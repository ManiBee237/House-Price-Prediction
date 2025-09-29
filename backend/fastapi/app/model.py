# app/model.py
import joblib
from pathlib import Path
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
STORE_PATH = ROOT / "models" / "model_store.joblib"

DEFAULT_COLUMNS = [
    # minimal fallback shape if no store found (rare, first boot)
    "GrLivArea","TotalBsmtSF","GarageCars","FullBath","YearBuilt","OverallQual",
    "Neighborhood_NAmes","Neighborhood_CollgCr","Neighborhood_OldTown","Neighborhood_Edwards",
    "Neighborhood_Somerst","Neighborhood_NridgHt","Neighborhood_Sawyer","Neighborhood_Gilbert",
    "HouseStyle_1Story","HouseStyle_2Story","HouseStyle_1.5Fin","HouseStyle_SLvl","HouseStyle_SFoyer"
]

class PriceModel:
    def __init__(self):
        self.model = None
        self.columns = DEFAULT_COLUMNS
        if STORE_PATH.exists():
            store = joblib.load(STORE_PATH)
            self.model = store["model"]
            self.columns = store["columns"]
        else:
            # As a fallback, build a trivial mean model
            from sklearn.dummy import DummyRegressor
            self.model = DummyRegressor(strategy="mean")
            import numpy as np
            self.model.fit([[0]*len(self.columns)], [200000.0])

    def _row_to_df(self, features: dict) -> pd.DataFrame:
        # features are UI schema keys
        num = {k: [features[k]] for k in ["GrLivArea","TotalBsmtSF","GarageCars","FullBath","YearBuilt","OverallQual"]}
        cat = {
            "Neighborhood": [features["Neighborhood"]],
            "HouseStyle": [features["HouseStyle"]],
        }
        X = pd.DataFrame(num)
        X_cat = pd.get_dummies(pd.DataFrame(cat), columns=["Neighborhood","HouseStyle"])
        X_full = pd.concat([X, X_cat], axis=1)
        # align to training columns
        X_full = X_full.reindex(columns=self.columns, fill_value=0)
        return X_full

    def predict(self, features: dict) -> float:
        X = self._row_to_df(features)
        return float(self.model.predict(X)[0])

MODEL = PriceModel()
