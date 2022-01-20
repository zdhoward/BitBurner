export var allServers = ["ecorp", "megacorp", "b-and-a", "blade", "nwo", "clarkinc", "omnitek", "4sigma",
    "kuai-gong", "fulcrumtech", "fulcrumassets", "stormtech", "defcomm", "infocomm", "helios", "vitalife",
    "icarus", "univ-energy", "titan-labs", "microdyne", "taiyang-digital", "galactic-cyber", "aerocorp",
    "omnia", "zb-def", "applied-energetics", "solaris", "deltaone", "global-pharm", "nova-med", "zeus-med",
    "unitalife", "lexo-corp", "rho-construction", "alpha-ent", "aevum-police", "rothman-uni",
    "zb-institute", "summit-uni", "syscore", "catalyst", "the-hub", "comptek", "netlink", "johnson-ortho",
    "n00dles", "foodnstuff", "sigma-cosmetics", "joesguns", "zer0", "nectar-net", "neo-net",
    "silver-helix", "hong-fang-tea", "harakiri-sushi", "phantasy", "max-hardware", "omega-net",
    "crush-fitness", "iron-gym", "millenium-fitness", "powerhouse-fitness", "snap-fitness",
    "run4theh111z", "I.I.I.I", "avmnite-02h", ".", "CSEC", "The-Cave", "w0r1d_d43m0n"]

export var pservPrefixes = ['BOT', 'SHR', 'home'];

export var PASS = "✔";
export var FAIL = "✘";

//["n00dles", "foodnstuff", "nectar-net", "neo-net", "comptek", "syscore", "aevum-police", "millenium-fitness", "crush-fitness", "avmnite-02h", "zb-institute", "summit-uni", "I.I.I.I", "rho-construction", "galactic-cyber", "global-pharm", "snap-fitness", "unitalife", "phantasy", "CSEC", "sigma-cosmetics", "joesguns", "zer0", "silver-helix", "netlink", "johnson-ortho", "rothman-uni", "lexo-corp", "alpha-ent", "aerocorp", "omnia", "defcomm", "univ-energy", "taiyang-digital", "run4theh111z", "vitalife", "omnitek", "clarkinc", "zb-def", "deltaone", "icarus", "infocomm", "titan-labs", "helios", "kuai-gong", "powerhouse-fitness", "fulcrumassets", "The-Cave", "microdyne", "fulcrumtech", "solaris", "zeus-med", "nova-med", "applied-energetics", "stormtech", "4sigma", "nwo", ".", "b-and-a", "ecorp", "megacorp", "blade", "omega-net", "the-hub", "catalyst", "hong-fang-tea", "max-hardware", "harakiri-sushi", "iron-gym", "darkweb"];

export var MASTERMIND_PORT = 20;
export var STOCKS_PORT = 19;
export var UPGRADES_PORT = 18;

/** @param {import("../../.").NS } ns */
export function main(ns) {

}

/** @param {import("../../.").NS } ns */
export async function waitRandom(ns, time, offset) {
    // To help stagger commands in loops
    await ns.sleep(Math.floor(Math.random() * time) + offset);
}

/** @param {import("../../.").NS } ns **/
export function getBotnet(ns) {
    var purchasedServers = ns.getPurchasedServers();
    var botnet = [];
    for (var i = 0; i < purchasedServers.length; i++) {
        if (purchasedServers[i].startsWith('BOT')) {
            botnet.push(purchasedServers[i]);
        }
    }
    return botnet;
}

/** @param {import("../../.").NS } ns **/
export function getSharenet(ns) {
    var purchasedServers = ns.getPurchasedServers();
    var sharenet = [];
    for (var i = 0; i < purchasedServers.length; i++) {
        if (purchasedServers[i].startsWith('SHR')) {
            sharenet.push(purchasedServers[i]);
        }
    }
    return sharenet;
}

/** @param {import("../../.").NS } ns
 *  @param 0 ram
 *  @return validRamAmount
 */
