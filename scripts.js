let colors = [
    '#ffffff',  // white
    '#ff2121',  // red
    '#ff93c4',  // pink
    '#ff8135',  // orange
    '#fff609',  // yellow
    '#249ca3',  // cyan
    '#78dc52',  // green
    '#003fad',  // blue
    '#87f2ff',  // light-blue
    '#8e2ec4',  // purple
    '#a4839f',  // Dusty Purple
    '#5c406c',  // Dark Purple
    '#e5cdc4',  // Light Beige
    '#91463d',  // brown
    '#000000'   // black
];
function findNearestColor(t, s){let e=s[0],h=Math.abs(t[0]-e[0])+Math.abs(t[1]-e[1])+Math.abs(t[2]-e[2]);for(let a=1;a<s.length;a++){var[b,r,M]=s[a],M=Math.abs(t[0]-b)+Math.abs(t[1]-r)+Math.abs(t[2]-M);M<h&&(h=M,e=s[a])}return e}
function getQuantErr(r,t){return r[0]-=t[0],r[1]-=t[1],r[2]-=t[2],r}
function applyErrBitShift(r,t,i,n){i*=multiplier;return r[0]+=t[0]*i>>n,r[1]+=t[1]*i>>n,r[2]+=t[2]*i>>n,r}
function applyErrDiv(r,t,i,n){i*=multiplier,n=1/n;return r[0]+=t[0]*i*n,r[1]+=t[1]*i*n,r[2]+=t[2]*i*n,r}

let enabledColorsList = new Array(colors.length).fill(true);
let filterList = [];
let filterEffectPowerList = [];
let time = 0;
let multiplier = 1;
const listKey = '$I';
const defaultColorList = {
    color: colors,
    enabledColorsList: new Array(colors.length).fill(true)
};
renderColors();
function updateMultiplier() {
    multiplier = parseFloat(document.getElementById('err_multi').value) || 1;
}
// Main function to process the image
/**
 * Process the image
 */
