function capitalize(sentence) {
    if (!sentence) return undefined;

    const capitalizedSentence = sentence
        .trim()
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    return capitalizedSentence
}

module.exports = {
    capitalize
};