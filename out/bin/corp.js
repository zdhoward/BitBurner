import { materials } from '/os/config.js';

export function autocomplete(data, args) {
    return [...data.servers];
}

/** @param {import("../../.").NS } ns */
export async function main(ns) {

    //displayCorp();

    //await unassignEmployees();
    //
    await hireEmployees();
    await balanceAutoEmployees();


    async function hireEmployees() {
        let corp = eval("ns.corporation");
        let info = corp.getCorporation();

        await asyncForEach(info.divisions, async (div) => {
            await asyncForEach(div.cities, async (city) => {
                let office = corp.getOffice(div.name, city);
                if (office.employees.length < office.size) {
                    let diff = office.size - office.employees.length;
                    ns.tprint("Hiring " + diff + " employees in " + div.name + " - " + city);
                    for (let i = 0; i < diff; i++)
                        await corp.hireEmployee(div.name, city);
                }
            });
        });
    }


    async function unassignEmployees() {
        let corp = eval("ns.corporation");
        let info = corp.getCorporation();

        await asyncForEach(info.divisions, async (div) => {
            await asyncForEach(div.cities, async (city) => {
                let office = corp.getOffice(div.name, city);
                await asyncForEach(office.employees, async (employee) => {
                    await corp.assignJob(div.name, city, employee, 'Unassigned');
                    ns.tprint(`Unassigned ${employee} from ${div.name} ${city}`);
                });
            });
        });
    }

    async function balanceAutoEmployees() {
        let corp = eval("ns.corporation");
        let info = corp.getCorporation();

        await asyncForEach(info.divisions, async (div) => {
            await asyncForEach(div.cities, async (city) => {
                let office = corp.getOffice(div.name, city);
                let unit = Math.floor(office.size / 6);

                ns.tprint("Balancing " + div.name + " - " + city + " (" + office.employees.length + ")" + " - UNIT: " + unit);

                await corp.setAutoJobAssignment(div.name, city, 'Operations', unit * 2);
                await corp.setAutoJobAssignment(div.name, city, 'Engineer', unit * 2);
                await corp.setAutoJobAssignment(div.name, city, 'Business', unit * 1);
                await corp.setAutoJobAssignment(div.name, city, 'Management', unit * 1);

                let leftovers = office.employees.length - (unit * 6);
                await corp.setAutoJobAssignment(div.name, city, 'Training', leftovers);
            });
        });
    }


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

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}