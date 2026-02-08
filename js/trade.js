import { buyAsset, sellAsset, getHistory } from "./api.js";
import { updatePortfolio } from "./portfolio.js";

const modal = document.getElementById("trade-modal");
const modalTitle = document.getElementById("modal-title");
const modalAssetName = document.getElementById("modal-asset-name");
const tradeQtyInput = document.getElementById("trade-qty");
const executeBtn = document.getElementById("execute-btn");
const historyBody = document.getElementById("history-body");

let currentTrade = {
    symbol: '',
    type: '' // BUY or SELL
};

export function openTradeModal(symbol, type) {
    currentTrade = { symbol, type };
    modalTitle.innerText = `EXECUTE ${type}`;
    modalAssetName.innerText = symbol;
    tradeQtyInput.value = 1;
    modal.style.display = "flex";
}

async function handleExecute() {
    const qty = parseInt(tradeQtyInput.value);
    if (isNaN(qty) || qty <= 0) {
        alert("Please enter a valid quantity");
        return;
    }

    // High Voltage interaction
    const originalText = executeBtn.innerText;
    executeBtn.innerText = "TRANSMITTING...";
    executeBtn.disabled = true;

    try {
        if (currentTrade.type === 'BUY') {
            await buyAsset(currentTrade.symbol, qty);
        } else {
            await sellAsset(currentTrade.symbol, qty);
        }

        // Simulate processing delay
        await new Promise(r => setTimeout(r, 1000));

        modal.style.display = "none";
        updatePortfolio();
        updateHistory();
    } catch (error) {
        alert(error.message);
    } finally {
        executeBtn.innerText = originalText;
        executeBtn.disabled = false;
    }
}

export async function updateHistory() {
    if (!historyBody) return;
    const history = await getHistory();
    historyBody.innerHTML = history.map(item => `
        <tr>
            <td>${item.date}</td>
            <td style="color: ${item.type === 'BUY' ? 'var(--neon-green)' : 'var(--neon-red)'}">${item.type}</td>
            <td class="font-tech">${item.symbol}</td>
            <td>${item.qty}</td>
            <td>₹${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>
    `).join("");
}

executeBtn.addEventListener("click", handleExecute);

// Update history initially
updateHistory();
