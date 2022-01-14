/** @param {import("../../.").NS } ns **/
export async function main(ns) {
    var factions = ns.getPlayer().factions;

    for (var i = 0; i < factions[i]; i++) {
        ns.tprint('Factions: ' + factions[i]);
    }
}