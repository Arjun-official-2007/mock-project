from typing import Optional
from pydantic import BaseModel

class TradeRequest(BaseModel):
    symbol: str          
    action: str          
    quantity: int        
    price_limit: Optional[float] = None 

class Asset(BaseModel):
    symbol: str
    current_value: float
    volatility: str