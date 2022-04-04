import { contains, without, shuffle } from 'underscore'
import { canBePangram, uniqueChars, possibleScore } from './util.js'

export class Game {

    #dictionary
    #answers
    #database

    constructor({ database, id, letters, keyLetter, dictionary }) {

        if (!database || !letters || !keyLetter || !dictionary) {
            throw 'Must pass database, letters, keyLetter and dictionary to constructor'
        }

        this.id = id
        this.letters = letters.map(l => l.toLowerCase())
        this.keyLetter = keyLetter.toLowerCase()

        this.#database = database        
        this.#dictionary = dictionary
        this.#answers = this.getQualifyingWords()

        this.pangrams = this.getAllPangrams(letters.length)
        this.maximumScore = possibleScore(this.#answers)

    }

    getAllLetters() {
        return this.letters.map(l => ({
            text: l,
            isKey: l === this.keyLetter
        }))
    }

    getAllPangrams(numberOfLetters) {
        return Object.keys(this.#answers).filter(word => {
            return canBePangram(word, numberOfLetters)
        })
    }

    getQualifyingWords() {
        if (this.#answers) {
            return this.#answers
        }

        let answers = {}
        const keyLetter = this.keyLetter
        const letters = this.letters
        this.#dictionary.forEach(({ word }) => {
            const uniques = uniqueChars(word)
            if (
                !contains(uniques, keyLetter) ||
                without(uniques, ...letters).length > 0
            ) return

            answers[word] = 1
        })
        return answers
    }

    submit(submission) {
        if (this.#answers[submission.toLowerCase()]) {
            return submission.length < 5 ? 1 : submission.length
        }
        return 0
    }

    shuffle() {
        this.letters = shuffle(this.letters)
    }

    numberOfAnswers() {
        return Object.keys(this.#answers).length
    }

    toString() {
        return JSON.stringify({
            letters: this.letters,
            keyLetter: this.keyLetter
        })
    }

    save() {
        return this.#database.saveGame(this)
    }
}