function processImage() {
    updateMultiplier();  // Update multiplier value

    // Retrieve input elements
    const fileInput = document.getElementById('fileInput');
    const scaleFactorInput = document.getElementById('scaleFactor');
    const outputImage = document.getElementById('outputImage');
    const colorArr = document.getElementById('colorArr');
    const newWidth = document.getElementById('width').value;
    const newHeight = document.getElementById('height').value;
    const pixelGoal = document.getElementById('maxPixels').value;
    const ditheringOption = document.getElementById('ditheringOptions').value;

    // Initialize the file reader
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            // Create a canvas to draw the image on
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Adjust canvas size based on settings
            setCanvasSize(img, canvas, newWidth, newHeight, pixelGoal, scaleFactorInput.value);

            // Draw the image and apply transformations
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            applyFilter(ctx, canvas.width, canvas.height);
            applyDithering(ctx, canvas.width, canvas.height, ditheringOption);

            // Set the output image source to the processed canvas
            outputImage.src = canvas.toDataURL();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(fileInput.files[0]);

    // Add event listener to the download button
    const downloadButton = document.getElementById('downloadButton');
    downloadButton.addEventListener('click', downloadImage);

    // Calculate and display the conversion time

}
window.onload = function() {
    var colorListsSelect = document.getElementById('colorLists');

    colorListsSelect.innerHTML = '';
    var defaultOption = document.createElement("option");
    defaultOption.text = "Default";
    defaultOption.value = listKey + "Default";
    colorListsSelect.add(defaultOption);
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key.startsWith(listKey)) {
            var listName = key.substring(listKey.length);
            var option = document.createElement("option");
            option.text = listName;
            option.value = listName;
            colorListsSelect.add(option);
        }
    }

    renderColors();
}
document.getElementById('Filters').addEventListener('change', function() {
    var selectedValue = this.value;
    var customDiv = document.getElementById('customFilter');
    var noiseDiv = document.getElementById('NoiseFilter');
    var blurDiv = document.getElementById('blurFilter');
    var radiusDiv = document.getElementById('RadiusFilter');
    var sliderDiv = document.getElementById('BrightenFilter');
    
    // Hide all divs first
    customDiv.style.display = 'none';
    noiseDiv.style.display = 'none';
    blurDiv.style.display = 'none';
    radiusDiv.style.display = 'none';
    sliderDiv.style.display = 'none'; // Fixed the typo here

    // Show the selected div based on the selected value
    if (selectedValue === 'custom') {
        customDiv.style.display = 'block';
    } else if (selectedValue === 'noise') {
        noiseDiv.style.display = 'block';
    } else if (selectedValue === 'blur') {
        blurDiv.style.display = 'block';
    } else if (selectedValue === 'median') {
        radiusDiv.style.display = 'block';
    } else if (selectedValue === 'Brighten') {
        sliderDiv.style.display = 'block';
    }

    // Store the selected filter option
    fliterOption = selectedValue;
});
document.getElementById('sizeSettings').addEventListener('change', function() {
    var selectedOption = this.value;
        document.getElementById('scaleOptions').style.display = 'none';
        document.getElementById('pixelGoalOptions').style.display = 'none';
        document.getElementById('widthHeightOptions').style.display = 'none';
        document.getElementById(selectedOption + 'Options').style.display = 'block';
}); 
document.getElementById('red').addEventListener('input', function() {
    changeColorPickerColor();
});
document.getElementById('green').addEventListener('input', function() {
    changeColorPickerColor();
});
document.getElementById('blue').addEventListener('input', function() {
    changeColorPickerColor();
});
document.addEventListener("DOMContentLoaded", function() {
    var select = document.getElementById("ditheringOptions");
    var hoverBox = document.getElementById("hoverBox");
    var hoverDescription = document.getElementById("hoverDescription");
    select.addEventListener("mouseover", function(event) {
        if (event.target.tagName === "OPTION") {
            var optionDescription = event.target.getAttribute("data-description");
            var optionRect = event.target.getBoundingClientRect();
             hoverDescription.textContent = optionDescription;
             hoverBox.style.display = "block";
            hoverBox.style.left = optionRect.left + "px";
            hoverBox.style.top = (optionRect.top + window.scrollY + 20) + "px"; // Adjusting the position for better visibility
        }
    });
    select.addEventListener("mouseout", function() {
        hoverBox.style.display = "none";
    });
});
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const img = new Image();
    img.onload = function() {
        const widthInput = document.getElementById('width');
        const heightInput = document.getElementById('height');
        const maxPixelsInput = document.getElementById('maxPixels');
        const scaleFactorInput = document.getElementById('scaleFactor');

        const screenWidth = window.innerWidth;

        const targetWidth = (screenWidth<<2) / 14
        const scaleFactor = Math.round((targetWidth / img.width)*10e+2)/10e+2;

        const optimizedWidth = Math.floor(img.width * scaleFactor);
        const optimizedHeight = Math.floor(img.height * scaleFactor);

        widthInput.value = Math.max(optimizedWidth, 1);
        heightInput.value = Math.max(optimizedHeight, 1);

        scaleFactorInput.value = Math.abs(scaleFactor-1) <= 0.1 ? 1 : scaleFactor;

        processImage();
    };

    const reader = new FileReader();
    reader.onload = function(e) {
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});
function saveColorList() {
    var colorListName = prompt("Enter a name for the color list:");
    if (colorListName) {
        var savedData = {
            color: colors,
            enabledColorsList: enabledColorsList
        };
        localStorage.setItem(listKey + colorListName, JSON.stringify(savedData));
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
    if (selectedColorListName != listKey + "Default") {
        var fullKey = listKey + selectedColorListName;
        var savedData = localStorage.getItem(fullKey);
        if (savedData) {
            savedData = JSON.parse(savedData);
            colors = savedData.color;
            enabledColorsList = savedData.enabledColorsList;
        }
    } else {
        colors = defaultColorList.color;
        enabledColorsList = defaultColorList.enabledColorsList;
    }
    renderColors();
}
function removeColorList() {
    var selectedColorListName = document.getElementById('colorLists').value;
    if (selectedColorListName != listKey + "Default") {
        var fullKey = listKey + selectedColorListName;
        localStorage.removeItem(fullKey);
        var colorListsSelect = document.getElementById('colorLists');
        var options = colorListsSelect.options;
        for (var i = 0; i < options.length; i++) {
            if (options[i].value === selectedColorListName) {
                colorListsSelect.remove(i);
                break;
            }
        }
        if (colorListsSelect.options.length === 0) {
            colors = defaultColorList.color;
            enabledColorsList = defaultColorList.enabledColorsList;
            renderColors();
        }
    }
}
/**
 * Function to set the canvas size based on user-specified settings. 
 * This function adjusts the canvas dimensions using one of three methods: 
 * user-defined width and height, a target pixel goal, or a scale factor.
 *
 * @param {HTMLImageElement} img - The source image used to determine dimensions.
 * @param {HTMLCanvasElement} canvas - The canvas element to resize.
 * @param {number} newWidth - Desired width of the canvas. Use -1 to ignore this parameter.
 * @param {number} newHeight - Desired height of the canvas. Use -1 to ignore this parameter.
 * @param {number} pixelGoal - The target number of pixels for the resized canvas. Ignored unless 'pixelGoal' mode is selected.
 * @param {number} scaleFactor - The scaling factor to apply to the image dimensions. Ignored unless 'scaleFactor' mode is selected.
 */
function setCanvasSize(img, canvas, newWidth, newHeight, pixelGoal, scaleFactor) {
    const sizeSettings = document.getElementById('sizeSettings').value;

    if (sizeSettings === 'widthHeight') {
        // Set width and height based on user input or ratio adjustment
        if (!(newWidth == -1 && newHeight == -1)) {
            canvas.width = newWidth != -1 ? newWidth : img.width * (newHeight / img.height);
            canvas.height = newHeight != -1 ? newHeight : img.height * (newWidth / img.width);
        } else {
            canvas.width = img.width;
            canvas.height = img.height;
        }
    } else if (sizeSettings === 'pixelGoal') {
        // Resize based on pixel goal
        const newRes = resizePixelGoal(img.width, img.height, pixelGoal);
        canvas.width = newRes[0];
        canvas.height = newRes[1];
    } else {
        // Resize based on scale factor
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;
    }
}
/**
 * Function to apply a specified dithering technique to an image.
 * The function processes the image data within a canvas context using the selected dithering algorithm.
 *
 * @param {CanvasRenderingContext2D} context - The canvas 2D rendering context containing the image data to dither.
 * @param {number} w - The width of the image or canvas area to apply the dithering.
 * @param {number} h - The height of the image or canvas area to apply the dithering.
 * @param {string} ditheringType - The type of dithering to apply. Options include:
 *  - 'none': No dithering.
 *  - 'floyd': Floyd-Steinberg dithering.
 *  - 'nearest': Nearest color dithering.
 *  - 'bayerMatrix2': Bayer matrix 2x2 dithering.
 *  - 'bayerMatrix4': Bayer matrix 4x4 dithering.
 *  - 'bayerMatrix8': Bayer matrix 8x8 dithering.
 *  - 'bayerMatrix16': Bayer matrix 16x16 dithering.
 *  - 'falseFloyd': False Floyd-Steinberg dithering.
 *  - 'stucki': Stucki dithering.
 *  - 'Burkes': Burkes dithering.
 */
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
function applyFilter(context,w,h) {
    if (filterList.length > 0) {
        for (let i = 0; i < filterList.length; i++) {
            if (filterList[i] == 'GrayScale') {
                grayScale(context,w,h);
            } else if (filterList[i] == 'custom') {
                const r = filterEffectPowerList[i][0];
                const g = filterEffectPowerList[i][1];
                const b = filterEffectPowerList[i][2];
                customFilter(context,w,h,r,g,b);
            } else if (filterList[i] == 'noise') {
                const noiseLevel = filterEffectPowerList[i][0];
                noiseFilter(context,w,h,noiseLevel);
            } else if (filterList[i] == 'blur') {
                const blurPower = Math.min(Math.abs(filterEffectPowerList[i][0]),50);
                blurImage(context,w,h, blurPower);
            } else if (filterList[i] == 'invert') {
              InvertFilter(context,w,h);
            } else if (filterList[i] == 'unBlur') {
                unblurImage(context,w,h);
            } else if (filterList[i] == 'median') {
                const radius = Math.min(Math.abs(filterEffectPowerList[i][0]),15);
                medianFilter(context,w,h, 1);
            } else if (filterList[i] == 'Brighten') {
                brightenFilter(context,w,h,1.2)
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
        } else if (filterType == 'unBlur') {
            unblurImage(context,w,h);  
        } else if (filterType == 'median') {
            const radius = Math.min(Math.abs(document.getElementById('radius').value),15);
            medianFilter(context,w,h, radius);
        } else if (filterType == 'Brighten') {
            brightenFilter(context,w,h,1.2)
        }
    }
}
function getPerceivedBrightness(r, g, b) {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function brightenFilter(context, width, height, brightnessFactor) {
    // Get the image data from the canvas
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Loop through all the pixels
    for (let i = 0; i < data.length; i += 4) {
        // Get the RGB values
        let r = data[i];     // Red
        let g = data[i + 1]; // Green
        let b = data[i + 2]; // Blue

        // Calculate the perceived brightness of the pixel
        let brightness = getPerceivedBrightness(r, g, b);

        // Apply the brightness factor to the perceived brightness
        // Increase the brightness proportionally, but don't exceed the max value (255)
        r = Math.min(255, r + (brightness * brightnessFactor));
        g = Math.min(255, g + (brightness * brightnessFactor));
        b = Math.min(255, b + (brightness * brightnessFactor));

        // Set the new values to the image data
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
    }

    // Put the modified image data back to the canvas
    context.putImageData(imageData, 0, 0);
}
function medianFilter(context, w, h, radius) {
    const imgData = context.getImageData(0, 0, w, h);
    const data = imgData.data;
    const newData = new Uint8ClampedArray(data.length); // Create a new array to store modified data
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const index = (y * w + x) * 4;
            const redValues = [];
            const greenValues = [];
            const blueValues = [];
            for (let j = -radius; j <= radius; j++) {
                for (let i = -radius; i <= radius; i++) {
                    const nx = x + i;
                    const ny = y + j;
                    if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                        const neighborIndex = (ny * w + nx) * 4;
                        redValues.push(data[neighborIndex]);
                        greenValues.push(data[neighborIndex + 1]);
                        blueValues.push(data[neighborIndex + 2]);
                    }
                }
            }
            redValues.sort((a, b) => a - b);
            greenValues.sort((a, b) => a - b);
            blueValues.sort((a, b) => a - b);
            const medianRed = redValues[Math.floor(redValues.length / 2)];
            const medianGreen = greenValues[Math.floor(greenValues.length / 2)];
            const medianBlue = blueValues[Math.floor(blueValues.length / 2)];
            newData[index] = medianRed;
            newData[index + 1] = medianGreen;
            newData[index + 2] = medianBlue;
            newData[index + 3] = data[index + 3]; 
        }
    }
    for (let i = 0; i < data.length; i++) {
        data[i] = newData[i];
    }
    context.putImageData(imgData, 0, 0);
}
const slider = document.getElementById('Slider');
        const valueDisplay = document.getElementById('sliderValue');

        // Update the percentage display when the slider value changes
        slider.addEventListener('input', function() {
            const value = (slider.value * 100).toFixed(0); // Multiply by 100 to get percentage
            valueDisplay.textContent = '' + value + '%';
});

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
function resizePixelGoal(width, height, totalPixelGoal) {
    if (totalPixelGoal == -1) {
        return [width, height];
    }
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
            row.push(palArr.indexOf(findNearestColor([r,g,b], palArr)) + 1);
        }
        MakecodeImg.push(row);
    } 
    imageString = ' = img\`\n';
    for (let i = 0; i < MakecodeImg.length; i++) {
        let rows = MakecodeImg[i];
        for (let j = 0; j < rows.length; j++) {
            let pixel = rows[j];
            imageString += pixel.toString(16) + " ";
        }
        imageString += "\n";
    }
    imageString += "`";

}

