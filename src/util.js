export function canBePangram(word, uniqueLetters) {
    if (typeof word !== 'string') return false
    const uniques = uniqueChars(word)
    return uniques.length === uniqueLetters
}

export function uniqueChars(word) {
    if (typeof word !== 'string') return []
    const chars = word.split('')
    return chars.filter((value, index, self) =>
        self.indexOf(value) === index)
}

export function possibleScore(answers) {
    let score = 0
    Object.keys(answers).forEach(ans => {
        score += ans.length < 5 ? 4 : ans.length
    })
    return score
}