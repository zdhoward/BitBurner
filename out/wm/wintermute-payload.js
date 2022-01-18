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

// should calculate 3 different things
// - time to weaken from max to min, this will be the longest wait
// - time to grow from min to max
// - time to hack
//
// calulate maxPayloadAmt based on the max amount of threads required for weaken, grow, and hack
// 
// cycle them all so that weaken hits, then grow hits, then hack hits
// - weakenTime - growTime = initialWaitTime
// - weakenTime - hackTime = initialWaitTime
//
// wait before launching attacks and add 1 second for grow, and 2 seconds for hack
// this should stagger them enough to not be a problem
//
// this way does eat ram up with waiting processes, would be better to trigger them and let them die out once done

// another idea might be to stagger payloads out by getting wait time and continuously launching separate scripts
// if weakentime = 2 mins && maxThreads = 100
//   fire off a weaken script every (2mins / 100) = 0.2s


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Will do this using loop algorithm approach
// Goal: Maximize RAM usage and optimize for time
//
// wintermute-payload.js = deployment of mini payloads
//
// Payloads:
// - /mini/weaken.js
// - /mini/grow.js
// - /mini/hack.js
//
// When utilizing this strategy, monitor the amount of money and security on the target server, 
// if the money is not hovering around maximum and the security around the minimum, 
// the ratios should be tweaked until that is the case.
//
// Notes:
// - formulas.exe can be used to optimize timings
// - sleep() or asleep()
//
// TODO:
//   - replace deploy.js with this? Then this script doesn't need to run on the target server
//     - this is the easiest route

var threadRatios = { 'weaken': 2, 'grow': 10, 'hack': 1 };
var batchOffset = 3000; // in ms

/** @param {import("../../.").NS } ns **/
export async function main(ns) {
    //ns.disableLog('ALL');
    ns.tprint('WINTERMUTE PAYLOAD: ' + ns.getHostname());
    var maxThreads = 28;// ns.args[1] // should be passed as an argument
    var target = 'joesguns'; // ns.args[0] // should be passed as an argument

    var batchTime = Math.ceil(ns.getWeakenTime(target));
    var threadsPerBatch = threadRatios['weaken'] + threadRatios['grow'] + threadRatios['hack'];

    var remainingThreads = maxThreads;

    while (remainingThreads > 0) {
        if (remainingThreads >= threadsPerBatch) {
            deployBatch();
            await ns.sleep(batchOffset);
        } else {
            deployRemaining();
        }
    }

    function deployBatch() {
        var cycleOffset = 100; // in ms
        var weakenTime = batchTime;
        var growTime = ns.getGrowTime(target);
        var hackTime = ns.getHackTime(target);

        var growWait = batchTime - growTime + cycleOffset;
        var hackWait = batchTime - hackTime + cycleOffset;

        for (var i = 0; i < threadRatios['weaken']; i++) {
            deployWeaken(cycleOffset);
        }
        for (var i = 0; i < threadRatios['grow']; i++) {
            deployGrow(growWait);
        }
        for (var i = 0; i < threadRatios['hack']; i++) {
            deployHack(hackWait);
        }

        remainingThreads -= threadsPerBatch;
    }

    function deployRemaining() {
        // attempt to deploy them to continuously attack
        var intervalIncrease = Math.ceil(batchTime / remainingThreads);
        var waitTime = intervalIncrease;
        for (var i = remainingThreads; i > 0; i--) {
            deployWeaken(waitTime);
            waitTime += intervalIncrease;
        }
        remainingThreads = 0;
    }

    function deployWeaken(offset = 0) {
        // run weaken.js [target], [offset]
        ns.tprint("DEPLOY WEAKEN");
        //ns.run('/mini/weaken.js', 1, target, offset, crypto.randomUUID());
    }

    function deployGrow(offset = 0) {
        // run grow.js [target], [offset]
        ns.tprint("DEPLOY GROW");
        //ns.run('/mini/grow.js', 1, target, offset, crypto.randomUUID());
    }

    function deployHack(offset = 0) {
        // run hack.js [target], [offset]
        ns.tprint("DEPLOY HACK");
        //ns.run('/mini/hack.js', 1, target, offset, crypto.randomUUID());
    }
}