export function getValidRamAmount(ns, ram) {
    ns.tprint('RAM: ' + ram);
    var initialRam = 2;
    while (initialRam < ram) {
        initialRam *= 2;
    }
    ns.tprint('getValidRamAmount: ' + initialRam);
    return ram;
}

/** @param {import("../../.").NS } ns
 *  @param 0 msg
 *  @return formattedMsg
 */
export async function printBanner(ns, msg) {
    ns.tprint('\n============================================================' + '\n==\t\t' + msg + '\n============================================================');
}

/** @param {import("../../.").NS } ns
 *  @param 0 money
 *  @return formattedMoney
 */
export function formatMoney(money, precision = 2) {
    var suffix = '';
    if (money >= 1000000000000) {
        suffix = 'T';
    } else if (money >= 1000000000) {
        suffix = 'B';
    } else if (money >= 1000000) {
        suffix = 'M';
    } else if (money >= 1000) {
        suffix = 'k';
    }

    while (money >= 1000) {
        money /= 1000;
    }

    return Number(money).toFixed(precision).toLocaleString('en-us') + suffix; //ns.nFormat(money, "0,0.00") + suffix;
}

/* @param0 dict to serialize
 * @return serialized string
 */
export function serializeDict(dict) {
    var serialized = '';
    for (var key in dict) {
        serialized += key + '=' + dict[key] + ',';
    }
    return serialized;
}

/* @param0 string to deserialize
 * @return dict
 */
export function deserializeDict(serialized) {
    var dict = {};
    var items = serialized.split(',');
    for (var i = 0; i < items.length; i++) {
        var details = items[i].split('=');
        dict[details[0]] = details[1];
    }
    return dict
}

/* @param0 number to zero fill
 * @param1 length of zero fill
 * @return zero filled string
 */
export function zfill(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

/* @param0 string to pad
 * @param1 length of padding
 * @return padded string
 */
export function pad(msg, size) {
    msg = String(msg);
    while (msg.length < size) msg = msg + ' ';
    return msg;
}

/** @param {import("../../.").NS } ns 
 *  @param script
 *  @param server='home' **/
export async function runRemoteScript(ns, script, server = 'home') {
    await ns.scriptKill(script, server);
    if (server != 'home') {
        await ns.scp(script, 'home', server);
    }
    if (ns.getScriptRam(script, 'home') < ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) {
        ns.exec(script, server);
    } else {
        ns.tprint('Not enough RAM to activate ' + script);
    }

    //await ns.sleep(10);
}

/** @param {import("../../.").NS } ns **/
export async function shareFill(ns) {
    var servers = allServers;
    //servers = servers.concat(getBotnet(ns)).concat(getSharenet(ns)).push('home');
    servers = servers.concat(getBotnet(ns));
    servers = servers.concat(getSharenet(ns));
    servers.push('home');
    //ns.tprint("Servers: " + servers);

    for (var i = 0; i < servers.length; i++) {
        if (ns.serverExists(servers[i])) {
            var server = servers[i];

            ns.scriptKill('/bin/mastermind-payload.js', server);
            ns.scriptKill('/mini/share.js', server);
            var maxRam = ns.getServerMaxRam(server);

            if (maxRam > 0) {
                var usedRam = ns.getServerUsedRam(server);
                var payloadRam = ns.getScriptRam('/mini/share.js', server);

                var availableRam = maxRam - usedRam;
                var threads = Math.floor(availableRam / payloadRam);

                var sharePower = ns.getSharePower();

                //ns.tprint(threads + " threads available");
                //ns.tprint("Share power mult: " + ((CalculateShareMult(sharePower) - 1) * 100).toFixed(2) + "%");
                //ns.tprint("Total Power mult: " + ((CalculateShareMult(sharePower * threads) - 1) * 100).toFixed(2) + "%");

                ns.exec('/mini/share.js', server, threads);
            }
        }
    }
}

export function CalculateShareMult(power) {
    const x = 1 + Math.log(power) / (8 * Math.log(1000));
    if (isNaN(x) || !isFinite(x)) return 1;
    return x;
}