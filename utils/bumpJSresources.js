// Bumps @require'd JS in userscripts
// NOTE: Doesn't git commit to allow script editing from breaking changes
// NOTE: Pass --dev to use ./utils/userJSfiles.dev.json for faster init

(async () => {

    const devMode = process.argv.includes('--dev')

    // Import LIBS
    const fs = require('fs'), // to read/write files
          ssri = require('ssri') // to generate SHA-256 hashes

    // Init UI COLORS
    const nc = '\x1b[0m',        // no color
          dg = '\x1b[38;5;243m', // dim gray
          bw = '\x1b[1;97m',     // bright white
          by = '\x1b[1;33m',     // bright yellow
          bg = '\x1b[1;92m',     // bright green
          br = '\x1b[1;91m'      // bright red

    // Init REGEX
    const rePatterns = {
        hash: { commit: /(@|\?v=)([^/#]+)/, sri: /[^#]+$/ },
        resName: /[^/]+\/(?:css|dist)?\/?[^/]+\.(?:css|js)(?=[?#]|$)/,
        url: { js: /^\/\/ @require\s+(https:\/\/cdn\.jsdelivr\.net\/gh\/.+)$/ }
    }

    // Define FUNCTIONS

    const log = {};
    ['hash', 'info', 'working', 'success', 'error'].forEach(lvl => log[lvl] = function(msg) {
        const logColor = lvl == 'hash' ? dg : lvl == 'info' ? bw : lvl == 'working' ? by : lvl == 'success' ? bg : br,
              formattedMsg = logColor + ( log.endedWithLineBreak ? msg.trimStart() : msg ) + nc
        console.log(formattedMsg) ; log.endedWithLineBreak = msg.toString().endsWith('\n')
    })

    async function findUserJS(dir = './') {
        const userJSfiles = []
        if (!dir.endsWith('/')) dir += '/' // for prettier log
        fs.readdirSync(dir).forEach(async file => {
            const filePath = dir + file // relative path
            if (fs.statSync(filePath).isDirectory()) // recursively search subdirs
                userJSfiles.push(...await findUserJS(filePath))
            else if (file.endsWith('.user.js')) {
                console.log(filePath) ; userJSfiles.push(filePath) }
        })
        return userJSfiles
    }

    function fetchData(url) {
        if (typeof fetch == 'undefined') // polyfill for Node.js < v21
            return new Promise((resolve, reject) => {
                try { // to use http or https module
                    const protocol = url.match(/^([^:]+):\/\//)[1]
                    if (!/^https?$/.test(protocol)) reject(new Error('Invalid fetchData() URL.'))
                    require(protocol).get(url, resp => {
                        let rawData = ''
                        resp.on('data', chunk => rawData += chunk)
                        resp.on('end', () => resolve({ json: () => JSON.parse(rawData) }))
                    }).on('error', err => reject(new Error(err.message)))
                } catch (err) { reject(new Error('Environment not supported.'))
            }})
        else // use fetch() from Node.js v21+
            return fetch(url)
    }

    async function generateSRIhash(resURL, algorithm = 'sha256') {
        const sriHash = ssri.fromData(
            Buffer.from(await (await fetchData(resURL)).arrayBuffer()), { algorithms: [algorithm] }).toString()
        log.hash(`${sriHash}\n`)
        return sriHash
    }

    function bumpUserJSver(userJSfilePath) {
        const date = new Date(),
              today = `${date.getFullYear()}.${date.getMonth() +1}.${date.getDate()}`, // YYYY.M.D format
              reVersion = /(@version\s+)([\d.]+)/,
              userJScontent = fs.readFileSync(userJSfilePath, 'utf-8'),
              currentVer = userJScontent.match(reVersion)[2]
        let newVer
        if (currentVer.startsWith(today)) { // bump sub-ver
            const verParts = currentVer.split('.'),
                  subVer = verParts.length > 3 ? parseInt(verParts[3], 10) +1 : 1
            newVer = `${today}.${subVer}`
        } else // bump to today
            newVer = today
        fs.writeFileSync(userJSfilePath, userJScontent.replace(reVersion, `$1${newVer}`), 'utf-8')
        console.log(`Updated: ${bw}v${currentVer}${nc} → ${bg}v${newVer}${nc}`)
    }

    // Run MAIN routine

    log.working('\nSearching for userscripts...\n')
    const userJSfiles = await (async () =>
        devMode ? JSON.parse(await fs.promises.readFile('./utils/userJSfiles.dev.json', 'utf-8')) : findUserJS()
    )()

    log.working('\nCollecting JS resources...\n')
    const urlMap = {} ; let resCnt = 0
    const reResURL = new RegExp(rePatterns.url.js.source, 'gm')
    userJSfiles.forEach(userJSfilePath => {
        const userJScontent = fs.readFileSync(userJSfilePath, 'utf-8'),
              resURLs = [...userJScontent.matchAll(reResURL)].map(match => match[1] || match[2])
        if (resURLs.length > 0) { urlMap[userJSfilePath] = resURLs ; resCnt += resURLs.length }
    })
    log.success(`${resCnt} bumpable resource(s) found.`)

    log.working('\nProcessing resource(s)...\n')
    let urlsUpdatedCnt = 0 ; let filesUpdatedCnt = 0
    for (const userJSfilePath of Object.keys(urlMap)) {

        // Init repo name
        let repoName = userJSfilePath.split(devMode ? '\\' : '/').pop().replace('.user.js', '')
        if (repoName.endsWith('-mode')) repoName = repoName.slice(0, -5) // for chatgpt-widescreen

        // Fetch latest commit hash
        console.log(`Fetching latest commit hash for ${repoName}...`)
        const latestCommitHash = require('child_process').execSync(
            `git ls-remote https://github.com/adamlui/${repoName}.git HEAD`).toString().split('\t')[0]
        console.log(latestCommitHash + '\n')

        // Process each resource in the userscript
        let fileUpdated = false
        for (const url of urlMap[userJSfilePath]) {
            const resourceName = rePatterns.resName.exec(url)?.[0] || 'resource' // dir/filename for logs

            // Update hashes
            if ((url.match(rePatterns.hash.commit) || [])[1] != latestCommitHash) {
                console.log(`Updating commit hash for ${resourceName}...`)
                let updatedURL = url.replace(rePatterns.hash.commit, `@${latestCommitHash}`)
                console.log(`Updating SRI hash for ${resourceName}...`)
                updatedURL = updatedURL.replace(rePatterns.hash.sri, `#${await generateSRIhash(updatedURL)}`)

                // Write updated URL to userscript
                let userJScontent = fs.readFileSync(userJSfilePath, 'utf-8')
                userJScontent = userJScontent.replace(url, updatedURL)
                fs.writeFileSync(userJSfilePath, userJScontent, 'utf-8')
                urlsUpdatedCnt++ ; fileUpdated = true
            }
        }
        if (fileUpdated) {
            console.log('\nBumping userscript version...')
            bumpUserJSver(userJSfilePath) ; filesUpdatedCnt++
        }
    }

    // Log final summary
    log[urlsUpdatedCnt > 0 ? 'success' : 'info'](
        `${ urlsUpdatedCnt > 0 ? 'Success! ' : '' }${
            urlsUpdatedCnt} resource(s) bumped across ${filesUpdatedCnt} file(s).`
    )

})()
