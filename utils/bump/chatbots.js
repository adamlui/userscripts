#!/usr/bin/env node

// Bumps @version in chatbot userscripts

// NOTE: Pass --cache to use script.cache.paths.chatbotPaths for faster init
// NOTE: Pass <--commit-msg|-m> "msg" to commit w/ msg
// NOTE: Pass <--no-push|-np> to skip git push

'use strict'

async function run() {

    const { execSync, spawnSync } = require('child_process'),
            fs = require('fs'),
            path = require('path')

    const args = process.argv.slice(2)

    const script = {
        cache: { paths: { root: '.cache' }, refs: {} },
        chatbots: ['amazongpt', 'bravegpt', 'duckduckgpt', 'googlegpt'],
        config: {
            cache: args.some(arg => arg.startsWith('--cache')),
            commitMsg: (() => {
                const idx = args.findIndex(arg => ['--commit-msg', '-m'].includes(arg))
                return idx != -1 && args[idx +1] ? args[idx +1].replace(/^"|"$/g, '') : null
            })(),
            noPush: args.some(arg => ['--no-push', '-np'].includes(arg))
        },
        urls: { bumpmjs: 'https://cdn.jsdelivr.net/gh/adamlui/ai-web-extensions/utils/bump/lib/bump.min.mjs' }
    }
    script.cache.paths.bumpmjs = path.join(process.cwd(), `${script.cache.paths.root}/bump.min.mjs`)
    script.cache.paths.chatbotPaths = path.join(process.cwd(), `${script.cache.paths.root}/chatbot-paths.json`)
    const { cache: { paths: cachePaths }} = script

    // Import bump.mjs
    fs.mkdirSync(path.dirname(cachePaths.bumpmjs), { recursive: true })
    fs.writeFileSync(cachePaths.bumpmjs, (await (await fetch(script.urls.bumpmjs)).text()))
    const bump = await import(`file://${cachePaths.bumpmjs}`)
    fs.unlinkSync(cachePaths.bumpmjs)

    bump.log.working(`\n${ script.config.cache ? 'Collecting' : 'Searching for' } chatbot userscripts...\n`)
    let chatbotFiles = []
    if (script.config.cache)
        try { // create missing cache file
            fs.mkdirSync(path.dirname(cachePaths.chatbotPaths), { recursive: true })
            const fd = fs.openSync(cachePaths.chatbotPaths,
                fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_RDWR)
            bump.log.info(`Cache file missing. Generating ${cachePaths.chatbotPaths}...\n`)
            for (const chatbot of script.chatbots)
                chatbotFiles.push(...(await bump.findFileBySuffix({ suffix: `${chatbot}.user.js` })))
            fs.writeFileSync(fd, JSON.stringify(chatbotFiles, undefined, 2), 'utf-8')
            bump.log.success(`\nCache file created @ ${cachePaths.chatbotPaths}`)
        } catch (err) { // use existing cache file
            chatbotFiles = JSON.parse(fs.readFileSync(cachePaths.chatbotPaths, 'utf-8'))
            console.log(chatbotFiles)
            console.log('')
        }
    else { // use bump.findFileBySuffix()
        for (const chatbot of script.chatbots)
            chatbotFiles.push(...(await bump.findFileBySuffix({ suffix: `${chatbot}.user.js` })))
        console.log('')
    }

    let filesUpdatedCnt = 0 ; const bumpedChatbots = {}
    for (const chatbotFile of chatbotFiles) {
        const chatbotName = path.basename(chatbotFile, '.user.js')
        bump.log.working(`\nProcessing ${chatbotName}...\n`)
        const result = bump.bumpVersion({ format: 'dateVer', filePath: chatbotFile })
        if (result) {
            const { oldVer, newVer } = result
            bump.log.success(`${chatbotName} version bumped!\n`)
            filesUpdatedCnt++
            bumpedChatbots[chatbotFile] = { oldVer, newVer }
        } else {
            console.log(`${chatbotName} already up-to-date!`)
            bump.log.endedWithLineBreak = false
        }
    }

    const pluralSuffix = filesUpdatedCnt > 1 ? 's' : ''
    if (filesUpdatedCnt == 0) {
        bump.log.info('Completed. No chatbots bumped.')
        process.exit(0)
    } else
        bump.log.success(`${filesUpdatedCnt} chatbot${pluralSuffix} bumped!`)

    if (script.config.commitMsg) {
        bump.log.working(`\nCommitting bump${pluralSuffix} to Git...\n`)
        try {
            execSync('git add ./*.user.js')
            bump.initKudoSyncBot()
            spawnSync('git', ['commit', '-n', '-m', script.config.commitMsg], { stdio: 'inherit', encoding: 'utf-8' })
            console.log('')
            if (!script.config.noPush) {
                bump.log.working('\nPulling latest changes from remote to sync local repository...\n')
                execSync('git pull')
                bump.log.working(`\nPushing bump${pluralSuffix} to Git...\n`)
                execSync('git push')
            }
            bump.log.success(`Success! ${filesUpdatedCnt} chatbot${pluralSuffix} updated/committed${
                !script.config.noPush ? '/pushed' : '' } to GitHub`)
        } catch (err) {
            bump.log.error(`Git operation failed: ${err.message}`)
        }
    } else {
        bump.log.working(`\nNo commit message provided. Skipping git operations.`)
        bump.log.info(`TIP: Use --commit-msg "msg" or -m "msg" to commit changes.`)
    }

    console.log('')
    Object.entries(bumpedChatbots).forEach(([chatbotFile, { oldVer, newVer }]) =>
        console.log(`  ± ${path.basename(chatbotFile)} ${
            bump.colors.bw}v${oldVer}${bump.colors.nc} → ${bump.colors.bg}v${newVer}${bump.colors.nc}`)
    )
}

if (require.main == module) run()

module.exports = { run }
