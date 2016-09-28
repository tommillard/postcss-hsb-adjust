import postcss from 'postcss';
import test    from 'ava';

import plugin from './';

function run(t, input, output, opts = { }) {
    return postcss([ plugin(opts) ]).process(input)
        .then( result => {
            t.deepEqual(result.css, output);
            t.deepEqual(result.warnings().length, 0);
        });
}

// saturation increase
// brightness increase
// hue movement

// all the above, past max value
// all the above, past min value

// pass in a non-colour

// all the above ran with:
// - named color
// - rgb color
// - rgba color
// - hex color
// - variable name


test('basic test', t => {
    return run(t, 'a{ }', 'a{ }', { });
});
