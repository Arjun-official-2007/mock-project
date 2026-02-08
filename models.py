<<<<<<< HEAD
=======
from typing import Optional
from pydantic import BaseModel

class TradeRequest(BaseModel):
    symbol: str          
    action: str          
    quantity: int        


class Asset(BaseModel):
    symbol: str
    current_value: float
>>>>>>> ba5d57c6edace889b55e5b8268f61ad496fcc1da
