exports.config = {
    specs: [
        './audio.recording.js'
    ],
    seleniumAddress: process.env.SELENIUM_ADDRESS,
    multiCapabilities: []
}

function getDefaultBrowserInfo(browserName) {
    return {
        browserName: browserName,
        build: 'webRTC',
        name: 'webRTC_Tests',

        'browserstack.user': process.env.BROWSERSTACK_USERNAME,
        'browserstack.key': process.env.BROWSERSTACK_KEY,
        'browserstack.debug': 'true',

        'os': 'Windows',
        'os_version': '7',
        'browser_version': '58.0',
        'resolution': '1024x768',
        'chromeOptions': {
            args: [
                // '--enable-logging=stderr',
                // '--no-first-run',
                // '--no-default-browser-check',
                // '--disable-translate',
                '--use-fake-ui-for-media-stream',
                '--use-fake-device-for-media-stream',
                // '--vmodule="*media/*=3,*turn*=3"',
                // "--headless", 
                // "--disable-gpu",
                "--enable-experimental-web-platform-features",
                // "--allow-http-screen-capture",
                // "--enable-usermedia-screen-capturing"
            ]
        }
    };
}

var browserInfo = getDefaultBrowserInfo('Chrome');
exports.config.multiCapabilities.push(browserInfo);