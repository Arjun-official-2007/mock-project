import random

class Stock:
    def __init__(self,symbol:str,price:float):
        self.symbol = symbol
        self.price = price 

class User:
    def __init__(self,username:str,balance:float):
        self.username = username
        self.balance = balance
        self.holdings = {}

    def buy(self,stock:Stock,quantity:int):
        total_cost = stock.price * quantity
        self.balance -= total_cost
        self.holdings[stock.symbol] = self.holdings.get(stock.symbol,0) + quantity

    def sell(self,stock:Stock,quantity:int):
        total_cost = stock.price * quantity
        self.balance += total_cost
        self.holdings[stock.symbol] -= quantity

class Market:
    def __init__(self):
        self.stocks = {}

    def add_stock(self,symbol:str):
        self.stocks[symbol] = round(random.uniform(100, 1000), 2)

    def del_stock(self,symbol:str):
        del self.stocks[symbol]

    def simulate(self):
        for stock,price in self.stocks.items():
            up_or_down = random.choice([0,1])
            if up_or_down == 0:
                self.stocks[stock] += round(random.uniform(0,100),2)
            else:
                self.stocks[stock] -= round(random.uniform(1,100),2)