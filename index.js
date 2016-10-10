var postcss = require('postcss');
var parseColor = require('parse-color');
var parser = require('postcss-value-parser');

var getInnards = function (start, end, string) {
    var stringStart = string.indexOf(start);
    var stringEnd = string.lastIndexOf(end);

    if (stringStart < 0 || stringEnd < 0) {
        return false;
    }

    return string.substr(stringStart + 1, stringEnd - stringStart - 1);
};

var numInRange = function (number, min, max) {
    return Math.min(Math.max(number, min), max);
};

// copy of conversions from https://www.npmjs.com/package/color-convert
// used here so I can convert without rounding errors.
var hsl2rgb = function (hsl) {
    var h = hsl[0] / 360,
        s = hsl[1] / 100,
        l = hsl[2] / 100,
        t1, t2, t3, rgb, val;

    if (s === 0) {
        val = l * 255;
        return [val, val, val];
    }

    if (l < 0.5) {
        t2 = l * (1 + s);
    } else {
        t2 = l + s - l * s;
    }

    t1 = 2 * l - t2;

    rgb = [0, 0, 0];

    for (var i = 0; i < 3; i++) {
        t3 = h + 1 / 3 * -(i - 1);
        t3 < 0 && t3++;
        t3 > 1 && t3--;

        if (6 * t3 < 1) {
            val = t1 + (t2 - t1) * 6 * t3;
        } else if (2 * t3 < 1) {
            val = t2;
        } else if (3 * t3 < 2) {
            val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
        } else {
            val = t1;
        }

        rgb[i] = val * 255;
    }

    return rgb;
};

var rgb2hsl = function (rgb) {
    var r = rgb[0] / 255,
        g = rgb[1] / 255,
        b = rgb[2] / 255,
        min = Math.min(r, g, b),
        max = Math.max(r, g, b),
        delta = max - min,
        h, s, l;

    if (max === min) {
        h = 0;
    } else if (r === max) {
        h = (g - b) / delta;
    } else if (g === max) {
        h = 2 + (b - r) / delta;
    } else if (b === max) {
        h = 4 + (r - g) / delta;
    }

    h = Math.min(h * 60, 360);

    if (h < 0) {
        h += 360;
        l = (min + max) / 2;
    }

    if (max === min) {
        s = 0;
    } else if (l <= 0.5) {
        s = delta / (max + min);
    } else {
        s = delta / (2 - max - min);
    }

    return [h, s * 100, l * 100];
};

var hueColour = function (colour, amount) {
    var hslColour = rgb2hsl(colour);

    var newHue = (hslColour[0] + amount) % 360;
    if (newHue < 0) {
        newHue = 360 + newHue;
    }

    var newRGB = hsl2rgb([newHue, hslColour[1], hslColour[2]]);

    return newRGB;
};

var brightenColour = function (colour, amount) {
    var redOld = colour[0];
    var greenOld = colour[1];
    var blueOld = colour[2];

    var currentBrightness = Math.max(redOld, greenOld, blueOld) * (100 / 255);
    var newBrightness = numInRange(currentBrightness + amount, 0, 100);

    if (newBrightness === currentBrightness) {
        return [redOld, greenOld, blueOld];
    }

    var changeAsMultiple = newBrightness / currentBrightness;

    var redNew = numInRange(redOld * changeAsMultiple, 0, 255);
    var greenNew = numInRange(greenOld * changeAsMultiple, 0, 255);
    var blueNew = numInRange(blueOld * changeAsMultiple, 0, 255);

    return [redNew, greenNew, blueNew];
};

var saturateColour = function (colour, amount) {
    var hslColour = rgb2hsl(colour);

    var oldSaturation = hslColour[1];
    var newSaturation = numInRange(oldSaturation + amount, 0, 100);

    var newRGB = hsl2rgb([hslColour[0], newSaturation, hslColour[2]]);

    return newRGB;
};

var processColour = function (colour, adjustmentType, adjustmentAmount) {
    if (adjustmentType === 'b') {
        return brightenColour(colour, adjustmentAmount);
    } else if (adjustmentType === 's') {
        return saturateColour(colour, adjustmentAmount);
    } else if (adjustmentType === 'h') {
        return hueColour(colour, adjustmentAmount);
    }
    return colour;
};

var hsbAdjust = function (string) {
    string = getInnards('(', ')', string);
    var lastCommaIndex = string.lastIndexOf(',');

    var rootColour = string.substr(0, lastCommaIndex).trim();
    var adjustment = string.substr(lastCommaIndex + 1).trim();

    var adjustmentType = adjustment.substr(0, 1);
    var adjustmentAmount = getInnards('(', ')', adjustment);

    if (!adjustmentAmount || !adjustmentType) {
        return false;
    }

    adjustmentAmount = parseFloat(adjustmentAmount);

    if (isNaN(adjustmentAmount)) {
        return false;
    }

    rootColour = parseColor(rootColour).rgba;
    if (rootColour === undefined) {
        return false;
    }

    var newColour = [rootColour[0], rootColour[1], rootColour[2]];
    var alpha = rootColour[3];

    newColour = processColour(newColour, adjustmentType, adjustmentAmount);

    if (alpha && alpha < 1) {
        return 'rgba(' + Math.round(newColour[0]) + ',' +
        Math.round(newColour[1]) + ',' +
        Math.round(newColour[2]) + ',' + alpha + ')';
    } else {
        return 'rgb(' + Math.round(newColour[0]) + ',' +
        Math.round(newColour[1]) + ',' +
        Math.round(newColour[2]) + ')';
    }
};

var adjustDecl = function (string) {
    return parser(string).walk(function (node) {

        if (node.type !== 'function' || node.value !== 'hsb-adjust') {
            return;
        }
        node.value = hsbAdjust(parser.stringify(node));
        node.type = 'word';
    }).toString();
};

module.exports = postcss.plugin('postcss-hsb-adjust', function () {

    return function (style) {
        style.walkDecls(function (decl) {
            if (!decl.value || decl.value.indexOf('hsb-adjust(') === -1) {
                return;
            }

            decl.value = adjustDecl(decl.value);
        });
    };
});
