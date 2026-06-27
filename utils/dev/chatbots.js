#!/usr/bin/env node

// Opens KudoAI chatbots in VS Code

'use strict'

;(() => {
    const chatbots = ['amazongpt', 'bravegpt', 'duckduckgpt', 'googlegpt'],
        { dirname, resolve } = require('path'),
          fs = require('fs'),
          spawn = require('cross-spawn')
    const repoRoot = (dir => {
        while (dir != '/' && !fs.existsSync(resolve(dir, 'package.json'))) dir = dirname(dir)
        return dir
    })(__dirname)
    const filePaths = chatbots
        .map(chatbot => resolve(repoRoot, `chatgpt/${chatbot}/${chatbot}.user.js`))
        .filter(path => fs.existsSync(path))

    spawn('code', ['-r', repoRoot, ...filePaths], { stdio: 'inherit' })
        .on('error', err => console.error(`Failed to open VS Code: ${err.message}`))
})()
