export default {
    multidevice: false, // for version not multidevice use false.(default: true)
    folderNameToken: 'tokens', //folder name when saving tokens
    mkdirFolderToken: '/node_modules', //folder directory tokens, just inside the venom folder, example:  { mkdirFolderToken: '/node_modules', } //will save the tokens folder in the node_modules directory
    headless: true, // Headless chrome
    devtools: false, // Open devtools by default
    useChrome: true, // If false will use Chromium instance
    debug: false, // Opens a debug session
    logQR: true, // Logs QR automatically in terminal
    browserWS: '', // If u want to use browserWSEndpoint
    browserArgs: [''], // Original parameters  ---Parameters to be added into the chrome browser instance
    addBrowserArgs: [''], // Add broserArgs without overwriting the project's original
    puppeteerOptions: {}, // Will be passed to puppeteer.launch
    disableSpins: false, // Will disable Spinnies animation, useful for containers (docker) for a better log
    disableWelcome: false, // Will disable the welcoming message which appears in the beginning
    updatesLog: true, // Logs info updates automatically in terminal
    autoClose: 60000, // Automatically closes the venom-bot only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)
    createPathFileToken: false, // creates a folder when inserting an object in the client's browser, to work it is necessary to pass the parameters in the function create browserSessionToken
    chromiumVersion: '818858', // Version of the browser that will be used. Revision strings can be obtained from omahaproxy.appspot.com.
    addProxy: [''], // Add proxy server exemple : [e1.p.webshare.io:01, e1.p.webshare.io:01]
    userProxy: '', // Proxy login username
    userPass: '' // Proxy password
}