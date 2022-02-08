export function autocomplete(data, args) {
    return [...data.servers];
}

/** @param {import("../../.").NS } ns **/
export async function main(ns) {
    //var sourceFiles = ns.getOwnedSourceFiles();
    //ns.tprint(sourceFiles);
    killNM(ns);
    killMM(ns);
}

/** @param {import("../../.").NS } ns **/
function killNM(ns) {
    let servers = ['home'];

    for (let i = 0; i < servers.length; i++) {
        ns.scriptKill('/nm/neuromancer.js', servers[i]);
        ns.scriptKill('/mini/weaken.js', servers[i]);
        ns.scriptKill('/mini/grow.js', servers[i]);
        ns.scriptKill('/mini/hack.js', servers[i]);
    }
}

/** @param {import("../../.").NS } ns **/
function killMM(ns) {
    let servers = ['home'];

    for (let i = 0; i < servers.length; i++) {
        ns.scriptKill('/bin/mastermind-payload.js', servers[i]);
    }
}