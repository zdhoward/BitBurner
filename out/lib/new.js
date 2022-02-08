export function autocomplete(data, args) {
    return [...data.servers];
}

/** @param {import("../../.").NS } ns */
export async function main(ns) {
    /** @type { import("../..").NS } */
    let core = eval("ns");
}