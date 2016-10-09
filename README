# PostCSS HSB Adjust

A PostCSS plugin to change a given colour by either a Hue, Saturation or Brightness adjustment.

This plugin allows a colour to be modified by an adjustment to either:

- Hue (0 - 360 degrees)
- Saturation (0 - 100%)
- Brightness (0 - 100%)

You can see a demo of these adjustments [here](https://tommillard.github.io/postcss-hsb-adjust/)

## Install
### NPM 

`npm i postcss-hsb-adjust --save-dev`

### Git
`git clone https://github.com/tommmillard/postcss-hsb-adjust.git`

## Usage
The plugin takes two arguments, the base colour and the adjustment to be made.

## Example

Given this input CSS:

### Input
````
.normal { 
    width: 100%;
}

.no-flex .normal {
    width: 50%;
}
````

### Output Part 1 (extracted.css)
````
.no-flex .normal {
    width: 50%;
}
````

### Output Part 2 (remaining.css)
````
.normal { 
    width: 100%;
}
````

Original styles will be unaffected and continue to their 'normal' destination.

## Options
#### remaining
This is the location you want the rules that haven't matched to be written to.

#### extracted
This is the location you want the rules that have matched to be written to.

#### extractors
This is an object of possible strings (e.g. CSS selectors) that, should they be present in a rule will cause them to be extracted.

## Tests
This plugin uses [AVA](https://github.com/sindresorhus/ava) for tests. If you want to check this plugin is working as it should on your system, from CLI, browse to `node_modules/postcss-extract-to-file/` and run `npm test`.