function bayerDithering2x2(context, width, height) {
    const ditherMatrix = [
        [0, 2],
        [3, 1],
    ];
    const matrixWidth = ditherMatrix[0].length;
    const matrixHeight = ditherMatrix.length;
    const maxThreshold = Math.max(...ditherMatrix.flat());
    const palArr = removedisabledColors(hexToRgb(colors), enabledColorsList);
    const imgData = context.getImageData(0, 0, width, height);
    const data = imgData.data;

    // Normalize the Bayer matrix to 0-1 range
    const normalizedMatrix = ditherMatrix.map(row => row.map(value => value / maxThreshold));

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];

            // Normalize pixel intensity
            const threshold = normalizedMatrix[y % matrixHeight][x % matrixWidth] - 0.5;

            // Add dithering to each channel
            const ditheredR = Math.min(Math.max(r / 255 + threshold, 0), 1) * 255;
            const ditheredG = Math.min(Math.max(g / 255 + threshold, 0), 1) * 255;
            const ditheredB = Math.min(Math.max(b / 255 + threshold, 0), 1) * 255;

            // Find the nearest color in the palette
            const newColor = findNearestColor([ditheredR, ditheredG, ditheredB], palArr);

            // Update the pixel color in the image data
            data[index] = newColor[0];
            data[index + 1] = newColor[1];
            data[index + 2] = newColor[2];
        }
    }

    // Apply the modified image data back to the canvas
    context.putImageData(imgData, 0, 0);
}
function bayerDithering4x4(context, width, height) {
    const ditherMatrix = [
        [ 0,  8,  2, 10],
        [12,  4, 14,  6],
        [ 3, 11,  1,  9],
        [15,  7, 13,  5]
    ];
    const matrixWidth = ditherMatrix[0].length;
    const matrixHeight = ditherMatrix.length;
    const maxThreshold = Math.max(...ditherMatrix.flat());
    const palArr = removedisabledColors(hexToRgb(colors), enabledColorsList);
    const imgData = context.getImageData(0, 0, width, height);
    const data = imgData.data;

    // Normalize the Bayer matrix to 0-1 range
    const normalizedMatrix = ditherMatrix.map(row => row.map(value => value / maxThreshold));

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];

            // Normalize pixel intensity
            const threshold = normalizedMatrix[y % matrixHeight][x % matrixWidth] - 0.5;

            // Add dithering to each channel
            const ditheredR = Math.min(Math.max(r / 255 + threshold, 0), 1) * 255;
            const ditheredG = Math.min(Math.max(g / 255 + threshold, 0), 1) * 255;
            const ditheredB = Math.min(Math.max(b / 255 + threshold, 0), 1) * 255;

            // Find the nearest color in the palette
            const newColor = findNearestColor([ditheredR, ditheredG, ditheredB], palArr);

            // Update the pixel color in the image data
            data[index] = newColor[0];
            data[index + 1] = newColor[1];
            data[index + 2] = newColor[2];
        }
    }

    // Apply the modified image data back to the canvas
    context.putImageData(imgData, 0, 0);
}
function bayerDithering8x8(context, width, height) {
    const ditherMatrix = [
        [0, 48, 12, 60, 3, 51, 15, 63],
        [32, 16, 44, 28, 35, 19, 47, 31],
        [8, 56, 4, 52, 11, 59, 7, 55],
        [40, 24, 36, 20, 43, 27, 39, 23],
        [2, 50, 14, 62, 1, 49, 13, 61],
        [34, 18, 46, 30, 33, 17, 45, 29],
        [10, 58, 6, 54, 9, 57, 5, 53],
        [42, 26, 38, 22, 41, 25, 37, 21]
    ];
    const matrixWidth = ditherMatrix[0].length;
    const matrixHeight = ditherMatrix.length;
    const maxThreshold = Math.max(...ditherMatrix.flat());
    const palArr = removedisabledColors(hexToRgb(colors), enabledColorsList);
    const imgData = context.getImageData(0, 0, width, height);
    const data = imgData.data;

    // Normalize the Bayer matrix to 0-1 range
    const normalizedMatrix = ditherMatrix.map(row => row.map(value => value / maxThreshold));

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];

            // Normalize pixel intensity
            const threshold = normalizedMatrix[y % matrixHeight][x % matrixWidth] - 0.5;

            // Add dithering to each channel
            const ditheredR = Math.min(Math.max(r / 255 + threshold, 0), 1) * 255;
            const ditheredG = Math.min(Math.max(g / 255 + threshold, 0), 1) * 255;
            const ditheredB = Math.min(Math.max(b / 255 + threshold, 0), 1) * 255;

            // Find the nearest color in the palette
            const newColor = findNearestColor([ditheredR, ditheredG, ditheredB], palArr);

            // Update the pixel color in the image data
            data[index] = newColor[0];
            data[index + 1] = newColor[1];
            data[index + 2] = newColor[2];
        }
    }

    // Apply the modified image data back to the canvas
    context.putImageData(imgData, 0, 0);
}
function bayerDithering16x16(context, width, height) {
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
    const matrixWidth = ditherMatrix[0].length;
    const matrixHeight = ditherMatrix.length;
    const maxThreshold = Math.max(...ditherMatrix.flat());
    const palArr = removedisabledColors(hexToRgb(colors), enabledColorsList);
    const imgData = context.getImageData(0, 0, width, height);
    const data = imgData.data;

    // Normalize the Bayer matrix to 0-1 range
    const normalizedMatrix = ditherMatrix.map(row => row.map(value => value / maxThreshold));

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];

            // Normalize pixel intensity
            const threshold = normalizedMatrix[y % matrixHeight][x % matrixWidth] - 0.5;

            // Add dithering to each channel
            const ditheredR = Math.min(Math.max(r / 255 + threshold, 0), 1) * 255;
            const ditheredG = Math.min(Math.max(g / 255 + threshold, 0), 1) * 255;
            const ditheredB = Math.min(Math.max(b / 255 + threshold, 0), 1) * 255;

            // Find the nearest color in the palette
            const newColor = findNearestColor([ditheredR, ditheredG, ditheredB], palArr);

            // Update the pixel color in the image data
            data[index] = newColor[0];
            data[index + 1] = newColor[1];
            data[index + 2] = newColor[2];
        }
    }

    // Apply the modified image data back to the canvas
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
            newpixel = findNearestColor(oldpixel, palArr);
            row.push(palArr.indexOf(newpixel) + 1);
            data[id] = newpixel[0];
            data[id + 1] = newpixel[1];
            data[id + 2] = newpixel[2];
            data[id + 3] = 255;
        }
        MakecodeImg.push(row);
    }
    imageString = ' = img\`\n';
    for (let i = 0; i < MakecodeImg.length; i++) {
        let rows = MakecodeImg[i];
        for (let j = 0; j < rows.length; j++) {
            let pixel = rows[j];
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
            newpixel = findNearestColor(oldpixel, palArr);
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
    for (let i = 0; i < MakecodeImg.length; i++) {
        let rows = MakecodeImg[i];
        for (let j = 0; j < rows.length; j++) {
            let pixel = rows[j];
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
            newpixel = findNearestColor(oldpixel, palArr);
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
    for (let i = 0; i < MakecodeImg.length; i++) {
        let rows = MakecodeImg[i];
        for (let j = 0; j < rows.length; j++) {
            let pixel = rows[j];
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
            newpixel = findNearestColor(oldpixel, palArr);
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
    for (let i = 0; i < MakecodeImg.length; i++) {
        let rows = MakecodeImg[i];
        for (let j = 0; j < rows.length; j++) {
            let pixel = rows[j];
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
            newpixel = findNearestColor(oldpixel, palArr);
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
    for (let i = 0; i < MakecodeImg.length; i++) {
        let rows = MakecodeImg[i];
        for (let j = 0; j < rows.length; j++) {
            let pixel = rows[j];
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
function unblurImage(context, w, h) {
    const unblurMatrix = [
        [0, -1,  0],
        [-1, 5, -1],
        [0, -1,  0]
    ];
    const imgData = context.getImageData(0, 0, w, h);
    const data = imgData.data;
    const newData = new Uint8ClampedArray(data.length); // Create a new array to store modified data
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const index = (y * w + x) * 4;
            const PixelColor = [0, 0, 0];
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const PixelMulty = unblurMatrix[ky + 1][kx + 1];
                    const dx = x + kx, dy = y + ky;
                    if (dx >= 0 && dx < w && dy >= 0 && dy < h) {
                        const neighborIndex = (dy * w + dx) * 4;
                        const r = data[neighborIndex];
                        const g = data[neighborIndex + 1];
                        const b = data[neighborIndex + 2];
                        PixelColor[0] += r * PixelMulty;
                        PixelColor[1] += g * PixelMulty;
                        PixelColor[2] += b * PixelMulty;
                    }
                }
            }
            newData[index] = PixelColor[0];
            newData[index + 1] = PixelColor[1];
            newData[index + 2] = PixelColor[2];
            newData[index + 3] = data[index + 3]; // Preserve alpha channel
        }
    }
    for (let i = 0; i < data.length; i++) {
        data[i] = newData[i];
    }
    context.putImageData(imgData, 0, 0);
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
function moveColorUp(index) {  
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
function moveColorDown(index) {  
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
        const hexIndex = index.toString(16).toUpperCase();
        const li = document.createElement('li');
        li.style.position = 'relative';
        li.style.marginBottom = '5px';
        const colorSpan = document.createElement('span');
        colorSpan.textContent = color.toUpperCase();
        colorSpan.style.position = 'absolute';
        colorSpan.style.top = '50%';
        colorSpan.style.left = '50%';
        colorSpan.style.transform = 'translate(-' + (135-hexIndex.length*6) +'px, -50%)';
        colorSpan.style.color = getTextColor(color);
        colorSpan.style.zIndex = '1';
        const canvas = document.createElement('canvas');
        canvas.width = 80;
        canvas.height = 20;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        canvas.style.borderRadius = '5px';
        canvas.style.zIndex = '0';
        const canvasContainer = document.createElement('div');
        canvasContainer.style.position = 'relative';
        canvasContainer.style.display = 'flex';
        canvasContainer.style.alignItems = 'center';
        const indexSpan = document.createElement('span');
        indexSpan.textContent = hexIndex;
        indexSpan.style.marginRight = '30px';
        indexSpan.style.color = '#fff';
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', () => removeColor(index));
        const changeColorBtn = document.createElement('button');
        changeColorBtn.textContent = 'Change';
        changeColorBtn.addEventListener('click', () => changeColor(index));
        const moveColorUpBtn = document.createElement('button');
        moveColorUpBtn.textContent = '\u2191';
        moveColorUpBtn.addEventListener('click', () => moveColorUp(index));
        const moveColorDownBtn = document.createElement('button');
        moveColorDownBtn.textContent = '\u2193';
        moveColorDownBtn.addEventListener('click', () => moveColorDown(index));
        const enableBtn = document.createElement('button');
        enableBtn.textContent = enabledColorsList[index] ? 'Disable' : 'Enable';
        enableBtn.classList.add(enabledColorsList[index] ? 'enabled' : 'disabled');
        enableBtn.addEventListener('click', () => enableColor(index));
        canvasContainer.appendChild(indexSpan);
        canvasContainer.appendChild(canvas);
        canvasContainer.appendChild(colorSpan);
        canvasContainer.appendChild(removeBtn);
        canvasContainer.appendChild(changeColorBtn);
        canvasContainer.appendChild(moveColorUpBtn);
        canvasContainer.appendChild(moveColorDownBtn);
        canvasContainer.appendChild(enableBtn);
        li.appendChild(canvasContainer);
        colorList.appendChild(li);
    });
}
function getTextColor(color) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return brightness < 128 ? 'white' : 'black';
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
            const r = document.getElementById('red').value!==''?document.getElementById('red').value:"255";
            const g = document.getElementById('green').value!==''?document.getElementById('green').value:"255";
            const b = document.getElementById('blue').value!==''?document.getElementById('blue').value:"255";
            data = [r,g,b];
        } else if (filter == 'noise') {
            const noiseLevel = document.getElementById('noiseLevel').value!==''?document.getElementById('noiseLevel').value:15;
            data = [noiseLevel];
        } else if (filter == 'blur') {
            const blurPower = Math.floor(Math.min(Math.abs(document.getElementById('blurPower').value),50));
            data = [blurPower>0?blurPower:2];
        } else if (filter == 'median') {
            const radius = Math.floor(Math.min(Math.abs(document.getElementById('blurPower').value),10));
            data = [radius>0?radius:2]
        } else if (filter == 'Brighten') {
            const slider = document.getElementById('Slider').value // number from 0 to 2
            data = [slider]
        } else {
            data = [];
        }
        filterEffectPowerList.push(data)
    }
    renderFilterList()
    
}
function getFilterData(filter,effect) {
    switch (filter) {
        case 'custom':
            return '' +rgbToHex(effect)
        case 'noise':
            return 'power: ' +effect[0]
        case 'blur':
            return 'power: ' +effect[0]
        case 'median':
            return 'radius: ' + effect[0]
        case 'brighten':
            return '' + Math.round(effect[0]*100) + '%'       
    }
    return ''
}
function removeFilter(index) {
    filterList.splice(index, 1);
    filterEffectPowerList.splice(index, 1);
    renderFilterList(); // Re-render the list
}
function moveUp(index) {
    if (index > 0) {
        [filterList[index - 1], filterList[index]] = [filterList[index], filterList[index - 1]];
        [filterEffectPowerList[index - 1], filterEffectPowerList[index]] = [filterEffectPowerList[index], filterEffectPowerList[index - 1]];
        renderFilterList(); // Re-render the list
    }
}
function moveDown(index) {
    if (index < filterList.length - 1) {
        [filterList[index], filterList[index + 1]] = [filterList[index + 1], filterList[index]];
        [filterEffectPowerList[index], filterEffectPowerList[index + 1]] = [filterEffectPowerList[index + 1], filterEffectPowerList[index]];
        renderFilterList(); // Re-render the list
    }
}
function renderFilterList() {
    const filterListElement = document.getElementById('FiltersList');
    filterListElement.innerHTML = '';

    filterList.forEach((filter, index) => {
        filter = filter.toUpperCase()==='UNBLUR'?'SHARPEN':filter
        const li = document.createElement('li');
        li.style.position = 'relative';
        li.style.marginBottom = '5px';

        const filterNameSpan = document.createElement('span');
        filterNameSpan.textContent = filter.toUpperCase();
        filterNameSpan.style.marginRight = '10px';
        filterNameSpan.style.color = '#fff';
        filterNameSpan.style.fontWeight = 'bold';

        const effectData = filterEffectPowerList[index] != null ? filterEffectPowerList[index] : 'N/A';

        const text = getFilterData(filter.toLowerCase(), effectData) || 'N/A';

        console.log("Filter:", filter);
        console.log("Effect Data:", effectData);
        console.log("Text:", text);

        const effectSpan = document.createElement('span');

        if (text.startsWith('#')) {
            const canvas = document.createElement('canvas');
            canvas.width = 20;
            canvas.height = 20;
            canvas.style.marginRight = '10px';

            const ctx = canvas.getContext('2d');
            ctx.fillStyle = text;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add canvas to list item
            li.appendChild(canvas);

            // Add the effectSpan
            effectSpan.textContent = text;
            effectSpan.style.marginRight = '10px';
            effectSpan.style.color = getTextColor(text); // Ensure getTextColor returns a readable color
            effectSpan.style.fontStyle = 'italic';
            li.appendChild(effectSpan);
        } else {
            effectSpan.textContent = text;
            effectSpan.style.marginRight = '10px';
            effectSpan.style.color = '#ccc';
            effectSpan.style.fontStyle = 'italic';

            // Append the effectSpan to the list item
            li.appendChild(effectSpan);
        }

        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', () => removeFilter(index));

        // Move up button
        const moveFilterUpBtn = document.createElement('button');
        moveFilterUpBtn.textContent = '\u2191'; // Up arrow
        moveFilterUpBtn.addEventListener('click', () => moveUp(index));
        if (index === 0) {
            moveFilterUpBtn.style.display = 'none';
        }

        // Move down button
        const moveFilterDownBtn = document.createElement('button');
        moveFilterDownBtn.textContent = '\u2193'; // Down arrow
        moveFilterDownBtn.addEventListener('click', () => moveDown(index));
        if (index === filterList.length - 1) {
            moveFilterDownBtn.style.display = 'none';
        }

        // Append elements to the list item
        li.appendChild(filterNameSpan);
        li.appendChild(removeBtn);
        li.appendChild(moveFilterUpBtn);
        li.appendChild(moveFilterDownBtn);

        // Append the list item to the filter list
        filterListElement.appendChild(li);
    });
}
const tools = {
    colors: function(len=255,opt=0) {
        colors = [];
        enabledColorsList = [];
        colors.push('#ffffff')
        colors.push('#000000')
        enabledColorsList.push(true)
        enabledColorsList.push(true)
        for (let i = 0; i < len-1; i++) {
                let randomColor = this.getRandomColor(opt);
                colors.push(randomColor);
                enabledColorsList.push(true);
        }
        renderColors()
    },
    getRandomColor: function(opt=0) {
        let colorParts = ['#']
        let g=Math.floor(Math.random()*16).toString(16)
        if(opt===0){for(let j=0;j<6;j++)colorParts.push(Math.floor(Math.random()*16).toString(16))
        } else if (opt===1) for(let j=0;j<6;j++)colorParts.push(g)
        return colorParts.join('');
    },
    filters: function() {
        console.log('' + JSON.stringify(filterList) + ' ; ' + JSON.stringify(filterEffectPowerList))
    }
}
