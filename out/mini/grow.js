export function autocomplete(data, args) {
    return [...data.servers];
}

/** @param {import("../../.").NS } ns **/
export async function main(ns) {
    await ns.sleep(args[1]);
    ns.grow(ns.args[0]);
}