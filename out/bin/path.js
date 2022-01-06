/*
 *	@param 0 destination
 * 
 */

var path = [];
var searched = {};

/** @param {NS} ns **/
export async function main(ns) {
    var dest = ns.args[0];
    findPath(ns, ns.getHostname(), dest);
    ns.tprint("PATH: " + path.reverse().join(" -> "));
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
            return host;
        }
    }
}