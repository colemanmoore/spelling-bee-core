import { SpellingBee, Database } from '../index.js'

const db = new Database()

db.initialize().then(async () => {

    const Game = new SpellingBee(db)

    let game = await Game.createNewGame(7)

    console.log(game.toString())

    await game.save()

    game = await Game.createCurrentGameObject()

    console.log(game.getAllLetters())

    console.log(game.numberOfAnswers())
})
