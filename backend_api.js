const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3001;
const endpointUrl = '/historical-data';

// Connect to SQLite database
const db = new sqlite3.Database('/Users/paramshah/Desktop/TB_CRUD/historical_prices.db');

// Middleware to parse JSON bodies
app.use(express.json());

// Define a GET endpoint for /historical-data
app.get('/historical-data', (req, res) => {
    const { symbol, from_date, to_date } = req.query;

    // Validate query parameters
    if (!symbol || !from_date || !to_date) {
        return res.status(400).json({ error: 'Missing query parameters' });
    }

    // Construct SQL query dynamically based on query parameters
    const query = `
        SELECT *
        FROM historical_prices
        WHERE instrument_name = ?
        AND date BETWEEN ? AND ?;
    `;

    // Execute SQL query with parameters
    db.all(query, [symbol, from_date, to_date], (err, rows) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Return data as JSON in the response
        res.json(rows);
    });
});

// Serve the HTML file
app.get('/view_chart', (req, res) => {
    res.sendFile(path.join(__dirname, '/chart_view.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});