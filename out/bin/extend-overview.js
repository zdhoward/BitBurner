import { formatMoney, } from '/lib/lib.js';
import { allServers } from '/lib/config.js';

/** @param {NS} ns **/
export async function main(ns) {
    const doc = document; // This is expensive! (25GB RAM) Perhaps there's a way around it? ;)
    const hook0 = doc.getElementById('overview-extra-hook-0');
    const hook1 = doc.getElementById('overview-extra-hook-1');
    const hook2 = doc.getElementById('overview-extra-hook-2');

    while (true) {
        try {
            const headers = []
            const values = [];
            // Add script income per second
            headers.push("ScrInc");
            values.push(formatMoney(ns, ns.getScriptIncome()[0]) + '/sec');
            // Add script exp gain rate per second
            headers.push("ScrExp");
            values.push(formatMoney(ns, ns.getScriptExpGain()) + '/sec');
            // TODO: Add more neat stuff
            //headers.push("TESTING");
            //values.push("VALUES");

            // TODO: How many servers are rooted? [23/77]
            headers.push("HACKABLE");
            values.push(getRootedServers(ns));

            // TODO: karma?
            // TODO: Augments?


            // Now drop it into the placeholder elements
            hook0.innerText = headers.join(" \n");
            hook1.innerText = values.join("\n");
            //hook2.innerText = "<input type='button'>HOOK2</button>";
            // creat button if it does not exist
            //ns.alert("DOING IT!!!");
            //var btn = createButton(ns, doc, hook2, 'test-btn', testFunction);
            //ns.tprint(btn.innerText);

            //ns.alert("DOING IT");
        } catch (err) { // This might come in handy later
            ns.print("ERROR: Update Skipped: " + String(err));
        }
        await ns.sleep(1000);
    }
}

function createButton(ns, doc, hook, name, fn) {
    var btn = doc.getElementById(name);
    if (!btn) {
        btn = doc.createElement("button");
        btn.setAttribute("id", name);
    }
    btn.innerHTML = name;
    //btn.addEventListener('click', function () {
    //    fn(ns);
    //});
    btn.onClick = function () {
        fn(ns);
    };

    hook.appendChild(btn);

    ns.alert("BUTTON CREATED");

    return btn;
}

function testFunction(ns) {
    ns.alert("BUTTON PRESSED");
}

function getRootedServers(ns) {
    var rooted = 0;
    allServers.forEach(function (server) {
        if (ns.hasRootAccess(server) && ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel()) {
            //ns.tprint("Server " + server + " is rooted.");
            rooted++;
        }
    });
    return rooted + "/" + allServers.length;;
}