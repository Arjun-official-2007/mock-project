import { getUserProfile, getMarketStatus } from "./api.js";

const portfolioBody = document.getElementById("portfolio-body");
const userCashEl = document.getElementById("user-cash");
const userNetworthEl = document.getElementById("user-networth");

export async function updatePortfolio() {
    const user = await getUserProfile();
    const market = await getMarketStatus();

    // Update Top Bar
    userCashEl.innerText = `₹${user.cash.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    userNetworthEl.innerText = `₹${user.netWorth.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

    // Update Portfolio Table
    const rows = Object.entries(user.portfolio).map(([symbol, qty]) => {
        const asset = market.find(a => a.symbol === symbol);
        const value = asset ? asset.price * qty : 0;
        return `
            <tr>
                <td class="font-tech">${symbol}</td>
                <td>${qty}</td>
                <td>₹${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
        `;
    });

    if (rows.length === 0) {
        portfolioBody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-secondary)">NO ASSETS HELD</td></tr>`;
    } else {
        portfolioBody.innerHTML = rows.join("");
    }
}

// Update portfolio frequently to match market values
setInterval(updatePortfolio, 2000);
updatePortfolio();
