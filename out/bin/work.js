import { formatMoney } from '/lib/lib.js';
//workPriority: {targets: {combatStats: 850, factionRep: {'netburners': 250000}}]}

var statGoals = { 'strength': 30, 'defence': 30, 'dexterity': 30, 'agility': 30, 'intelligence': 0, 'charisma': 30 };
var createProgramReq = { 'BruteSSH.exe': 50, 'FTPCrack.exe': 100, 'relaySMTP.exe': 250, 'HTTPWorm.exe': 500, 'SQLInject.exe': 750, 'AutoLink.exe': 25, 'DeepscanV1.exe': 75, 'DeepscanV2.exe': 400 }; //, 'ServerProfiler.exe': 75 
var factionsToNotAcceptImmediately = ['Sector-12', 'Chongqing', 'New Tokyo', 'Ishima', 'Aevum', 'Volhaven'];

/** @param {import("../../.").NS } ns **/
export async function main(ns) {
    ns.disableLog('ALL');
    ns.stopAction();
    // Gain Rep
    // Always have a focus
    while (true) {
        tryCreateProgram(ns);
        await tryWorkFactions(ns);
        //await tryWork(ns); // if all else fails, work at joes guns // This still doesn't work, shouldn't run if there is any faction rep to gain

        await ns.sleep(1000);
    }
}

/** @param {import("../../.").NS } ns **/
function tryCreateProgram(ns) {
    if (!ns.isBusy()) {
        ns.print("Trying To Create Programs...");

        var hackingLvl = ns.getHackingLevel();

        for (var program in createProgramReq) {
            //var program = 'BruteSSH.exe';
            if (!ns.fileExists(program, 'home') && hackingLvl >= createProgramReq[program]) {
                var result = ns.createProgram(program);
                return result;
            }
        }
    }
    return false;
}

/** @param {import("../../.").NS } ns **/
async function tryWorkFactions(ns) {
    var player = ns.getPlayer();
    var invitations = ns.checkFactionInvitations();

    /*
    // JOIN FACTIONS
    for (var i = 0; i < invitations.length; i++) {
        if (!factionsToNotAcceptImmediately.includes(invitations[i])) {
            ns.tprint("Joining Faction: " + invitations[i]);
            ns.joinFaction(invitations[i]);
        }
    }
    */

    if (!ns.isBusy()) {
        var factions = player.factions;

        //ns.tprint('Factions: ' + factions);

        for (var i = 0; i < factions.length; i++) {
            // find goals for factions and work on achieving them
            var repGoal = getRepGoal(ns, factions[i]);
            var factionRep = ns.getFactionRep(factions[i]);
            //ns.tprint(factions[i] + ' Rep Goal: ' + repGoal);
            if (factionRep < repGoal) {
                var workType = 'Hacking Contracts';
                ns.print("Trying To Work For Faction: " + factions[i] + ' - ' + formatMoney(ns, factionRep) + "/" + formatMoney(ns, repGoal));
                ns.workForFaction(factions[i], workType, false);
                await ns.sleep(1000 * 60 * 10); // 2 mins
                ns.stopAction();
                return;
            }
        }
    }
}

/** @param {import("../../.").NS } ns **/
function getRepGoal(ns, faction) {
    var augs = ns.getAugmentationsFromFaction(faction);
    var ownedAugs = ns.getOwnedAugmentations(true);

    var highestRep = 0;
    for (var i = 0; i < augs.length; i++) {
        if (!ownedAugs.includes(augs[i]) && !augs[i].startsWith('NeuroFlux Governor')) {
            var cost = ns.getAugmentationRepReq(augs[i]);
            if (cost > highestRep) {
                highestRep = cost;
            }
        }
    }
    return highestRep;
}

/** @param {import("../../.").NS } ns **/
async function tryWork(ns) {
    if (!ns.isBusy()) {
        // if no factions, and no stats, focus on working at joes guns
        // if no factions, and have stats, start working at blade and then fulcrum
        // if have factions, work on gaining faction rep with ones that have good augments to buy
        //   gain as much rep as the most costly augment with them
        ns.print("Trying To Work...");
        ns.workForCompany('joesguns');

        var player = ns.getPlayer();
        //var stats = { 'strength': player.strength, 'defense': player.defense, 'dexterity': player.dexterity, 'agility': player.agility, 'intelligence': player.intelligence, 'charisma': player.charisma };
        var jobs = player.jobs;

        //ns.tprint(Object.keys(stats));

        var hasJob = false;
        Object.keys(jobs).forEach(function (key) {
            ns.print(key + ': ' + jobs[key]);
            if (key == "Joe's Guns" && jobs[key] == 'Employee') {
                hasJob = true;
            }
        });

        if (!hasJob) {
            if (ns.applyToCompany("Joe's Guns", 'Employee')) {
                hasJob = true;
            }
        }

        if (hasJob) {
            ns.print("Trying To Work For Company: Joe's Guns");
            ns.workForCompany("Joe's Guns", false);
            await ns.sleep(1000 * 60 * 10);
            ns.stopAction();
        }
    }
}