module.exports  = {
    'extends': ['eslint:recommended'],
    'ignorePatterns': ['**/*.md', '**/pikpak-enhance.js'],
    'rules': {
        'indent': ['error', 4, { 'ignoredNodes': [ // enforce 4-space indentation, except for...
            'TemplateLiteral > *', // template literal children
            'ConditionalExpression', // ternarys
            'IfStatement > BlockStatement', // multi-line if's
            'BinaryExpression', // string concatenations, math, comparison, etc.,
            'BlockStatement', 'SwitchCase' // closing braces
        ]}],
        'quotes': ['error', 'single', { 'avoidEscape': true, 'allowTemplateLiterals': true }], // enforce single quotes for string literals
        'space-before-function-paren': ['error', 'never'], // enforce no space before function parentheses
        'key-spacing': ['error', { 'beforeColon': false, 'afterColon': true }], // enforce spacing in object properties
        'comma-dangle': ['error', 'never'], // enforce no trailing commas in arrays or objects
        'no-async-promise-executor': 'off', // allow promise executor functions to be async (to accomodate await lines)
        'no-constant-condition': 'off', // allow constant conditions
        'no-empty': 'off', // allow empty blocks
        'no-unused-vars': ['error', { 'argsIgnorePattern': '^node$' }]
    },
    'globals': { 'chatgpt': true, 'global_module': true, '$': true, 'GM_cookie': true },
    'parserOptions': {
        'ecmaVersion': 2022,
        'sourceType': 'script'
    },
    'env': { 'browser': true, 'node': true, 'es6': true, 'greasemonkey': true }
};
