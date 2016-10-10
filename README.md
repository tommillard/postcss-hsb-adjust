# PostCSS HSB Adjust

A PostCSS plugin to change a given colour by either a Hue, Saturation or Brightness adjustment.

This plugin allows a colour to be modified by an adjustment to either:

- Hue (degrees)
- Saturation (%)
- Brightness (%)

You can see a demo of these adjustments [here](https://tommillard.github.io/postcss-hsb-adjust/)

## Install
### NPM 

`npm i postcss-hsb-adjust --save-dev`

### Git
`git clone https://github.com/tommmillard/postcss-hsb-adjust.git`

## Usage
The plugin takes two arguments, the base colour and the adjustment to be made.
Outputted colours are rgb or rgba if necessary.

Adjustments can be in positive or negative direction.

## Example

```css
/* Input */
.foo {
    background-color: hsb-adjust(navy, b(10)); /*Increase brightness by 10%*/
    color: hsb-adjust(rgba(100, 0, 65, 0.5), s(-20)); /*Reduce saturation by 20%*/
    border: 1px solid hsb-adjust(#ffdf1b, h(200)); /*Move hue by 200 degrees*/
}
```

```css
/* Output */
.foo {
    background-color: rgb(0,0,154); /*Increased brightness by 10%*/
    color: rgba(90,10,62,0.5); /*Reduced saturation by 20%*/
    border: 1px solid rgb(71,27,255); /*Moved hue by 200 degrees*/
}
```

Tested using node v4.30


