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

import { printBanner, runRemoteScript } from '/lib/lib.js';

// Personal Servers:
//    - home-scripts: work.js, upgrade.js, extend-status-overlay.js, contracts.js, stocks.js, hacknet.js

var specificTarget = '';

/** @param {import("../../.").NS } ns **/
export async function main(ns) {
    ns.disableLog('ALL');

    // INITIALIZE
    // work.js, upgrade.js, contracts.js, stocks.js, hacknet.js, extend-status-overlay.js
    var filesToDeploy = ['/lib/lib.js', '/bin/work.js', '/bin/contracts.js', '/bin/upgrades.js']; // '/bin/extend-status-overlay.js', '/ui/Base.js', '/ui/StatusBar.js', '/ui/StatusContainer.js',
    await init(ns, filesToDeploy);

    // Status Overlay seems to only run on home
    await ns.run('/bin/extend-status-overlay.js');

    // RUN RECON
    await ns.run('/wm/wintermute-recon.js', 1, specificTarget);
}

async function init(ns, filesToDeploy) {
    printBanner(ns, 'WINTERMUTE - INIT');

    if (ns.args[0]) {
        specificTarget = ns.args[0];
        ns.tprint('Specific Target: ' + specificTarget);
    }

    if (!ns.serverExists('home-extras')) {
        // attempt to purchase a server for 128GB
    }

    if (ns.serverExists('home-extras')) {
        for (var i = 0; i < filesToDeploy.length; i++) {
            await runRemoteScript(ns, filesToDeploy[i], 'home-extras');
        }
    } else { ns.tprint('ERROR - No home-extras server found'); }

    return true;
}