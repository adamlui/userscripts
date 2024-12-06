// Bumps @require'd JS in userscripts
// NOTE: Doesn't git commit to allow potentially required script editing

(async () => {

    const devMode = true // true to use ./utils/userJSfiles.dev.json for faster init

    // Import LIBS
    const fs = require('fs'), // to read/write files
          path = require('path'), // to handle/resolve file/dir paths
          ssri = require('ssri') // to generate SHA-256 hashes

    // Init UI COLORS
    const nc = '\x1b[0m',    // no color
          by = '\x1b[1;33m', // bright yellow
          bg = '\x1b[1;92m', // bright green
          bw = '\x1b[1;97m'  // bright white

    // Define FUNCTIONS

    const log = {
        dev(msg) { if (devMode) console.log(msg) },
        success(msg) { console.log(bg + msg + nc) },
        working(msg) { console.log(by + msg + nc) }
    }

    async function findUserJS(dir = './') {
        const userJSfiles = []
        fs.readdirSync(dir).forEach(async file => {
            const filePath = path.resolve(dir, file) // get absolute path
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
                    require(protocol).get(url, res => {
                        let rawData = ''
                        res.on('data', chunk => rawData += chunk)
                        res.on('end', () => resolve({ json: () => JSON.parse(rawData) }))
                    }).on('error', err => reject(new Error(err.message)))
                } catch (err) { reject(new Error('Environment not supported.'))
            }});
        else // use fetch() from Node.js v21+
            return fetch(url)
    }

    async function getSRIhash(url, algorithm = 'sha256') {
        return ssri.fromData(
            Buffer.from(await (await fetchData(url)).arrayBuffer()), { algorithms: [algorithm] }).toString()
    }

    function bumpUserJSver(userJSfilePath) {
        const date = new Date(),
              today = `${date.getFullYear()}.${date.getMonth() +1}.${date.getDate()}`, // YYYY.M.D format
              re_version = /(@version\s+)([\d.]+)/
        let userJScontent = fs.readFileSync(userJSfilePath, 'utf-8')
        const currentVer = userJScontent.match(re_version)[2] ; let newVer
        if (currentVer.startsWith(today)) { // bump sub-ver
            const verParts = currentVer.split('.'),
                  subVer = verParts.length > 3 ? parseInt(verParts[3], 10) +1 : 1
            newVer = `${today}.${subVer}`
        } else // bump to today
            newVer = today
        userJScontent = userJScontent.replace(re_version, `$1${newVer}`)
        fs.writeFileSync(userJSfilePath, userJScontent, 'utf-8')
        console.log(`Version bumped from ${bw + currentVer + nc} to ${bw + newVer + nc}\n`)
    }

    // Run MAIN routine

    log.working('\nSearching for userscripts...\n')
    const userJSfiles = await (async () =>
        devMode ? JSON.parse(await fs.promises.readFile('./utils/userJSfiles.dev.json', 'utf-8')) : findUserJS()
    )()
    log.dev(userJSfiles)

    log.working('\nCollecting JS resources...\n')
    const jsrURLmap = {} ; let jsrCnt = 0
    userJSfiles.forEach(userJSfilePath => {
        const userJScontent = fs.readFileSync(userJSfilePath, 'utf-8'),
              re_jsrURL = /^\/\/ @require\s+(https:\/\/cdn\.jsdelivr\.net\/gh\/.+$)/gm,
              jsrURLs = [...userJScontent.matchAll(re_jsrURL)].map(match => match[1])
        if (jsrURLs.length > 0) { jsrURLmap[userJSfilePath] = jsrURLs ; jsrCnt += jsrURLs.length }
    })
    log.success(`${jsrCnt} bumpable resource(s) found.`)

    log.working('\nProcessing resource(s)...\n')
    let jsrUpdatedCnt = 0 ; let filesUpdatedCnt = 0
    for (const userJSfilePath of Object.keys(jsrURLmap)) {

        // Init repo name
        let repoName = path.basename(userJSfilePath, '.user.js')
        if (repoName.endsWith('-mode')) repoName = repoName.slice(0, -5) // for chatgpt-widescreen

        // Fetch latest commit hash
        console.log(`Fetching latest commit hash for ${repoName}...`)
        const latestCommitHash = require('child_process').execSync(
            `git ls-remote https://github.com/adamlui/${repoName}.git HEAD`).toString().split('\t')[0]
        console.log(latestCommitHash + '\n')

        // Process each resource in the userscript
        const re_commitHash = /@([^/]+)/ ; let fileUpdated = false
        for (const resourceURL of jsrURLmap[userJSfilePath]) {
            const resourceName = resourceURL.match(/\w+\/\w+\.js(?=#|$)/)[0] // dir/filename.js for logs

            // Update hashes
            if ((resourceURL.match(re_commitHash) || [])[1] != latestCommitHash) {
                console.log(`Updating commit hash for ${resourceName}...`)
                let updatedResourceURL = resourceURL.replace(re_commitHash, `@${latestCommitHash}`)
                console.log(`Updating SRI hash for ${resourceName}...`)
                updatedResourceURL = updatedResourceURL.replace(/#sha.+/, `#${await getSRIhash(updatedResourceURL)}`)

                // Write updated URL to userscript
                let userJScontent = fs.readFileSync(userJSfilePath, 'utf-8')
                userJScontent = userJScontent.replace(resourceURL, updatedResourceURL)
                fs.writeFileSync(userJSfilePath, userJScontent, 'utf-8')
                jsrUpdatedCnt++ ; fileUpdated = true
            }
        }
        if (fileUpdated) {
            console.log('\nBumping userscript version...')
            bumpUserJSver(userJSfilePath) ; filesUpdatedCnt++
        }
    }

    // Log final summary
    log.success(`${jsrUpdatedCnt} resource(s) bumped across ${filesUpdatedCnt} file(s).`)
})()
