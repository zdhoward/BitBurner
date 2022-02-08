import { StatusContainer } from "/ui/StatusContainer.js";
import { StatusBarText, StatusBarProgress } from "/ui/StatusBar.js";
import { getBotnet } from '/nm/lib.js';

const doc = eval('document');
var visited = {};

const CHECK = (hover) => `<span style="font-size:0.9em; color:green; vertical-align:0.1em" title="${hover}">✔</span>`
const XFAIL = (hover) => `<span style="font-size:0.8em; color:red;   vertical-align:0.2em" title="${hover}">✘</span>`

export function autocomplete(data, args) {
    return [...data.servers];
}

/** @param {import("../..").NS } ns */
export async function main(ns) {
    // FUNCTIONS //
    async function serverScanRecursive(hostname) {
        if (visited[hostname] == true) {
            return;
        }

        visited[hostname] = true;

        var remoteHosts = eval("ns.scan(hostname)");
        for (var i in remoteHosts) {
            var remoteHost = remoteHosts[i];
            if (ns.serverExists(remoteHost)) {
                await serverScanRecursive(remoteHost);
            }
        }
    }

    function cleanUp() {
        (new StatusContainer(doc)).destroy();
    }

    function shorten(x, suffix = '', { precision = 2, sep = '', div = 1000 } = {}) {
        const labels = ['', 'k', 'm', 'b', 't', 'q'];
        for (var n = 0; x > div; n++) { x /= div };
        return `${x.toFixed(precision)}${sep}${labels[n]}${suffix}`;
    }

    function getRootedCount() {
        //const hosts = [new HostExtended(ns, 'home', []), ...Object.values(scan(ns, 20))].filter(h=>(!h.isPrivate()))
        const hosts = HOSTNAMES.filter(hn => ns.serverExists(hn));
        const rooted = hosts.filter(hn => ns.hasRootAccess(hn));
        return [rooted.length, hosts.length];
    }

    function getFreeRam(hosts) {
        let memUsed = 0, memMax = 0;
        hosts.forEach(hn => {
            memUsed += ns.getServerUsedRam(hn);
            memMax += ns.getServerMaxRam(hn);
        })

        return [memUsed, memMax];
    }

    function countContracts() {
        const hosts = HOSTNAMES.filter(hn => ns.serverExists(hn)).filter(hn => ns.hasRootAccess(hn));
        const contracts = [].concat.apply([], hosts.map(hn => ns.ls(hn, '.cct')));
        return contracts.length;
    }

    // INIT // 
    visited = {};
    ns.disableLog("ALL");
    ns.toast('extend.js has started', 'info');
    await serverScanRecursive("home");

    let HOSTNAMES = Object.keys(visited);
    cleanUp();
    ns.atExit(cleanUp);

    let container = new StatusContainer(doc, { location: 'stats' });
    container.installObserver(doc);

    // LOGIC //
    let bars = {
        hlev: new StatusBarProgress(doc, { container, labelText: 'targets' }),//, clickHandler: () => ns.run("/tools/peers.js"), barColor: '#273061' }),
        home: new StatusBarProgress(doc, { container, labelText: 'home' }),
        gmem: new StatusBarProgress(doc, { container, labelText: 'remotes' }),
        bmem: new StatusBarProgress(doc, { container, labelText: 'botnet' }),
        ram: new StatusBarProgress(doc, { container, labelText: 'RAM' }),//new StatusBarText(doc, { container, labelText: 'RAM' }),
        exes: new StatusBarText(doc, { container, labelText: 'EXEs' }),
        cont: new StatusBarText(doc, { container, labelText: 'Contracts' }), //, clickHandler: () => ns.run("contract-hunter.js", 1, "--solve", "ALL") }),
        totalIncome: new StatusBarText(doc, { container, labelText: 'Total' }),
        income: new StatusBarText(doc, { container, labelText: '$' }),
        xpgain: new StatusBarText(doc, { container, labelText: 'XP' }),
        karma: new StatusBarText(doc, { container, labelText: 'Karma' }),
        killed: new StatusBarText(doc, { container, labelText: 'Killed' }),
    }

    for (let iteration = 0; ; iteration++) {
        // Hacking Targets
        if ((iteration % 50) == 0) {
            let [rootedAvail, rootedMax] = getRootedCount()
            bars.hlev.progress = rootedAvail / rootedMax
            bars.hlev.llabel = ns.sprintf("%d / %d", rootedAvail, rootedMax)
        }

        // Memory
        let [hused, hmax] = [ns.getServerUsedRam('home'), ns.getServerMaxRam('home')];
        let [gused, gmax] = getFreeRam(HOSTNAMES.filter(hn => ns.serverExists(hn)).filter(hn => ns.hasRootAccess(hn) && !hn.startsWith("home") && !hn.startsWith("BOT")));
        let [bused, bmax] = getFreeRam(getBotnet(ns));
        let [aused, amax] = [hused + gused + bused, hmax + gmax + bmax];
        bars.home.progress = hused / hmax
        bars.gmem.progress = gused / gmax
        bars.bmem.progress = bused / bmax
        bars.ram.progress = aused / amax
        bars.ram.rlabel = shorten(hmax + gmax + bmax, ' GB', { precision: 0, sep: '', div: 1000 })

        // Unlockers
        if ((iteration % 100) == 0) {
            let exesContent = []
            for (let filename of ['BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe']) {
                exesContent.push(ns.fileExists(filename, 'home') ? CHECK(filename) : XFAIL(filename))
            }
            bars.exes.rlabel = exesContent.join(" ")
        }

        // Contracts
        if ((iteration % 50) == 0) {
            bars.cont.rlabel = countContracts()
        }

        // Income & Experience
        let [incomePerSecond, incomeSinceReset] = ns.getScriptIncome()
        let experiencePerSecond = ns.getScriptExpGain()
        bars.totalIncome.rlabel = shorten(incomeSinceReset * (ns.getTimeSinceLastAug() / 1000))
        bars.income.rlabel = shorten(incomePerSecond, '/sec')
        bars.xpgain.rlabel = shorten(experiencePerSecond, '/sec')
        bars.karma.rlabel = ns.heart.break()
        bars.killed.rlabel = ns.getPlayer().numPeopleKilled

        // Important: this must be asleep and not sleep if we want our clickHandlers to work.
        await ns.asleep(500)
    }
}