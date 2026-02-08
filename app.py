<<<<<<< HEAD
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import random
import os
from datetime import datetime

app = FastAPI()

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock Data
assets = [
    {"symbol": "GOLD", "name": "Gold Bullion", "price": 1850.50, "volatility": 1.2},
    {"symbol": "SILVER", "name": "Silver Bar", "price": 25.30, "volatility": 2.5},
    {"symbol": "BTC", "name": "Bitcoin", "price": 45000.00, "volatility": 5.8},
    {"symbol": "ETH", "name": "Ethereum", "price": 3200.00, "volatility": 4.2},
    {"symbol": "AAPL", "name": "Apple Inc.", "price": 175.00, "volatility": 1.5},
    {"symbol": "TSLA", "name": "Tesla Inc.", "price": 900.00, "volatility": 4.5},
]

user_stats = {
    "username": "Trader1",
    "cash": 15000.0,
    "holdings": [],
    "transactions": []
}

class TradeRequest(BaseModel):
    symbol: str
    amount: float

@app.get("/market/status")
async def get_market_status():
    # Simulate price changes
    for asset in assets:
        change = asset["price"] * (random.uniform(-0.02, 0.02) * (asset["volatility"] / 2))
        asset["price"] = round(asset["price"] + change, 2)
    return assets

@app.get("/user/portfolio")
async def get_portfolio():
    net_worth = user_stats["cash"]
    holdings_with_value = []
    
    for h in user_stats["holdings"]:
        asset = next((a for a in assets if a["symbol"] == h["symbol"]), None)
        if asset:
            value = h["quantity"] * asset["price"]
            net_worth += value
            holdings_with_value.append({
                "symbol": h["symbol"],
                "quantity": h["quantity"],
                "value": round(value, 2)
            })
            
    return {
        "username": user_stats["username"],
        "cash": round(user_stats["cash"], 2),
        "net_worth": round(net_worth, 2),
        "holdings": holdings_with_value
    }

@app.post("/trade/buy")
async def buy_asset(trade: TradeRequest):
    asset = next((a for a in assets if a["symbol"] == trade.symbol), None)
    if not asset:
        return {"success": False, "message": "Asset not found"}
    
    cost = asset["price"] * trade.amount
    if user_stats["cash"] < cost:
        return {"success": False, "message": "Insufficient cash"}
    
    user_stats["cash"] -= cost
    
    holding = next((h for h in user_stats["holdings"] if h["symbol"] == trade.symbol), None)
    if holding:
        holding["quantity"] += trade.amount
    else:
        user_stats["holdings"].append({"symbol": trade.symbol, "quantity": trade.amount})
    
    # Record transaction
    user_stats["transactions"].insert(0, {
        "symbol": trade.symbol,
        "quantity": trade.amount,
        "price": asset["price"],
        "action": "BUY",
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })
        
    return {"success": True}

@app.post("/trade/sell")
async def sell_asset(trade: TradeRequest):
    holding = next((h for h in user_stats["holdings"] if h["symbol"] == trade.symbol), None)
    if not holding or holding["quantity"] < trade.amount:
        return {"success": False, "message": "Insufficient quantity"}
    
    asset = next((a for a in assets if a["symbol"] == trade.symbol), None)
    if not asset:
        return {"success": False, "message": "Asset not found"}
    
    user_stats["cash"] += asset["price"] * trade.amount
    holding["quantity"] -= trade.amount
    
    if holding["quantity"] <= 0:
        user_stats["holdings"] = [h for h in user_stats["holdings"] if h["symbol"] != trade.symbol]
    
    # Record transaction
    user_stats["transactions"].insert(0, {
        "symbol": trade.symbol,
        "quantity": trade.amount,
        "price": asset["price"],
        "action": "SELL",
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })
        
    return {"success": True}

@app.get("/user/history")
async def get_history():
    return user_stats["transactions"]

# Serve frontend
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
=======
from fastapi import FastAPI
from models import TradeRequest,Asset
from logic import Stock,User,Market

app = FastAPI()

user = User("Noob",10000)

market = Market()

@app.get("/market")
def get_stocks():
    return [{"symbol": symbol, "price": price} for symbol, price in market.stocks.items()]

@app.post("/trade")
def trade(order:TradeRequest):
    if order.action.lower() == "buy":
        if market.stocks.get(order.symbol,0) == 0 :
            market.add_stock(order.symbol)

        price = market.stocks[order.symbol]
        temp_stock = Stock(order.symbol ,price)
        user.buy(temp_stock,order.quantity)
    else:
        price = market.stocks[order.symbol]
        temp_stock = Stock(order.symbol ,price)
        user.sell(temp_stock,order.quantity)

@app.get("/portfolio")
def show_portfolio():
    return {"username": user.username,
            "cash_balance": user.balance,
            "holdings": [{"symbol": symbol, "quantity": quantity,"current_value": market.stocks.get(symbol,0)} for symbol, quantity in user.holdings.items()]}
>>>>>>> ba5d57c6edace889b55e5b8268f61ad496fcc1da
