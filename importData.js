const fs = require('fs');
const csv = require('csv-parser');
const db = require('./database');

// read CSV and insert into the database
fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', (row) => {
        // check if node exists or insert it
        db.get(`SELECT id FROM nodes WHERE node_name = ?`, [row.node_name], (err, node) => {
            if (err) {
                return console.error(err.message);
            }

            if (node) {
                // insert measurement for the existing node
                db.run(`INSERT INTO measurements(node_id, timestamp, x, y, z) VALUES(?, ?, ?, ?, ?)`,
                    [node.id, row.timestamp, row.x, row.y, row.z]);
            } else {
                // insert new node, then insert measurement
                db.run(`INSERT INTO nodes(node_name, initial_x, initial_y, initial_z) VALUES(?, ?, ?, ?)`,
                    [row.node_name, row.x, row.y, row.z], function (err) {
                        if (err) {
                            return console.error(err.message);
                        }
                        const newNodeId = this.lastID;
                        db.run(`INSERT INTO measurements(node_id, timestamp, x, y, z) VALUES(?, ?, ?, ?, ?)`,
                            [newNodeId, row.timestamp, row.x, row.y, row.z]);
                    });
            }
        });
    })
    .on('end', () => {
        console.log('CSV file successfully processed and data inserted.');
    });
