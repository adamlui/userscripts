module.exports = {
    'extends': ['eslint:recommended'],
    'rules': {
        'indent': 'off', 'no-unexpected-multiline': 'off', // allow whitespace anywhere
        'quotes': ['error', 'single'], // enforce single quotes for string literals
        'key-spacing': ['error', { 'beforeColon': false, 'afterColon': true }], // enforce spacing in object properties
        'comma-dangle': ['error', 'never'], // enforce no trailing commas in arrays or objects
        'no-async-promise-executor': 'off', // allow promise executor functions to be async (to accomodate await lines)
        'no-constant-condition': 'off', // allow constant conditions
        'no-empty': 'off', // allow empty blocks
        'no-inner-declarations': 'off', // allow function declarations anywhere
        'no-useless-escape': 'off' // allow all escape chars cause ESLint sucks at detecting truly useless ones
    },
    'globals': { '$': 'readonly', 'chatgpt': 'readonly', 'chrome': 'readonly', 'CryptoJS': 'readonly', 'GM_cookie': 'readonly' },
    'parserOptions': { 'ecmaVersion': 2022, 'sourceType': 'script' },
    'overrides': [{ 'files': ['**/*.json'], 'extends': ['plugin:json-schema-validator/recommended'] }],
    'env': { 'browser': true, 'node': true, 'es6': true, 'greasemonkey': true }
};
