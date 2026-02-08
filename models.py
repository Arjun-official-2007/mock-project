from typing import Optional
from pydantic import BaseModel

class TradeRequest(BaseModel):
    symbol: str          
    action: str          
    quantity: int        


class Asset(BaseModel):
    symbol: str
    current_value: float
