from pydantic import BaseModel, Field
from typing import Literal

NeighborhoodLiteral = Literal['NAmes','CollgCr','OldTown','Edwards','Somerst','NridgHt','Sawyer','Gilbert']
HouseStyleLiteral = Literal['1Story','2Story','1.5Fin','SLvl','SFoyer']

class PredictIn(BaseModel):
    GrLivArea: float = Field(ge=100)
    TotalBsmtSF: float = Field(ge=0)
    GarageCars: int = Field(ge=0, le=5)
    FullBath: int = Field(ge=0, le=5)
    YearBuilt: int = Field(ge=1800, le=2025)
    Neighborhood: NeighborhoodLiteral
    HouseStyle: HouseStyleLiteral
    OverallQual: int = Field(ge=1, le=10)

class PredictOut(BaseModel):
    predicted_price: float
    currency: str = 'USD'
    r2_meta: float | None = None