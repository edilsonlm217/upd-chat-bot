const venom = require('venom-bot');
import settings from "../config/venom";

function startVenomSession(data) {
    const { client, callback } = data;
    return venom.create(
        client,
        (base64Qrimg) => { callback(base64Qrimg) },
        undefined,
        settings,
    );
}

export { startVenomSession }