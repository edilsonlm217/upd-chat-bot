import settings from "../config/venom";

const venom = require('venom-bot');

function start(data) {
    const { sessionName, callback } = data;

    return venom
        .create(
            sessionName, //Pass the name of the client you want to start the bot
            (base64Qrimg, attempts) => {
                console.log('Number of attempts to read the qrcode: ', attempts);
                callback(base64Qrimg);
            },
            (statusSession, session) => { },
            settings,
            // BrowserSessionToken
            // To receive the client's token use the function await clinet.getSessionTokenBrowser()
            {
                WABrowserId: '"UnXjH....."',
                WASecretBundle:
                    '{"key":"+i/nRgWJ....","encKey":"kGdMR5t....","macKey":"+i/nRgW...."}',
                WAToken1: '"0i8...."',
                WAToken2: '"1@lPpzwC...."'
            },
            // BrowserInstance
            (browser, waPage) => {
                console.log('Browser PID:', browser.process().pid);
            }
        )
}

export { start }