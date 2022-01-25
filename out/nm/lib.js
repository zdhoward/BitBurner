export var pservPrefixes = ['home', 'BOT'];

// this is a required global var for the scan
var visited = {};

/** @param {import("../../.").NS } ns */
export function getHosts(ns) {
    let hosts = ['home'];
    hosts = hosts.concat(getBots(ns));
    //hosts.push('home');
    return hosts;
}

/** @param {import("../../.").NS } ns **/
export function getBots(ns) {
    return getBotnet(ns);
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

/** @param {import("../../.").NS } ns 
 *  @returns {array} sortedServers
 **/
export async function getTargets(ns) {
    let targets = [];

    await serverScanRecursive(ns, ns.getHostname());
    for (let server in visited) {
        if (ns.serverExists(server) && !pservPrefixes.includes(server.split('-')[0]) && ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel()) {
            targets.push(server);
        }
    }

    let sortedServers = sortServers(ns, targets)
    return sortedServers;
}

/** @param {import("../../.").NS } ns 
 *  @param {string} mode (train|share|hack)
 *  @param {string} payload file
 *  @returns payloadAmts as dict {'server': threadNum }
*/
export function getPayloadAmts(ns, mode, payload) {
    //   hack amount / max amount = hack threads
    //   max hosts threads / targets = training threads
    //   Infinity = share threads
    let payloadAmts = {};
    let targets = getTargets(ns);

    switch (mode) {
        case "train":
            payloadAmts = getTrainPayloadAmts(ns, payload);
            break;
        case "share":
            payloadAmts = getSharePayloadAmts(ns, payload);
            break;
        case "hack":
            payloadAmts = getHackPayloadAmts(ns, payload);
            break;
    }

    return payloadAmts;
}

/** @param {import("../../.").NS } ns 
 *  @param {string} script
 *  @param {string} [server=home] 
 *  @param {number} [threads=1] 
 **/
export async function runScript(ns, script, server = 'home', threads = 1) {
    await ns.scriptKill(script, server);
    if (server != 'home') {
        await ns.scp(script, 'home', server);
    }
    if (ns.getScriptRam(script, 'home') < ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) {
        ns.exec(script, server, threads);
    } else {
        ns.tprint('Not enough RAM to activate ' + script + ' on ' + server);
    }
}

/** @param {import("../../.").NS } ns 
 *  @param {string} payload file
 *  @returns payloadAmts as dict {'server': threadNum }
 **/
export function getTrainPayloadAmts(ns, payload) {
    let payloadAmts = {};
    return payloadAmts;
}

/** @param {import("../../.").NS } ns 
 *  @param {string} payload file
 *  @returns payloadAmts as dict {'server': threadNum }
 **/
export function getSharePayloadAmts(ns, payload) {
    let payloadAmts = {};
    return payloadAmts;
}

/** @param {import("../../.").NS } ns 
 *  @param {string} payload file
 *  @returns payloadAmts as dict {'server': threadNum }
 **/
export function getHackPayloadAmts(ns, payload) {
    let payloadAmts = {};
    /**
    sortedServers.forEach(function (server) {
        if (true) {
            let maxMoney = ns.getServerMaxMoney(server);
            let hackAmt = ns.hackAnalyze(server);
            let maxThreads = Math.floor(maxMoney / (maxMoney * hackAmt));
            if (maxThreads != Infinity && maxThreads > 0) {
                targets[server] = maxThreads;
            }
        }
    });
    **/
    return payloadAmts;
}


/** @param {import("../../.").NS } ns
 *  @param {string} servers
 *  @returns {array} sortedServers
 */
export function sortServers(ns, servers) {
    let sortedTargets = servers.sort(function (a, b) {
        if (ns.getServerMaxMoney(a) > ns.getServerMaxMoney(b)) {
            return 1; // -1 = greatest to least
        }
    });

    return sortedTargets;
}

/** @param {import("../../.").NS } ns
*   @param {string} hostname
*/
export async function serverScanRecursive(ns, hostname) {
    if (visited[hostname] == true) {
        return;
    }

    visited[hostname] = true;

    root(ns, hostname);

    let remoteHosts = ns.scan(hostname);
    for (let i in remoteHosts) {
        let remoteHost = remoteHosts[i];
        if (ns.serverExists(remoteHost)) {
            await serverScanRecursive(ns, remoteHost);
        }
    }
}

/** @param {import("../../.").NS } ns
*  @param {string} server
*/
export function root(ns, server) {
    openPorts(ns, server);
    let isRooted;
    try {
        isRooted = ns.nuke(server);
        if (isRooted) {
            s.tprint("== Server " + server + " is now rooted.");
        }
    } catch (e) {
        isRooted = false;
    }
}

/** @param {import("../../.").NS } ns
 *  @param {string} server
 */
export function openPorts(ns, server) {
    [
        { fn: ns.brutessh, requirement: "BruteSSH.exe" },
        { fn: ns.ftpcrack, requirement: "FTPCrack.exe" },
        { fn: ns.relaysmtp, requirement: "relaySMTP.exe" },
        { fn: ns.httpworm, requirement: "HTTPWorm.exe" },
        { fn: ns.sqlinject, requirement: "SQLInject.exe" },
    ].forEach((portOpener) => {
        if (ns.fileExists(portOpener.requirement)) {
            portOpener.fn(server);
        }
    });
}

/** @param {import("../../.").NS } ns **/
export async function purchaseNewAttackBot(ns) {
    if (ns.getPurchasedServers().length < ns.getPurchasedServerLimit() && ns.getPlayer().money > 58000000000) {
        var ramSize = getNewServerSize(ns, ns.getPurchasedServerMaxRam(), ns.getPlayer().money);
        var cost = ns.getPurchasedServerCost(ramSize);

        var name = getNewBotName(ns, 'BOT', getBotnet(ns));


        if (ns.purchaseServer(name, ramSize)) {
            ns.tprint('INFO - ' + 'PURCHASING ' + name + ': ' + ramSize + ' for ' + formatMoney(cost));
            await ns.scp('/mini/hack.js', 'home', name);
            await ns.scp('/mini/grow.js', 'home', name);
            await ns.scp('/mini/weaken.js', 'home', name);
            await ns.scp('/mini/share.js', 'home', name);
        } else { ns.tprint('ERROR - ' + 'PURCHASING ' + name + ': ' + ramSize + ' for ' + formatMoney(cost)); }
    } else {
        ns.tprint("NOT ENOUGH MONEY OR SERVER LIMIT REACHED");
    }
}

/** @param {import("../../.").NS } ns 
 *  @param 0 ramSize
 *  @return max purchasable ramSize
 */
export function getNewServerSize(ns, ramSize, money) {
    var cost = ns.getPurchasedServerCost(ramSize);
    if (cost > money) {
        ramSize = getNewServerSize(ns, ramSize / 2, money);
    }

    return ramSize
}

/** @param {import("../../.").NS } ns 
 *  @param 0 name
 *  @return name with unique number
 */
export function getNewBotName(ns, name, existingNames) {
    //var number = crypto.randomUUID();//ns.getPurchasedServers().length + 1;

    var highestNumber = 1;
    for (var i = 0; i < existingNames.length; i++) {
        var num = Number(existingNames[i].split('-')[1]);

        if (num > highestNumber) {
            highestNumber = num;
        }
    }
    highestNumber = Number(highestNumber) + 1;
    var name = name + "-" + highestNumber;
    ns.tprint("FINAL NAME: " + name);

    return name;
}

/** @param {import("../../.").NS } ns
 *  @param 0 money
 *  @return formattedMoney
 */
export function formatMoney(money, precision = 2) {
    return formatNumber(money, precision);
}

/** @param {number} number
 *  @param {string} suffix
 *  @param {number} precision
 *  @param {string} seperator
 *  @return formattedMoney
 */
export function formatNumber(number, suffix = '', precision = 2, sep = '') {
    const div = 1000;
    const labels = ['', 'k', 'm', 'b', 't', 'q'];
    for (var n = 0; Math.abs(number) > div; n++) { number /= div };
    return `${number.toFixed(precision)}${sep}${labels[n]}${suffix}`;
}

export function printRainbow(text) {
    let doc = eval('document');
    const list = doc.getElementById("terminal");

    if (list != null) {

        let style = `@keyframes rainbow {
        0% {color:purple}
        12.5% {color:cyan}
        50% {color:yellow}
        87.5% {color:cyan}
        100% {color:purple}
    }
    .rainbow {
        animation-name: rainbow;
        animation-duration: 3s;
        animation-iteration-count: infinite;
    }
        `;

        style = `.rainbow {
        /* text-align: center; /*
        /* text-decoration: underline; */
        font-size: 18px;
        font-family: monospace;
        letter-spacing: -1px;
    }
    .rainbow_text_animated {
        background: linear-gradient(to right, #6666ff, #0099ff , #00ff00, #ff3399, #6666ff);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        animation: rainbow_animation 6s ease-in-out infinite;
        background-size: 400% 100%;
    }
    
    @keyframes rainbow_animation {
        0%,100% {
            background-position: 0 0;
        }
    
        50% {
            background-position: 100% 0;
        }
    }`;

        // Inject some HTML.
        list.insertAdjacentHTML('beforeend', `<style>${style}</style><li class = "rainbow"><p class ="jss778 MuiTypography-root MuiTypography-body1 css-12bw0zz"><pre class="rainbow rainbow_text_animated">${text}</pre></p></li>`);
    }
}
