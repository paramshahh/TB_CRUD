const WebSocket = require('ws');

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Function to generate dummy price data
function generateDummyPriceData() {
    return Math.random() * 100; // Generate a random price for demonstration
}

// Broadcast price data to all connected clients
function broadcastPriceData() {
    const price = generateDummyPriceData();
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ price: price }));
        }
    });
}

// Generate and broadcast dummy price data at regular intervals
setInterval(broadcastPriceData, 5000); // Send price data every 5 seconds
