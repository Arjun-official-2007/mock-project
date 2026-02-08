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
    if order.action == "buy":
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
            "holdings": [{"symbol": symbol, "price": price} for symbol, price in market.stocks.items()]}