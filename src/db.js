const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const DB_FILENAME = 'chat.db';

let dbConnection;

async function initDB() {
    try {
        dbConnection = await open({
            filename: path.join(__dirname, '..', '_data', DB_FILENAME),
            driver: sqlite3.Database,
        });
        await dbConnection.exec(`
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_offset TEXT UNIQUE,
                content TEXT
            );
        `);
        console.log('DB initialized.');
    } catch (err) {
        console.error(`Unable to connect db: ${err}`);
    }
}

async function addMessage(message, clientOffset, callback) {
    let result;
    try {
        result = await dbConnection.run('INSERT INTO messages (content, client_offset) VALUES (?, ?)', message, clientOffset);
    } catch (err) {
        if (err.errno === 19) {
            callback(); // the message was already inserted, so we notify the client
        } else {
            console.error(`Unable to add message into db: ${err}`);
        }
    }
    return result;
}

async function getMessage(ids, callback) {
    try {
        await dbConnection.each('SELECT id, content, client_offset FROM messages WHERE id > ?', ids, callback);
    } catch (err) {
        console.error(`Unable to retrive a message from db: ${err}`);        
    }
}

module.exports = {
    initDB,
    addMessage,
    getMessage,
}