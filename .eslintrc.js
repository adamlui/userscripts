module.exports  = {
    'extends': ['eslint:recommended'],
    'ignorePatterns': ['**/*.md'],
    'rules': {
        'indent': ['error', 4, { 'ignoredNodes': [ // enforce 4-space indentation, except for...
            'TemplateLiteral > *', // template literal children
            'ConditionalExpression', // ternarys
            'IfStatement > BlockStatement', // multi-line if's
            'BinaryExpression', // string concatenations, math, comparison, etc.,
            'BlockStatement', 'SwitchCase' // closing braces
        ]}],
        'quotes': ['error', 'single', { 'avoidEscape': true }], // enforce single quotes for string literals
        'space-before-function-paren': ['error', 'never'], // enforce no space before function parentheses
        'key-spacing': ['error', { 'beforeColon': false, 'afterColon': true }], // enforce spacing in object properties
        'comma-dangle': ['error', 'never'], // enforce no trailing commas in arrays or objects
        'no-async-promise-executor': 'off', // allow promise executor functions to be async (to accomodate await lines)
        'no-constant-condition': 'off' // to accomodate while (true)
    },
    'globals': { 'chatgpt': true, 'global_module': true, '$': true, 'GM_cookie': true },
    'parserOptions': {
        'ecmaVersion': 2020,
        'sourceType': 'script'
    },
    'env': { 'browser': true, 'node': true, 'es6': true, 'greasemonkey': true }
};
