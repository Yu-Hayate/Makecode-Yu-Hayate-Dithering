function extractHexColors(str) {
    return (str.match(/#[0-9A-Fa-f]{6}\b/g) || []);
}
