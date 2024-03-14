app.get('/historical-data', (req, res) => {
    const symbol = req.query.symbol;
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const historicalData = [];

    fs.createReadStream('historical_prices.csv')
        .pipe(csv())
        .on('data', (row) => {
            // Filter the data based on symbol and date range
            if (row.symbol === symbol && row.date >= fromDate && row.date <= toDate) {
                historicalData.push(row);
            }
        })
        .on('end', () => {
            res.json(historicalData);
        });
});