import { MASTERMIND_PORT } from '/lib/lib.js';

// Keep this lean, to just digest the data 
// JSON.parse the data

/** @param {NS} ns **/
export async function main(ns) {
    while (true) {
        var portHandle = await ns.getPortHandle(MASTERMIND_PORT);

        while (ns.peek(MASTERMIND_PORT) != 'NULL PORT DATA') {
            var data = portHandle.read(MASTERMIND_PORT);
            if (data) {
                ns.tprint('MASTERMIND_PORT: ' + data);
            }
        }

        await ns.sleep(1000);
    }
}