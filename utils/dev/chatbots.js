#!/usr/bin/env node

// Opens KudoAI chatbots in VS Code

'use strict'

(() => {
    const { dirname, resolve } = require('path'),
            spawn = require('cross-spawn'),
            chatbots = ['amazongpt', 'bravegpt', 'duckduckgpt', 'googlegpt'],
            br = '\x1b[91m', // bright red
            nc = '\x1b[0m'   // no color
    const repoRoot = (dir => {
        while (dir != '/' && !require('fs').existsSync(resolve(dir, 'package.json'))) dir = dirname(dir) ; return dir
    })(__dirname)
    const filePaths = chatbots
        .map(chatbot => resolve(repoRoot, `chatgpt/${chatbot}/${chatbot}.user.js`))
        .filter(path => require('fs').existsSync(path))
    spawn('code', ['-r', repoRoot, ...filePaths], { stdio: 'inherit' })
        .on('error', err => console.error(`${br}Failed to open VS Code: ${err.message}${nc}`))
})()
