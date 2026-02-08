// Mock data for the "Frontend-only" demo
let state = {
    user: {
        name: "Trader1",
        cash: 15000,
        portfolio: {} // symbol -> quantity
    },
    market: [
        { symbol: "SILVER", name: "Silver Commodity", price: 88000, volatility: "Low" },
        { symbol: "AI_STARTUP", name: "Generative AI Corp", price: 120, volatility: "High" },
        { symbol: "GOLD", name: "Gold Standard", price: 62000, volatility: "Low" },
        { symbol: "TESLA_X", name: "Neural Link Corp", price: 450, volatility: "High" }
    ],
    history: []
};

// Simulate price fluctuations
function updateMarketPrices() {
    state.market = state.market.map(asset => {
        const changePercent = (Math.random() - 0.5) * (asset.volatility === "High" ? 0.05 : 0.01);
        const oldPrice = asset.price;
        const newPrice = Math.max(1, asset.price * (1 + changePercent));
        return {
            ...asset,
            price: newPrice,
            lastPrice: oldPrice
        };
    });
}

// Global update interval
setInterval(updateMarketPrices, 2000);

// API Mocks
export async function getMarketStatus() {
    return state.market;
}

export async function getUserProfile() {
    const netWorth = state.user.cash + Object.entries(state.user.portfolio).reduce((acc, [symbol, qty]) => {
        const asset = state.market.find(a => a.symbol === symbol);
        return acc + (asset ? asset.price * qty : 0);
    }, 0);

    return {
        ...state.user,
        netWorth: netWorth
    };
}

export async function buyAsset(symbol, quantity) {
    const asset = state.market.find(a => a.symbol === symbol);
    if (!asset) throw new Error("Asset not found");
    
    const cost = asset.price * quantity;
    if (state.user.cash < cost) throw new Error("Insufficient funds");

    state.user.cash -= cost;
    state.user.portfolio[symbol] = (state.user.portfolio[symbol] || 0) + quantity;
    
    state.history.unshift({
        date: new Date().toLocaleTimeString(),
        type: "BUY",
        symbol: symbol,
        qty: quantity,
        price: asset.price
    });

    return { success: true, user: await getUserProfile() };
}

export async function sellAsset(symbol, quantity) {
    const asset = state.market.find(a => a.symbol === symbol);
    if (!asset) throw new Error("Asset not found");
    
    const currentQty = state.user.portfolio[symbol] || 0;
    if (currentQty < quantity) throw new Error("Insufficient assets");

    const profit = asset.price * quantity;
    state.user.cash += profit;
    state.user.portfolio[symbol] -= quantity;
    
    if (state.user.portfolio[symbol] === 0) {
        delete state.user.portfolio[symbol];
    }

    state.history.unshift({
        date: new Date().toLocaleTimeString(),
        type: "SELL",
        symbol: symbol,
        qty: quantity,
        price: asset.price
    });

    return { success: true, user: await getUserProfile() };
}

export async function getHistory() {
    return state.history;
}
