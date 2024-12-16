const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "boovkd434xr0zfz4t0mu-mysql.services.clever-cloud.com",
    user: "ufiog8sb8qoqwfor",
    password: "cVuFz7kXWKbG1LTkf7EK",
    database: "boovkd434xr0zfz4t0mu",
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('MySQL Connected...');
});

module.exports = db;