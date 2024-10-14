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

// Find the best time to buy and sell stock
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

// Analyze Time Complexity
document.getElementById('complexityButton').addEventListener('click', function() {
    const pricesInput = document.getElementById('prices').value;
    const prices = pricesInput.split(',').map(Number);
    const n = prices.length;

    const complexityResultElement = document.getElementById('complexityResult');

    if (n === 0) {
        complexityResultElement.textContent = 'Please enter stock prices to analyze time complexity.';
    } else {
        const timeComplexity = `O(n)`;
        complexityResultElement.textContent = `The time complexity of the algorithm is ${timeComplexity}, where n = ${n}.`;
    }
});

function drawStockChart(prices, buyDay, sellDay) {
    const canvas = document.getElementById('stockCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    ctx.clearRect(0, 0, width, height);

    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const days = prices.length;

    const mapPriceToY = price => height - padding - (price - minPrice) / (maxPrice - minPrice) * (height - 2 * padding);
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding); // X-axis
    ctx.lineTo(padding, padding); // Y-axis
    ctx.strokeStyle = '#000';
    ctx.stroke();

    // Draw price line
    ctx.beginPath();
    ctx.moveTo(padding, mapPriceToY(prices[0]));
    for (let i = 1; i < days; i++) {
        const x = padding + (i / (days - 1)) * (width - 2 * padding);
        const y = mapPriceToY(prices[i]);
        ctx.lineTo(x, y);
    }
    ctx.strokeStyle = '#007bff';
    ctx.stroke();

    // Highlight buy and sell days
    ctx.fillStyle = 'red';
    const buyX = padding + (buyDay / (days - 1)) * (width - 2 * padding);
    const buyY = mapPriceToY(prices[buyDay]);
    ctx.beginPath();
    ctx.arc(buyX, buyY, 5, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = 'green';
    const sellX = padding + (sellDay / (days - 1)) * (width - 2 * padding);
    const sellY = mapPriceToY(prices[sellDay]);
    ctx.beginPath();
    ctx.arc(sellX, sellY, 5, 0, 2 * Math.PI);
    ctx.fill();

    // X-axis labels
    ctx.fillStyle = '#00f';
    ctx.font = '12px Arial';
    for (let i = 0; i < days; i++) {
        const x = padding + (i / (days - 1)) * (width - 2 * padding);
        ctx.fillText(`Day ${i + 1}`, x - 10, height - padding + 20);
    }

    // Y-axis labels
    ctx.fillStyle = '#ff8c00';
    const priceSteps = 5;
    for (let i = 0; i <= priceSteps; i++) {
        const price = minPrice + (i / priceSteps) * (maxPrice - minPrice);
        const y = mapPriceToY(price);
        ctx.fillText(`$${Math.round(price)}`, padding - 35, y + 5);
    }

    // Buy and sell labels
    ctx.fillStyle = '#ff0000';
    ctx.fillText(`Buy: $${Math.round(prices[buyDay])}`, buyX + 10, buyY - 10);
    ctx.fillStyle = '#008000';
    ctx.fillText(`Sell: $${Math.round(prices[sellDay])}`, sellX + 10, sellY - 10);
}
