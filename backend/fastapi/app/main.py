import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .schemas import PredictIn, PredictOut
from .model import MODEL
from .utils import price_band
from fastapi import UploadFile, File
from .train import fit_from_csv


app = FastAPI(title='House Price ML Service')

@app.post("/retrain")
async def retrain(file: UploadFile = File(...)):
    import tempfile, shutil
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".csv")
    with open(tmp.name, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    r2, cols = fit_from_csv(tmp.name)
    return {"status": "ok", "r2": r2, "n_columns": len(cols)}

origins = os.getenv('CORS_ORIGINS', '*').split(',')
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def root():
    return { 'name': 'house-price-ml', 'ok': True }

@app.post('/predict', response_model=PredictOut)
def predict(p: PredictIn):
    price = MODEL.predict(p.model_dump())
    # If you trained with train.py, you can store R² somewhere persistent; for now use a nominal value
    r2_meta = 0.82
    return { 'predicted_price': price, 'currency': 'USD', 'r2_meta': r2_meta }

@app.get('/aggregates')
def aggregates():
    # Placeholder; replace with real DB/CSV aggregates
    return {
      'by_year': {
        'labels': [1950,1960,1970,1980,1990,2000,2010,2020],
        'avg':    [80,90,110,140,170,220,260,310]
      },
      'by_neighborhood': {
        'labels': ['NAmes','CollgCr','OldTown','Edwards','Somerst','NridgHt','Sawyer','Gilbert'],
        'avg':    [210,245,180,175,260,320,190,240]
      }
    }