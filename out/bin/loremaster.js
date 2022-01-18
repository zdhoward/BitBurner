// COLLECT ALL txt and lit files

var visited = {};
var seenFiles = [];

/** @param {NS} ns **/
export async function main(ns) {
    ns.toast('loremaster.js has started', 'info');
    visited = {};
    seenFiles = [];
    await serverScanRecursive(ns, ns.getHostname());
}

async function serverScanRecursive(ns, hostname) {
    if (visited[hostname] == true) {
        return;
    }

    visited[hostname] = true;

    var remoteHosts = ns.scan(hostname);
    for (var i in remoteHosts) {
        var remoteHost = remoteHosts[i];
        if (remoteHost != 'home') {
            var files = ns.ls(remoteHost);
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (!seenFiles.includes(file)) {
                    if (file.endsWith('.txt') || file.endsWith('.lit')) {
                        seenFiles.push(file);
                        await ns.scp(file, remoteHost, 'home');
                    }
                }
            }
        }

        await serverScanRecursive(ns, remoteHost);
    }

}