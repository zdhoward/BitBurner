/*
 *	@param 0 destination
 * 
 */

var path = [];
var searched = {};

export function autocomplete(data, args) {
    return [...data.servers];
}

/** @param {NS} ns **/
export async function main(ns) {
    path = [];
    searched = {};

    var dest = ns.args[0];
    if (ns.serverExists(dest)) {
        findPath(ns, ns.getHostname(), dest);
        path = path.reverse();
        ns.tprint("PATH: " + path.join(" -> "));
        for (var i = 0; i < path.length; i++) {
            ns.connect(path[i]);
        }
    } else { ns.tprint('ERROR - ' + dest + 'SERVER NAME DOES NOT EXISTS') }
}

/** @param {NS} ns **/
function findPath(ns, host, dest) {
    if (searched[host] == true) {
        return false;
    }

    searched[host] = true;

    if (host == dest) {
        path.push(host);
        return host;
    }

    var remoteHosts = ns.scan(host);
    for (var i in remoteHosts) {
        var remoteHost = remoteHosts[i];
        var result = findPath(ns, remoteHost, dest);
        if (result) {
            path.push(host);
            //ns.tprint('RETURNING: ' + host);
            return host;
        }
    }
}