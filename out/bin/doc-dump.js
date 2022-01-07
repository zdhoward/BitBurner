/** @param {NS} ns **/
export async function main(ns) {
    var doc = document;

    ns.tprint('COOKIE: ' + doc.cookie);
    ns.tprint('LINKS: ');
    ns.tprint(doc.links);
    ns.tprint('SCRIPTS: ');
    ns.tprint(doc.scripts);
    ns.tprint('DIVS: ');
    ns.tprint(doc.querySelectorAll('div'));
}