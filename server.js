const express = require("express"); // Express framework for building web applications
const bodyParser = require("body-parser"); // Middleware for parsing request bodies
const path = require("path"); // Module for working with file and directory paths
const fs = require("fs"); // File system module for reading and writing files
const csv = require("csv-parser"); // Module for parsing CSV files
const sqlite3 = require('sqlite3').verbose(); // SQLite module for working with databases

// Import required modules

// Create an instance of the Express application
const app = express();

// Set the port number for the server
const port = 3002;

// Connect to the SQLite database
const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database');
    }
});

// Configure middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve login.html when /login is requested
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Serve register.html when /register is requested
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// Serve historical_data.csv as JSON when /historical-data is requested
app.get('/historical-data', (req, res) => {
    const historicalData = [];

    fs.createReadStream('historical_prices.csv')
        .pipe(csv())
        .on('data', (row) => {
            historicalData.push(row);
        })
        .on('end', () => {
            res.json(historicalData);
        });
});

// Serve profile_response.json when /profile_response.json is requested
app.get('/profile_response.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'profile_response.json'));
});

// Serve holdings_response.json when /holdings_response.json is requested
app.get('/holdings_response.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'holdings_response.json'));
});

// Serve dashboard.html when /dashboard is requested
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Serve stock-bg.jpg when /stock-bg.jpg is requested
app.get('/stock-bg.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'stock-bg.jpg'));
});

// Store order data received via POST request to /store-order
app.post('/store-order', (req, res) => {
    const orderData = req.body;

    // Assuming you want to store the order data in a JSON file named 'orders.json'
    const filePath = 'orders.json';

    // Read existing orders from file, if any
    let existingOrders = [];
    try {
        existingOrders = JSON.parse(fs.readFileSync(filePath));
    } catch (error) {
        console.error('Error reading existing orders:', error);
    }

    // Add the new order to the existing orders array
    existingOrders.push(orderData);

    // Write updated orders back to the file
    try {
        fs.writeFileSync(filePath, JSON.stringify(existingOrders, null, 2));
        console.log('Order data stored successfully.');
        res.status(200).send('Order data stored successfully.');
    } catch (error) {
        console.error('Error storing order data:', error);
        res.status(500).send('Error storing order data.');
    }
});

// Handle user login via POST request to /login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Query the database for the user with the provided username and password
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    db.get(query, [username, password], (err, row) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).send('Error processing login');
        }

        if (row) {
            res.redirect('/dashboard'); // Redirect to dashboard upon successful login
        } else {
            res.status(401).send('Invalid username or password');
        }
    });
});

// Handle user registration via POST request to /register
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Check if the username already exists in the database
    const query = `SELECT * FROM users WHERE username = ?`;
    db.get(query, [username], (err, row) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).send('Error processing registration');
        }

        if (row) {
            return res.status(400).send('Username already exists');
        }

        // Insert the new user into the database
        const insertQuery = `INSERT INTO users (username, password) VALUES (?, ?)`;
        db.run(insertQuery, [username, password], (err) => {
            if (err) {
                console.error('Error inserting into the database:', err);
                return res.status(500).send('Error processing registration');
            }
            res.redirect('/login'); // Redirect to login page after successful registration
        });
    });
});

// Serve holdings data when /holdings is requested
app.get('/holdings', (req, res) => {
    try {
        const holdingsData = JSON.parse(fs.readFileSync("holdings_response.json", "utf8"));
        res.json(holdingsData);
    } catch (err) {
        console.error("Error parsing holdings_response.json:", err);
        res.status(500).send("Error processing holdings data");
    }
});

// Serve profile data when /profile is requested
app.get('/profile', (req, res) => {
    try {
        const profileData = JSON.parse(fs.readFileSync("profile_response.json", "utf8")).data;
        res.json(profileData);
    } catch (err) {
        console.error("Error parsing profile_response.json:", err);
        res.status(500).send("Error processing profile data");
    }
});

// Serve historical prices data when /historical-prices is requested
app.get('/historical-prices', (req, res) => {
    const historicalPrices = [];
    fs.createReadStream('historical_prices.csv')
        .pipe(csv())
        .on('data', (row) => {
            historicalPrices.push(row);
        })
        .on('end', () => {
            res.json(historicalPrices);
        });
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log("Server is running");
});