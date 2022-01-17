// WINTERMUTE
//    Orchestrate attacks and payloads
//    Time attacks
//      Assume server has $0 when growing
//      Assume server has max security when weakening
//      Hack back to $0 
//      Repeat
//
//     Needs to be run in parallel
//     Use wintermute-deploy.js to deploy and manage payloads
//     
//
//    Params:
//      - host
//      - target
//      - timingOffset/schedule
//      - mode (default, train)
//
//
//    Is this worth the effort?

//
//  Split payload into 3 files?
//  - dispatch.js [target] - make all calcs and kick off grow
//  - grow.js [target]
//  - weaken.js
//  - hack.js
//
//  find the largest ram file of the 3 and use that for payloadAmt
//

/** @param {NS} ns **/
export async function main(ns) {
    //ns.disableLog('ALL');
    ns.tprint('WINTERMUTE PAYLOAD: ' + ns.getHostname());


}