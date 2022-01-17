import { pad, formatMoney } from "/lib/lib.js";

var allFactions = ['NiteSec', 'Netburners', 'CyberSec', 'The Black Hand'];

// TIAN DI HUI = FACTION REP BONUSES
// CYBERSEC = Cheap Hacking Bonuses

var factionToBuyFromFirst = ['CyberSec', 'NiteSec', 'Tian Di Hui', 'Netburners',];
var augsToBuyFirst = [''];

/** @param {import("../../.").NS } ns **/
export async function main(ns) {
    var money = ns.getPlayer().money;

    var factionInvites = ns.checkFactionInvitations();
    var ownedAugs = ns.getOwnedAugmentations();

    var augTypesToBuy = ['hacking', 'faction'];

    var availableFactions = ns.getPlayer().factions;

    var augsToBuy = getAugsToBuy(ns, ownedAugs, augTypesToBuy); // determines which augs are in the right category

    suggestAugToBuy(ns);

    // need to choose good buys now
    //   must be the most expensive augmentations that are not owned
    //   must flag to stop buying when the costs are too high

    //augsToBuy.forEach(info => { if (info.startsWith('hacking')) { return true }});

    for (var i = 0; i < availableFactions.length; i++) {
        //buyBestAugFromFaction(ns, availableFactions[i], ownedAugs, augsToBuy);
    }
    return;


    ns.tprint('Faction Invites: ' + factionInvites);
    ns.tprint('Owned Augs: ' + ownedAugs);

    for (var i = 0; i < allFactions.length; i++) {
        var rep = ns.getFactionRep(allFactions[i]);
        var augs = ns.getAugmentationsFromFaction(allFactions[i]);

        var augInfo = ''
        for (var j = 0; j < augs.length; j++) {
            var cost = ns.getAugmentationPrice(augs[j]);
            var repCost = ns.getAugmentationRepReq(augs[j]);

            augInfo += '\n\tAug: ' + pad(augs[j], 45) + '\tRep Cost: ' + pad(formatMoney(ns, repCost), 7) + '\t $ Cost: ' + formatMoney(ns, cost);
        }

        ns.tprint('\nFaction: ' + allFactions[i] + ' \tRep: ' + rep + augInfo);

    }
}

function suggestAugToBuy(ns) {
    var factions = ns.getPlayer().factions;
    var ownedAugs = ns.getOwnedAugmentations(true);
    var augsToBuy = getAugsToBuy(ns, ownedAugs, ['hacking', 'faction']);

    var bestAugFaction = '';
    var bestAug = '';
    var bestAugCost = 0;

    for (var i = 0; i < factions.length; i++) {
        var faction = factions[i];
        var augs = ns.getAugmentationsFromFaction(faction);
        for (var j = 0; j < augs.length; j++) {
            var cost = ns.getAugmentationPrice(augs[j]);
            if (cost > bestAugCost && augsToBuy.includes(augs[j]) && !ownedAugs.includes(augs[j])) {
                bestAug = augs[j];
                bestAugCost = cost;
                bestAugFaction = faction;
            }
        }
    }

    ns.tprint('Buy ' + bestAug + ' from ' + bestAugFaction + ' for ' + formatMoney(ns, bestAugCost));
}

/** @param {import("../../.").NS } ns 
 *  @param {string[]} faction
 *  @param {string[]} ownedAugs
 *  @param {string[]} augsToBuy
 */
function buyBestAugFromFaction(ns, faction, ownedAugs, augsToBuy) {
    var augs = ns.getAugmentationsFromFaction(faction);

    var mostExpensiveAug = '';
    var mostExpensiveAugCost = 0;
    for (var i = 0; i < augs.length; i++) {
        if (augsToBuy.includes(augs[i])) {
            var cost = ns.getAugmentationPrice(augs[i]);
            if (cost > mostExpensiveAugCost) {
                mostExpensiveAug = augs[i];
                mostExpensiveAugCost = cost;
            }
        }
    }
    if (mostExpensiveAug != '') {
        ns.tprint('INFO - Recommend Buying ' + mostExpensiveAug + ' from ' + faction + ' for ' + formatMoney(ns, mostExpensiveAugCost));
    }
    return mostExpensiveAug;
}

/** @param {import("../../.").NS } ns 
 *  @param {string[]} ownedAugs
 *  @param {string[]} augTypesToBuy
 */
function getAugsToBuy(ns, ownedAugs, augTypesToBuy) {

    var augsToBuy = [];

    for (var i = 0; i < allFactions.length; i++) {
        var faction = allFactions[i];
        //ns.tprint("\tFaction: " + faction);

        var augs = ns.getAugmentationsFromFaction(faction);

        for (var j = 0; j < augs.length; j++) {
            var aug = augs[j];
            //ns.tprint("\t\tAug: " + aug);

            var cost = ns.getAugmentationPrice(aug);
            var repCost = ns.getAugmentationRepReq(aug);
            var stats = Object.keys(ns.getAugmentationStats(aug));
            var prereqs = ns.getAugmentationPrereq(aug);
            //ns.tprint(prereqs);

            for (var k = 0; k < stats.length; k++) {
                var stat = stats[k];
                //ns.tprint("\t\t\t\tStat: " + stat);
                //if (stat.startsWith(type)) {
                //    augsToBuy.push(aug);
                //}

                for (var l = 0; l < augTypesToBuy.length; l++) {
                    var type = augTypesToBuy[l];
                    //ns.tprint("\t\t\tType: " + type);
                    if (stat.startsWith(type)) {
                        if (!augsToBuy.includes(aug) && !ownedAugs.includes(aug)) {
                            if (prereqs.length == 0 || ownedAugs.includes(prereqs[0])) {
                                augsToBuy.push(aug);
                            }
                        }
                    }
                }
            }
        }
    }

    return augsToBuy
}