import { materials } from '/os/config.js';

export function autocomplete(data, args) {
    return [...data.servers];
}

/** @param {import("../../.").NS } ns */
export async function main(ns) {

    displayCorp();


    function displayCorp() {
        let corp = eval("ns.corporation");
        let info = corp.getCorporation();

        Object.keys(corp.getCorporation()).forEach(function (key) {
            if (key == "divisions") {
                Object.keys(info[key]).forEach(function (divnum) {
                    let division = info[key][divnum];
                    Object.keys(division).forEach(function (divkey) {
                        ns.tprint(division.name + " - " + divkey + ': ' + division[divkey]);
                    });
                    // get OFFICE INFO
                    Object.keys(info[key][divnum].cities).forEach(function (city) {
                        let office = corp.getOffice(info[key][divnum].name, info[key][divnum]['cities'][city]);
                        Object.keys(office).forEach(function (offkey) {
                            if (offkey == "employeeProd") {
                                Object.keys(office[offkey]).forEach(function (prodkey) {
                                    ns.tprint(office.loc + " - Office - " + offkey + ' - ' + prodkey + ': ' + office[offkey][prodkey]);
                                });
                            } else {
                                ns.tprint(office.loc + " - " + offkey + ': ' + office[offkey]);
                            }
                        });
                        let warehouse = corp.getWarehouse(info[key][divnum].name, info[key][divnum]['cities'][city]);
                        Object.keys(materials).forEach(function (matkey) {
                            let material = corp.getMaterial(info[key][divnum].name, info[key][divnum]['cities'][city], materials[matkey]);
                            ns.tprint(warehouse.loc + " - Warehouse - " + materials[matkey] + ': ' + material.qty);
                        });
                        ns.tprint(warehouse);
                    });
                });
            } else {
                ns.tprint(key + ": " + info[key]);
            }
        });
    }

}

