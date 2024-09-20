const sqlite3 = require('sqlite3').verbose();

// create a new database or open the exisitng one
let db = new sqlite3.Database('./node_database.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

// create tables if they don't already exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS nodes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        node_name TEXT NOT NULL,
        initial_x REAL,
        initial_y REAL,
        initial_z REAL
        )`);

    db.run(`CREATE TABLE IF NOT EXISTS measurements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        node_id INTEGER,
        timestamp TEXT,
        x REAL,
        y REAL,
        z REAL,
        FOREIGN KEY(node_id) REFERENCES nodes(id)
        )`);
});

module.exports = db;
