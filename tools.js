function extractHexColors(str, prefix = "#") {
    let regex = new RegExp(`\\${prefix}[0-9A-Fa-f]{6}\\b`, "g");
    return str.match(regex) || [];
}

const tools = {
    generateColors: function(len = 255, opt = 0) {
        colors = ["#ffffff", "#000000"];
        enabledColorsList = [true, true];

        for (let i = 2; i < len; i++) {
            let randomColor = this.getRandomColor(opt);
            colors.push(randomColor);
            enabledColorsList.push(true);
        }
        renderColors();
    },

    getRandomColor: function(opt = 0) {
        let g = Math.floor(Math.random() * 16).toString(16);
        let colorParts = ["#"];

        if (opt === 0) {
            for (let j = 0; j < 6; j++) colorParts.push(Math.floor(Math.random() * 16).toString(16));
        } else if (opt === 1) {
            for (let j = 0; j < 6; j++) colorParts.push(g);
        }

        return colorParts.join("");
    },

    filters: function() {
        console.log(JSON.stringify(filterList) + " ; " + JSON.stringify(filterEffectPowerList));
    },

    setColors: function(s) {
        colors = extractHexColors(s);
        enabledColorsList = new Array(colors.length).fill(true);
    },
};

console.log(`use tools.setColors('') to load in a color list.`)
