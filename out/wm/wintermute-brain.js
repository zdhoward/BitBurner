// WINTERMUTE BRAIN
//    Run all of wintermute
//    Receives [
//      hackPriority: train, earn, default
//      specificTarget: 'n00dles'
//    ]

// wintermute.js: calls brain with configuration for current bitnode
// brain.js: 
//    - recon.js: discover hosts and prepare info for deploy.js
//      - deploy.js: deploys to discovered hosts and activates payloads
//        - payload.js: actively works at weaken, grow, and hacking
//    - work.js: handle working, faction rep, and crime
//    - upgrade.js: handle upgrading home, purchasing augments, and buying new servers
//    - ui.js: handle all ui tweaks
//    - contracts.js: handle contracts
//    - stocks.js: handle stocks
//    - hacknet.js: handle hacknet
//    - lib.js: library of functions

import { printBanner, runRemoteScript, deserializeDict, zfill, pad, waitRandom, getBotnet, serializeDict, pservPrefixes, formatMoney, allServers, MASTERMIND_PORT } from '/lib/lib.js';

//import { printBanner, runRemoteScript } from '/lib/lib.js';

// Personal Servers:
//    - home-scripts: work.js, upgrade.js, extend-status-overlay.js, contracts.js, stocks.js, hacknet.js

var specificTarget = '';

//export function autocomplete(data, args) {
//    return [...data.servers];
//}

/** @param {import("../../.").NS } ns **/
export async function main(ns) {
    ns.disableLog('ALL');

    // INITIALIZE
    // work.js, upgrade.js, contracts.js, stocks.js, hacknet.js, extend-status-overlay.js
    var filesToDeploy = ['/lib/lib.js'];//, '/bin/work.js', '/bin/contracts.js', '/bin/upgrades.js', 'stocks.js']; // '/bin/extend-status-overlay.js', '/ui/Base.js', '/ui/StatusBar.js', '/ui/StatusContainer.js',
    await init(ns, filesToDeploy);

    await ns.scriptKill('/bin/mastermind-payload.js', 'home');

    // Status Overlay seems to only run on home
    //await ns.run('/bin/extend-status-overlay.js');
    //await runRemoteScript(ns, '/bin/extend-status-overlay.js', 'home');

    // RUN RECON
    await ns.run('/wm/wintermute-recon.js', 1, specificTarget);

    ns.tprint("COMPLETE");
}

/** @param {import("../../.").NS } ns **/
async function init(ns, filesToDeploy) {
    var wintermuteBanner = "\n" +
        "   _.-=-._.-=-._.-=-._.-=-._.-=-._.-=-._.-=-._.-=-._.-=-._.-=-._.-=-._.-=-._.-=-._.-=-._.-=-._.-=-._.-=-._.-=-._.-=-._.-=-._\n" +
        ".-'---      - ---     --     ---   -----      - ---     --     ---   -----      - ---     --     ---   -----      - --- --- `-.\n" +
        " )    ▄█     █▄   ▄█  ███▄▄▄▄       ███        ▄████████    ▄████████   ▄▄▄▄███▄▄▄▄   ███    █▄      ███        ▄████████    ( \n" +
        "(    ███     ███ ███  ███▀▀▀██▄ ▀█████████▄   ███    ███   ███    ███ ▄██▀▀▀███▀▀▀██▄ ███    ███ ▀█████████▄   ███    ███     )\n" +
        " )   ███     ███ ███▌ ███   ███    ▀███▀▀██   ███    █▀    ███    ███ ███   ███   ███ ███    ███    ▀███▀▀██   ███    █▀     ( \n" +
        "(    ███     ███ ███▌ ███   ███     ███   ▀  ▄███▄▄▄      ▄███▄▄▄▄██▀ ███   ███   ███ ███    ███     ███   ▀  ▄███▄▄▄         )\n" +
        " )   ███     ███ ███▌ ███   ███     ███     ▀▀███▀▀▀     ▀▀███▀▀▀▀▀   ███   ███   ███ ███    ███     ███     ▀▀███▀▀▀        ( \n" +
        "(    ███     ███ ███  ███   ███     ███       ███    █▄  ▀███████████ ███   ███   ███ ███    ███     ███       ███    █▄      )\n" +
        " )   ███ ▄█▄ ███ ███  ███   ███     ███       ███    ███   ███    ███ ███   ███   ███ ███    ███     ███       ███    ███    ( \n" +
        "(     ▀███▀███▀  █▀    ▀█   █▀     ▄████▀     ██████████   ███    ███  ▀█   ███   █▀  ████████▀     ▄████▀     ██████████     )\n" +
        " )                                                         ███    ███                                                        ( \n" +
        "(___       _       _       _       _       _       _       _       _       _       _       _       _       _       _       ___)\n" +
        "    `-._.-' (___ _) `-._.-' `-._.-' `-._.-' `-._.-' `-._.-' )     ( `-._.-' `-._.-' `-._.-' `-._.-' `-._.-' (__ _ ) `-._.-'\n" +
        "            ( _ __)                                        (_     _)                                        (_ ___)\n" +
        "            (__  _)                                         `-._.-'                                         (___ _)\n" +
        "            `-._.-'                                                                                         `-._.-'\n";

    ns.tprint(wintermuteBanner);
    printBanner(ns, 'WINTERMUTE - INIT');

    specificTarget = '';

    if (ns.args[0]) {
        specificTarget = ns.args[0];
        ns.tprint('Specific Target: ' + specificTarget);
    }

    if (!ns.serverExists('home-extras')) {
        // attempt to purchase a server for 128GB
        if (!ns.serverExists('home-extras') && ns.getPlayer().money > ns.getPurchasedServerCost(128)) {
            ns.purchaseServer('home-extras', 128);
        }
    }

    if (ns.serverExists('home-extras')) {
        for (var i = 0; i < filesToDeploy.length; i++) {
            ns.tprint('Deploying ' + filesToDeploy[i] + '...');
            await runRemoteScript(ns, filesToDeploy[i], 'home-extras');
        }
    } else { ns.tprint('ERROR - No home-extras server found'); }

    if (ns.serverExists('home-extras') && (ns.getPlayer().money > 10e9)) { //|| ns.fileExists('/bin/stocks.js', 'home-extras')) { // 10 bil
        ns.tprint('Deploying Stocks...');
        await runRemoteScript(ns, '/bin/stocks.js', 'home-extras');
    }

    return true;
}