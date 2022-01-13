import { pad, formatMoney } from "/lib/lib.js";

var allFactions = ['NiteSec', 'Netburners', 'CyberSec'];

// TIAN DI HUI = FACTION REP BONUSES
// CYBERSEC = Cheap Hacking Bonuses

var factionToBuyFromFirst = ['Tian Di Hui',];
/** @param {NS} ns **/
export async function main(ns) {
    var money = ns.getPlayer().money;

    var factionInvites = ns.checkFactionInvitations();
    var ownedAugs = ns.getOwnedAugmentations();


    ns.tprint('Faction Invites: ' + factionInvites);
    ns.tprint('Owned Augs: ' + ownedAugs);

    for (var i = 0; i < allFactions.length; i++) {
        var rep = ns.getFactionRep(allFactions[i]);
        var augs = ns.getAugmentationsFromFaction(allFactions[i]);

        var augInfo = ''
        for (var j = 0; j < augs.length; j++) {
            var cost = ns.getAugmentationCost(augs[j]);

            augInfo += '\n\tAug: ' + pad(augs[j], 45) + '\tRep Cost: ' + pad(formatMoney(ns, cost[0]), 7) + '\t $ Cost: ' + formatMoney(ns, cost[1]);
        }

        ns.tprint('\nFaction: ' + allFactions[i] + ' \tRep: ' + rep + augInfo);

    }
}