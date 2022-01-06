/** @param {NS} ns **/
export async function main(ns) {
    var player = ns.getPlayer();
    //ns.tprint(player['hacking']);

    for (var stats in player) {
        ns.tprint(stats + ": " + player[stats]);
    }

    //var keys = player.keys();
    //ns.tprint(keys);

    /*
    for (var i = 0; i < keys.length; i++){
        ns.tprint(``);
    }
    */
}