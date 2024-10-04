document.getElementById('stockForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get the stock prices from the input
    const pricesInput = document.getElementById('prices').value;
    const prices = pricesInput.split(',').map(Number);

    // Calculate the best time to buy and sell
    const { buyDay, sellDay, maxProfit } = findBestTimeToBuyAndSell(prices);

    // Display the result
    const resultElement = document.getElementById('result');
    resultElement.textContent = `Buy on day ${buyDay + 1}, Sell on day ${sellDay + 1}. Maximum profit: $${maxProfit}.`;

    // Draw the stock prices on the canvas
    drawStockChart(prices, buyDay, sellDay);
});

function findBestTimeToBuyAndSell(prices) {
    let minPrice = prices[0];
    let minIndex = 0;
    let maxProfit = 0;
    let buyDay = 0;
    let sellDay = 0;

    for (let i = 1; i < prices.length; i++) {
        if (prices[i] < minPrice) {
            minPrice = prices[i];
            minIndex = i;
        }
        let profit = prices[i] - minPrice;
        if (profit > maxProfit) {
            maxProfit = profit;
            buyDay = minIndex;
            sellDay = i;
        }
    }

    return { buyDay, sellDay, maxProfit };
}

function drawStockChart(prices, buyDay, sellDay) {
    const canvas = document.getElementById('stockCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 20;

    ctx.clearRect(0, 0, width, height);

    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);

    // Draw price line
    ctx.beginPath();
    ctx.moveTo(padding, height - padding - (prices[0] - minPrice) / (maxPrice - minPrice) * (height - 2 * padding));
    for (let i = 1; i < prices.length; i++) {
        const x = padding + (i / (prices.length - 1)) * (width - 2 * padding);
        const y = height - padding - (prices[i] - minPrice) / (maxPrice - minPrice) * (height - 2 * padding);
        ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#007bff';
    ctx.stroke();

    // Highlight buy and sell days
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(padding + (buyDay / (prices.length - 1)) * (width - 2 * padding), height - padding - (prices[buyDay] - minPrice) / (maxPrice - minPrice) * (height - 2 * padding), 5, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(padding + (sellDay / (prices.length - 1)) * (width - 2 * padding), height - padding - (prices[sellDay] - minPrice) / (maxPrice - minPrice) * (height - 2 * padding), 5, 0, 2 * Math.PI);
    ctx.fill();
}
