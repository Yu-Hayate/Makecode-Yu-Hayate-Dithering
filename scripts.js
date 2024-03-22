let colors = rgbToHex([[255, 255, 255],[255, 33, 33], [255, 147, 196], [255, 129, 53], [255, 246, 9], [36, 156, 163], [120, 220, 82], [0, 63, 173], [135, 242, 255], [142, 46, 196], [164, 131, 159], [92, 64, 108], [229, 205, 196], [145, 70, 61], [0, 0, 0]]);
let enabledColorsList = new Array(colors.length).fill(true);
let filterList = [];
let filterEffectPowerList = [];
renderColors();
const easterEggHTMLBtnDiv = document.getElementById('goToEgg');
let currentValue = Number(localStorage.getItem('easterEgg')) || 0;
easterEggHTMLBtnDiv.style.display = 'none';
if (currentValue >= 1000) {
    easterEggHTMLBtnDiv.style.display = 'block';
}
function processImage() {
    const fileInput = document.getElementById('fileInput');
    const inputElement = document.getElementById('scaleFactor');
    const scaleFactor = parseFloat(inputElement.value);
    const outputImage = document.getElementById('outputImage');
    const colorArr = document.getElementById('colorArr');
    const newWidth = document.getElementById('width').value;
    const newHeight = document.getElementById('height').value;
    const pixelGoal = document.getElementById('maxPixels').value;
    const ditheringOption = document.getElementById('ditheringOptions').value;
    const reader = new FileReader;
    var palArr;
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (document.getElementById('sizeSettings').value === 'widthHeight') {
                canvas.width = newWidth;
                canvas.height = newHeight;
            } else if (document.getElementById('sizeSettings').value === 'pixelGoal') {
                let newRes = resizePixelGoal(img.width, img.height, pixelGoal);
                canvas.width = newRes[0];
                canvas.height = newRes[1];
            } else {
                canvas.width = img.width * scaleFactor;
                canvas.height = img.height * scaleFactor;
            }
            var imageString = '';
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            applyFliter(ctx, canvas.width, canvas.height)
            applyDithering(ctx, canvas.width, canvas.height, ditheringOption)
            outputImage.src = canvas.toDataURL();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(fileInput.files[0]);
    const downloadButton = document.getElementById('downloadButton');
    downloadButton.addEventListener('click', downloadImage);
}
function applyDithering(context, w ,h,ditheringType) {
    if (ditheringType == 'none') {
        noneDithering(context, w, h)
    } else if (ditheringType == 'floyd') {
    floydSteinbergDithering(context, w, h);
    } else if (ditheringType == 'nearest') {
        ClosesColorDithering(context, w, h);
    } else if (ditheringType == 'bayerMatrix4') {
        bayerDithering4x4(context, w, h)
    } else if (ditheringType == 'bayerMatrix8') {
        bayerDithering8x8(context, w, h)
    } else if (ditheringType == 'falseFloyd') {
        FalseFloydSteinbergDithering(context, w, h)
    } else if (ditheringType == 'stucki') {
        stuckiDithering(context, w, h);
    } else if (ditheringType == 'Burkes') {
        BurkesDithering(context, w, h);
    } else if (ditheringType == 'bayerMatrix2') {
        bayerDithering2x2(context, w, h)
    } else if (ditheringType == 'bayerMatrix16') {
        bayerDithering16x16(context, w, h)
    }
}
function applyFliter(context,w,h) {
    if (filterList.length > 0) {
        for (let i = 0; i < filterList.length; i++) {
            if (filterList[i] == 'GrayScale') {
                grayScale(context,w,h);
            } else if (filterList[i] == 'custom') {
                const r = filterEffectPowerList[i][0]
                const g = filterEffectPowerList[i][1]
                const b = filterEffectPowerList[i][2]
                customFilter(context,w,h,r,g,b);
            } else if (filterList[i] == 'noise') {
                const noiseLevel = filterEffectPowerList[i][0];
                noiseFilter(context,w,h,noiseLevel);
            } else if (filterList[i] == 'blur') {
                const blurPower = Math.min(Math.abs(filterEffectPowerList[i][0]),50);
                blurImage(context,w,h, blurPower);
            } else if (filterList[i] == 'invert') {
              InvertFilter(context,w,h)  ;
            }
        }
    } else {
        filterType = document.getElementById('Filters').value;
        if (filterType == 'GrayScale') {
            grayScale(context,w,h);
        } else if (filterType == 'custom') {
            const r = document.getElementById('red').value;
            const g = document.getElementById('green').value;
            const b = document.getElementById('blue').value;
            customFilter(context,w,h,r,g,b);
        } else if (filterType == 'noise') {
            const noiseLevel = document.getElementById('noiseLevel').value;
            noiseFilter(context,w,h,noiseLevel);
        } else if (filterType == 'blur') {
            const blurPower = Math.min(Math.abs(document.getElementById('blurPower').value),50);
            blurImage(context,w,h, blurPower);
        } else if (filterType == 'invert') {
          InvertFilter(context,w,h)  ;
        }
    }
}
var defaultColorList = {
    color: rgbToHex([[255, 255, 255],[255, 33, 33], [255, 147, 196], [255, 129, 53], [255, 246, 9], [36, 156, 163], [120, 220, 82], [0, 63, 173], [135, 242, 255], [142, 46, 196], [164, 131, 159], [92, 64, 108], [229, 205, 196], [145, 70, 61], [0, 0, 0]]),
    enabledColorsList: [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true]
};
    function saveColorList() {
    var colorListName = prompt("Enter a name for the color list:");
    if (colorListName) {
        var savedData = {
            color: colors,
            enabledColorsList: enabledColorsList
        };
        localStorage.setItem(colorListName, JSON.stringify(savedData));
        var colorListsSelect = document.getElementById('colorLists');
        var option = document.createElement("option");
        option.text = colorListName;
        option.value = colorListName;
        colorListsSelect.add(option);
        renderColors();
    }
}
function loadColorList() {
    var selectedColorListName = document.getElementById('colorLists').value;
    if (selectedColorListName !== 'default') {
        var savedData = localStorage.getItem(selectedColorListName);
        if (savedData) {
            savedData = JSON.parse(savedData);
            colors = savedData.color;
            enabledColorsList = savedData.enabledColorsList;
        }
    } else {
        colors = defaultColorList.color;
        enabledColorsList = defaultColorList.enabledColorsList;
    }
    console.log(colors);
    console.log(enabledColorsList);
    renderColors();
}
function removeColorList() {
    var selectedColorListName = document.getElementById('colorLists').value;
    if (selectedColorListName !== 'default') {
        localStorage.removeItem(selectedColorListName);
        var colorListsSelect = document.getElementById('colorLists');
        var options = colorListsSelect.options;
        for (var i = 0; i < options.length; i++) {
            if (options[i].value === selectedColorListName) {
                colorListsSelect.remove(i);
                break;
            }
        }

        renderColors();
    }
}
window.onload = function() {
    var colorListsSelect = document.getElementById('colorLists');
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var option = document.createElement("option");
        option.text = key;
        option.value = key;
        colorListsSelect.add(option);
    }
}
function downloadImage() {
        let varName = document.getElementById('varName').value;
        const downloadLink = document.createElement('a');
        downloadLink.href = outputImage.src;
        downloadLink.download = varName + '.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
}
function convertImgStringToCanvas(imgString) {
    imgString = imgString.replace('`', '').replace('img', '');
    const rows = imgString.trim().split(/\s{2,}/).map(row => row.trim());
    const width = rows[0].split(' ').length;
    const height = rows.length;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const inputElement = document.getElementById('scaleFactor');
    const scaleFactor = parseFloat(inputElement.value);
    const newWidth = document.getElementById('width').value;
    const newHeight = document.getElementById('height').value;
    const pixelGoal = document.getElementById('maxPixels').value;
    if (document.getElementById('sizeSettings').value === 'widthHeight') {
        canvas.width = newWidth;
        canvas.height = newHeight;
    } else if (document.getElementById('sizeSettings').value === 'pixelGoal') {
        let newRes = resizePixelGoal(width, height, pixelGoal);
        canvas.width = newRes[0];
        canvas.height = newRes[1];
    } else {
        canvas.width = width * scaleFactor;
        canvas.height = height * scaleFactor;
    }
    const wDif = canvas.width / width;
    const hDif = canvas.height / height;
    for (let y = 0; y < height; y++) {
        const rowData = rows[y].split(' ');
        for (let x = 0; x < width; x++) {
            const data = rowData[x];
            if (data !== '.') {
                const colorIndex = parseInt(data, 16) - 1;
                const color = colors[colorIndex];
                ctx.fillStyle = color;
                ctx.fillRect(x * wDif, y * hDif, wDif, hDif);
            } else {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(x * wDif, y * hDif, wDif, hDif);
            }
        }
    }

    return canvas;
}
function convertAndDownload() {
    var makeCodeString = document.getElementById('makeCodeInput').value;
    var canvasData = convertImgStringToCanvas(makeCodeString, colors)
    var canvas = canvasData;
    var ctx = canvas.getContext('2d');   

    var dataURL = canvas.toDataURL('image/png');
    var downloadLink = document.createElement('a');
    downloadLink.href = dataURL;
    downloadLink.download = document.getElementById('varName').value + '.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}
document.getElementById('red').addEventListener('input', function() {
    changeColorPickerColor();
});
document.getElementById('green').addEventListener('input', function() {
    changeColorPickerColor();
});
document.getElementById('blue').addEventListener('input', function() {
    changeColorPickerColor();
});
function changeColorPickerColor() {
    const colorPicker = document.getElementById('colorPicker');
    const redInput = parseInt(document.getElementById('red').value);
    const greenInput = parseInt(document.getElementById('green').value);
    const blueInput = parseInt(document.getElementById('blue').value);

    const redHex = ('0' + redInput.toString(16)).slice(-2);
    const greenHex = ('0' + greenInput.toString(16)).slice(-2);
    const blueHex = ('0' + blueInput.toString(16)).slice(-2);

    colorPicker.value = '#' + redHex + greenHex + blueHex;
}
function updateColors() {
    const colorPicker = document.getElementById('colorPicker');
    const redInput = document.getElementById('red');
    const greenInput = document.getElementById('green');
    const blueInput = document.getElementById('blue');
    const selectedColor = colorPicker.value;
    const red = parseInt(selectedColor.substring(1, 3), 16);
    const green = parseInt(selectedColor.substring(3, 5), 16);
    const blue = parseInt(selectedColor.substring(5, 7), 16);
    redInput.value = red;
    greenInput.value = green;
    blueInput.value = blue;
}
function removedisabledColors(colArr, enabledArr) {
    const newPalArr = [];
    for (let i = 0; i < colArr.length; i++) {
        if (enabledArr[i]) {
            newPalArr.push(colArr[i]);
        }
    }
    return newPalArr;
}
function setRGBValues(red, green, blue) {
    document.getElementById('red').value = red;
    document.getElementById('green').value = green;
    document.getElementById('blue').value = blue;
}
document.getElementById('Filters').addEventListener('change', function() {
    var selectedValue = this.value;
    var customDiv = document.getElementById('customFilter');
    var noiseDiv = document.getElementById('NoiseFilter');
    var blurDiv = document.getElementById('blurFilter')
    customDiv.style.display = 'none';
    noiseDiv.style.display = 'none';
    blurDiv.style.display = 'none';
    if (selectedValue === 'custom') {
        customDiv.style.display = 'block';
    } else if (selectedValue === 'noise') {
        noiseDiv.style.display = 'block';
    } else if (selectedValue === 'blur') {
        blurDiv.style.display = 'block';
    }
    fliterOption = selectedValue;
});
document.getElementById('sizeSettings').addEventListener('change', function() {
    var selectedOption = this.value;
        document.getElementById('scaleOptions').style.display = 'none';
        document.getElementById('pixelGoalOptions').style.display = 'none';
        document.getElementById('widthHeightOptions').style.display = 'none';
        document.getElementById(selectedOption + 'Options').style.display = 'block';
}); 
function resizePixelGoal(width, height, totalPixelGoal) {
    var currentPixels = width * height;
    var aspectRatio = width / height;
    var newWidth = Math.sqrt(totalPixelGoal * aspectRatio);
    var newHeight = newWidth / aspectRatio;
    newWidth = Math.round(newWidth);
    newHeight = Math.round(newHeight);
    return [newWidth, newHeight];
}
function copyToClipboard() {
    let varName = document.getElementById('varName').value;
    navigator.clipboard.writeText('let ' + varName + imageString);
    alert("Copied successfully! ");
}
function noneDithering(context,w,h) {
    palArr = removedisabledColors(hexToRgb(colors),enabledColorsList);
    var imgData = context.getImageData(0, 0, w, h);
    var data = imgData.data;
    var MakecodeImg = []
    for (let y = 0; y < h; y++) {
        var row = [];
        for (let x = 0; x <w; x++) {
            const index = (y * w + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            row.push(palArr.indexOf(findClosest([r,g,b], palArr)) + 1);
        }
        MakecodeImg.push(row);
    } 
    imageString = ' = img\`\n';
    for (let rows of MakecodeImg) {
      for (let pixel of rows) {
        imageString += pixel.toString(16) + " "; 
      }
      imageString += "\n";
    }
    imageString += "`"; 
}
function bayerDithering2x2(context, w, h) {
    const ditherMatrix = [
        [0, 2],
        [3, 1]
    ];
    
    const palArr = removedisabledColors(hexToRgb(colors), enabledColorsList);
    const imgData = context.getImageData(0, 0, w, h);
    const data = imgData.data;
    const MakecodeImg = [];
    for (let y = 0; y < h; y++) {
        const row = [];
        for (let x = 0; x < w; x++) {
            const index = (y * w + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const threshold = ditherMatrix[x % 2][y % 2] / 3 ;
            let newR = r > threshold * 255 ? 255 : 0;
            let newG = g > threshold * 255 ? 255 : 0;
            let newB = b > threshold * 255 ? 255 : 0;
            const newpixel = findClosest([newR, newG, newB], palArr);
            data[index] = newpixel[0];
            data[index + 1] = newpixel[1];
            data[index + 2] = newpixel[2];
            row.push(palArr.indexOf(newpixel) + 1);
        }
        MakecodeImg.push(row);
    }
    let imageString = ' = img`\n';
    for (let rows of MakecodeImg) {
        for (let pixel of rows) {
            imageString += pixel.toString(16) + " ";
        }
        imageString += "\n";
    }
    imageString += "`";
    context.putImageData(imgData, 0, 0);
}
function bayerDithering4x4(context, w, h) {
    const ditherMatrix = [
        [ 0,  8,  2, 10],
        [12,  4, 14,  6],
        [ 3, 11,  1,  9],
        [15,  7, 13,  5]
    ];
    const palArr = removedisabledColors(hexToRgb(colors), enabledColorsList);
    const imgData = context.getImageData(0, 0, w, h);
    const data = imgData.data;
    const MakecodeImg = [];
    for (let y = 0; y < h; y++) {
        const row = [];
        for (let x = 0; x < w; x++) {
            const index = (y * w + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const threshold = ditherMatrix[x % 4][y % 4] / 15 ;
            let newR = r > threshold * 255 ? 255 : 0;
            let newG = g > threshold * 255 ? 255 : 0;
            let newB = b > threshold * 255 ? 255 : 0;
            const newpixel = findClosest([newR, newG, newB], palArr);
            data[index] = newpixel[0];
            data[index + 1] = newpixel[1];
            data[index + 2] = newpixel[2];
            row.push(palArr.indexOf(newpixel) + 1);
        }
        MakecodeImg.push(row);
    }
    let imageString = ' = img`\n';
    for (let rows of MakecodeImg) {
        for (let pixel of rows) {
            imageString += pixel.toString(16) + " ";
        }
        imageString += "\n";
    }
    imageString += "`";
    context.putImageData(imgData, 0, 0);
}
function bayerDithering8x8(context, w, h) {
    const ditherMatrix = [
        [ 0, 48, 12, 60,  3, 51, 15, 63],
        [32, 16, 44, 28, 35, 19, 47, 31],
        [ 8, 56,  4, 52, 11, 59,  7, 55],
        [40, 24, 36, 20, 43, 27, 39, 23],
        [ 2, 50, 14, 62,  1, 49, 13, 61],
        [34, 18, 46, 30, 33, 17, 45, 29],
        [10, 58,  6, 54,  9, 57,  5, 53],
        [42, 26, 38, 22, 41, 25, 37, 21]
    ];
    const palArr = removedisabledColors(hexToRgb(colors), enabledColorsList);
    const imgData = context.getImageData(0, 0, w, h);
    const data = imgData.data;
    const MakecodeImg = [];
    for (let y = 0; y < h; y++) {
        const row = [];
        for (let x = 0; x < w; x++) {
            const index = (y * w + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const threshold = ditherMatrix[x % 8][y % 8] / 63;
            let newR = r > threshold * 255 ? 255 : 0;
            let newG = g > threshold * 255 ? 255 : 0;
            let newB = b > threshold * 255 ? 255 : 0;
            const newpixel = findClosest([newR, newG, newB], palArr);
            data[index] = newpixel[0];
            data[index + 1] = newpixel[1];
            data[index + 2] = newpixel[2];
            row.push(palArr.indexOf(newpixel) + 1);
        }
        MakecodeImg.push(row);
    }
    let imageString = ' = img`\n';
    for (let rows of MakecodeImg) {
        for (let pixel of rows) {
            imageString += pixel.toString(16) + " ";
        }
        imageString += "\n";
    }
    imageString += "`";
    context.putImageData(imgData, 0, 0);
}
function easterEgg() {
    let currentValue = Number(localStorage.getItem('easterEgg')) || 0;
    currentValue++;
    localStorage.setItem('easterEgg', currentValue);
    
    if (currentValue == 100 || currentValue == 1000) {
        window.location.href = easterEgg.html';
    } else {
        console.log(currentValue)
    }

}
function goToeasterEgg() {
    window.location.href = 'easterEgg.html';
}
document.getElementById('version').addEventListener('input', easterEgg);
function bayerDithering16x16(context, w, h) {
    const ditherMatrix = [
        [  0, 192,  48, 240,  12, 204,  60, 252,   3, 195,  51, 243,  15, 207,  63, 255],
        [128,  64, 176, 112, 140,  76, 188, 124, 131,  67, 179, 115, 143,  79, 191, 127],
        [ 32, 224,  16, 208,  44, 236,  28, 220,  35, 227,  19, 211,  47, 239,  31, 223],
        [160,  96, 144,  80, 172, 108, 156,  92, 163,  99, 147,  83, 175, 111, 159,  95],
        [  8, 200,  56, 248,   4, 196,  52, 244,  11, 203,  59, 251,   7, 199,  55, 247],
        [136,  72, 184, 120, 132,  68, 180, 116, 139,  75, 187, 123, 142,  78, 190, 126],
        [ 40, 232,  24, 216,  36, 228,  20, 212,  43, 235,  27, 219,  39, 231,  23, 215],
        [168, 104, 152,  88, 164, 100, 148,  84, 171, 107, 155,  91, 167, 103, 151,  87],
        [  2, 194,  50, 242,  14, 206,  62, 254,   1, 193,  49, 241,  13, 205,  61, 253],
        [130,  66, 178, 114, 129,  65, 177, 113, 134,  70, 182, 118, 133,  69, 181, 117],
        [ 34, 226,  18, 210,  46, 238,  30, 222,  33, 225,  17, 209,  45, 237,  29, 221],
        [162,  98, 146,  82, 174, 110, 158,  94, 161,  97, 145,  81, 173, 109, 157,  93],
        [ 10, 202,  58, 250,   6, 198,  54, 246,   9, 201,  57, 249,   5, 197,  53, 245],
        [138,  74, 186, 122, 137,  73, 185, 121, 140,  76, 188, 124, 141,  77, 189, 125],
        [ 42, 234,  26, 218,  38, 230,  22, 214,  41, 233,  25, 217,  37, 229,  21, 213],
        [170, 106, 154,  90, 166, 102, 150,  86, 169, 105, 153,  89, 165, 101, 149,  85]
    ];
    const palArr = removedisabledColors(hexToRgb(colors), enabledColorsList);
    const imgData = context.getImageData(0, 0, w, h);
    const data = imgData.data;
    const MakecodeImg = [];
    for (let y = 0; y < h; y++) {
        const row = [];
        for (let x = 0; x < w; x++) {
            const index = (y * w + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const threshold = ditherMatrix[x % 16][y % 16] / 255 ;
            let newR = r > threshold * 255 ? 255 : 0;
            let newG = g > threshold * 255 ? 255 : 0;
            let newB = b > threshold * 255 ? 255 : 0;
            const newpixel = findClosest([newR, newG, newB], palArr);
            data[index] = newpixel[0];
            data[index + 1] = newpixel[1];
            data[index + 2] = newpixel[2];
            row.push(palArr.indexOf(newpixel) + 1);
        }
        MakecodeImg.push(row);
    }
    let imageString = ' = img`\n';
    for (let rows of MakecodeImg) {
        for (let pixel of rows) {
            imageString += pixel.toString(16) + " ";
        }
        imageString += "\n";
    }
    imageString += "`";
    context.putImageData(imgData, 0, 0);
}
function ClosesColorDithering(context, w, h) {
    var imgData = context.getImageData(0, 0, w, h);
    var data = imgData.data;
    var MakecodeImg = []
    palArr = removedisabledColors(hexToRgb(colors),enabledColorsList);
    for (var y = 0; y < h; y++) {
        var row = [];
        for (var x = 0; x < w; x++) {
            var id = ((y * w) + x) * 4;
            oldpixel = [data[id], data[id + 1], data[id + 2]];
            newpixel = findClosest(oldpixel, palArr);
            row.push(palArr.indexOf(newpixel) + 1);
            data[id] = newpixel[0];
            data[id + 1] = newpixel[1];
            data[id + 2] = newpixel[2];
            data[id + 3] = 255;
        }
        MakecodeImg.push(row);
    }
    imageString = ' = img\`\n';
    for (let rows of MakecodeImg) {
      for (let pixel of rows) {
        imageString += pixel.toString(16) + " "; 
      }
      imageString += "\n";
    }
    imageString += "`"; 
    context.putImageData(imgData, 0, 0);
}
function floydSteinbergDithering(context, w, h) {
    var imgData = context.getImageData(0, 0, w, h);
    var data = imgData.data;
    var MakecodeImg = []
    palArr = removedisabledColors(hexToRgb(colors),enabledColorsList);
    for (var y = 0; y < h; y++) {
        var row = [];
        for (var x = 0; x < w; x++) {
            var id = ((y * w) + x) * 4;
            oldpixel = [data[id], data[id + 1], data[id + 2]];
            newpixel = findClosest(oldpixel, palArr);
            row.push(palArr.indexOf(newpixel) + 1);
            data[id] = newpixel[0];
            data[id + 1] = newpixel[1];
            data[id + 2] = newpixel[2];
            data[id + 3] = 255;
            quantErr = getQuantErr(oldpixel, newpixel);
            id = ((y * w) + (x + 1)) * 4;
            if (id < data.length) {
                err = applyErrBitShift([data[id], data[id + 1], data[id + 2]], quantErr, 7,4);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }
            id = (((y + 1) * w) + (x - 1)) * 4;
            if (id < data.length) {
                err = applyErrBitShift([data[id], data[id + 1], data[id + 2]], quantErr, 3,4);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }
            id = (((y + 1) * w) + x) * 4;
            if (id < data.length) {
                err = applyErrBitShift([data[id], data[id + 1], data[id + 2]], quantErr, 5,4);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }
            id = (((y + 1) * w) + (x + 1)) * 4;
            if (id < data.length) {
                err = applyErrBitShift([data[id], data[id + 1], data[id + 2]], quantErr, 1,4);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }
        }
        MakecodeImg.push(row);
    }
    imageString = ' = img\`\n';
    for (let rows of MakecodeImg) {
      for (let pixel of rows) {
        imageString += pixel.toString(16) + " "; 
      }
      imageString += "\n";
    }
    imageString += "`"; 
    context.putImageData(imgData, 0, 0);
}
function FalseFloydSteinbergDithering(context, w, h) {
    var imgData = context.getImageData(0, 0, w, h);
    var data = imgData.data;
    var MakecodeImg = []
    palArr = removedisabledColors(hexToRgb(colors),enabledColorsList);
    for (var y = 0; y < h; y++) {
        var row = [];
        for (var x = 0; x < w; x++) {
            var id = ((y * w) + x) * 4;
            oldpixel = [data[id], data[id + 1], data[id + 2]];
            newpixel = findClosest(oldpixel, palArr);
            row.push(palArr.indexOf(newpixel) + 1);
            data[id] = newpixel[0];
            data[id + 1] = newpixel[1];
            data[id + 2] = newpixel[2];
            data[id + 3] = 255;
            quantErr = getQuantErr(oldpixel, newpixel);
            id = (((y) * w) + (x + 1)) * 4;
            if (id < data.length) {
                err = applyErrBitShift([data[id], data[id + 1], data[id + 2]], quantErr, 3,3);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }
            id = (((y + 1) * w) + (x + 1)) * 4;
            if (id < data.length) {
                err = applyErrBitShift([data[id], data[id + 1], data[id + 2]], quantErr, 2,3);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }
            id = (((y+1) * w) + (x)) * 4;
            if (id < data.length) {
                err = applyErrBitShift([data[id], data[id + 1], data[id + 2]], quantErr, 3,3);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }
        }
        MakecodeImg.push(row);
    }
    imageString = ' = img\`\n';
    for (let rows of MakecodeImg) {
      for (let pixel of rows) {
        imageString += pixel.toString(16) + " "; 
      }
      imageString += "\n";
    }
    imageString += "`"; 
    context.putImageData(imgData, 0, 0);
}
function stuckiDithering(context, w, h) {
    var imgData = context.getImageData(0, 0, w, h);
    var data = imgData.data;
    var MakecodeImg = []
    palArr = removedisabledColors(hexToRgb(colors),enabledColorsList);
    for (var y = 0; y < h; y++) {
        var row = [];
        for (var x = 0; x < w; x++) {
            var id = ((y * w) + x) * 4;
            oldpixel = [data[id], data[id + 1], data[id + 2]];
            newpixel = findClosest(oldpixel, palArr);
            row.push(palArr.indexOf(newpixel) + 1);
            data[id] = newpixel[0];
            data[id + 1] = newpixel[1];
            data[id + 2] = newpixel[2];
            data[id + 3] = 255;
            quantErr = getQuantErr(oldpixel, newpixel);
            id = (((y) * w) + (x + 1)) * 4;
            if (id < data.length) {
                err = applyErrDiv([data[id], data[id + 1], data[id + 2]], quantErr, 8,42);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }
            id = (((y) * w) + (x + 2)) * 4;
            if (id < data.length) {
                err = applyErrDiv([data[id], data[id + 1], data[id + 2]], quantErr, 4,42);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }
            id = (((y+1) * w) + (x - 2)) * 4;
            if (id < data.length) {
                err = applyErrDiv([data[id], data[id + 1], data[id + 2]], quantErr, 2,42);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }
            id = (((y+1) * w) + (x - 1)) * 4;
            if (id < data.length) {
                err = applyErrDiv([data[id], data[id + 1], data[id + 2]], quantErr, 4,42);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }
            id = (((y+1) * w) + (x)) * 4;
            if (id < data.length) {
                err = applyErrDiv([data[id], data[id + 1], data[id + 2]], quantErr, 8,42);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }
            id = (((y+1) * w) + (x + 1)) * 4;
            if (id < data.length) {
                err = applyErrDiv([data[id], data[id + 1], data[id + 2]], quantErr, 4,42);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }
            id = (((y+1) * w) + (x + 2)) * 4;
            if (id < data.length) {
                err = applyErrDiv([data[id], data[id + 1], data[id + 2]], quantErr, 2,42);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }
            id = (((y + 2) * w) + (x - 2)) * 4;
            if (id < data.length) {
                err = applyErrDiv([data[id], data[id + 1], data[id + 2]], quantErr, 1,42);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }
            id = (((y + 2) * w) + (x - 1)) * 4;
            if (id < data.length) {
                err = applyErrDiv([data[id], data[id + 1], data[id + 2]], quantErr, 2,42);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }
            id = (((y + 2) * w) + (x)) * 4;
            if (id < data.length) {
                err = applyErrDiv([data[id], data[id + 1], data[id + 2]], quantErr, 4,42);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }
            id = (((y + 2) * w) + (x + 1)) * 4;
            if (id < data.length) {
                err = applyErrDiv([data[id], data[id + 1], data[id + 2]], quantErr, 2,42);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }
            id = (((y + 2) * w) + (x + 2)) * 4;
            if (id < data.length) {
                err = applyErrDiv([data[id], data[id + 1], data[id + 2]], quantErr, 1,42);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }
        }
        MakecodeImg.push(row);
    }
    imageString = ' = img\`\n';
    for (let rows of MakecodeImg) {
      for (let pixel of rows) {
        imageString += pixel.toString(16) + " "; 
      }
      imageString += "\n";
    }
    imageString += "`"; 
    context.putImageData(imgData, 0, 0);
}
function BurkesDithering(context, w, h) {
    var imgData = context.getImageData(0, 0, w, h);
    var data = imgData.data;
    var MakecodeImg = []
    palArr = removedisabledColors(hexToRgb(colors),enabledColorsList);
    for (var y = 0; y < h; y++) {
        var row = [];
        for (var x = 0; x < w; x++) {
            var id = ((y * w) + x) * 4;
            oldpixel = [data[id], data[id + 1], data[id + 2]];
            newpixel = findClosest(oldpixel, palArr);
            row.push(palArr.indexOf(newpixel) + 1);
            data[id] = newpixel[0];
            data[id + 1] = newpixel[1];
            data[id + 2] = newpixel[2];
            data[id + 3] = 255;
            quantErr = getQuantErr(oldpixel, newpixel);
            id = (((y) * w) + (x + 1)) * 4;
            if (id < data.length) {
                err = applyErrBitShift([data[id], data[id + 1], data[id + 2]], quantErr, 8,5);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }
            id = (((y) * w) + (x + 2)) * 4;
            if (id < data.length) {
                err = applyErrBitShift([data[id], data[id + 1], data[id + 2]], quantErr, 4,5);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }
            id = (((y+1) * w) + (x - 2)) * 4;
            if (id < data.length) {
                err = applyErrBitShift([data[id], data[id + 1], data[id + 2]], quantErr, 2,5);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }
            id = (((y+1) * w) + (x - 1)) * 4;
            if (id < data.length) {
                err = applyErrBitShift([data[id], data[id + 1], data[id + 2]], quantErr, 4,5);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }
            id = (((y+1) * w) + (x)) * 4;
            if (id < data.length) {
                err = applyErrBitShift([data[id], data[id + 1], data[id + 2]], quantErr, 8,5);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }
            id = (((y+1) * w) + (x + 1)) * 4;
            if (id < data.length) {
                err = applyErrBitShift([data[id], data[id + 1], data[id + 2]], quantErr, 4,5);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }
            id = (((y+1) * w) + (x + 2)) * 4;
            if (id < data.length) {
                err = applyErrBitShift([data[id], data[id + 1], data[id + 2]], quantErr, 2,5);
                data[id] = err[0];
                data[id + 1] = err[1];
                data[id + 2] = err[2];
            }
            
        }
        MakecodeImg.push(row);
    }
    imageString = ' = img\`\n';
    for (let rows of MakecodeImg) {
      for (let pixel of rows) {
        imageString += pixel.toString(16) + " "; 
      }
      imageString += "\n";
    }
    imageString += "`"; 
    context.putImageData(imgData, 0, 0);
}
function InvertFilter(context, w, h) {
    const imgData = context.getImageData(0, 0, w, h);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        data[  i  ] = 255 - r
        data[i + 1] = 255 - g
        data[i + 2] = 255 - b
    }
    context.putImageData(imgData, 0, 0);
}
function noiseFilter(context, w, h, noise) {
    const imgData = context.getImageData(0, 0, w, h);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const noiseArr = [r + Math.random() * noise, g + Math.random() * noise, b + Math.random() * noise];
        data[i] = Math.floor((r + noiseArr[0]) / 2);
        data[i + 1] = Math.floor((g + noiseArr[1]) / 2);
        data[i + 2] = Math.floor((b + noiseArr[2]) / 2);
    }
    context.putImageData(imgData, 0, 0);
}
function customFilter(context, w, h, red, green, blue) {
    const imgData = context.getImageData(0, 0, w, h);
    const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const percentRed = red / 255;
        const percentGreen = green / 255;
        const percentBlue = blue / 255;
        data[i] = percentRed * r;
        data[i + 1] = percentGreen * g;
        data[i + 2] = percentBlue * b;
    }
    context.putImageData(imgData, 0, 0);
}
function grayScale(context, w, h) {
    const imgData = context.getImageData(0, 0, w, h);
    const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
        const r = data[  i  ];
        const g = data[i + 1];
        const b = data[i + 2];
        const grayscale = (r +g + b)/3;
        data[  i  ] = grayscale; // Red
        data[i + 1] = grayscale; // Green
        data[i + 2] = grayscale; // Blue
    }
    context.putImageData(imgData, 0, 0);
}
function blurImage(context, w, h, blurPower) {
    const imgData = context.getImageData(0, 0, w, h);
    const data = imgData.data;
    const radius = Math.floor(blurPower / 2);
    const side = radius * 2 + 1;
    const kernel = 1 / Math.pow(side,2)
    const newData = new Uint8ClampedArray(data.length);
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let r = 0,g = 0,b = 0,a = 0;
            for (let ky = -radius; ky <= radius; ky++) {
                for (let kx = -radius; kx <= radius; kx++) {
                    const pixelY = y + ky;
                    const pixelX = x + kx;
                    if (pixelY >= 0 && pixelY < h && pixelX >= 0 && pixelX < w) {
                        const index = (pixelY * w + pixelX) * 4;
                        const weight = kernel;
                        r += data[index] * weight;
                        g += data[index + 1] * weight;
                        b += data[index + 2] * weight;
                        a += data[index + 3] * weight;
                    }
                }
            }
            const dataIndex = (y * w + x) * 4;
            newData[dataIndex] = r;
            newData[dataIndex + 1] = g;
            newData[dataIndex + 2] = b;
            newData[dataIndex + 3] = a;
        }
    }
    for (let i = 0; i < newData.length; i++) {
        data[i] = newData[i];
    }
    context.putImageData(imgData, 0, 0);
}
function findClosest(oldpixel, palArr) {
    return palArr.reduce((closest, current, idx) => {
        const [r, g, b] = current;
        const dist = (oldpixel[0] - r) ** 2 + (oldpixel[1] - g) ** 2 + (oldpixel[2] - b) ** 2;
        if (dist < closest.dist) {
            closest.dist = dist;
            closest.color = current;
        }
        return closest;
    }, { dist: Infinity, color: null }).color;
}
function getQuantErr(oldpixel, newpixel) {
    oldpixel[0] -= newpixel[0];
    oldpixel[1] -= newpixel[1];
    oldpixel[2] -= newpixel[2];
    return oldpixel;
}
function applyErrBitShift(pixel, error, factor,div) {
    pixel[0] += (error[0] * factor)>>div;
    pixel[1] += (error[1] * factor)>>div;
    pixel[2] += (error[2] * factor)>>div;
    return pixel;
}     
function applyErrDiv(pixel, error, factor,div) {
    pixel[0] += (error[0] * factor)/div;
    pixel[1] += (error[1] * factor)/div;
    pixel[2] += (error[2] * factor)/div;
    return pixel;
}     
function addColor() {
    const colorInput = document.getElementById('colorInput');
    const color = colorInput.value.trim();
    if (color) {
        colors.push(color);
        enabledColorsList.push(true);
        renderColors();
    }
}
function changeColor(index) {
    const colorInput = document.getElementById('colorInput');
    const color = colorInput.value.trim();
    colors[index] = color;
    renderColors();
}
function removeColor(index) {
    colors.splice(index, 1);
    enabledColorsList.splice(index, 1)
    renderColors();
}
function moveUp(index) {  
    if (index > 0) {
        const switchColors = [colors[index],colors[index-1]]
        colors[index] = switchColors[1]
        colors[index-1] = switchColors[0]
        const enableListSwitch = [enabledColorsList[index],enabledColorsList[index-1]]
        enabledColorsList[index] = enableListSwitch[1]
        enabledColorsList[index-1] = enableListSwitch[0]
        renderColors();

    }
}
function moveDown(index) {  
    if (index < colors.length-1) {
        const switchColors = [colors[index],colors[index+1]]
        colors[index] = switchColors[1]
        colors[index+1] = switchColors[0]
        const enableListSwitch = [enabledColorsList[index],enabledColorsList[index+1]]
        enabledColorsList[index] = enableListSwitch[1]
        enabledColorsList[index+1] = enableListSwitch[0]
        renderColors();
    }
}
function renderColors() {
    const colorList = document.getElementById('colorList');
    colorList.innerHTML = '';
    colors.forEach((color, index) => {
        const li = document.createElement('li');
        const listIndex = index + 1;
        const colorSpan = document.createElement('span');
        colorSpan.textContent = color.toUpperCase() + ', ' + listIndex.toString(16).toUpperCase();
        colorSpan.style.color = '#ffffff'; // Set text color to white (brighter)
        li.appendChild(colorSpan);
        const canvas = document.createElement('canvas');
        canvas.width = 50;
        canvas.height = 20;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        li.appendChild(canvas);
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', () => removeColor(index));
        li.appendChild(removeBtn);
        const changeColorBtn = document.createElement('button');
        changeColorBtn.textContent = 'Change';
        changeColorBtn.addEventListener('click', () => changeColor(index));
        li.appendChild(changeColorBtn);
        const moveColorUpBtn = document.createElement('button');
        moveColorUpBtn.textContent = '\u2191';
        moveColorUpBtn.addEventListener('click', () => moveUp(index));
        li.appendChild(moveColorUpBtn);
        const moveColorDownBtn = document.createElement('button');
        moveColorDownBtn.textContent = '\u2193';
        moveColorDownBtn.addEventListener('click', () => moveDown(index));
        li.appendChild(moveColorDownBtn);
        const enableBtn = document.createElement('button');
        enableBtn.textContent = enabledColorsList[index] ? 'Disable' : 'Enable';
        enableBtn.classList.add(enabledColorsList[index] ? 'enabled' : 'disabled');
        enableBtn.addEventListener('click', () => enableColor(index));
        li.appendChild(enableBtn);
        colorList.appendChild(li);
    });
}
function enableColor(index) {
    enabledColorsList[index] = !enabledColorsList[index]
    renderColors();
}
function hexToRgb(hexArray) {
    return hexArray.map(hex => {
        const red = parseInt(hex.substring(1, 3), 16);
        const green = parseInt(hex.substring(3, 5), 16);
        const blue = parseInt(hex.substring(5, 7), 16);
        return [red, green, blue];
    });
}
function rgbToHex(rgbArray) {
    return rgbArray.map(rgb => {
        return '#' + rgb.map(component => {
            const hex = component.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    });
}
function arrayEquals(arr1, arr2) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
}
function addFilter() {
    let data;
    const filter = document.getElementById('Filters').value
    if (filter != 'none') {
        filterList.push(filter)
        if (filter == 'custom') {
            const r = document.getElementById('red').value;
            const g = document.getElementById('green').value;
            const b = document.getElementById('blue').value;
            data = [r,g,b];
        } else if (filter == 'noise') {
            const noiseLevel = document.getElementById('noiseLevel').value;
            data = [noiseLevel];
        } else if (filter == 'blur') {
            const blurPower = Math.min(Math.abs(document.getElementById('blurPower').value),50);
            data = [blurPower];
        } else {
            data = [];
        }
        filterEffectPowerList.push(data)
    }
    
}
function resetFilter() {
    filterList = [];
    filterEffectPowerList = [];
}
