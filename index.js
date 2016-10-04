var postcss = require('postcss');

module.exports = postcss.plugin('postcss-hsb-adjust', function (opts) {
    opts = opts || {};
    // Work with options here
    console.log("hey");

    return function (root, result) {

        // Transform CSS AST here

    };
});
