import { getMarketStatus } from "./api.js";
import { openTradeModal } from "./trade.js";

const marketBody = document.getElementById("market-body");

export async function updateMarket() {
    const assets = await getMarketStatus();

    // Remember current prices to check for flashes
    const previousPrices = Array.from(marketBody.querySelectorAll('tr')).reduce((acc, row) => {
        const symbol = row.getAttribute('data-symbol');
        const price = parseFloat(row.getAttribute('data-price'));
        acc[symbol] = price;
        return acc;
    }, {});

    marketBody.innerHTML = assets.map(asset => {
        const prevPrice = previousPrices[asset.symbol];
        const flashClass = prevPrice ? (asset.price > prevPrice ? 'flash-green' : (asset.price < prevPrice ? 'flash-red' : '')) : '';
        const priceClass = prevPrice ? (asset.price > prevPrice ? 'price-up' : (asset.price < prevPrice ? 'price-down' : '')) : '';

        return `
            <tr data-symbol="${asset.symbol}" data-price="${asset.price}" class="${flashClass}">
                <td class="font-tech">${asset.symbol}</td>
                <td>${asset.name}</td>
                <td class="${priceClass}">₹${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td style="color: ${asset.volatility === 'High' ? 'var(--neon-red)' : 'var(--neon-green)'}">${asset.volatility}</td>
                <td>
                    <button class="btn-buy" onclick="window.handleBuyClick('${asset.symbol}')">
                        <span class="plus-icon">+</span>BUY
                    </button>
                    <button class="btn-sell" onclick="window.handleSellClick('${asset.symbol}')">
                        <span class="scan-line"></span>SELL
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

// Global handlers for buttons (since they are in dynamic HTML)
window.handleBuyClick = (symbol) => openTradeModal(symbol, 'BUY');
window.handleSellClick = (symbol) => openTradeModal(symbol, 'SELL');

setInterval(updateMarket, 2000);
updateMarket();
