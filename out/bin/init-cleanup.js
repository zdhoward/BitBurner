// This script is to be run at the start of a new run, before anything else

/** @param {NS} ns **/
export async function main(ns) {
    ns.rm('/data/mastermind-data.txt');
}