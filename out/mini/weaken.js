export function autocomplete(data, args) {
    return [...data.servers];
}

/** @param {import("../../.").NS } ns **/
export async function main(ns) {
    await ns.sleep(ns.args[1]);
    await ns.weaken(ns.args[0]);
    //ns.tprint('WEAKEN');
}