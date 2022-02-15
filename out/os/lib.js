export function helloWorld(ns) {
    ns.tprint("Hello World");
}

/// HELPER FUNCTIONS FOR GETTING TMP INFO
export async function getScriptInfo(ns) {
    return JSON.parse(await ns.read('/os/tmp/scripts.json'));
}

export async function getServerInfo(ns) {
    return JSON.parse(await ns.read('/os/tmp/servers.json'));
}

export async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

export function log(ns, msg, verbose = false) {
    if (verbose)
        ns.tprint(msg);

    ns.print(msg);
}

export function printBanner(ns, msg) {
    let banner = '\n' + "=".repeat(msg.length + 4) + '\n';
    banner += '= ' + msg + ' =\n';
    banner += "=".repeat(msg.length + 4) + '\n';

    log(ns, banner, true);
}

export function justifyLeft(ns, msg, length) {
    let spacer = length - msg.length;
    return msg + ' '.repeat(spacer);
}

export function justifyRight(ns, msg, length) {
    let spacer = length - msg.length;
    return ' '.repeat(spacer) + msg;
}

export function justifyCentre(ns, msg, length) {
    let spacer = length - msg.length / 2;
    return ' '.repeat(Math.floor(spacer)) + msg + ' '.repeat(Math.ceil(spacer));
}