export function autocomplete(data, args) {
    return [...data.servers];
}

/** @param {import("../../.").NS } ns **/
export async function main(ns) {
    let iterations = 1;
    if (ns.args[2])
        iterations = ns.args[2];

    for (let i = 0; i < iterations; i++) {
        await ns.sleep(ns.args[1]);
        await ns.grow(ns.args[0]);
        await ns.sleep(200);
    }
    //ns.tprint('GROWING');
}