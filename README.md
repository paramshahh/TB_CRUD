# Portfolio Management System

Welcome to the Portfolio Management System! This system provides a comprehensive solution for managing investment portfolios effectively.

## Key Features and Technologies

- **User Authentication**: Implemented user registration and login functionality to ensure secure access to the system.
- **Database Management**: Utilized SQLite database for efficient storage and retrieval of user data.
- **Historical Price Data**: Integrated CSV files to serve historical price data for various commodities.
- **Real-time Dummy Updates**: Employed WebSocket technology to enable real-time price updates, ensuring users have access to the latest market information (dummy prices implemented).
- **Interactive Dashboard**: Designed a user-friendly dashboard for intuitive portfolio management.

## Setup Guide

NOTE: All the files are in the master branch.
1. **Clone the Repository**: 
   ```bash
   git clone https://github.com/paramshahh/TB_CRUD.git
   cd TB_CRUD
   ```

2. **Install Dependencies**: 
   ```bash
   npm install
   ```

3. **Start the Server**: 
   ```bash
   node server.js
   ```

4. **Access the System**: 
   Open your web browser and navigate to [http://localhost:3002/register](http://localhost:3002/register) to start your journey!

## File Structure

- `dashboard.html`: User dashboard for portfolio management.
- `database.db`: SQLite database file containing user data.
- `historical_prices.csv`: CSV file containing historical price data.
- `login.html`: User login page.
- `orders.json`: JSON file storing order data.
- `profile_response.json`: JSON file containing user profile data.
- `register.html`: User registration page.
- `server.js`: Node.js server code.
- `stock-bg.jpg`: Background image for the web interface.
- `users.json`: JSON file storing user information.

## WebSocket Integration

Real-time dummy price updates are enabled through WebSocket technology. As prices fluctuate, the system broadcasts updates to all connected clients every 1 second.
