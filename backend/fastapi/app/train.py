# app/train.py
from pathlib import Path
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score
import joblib

ROOT = Path(__file__).resolve().parents[1]
MODEL_DIR = ROOT / "models"
STORE_PATH = MODEL_DIR / "model_store.joblib"   # contains {"model": ..., "columns": [...]}

def _floors_to_style(f):
    # map numeric floors to categorical style names the API understands
    try:
        v = float(f)
    except Exception:
        return "SLvl"
    if abs(v - 2.0) < 1e-6:
        return "2Story"
    if abs(v - 1.5) < 1e-6:
        return "1.5Fin"
    if abs(v - 1.0) < 1e-6:
        return "1Story"
    return "SLvl"

def _prepare(df: pd.DataFrame):
    # column presence checks
    need = ["price","bathrooms","sqft_living","sqft_basement","yr_built","floors","condition"]
    for c in need:
        if c not in df.columns:
            raise ValueError(f"CSV missing required column: {c}")

    # Neighborhood source
    nb_source = "city" if "city" in df.columns else ("statezip" if "statezip" in df.columns else None)
    if not nb_source:
        raise ValueError("CSV needs either 'city' or 'statezip' to act as Neighborhood")

    # Mapping to UI schema
    out = pd.DataFrame({
        "SalePrice": df["price"].astype(float),
        "GrLivArea": df["sqft_living"].astype(float),
        "TotalBsmtSF": df["sqft_basement"].fillna(0).astype(float),
        "GarageCars": 0,  # not available in this dataset
        "FullBath": np.rint(df["bathrooms"].astype(float)).clip(0, 5).astype(int),
        "YearBuilt": df["yr_built"].astype(int),
        "OverallQual": (df["condition"].astype(float) * 2).round().clip(1, 10).astype(int),
        "Neighborhood": df[nb_source].astype(str),
        "HouseStyle": df["floors"].apply(_floors_to_style).astype(str),
    })

    # drop rows missing essential numeric fields just in case
    out = out.dropna(subset=["SalePrice","GrLivArea","TotalBsmtSF","FullBath","YearBuilt","OverallQual"])
    return out

def fit_from_csv(csv_path: str):
    df = pd.read_csv(csv_path)
    data = _prepare(df)

    NUM = ["GrLivArea","TotalBsmtSF","GarageCars","FullBath","YearBuilt","OverallQual"]
    CATEG = ["Neighborhood","HouseStyle"]
    TARGET = "SalePrice"

    X_num = data[NUM]
    X_cat = pd.get_dummies(data[CATEG], columns=CATEG)
    X = pd.concat([X_num, X_cat], axis=1)
    y = data[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestRegressor(n_estimators=300, random_state=42)
    model.fit(X_train, y_train)
    r2 = r2_score(y_test, model.predict(X_test))

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump({"model": model, "columns": X.columns.tolist()}, STORE_PATH)
    return r2, X.columns.tolist()

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python -m app.train <path-to-csv>")
        raise SystemExit(1)
    r2, cols = fit_from_csv(sys.argv[1])
    print(f"Saved model to {STORE_PATH}\nR2={r2:.3f}\nColumns={len(cols)}")
