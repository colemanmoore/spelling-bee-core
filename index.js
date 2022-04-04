import { Game } from './src/game.js'
import { Database } from './src/database.js'
import { canBePangram, uniqueChars, possibleScore } from './src/util.js'

export const Util = {
    canBePangram,
    uniqueChars,
    possibleScore
}

export { Database as Database }

export function SpellingBee(database) {

    if (!database) {
        console.error('No database provided')
        return
    }

    database.initialize()

    const {
        getAllWordsFromDictionary,
        getLatestGame
    } = database

    async function createNewGame(numberOfLetters) {

        const dictionary = await getAllWordsFromDictionary()

        const pangrams = dictionary.filter(d =>
            canBePangram(d.word, numberOfLetters)
        )

        if (!pangrams.length) {
            console.warn('No pangrams in the current dictionary!')
            return
        }

        const pangram = pangrams[Math.floor(Math.random() * pangrams.length)]

        const letters = uniqueChars(pangram.word)

        const possibleGames = letters.map(l => new Game({
            database,
            letters,
            keyLetter: l,
            dictionary,
            numberOfLetters
        }))

        possibleGames.sort((a, b) => a.maximumScore - b.maximumScore)
        return possibleGames[0]
    }

    async function createCurrentGameObject() {
        
        const gameData = await getLatestGame()
        const letterData = await JSON.parse(gameData.letters)
        const dictionary = await getAllWordsFromDictionary()

        return new Game({
            database,
            id: gameData.id,
            letters: letterData.letters,
            keyLetter: letterData.keyLetter,
            dictionary
        })
    }

    return {
        createNewGame,
        createCurrentGameObject
    }
}