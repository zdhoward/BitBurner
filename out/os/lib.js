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