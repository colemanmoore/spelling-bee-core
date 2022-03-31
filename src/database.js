import pg from 'pg'
const { Pool } = pg

export function Database() {

    const connection = new Pool()
    connection.connect()

    const dictionaryCreated = new Promise((resolve, reject) => {
        connection.query(`
        CREATE TABLE IF NOT EXISTS dictionary(
            id SERIAL PRIMARY KEY,
            word VARCHAR NOT NULL,
            unique_letters INT NOT NULL
        );
        `, (err, result) => {
            if (err) reject(err)
            resolve(result)
        })
    })

    const gameTableCreated = new Promise((resolve, reject) => {
        connection.query(`
        CREATE TABLE IF NOT EXISTS games(
            id SERIAL PRIMARY KEY,
            date DATETIME NOT NULL, 
            letters VARCHAR NOT NULL, 
            max_points INT
        );
        `, (err, result) => {
            if (err) reject(err)
            resolve(result)
        })
    })

    function initialize() {
        return Promise.all([
            dictionaryCreated,
            gameTableCreated
        ])
    }

    function queryCallback(resolve, reject, error, result) {
        if (error) return reject(error)
        resolve(result.rows)
    }

    function getAllWordsFromDictionary(filters, limit) {
        let stmt = 'SELECT d.* FROM dictionary d'
        if (filters && filters.length) {
            stmt += ' WHERE'
            filters.forEach((f, i) => {
                stmt += `${i > 0 ? ' AND' : ' '} ${f}`
            })
        }
        if (limit && !isNaN(parseInt(limit))) {
            stmt += ` LIMIT ${limit}`
        }
        stmt += ';'
        return new Promise((resolve, reject) => {
            connection.query(stmt, (err, result) => queryCallback(resolve, reject, err, result))
        })
    }

    function saveGame(game) {
        return new Promise((resolve, reject) => {
            connection.query(
                `INSERT INTO games(created_at, letters, max_points) VALUES (NOW(), '${game.toString()}', ${game.maximumScore});`,
                (err, result) => queryCallback(resolve, reject, err, result)
            )
        })
    }

    function getLatestGame() {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM games g ORDER BY g.created_at DESC`, (err, results) => {
                if (err) reject(err)
                if (results.rows.length) {
                    resolve(results.rows[0])
                } else {
                    reject('There is no game for today!')
                }
            })
        })
    }

    return {
        initialize,
        getAllWordsFromDictionary,
        saveGame,
        getLatestGame
    }
}
