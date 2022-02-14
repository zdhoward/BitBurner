import { materials } from '/os/config.js';
import { asyncForEach } from '/os/lib.js';

/** @type {import("../../.").Corporation } corp */
let corp = '';

let itemsToResearch = ["Hi-Tech R&D Laboratory", "Market-TA.I", "Market-TA.II", "Overclock", "Self-Correcting Assemblers", "uPgrade: Fulcrum", "uPgrade: Dashboard", "uPgrade: Capacity.I", "Automatic Drug Administration", "CPH4 Injections", "Go-Juice", "Drones", "Drones - Assembly", "Drones-Transport", "Sti.mu", "Bulk Purchasing", "AutoPartyManager", "AutoBrew", "HRBuddy-Recruitment"]; //everything except "HRBuddy-Training"

let materialSizes = {
    Water: 0.05,
    Energy: 0.01,
    Food: 0.03,
    Plants: 0.05,
    Metal: 0.1,
    Hardware: 0.06,
    Chemicals: 0.05,
    Drugs: 0.02,
    Robots: 0.5,
    AICores: 0.1,
    RealEstate: 0.005,
    "Real Estate": 0.005,
    "AI Cores": 0.1,
};

let industries = {
    'Software': {
        inputs: [
            { type: 'Hardware', amount: 0.5 },
            { type: 'Energy', amount: 0.5 },
        ],
        outputs: [
            { type: 'AI Cores', amount: 1 },
        ],
        boosters: [
            { type: 'Hardware', amount: 5 },
            { type: 'Robots', amount: 1 },
            { type: 'AI Cores', amount: 3 },
            { type: 'Real Estate', amount: 2 },
        ],
        makesProducts: true
    },
    'Agriculture': {
        inputs: [
            { type: 'Water', amount: 0.5 },
            { type: 'Energy', amount: 0.5 },
        ],
        outputs: [
            { type: 'Plants', amount: 1 },
            { type: 'Food', amount: 1 },
        ],
        boosters: [
            { type: 'Hardware', amount: 4 },
            { type: 'Robots', amount: 5 },
            { type: 'AI Cores', amount: 5 },
            { type: 'Real Estate', amount: 14 },
        ],
        makesProducts: false
    },
    'Tobacco': {
        inputs: [
            { type: 'Plants', amount: 1 },
            { type: 'Water', amount: 0.2 },
        ],
        outputs: [
        ],
        boosters: [
            { type: 'Hardware', amount: 2 },
            { type: 'Robots', amount: 4 },
            { type: 'AI Cores', amount: 2 },
            { type: 'Real Estate', amount: 2 },
        ],
        makesProducts: true
    },
    'Real Estate': {
        inputs: [
            { type: 'Metal', amount: 5 },
            { type: 'Energy', amount: 5 },
            { type: 'Water', amount: 2 },
            { type: 'Hardware', amount: 4 },
        ],
        outputs: [
            { type: 'Real Estate', amount: 2 },
        ],
        boosters: [
            { type: 'Hardware', amount: 1 },
            { type: 'Robots', amount: 11 },
            { type: 'AI Cores', amount: 11 },
            { type: 'Real Estate', amount: 1 },
        ],
        makesProducts: true
    },
    'Robotics': {
        inputs: [
            { type: 'Hardware', amount: 5 },
            { type: 'Energy', amount: 3 },
        ],
        outputs: [
            { type: 'Robots', amount: 1 },
        ],
        boosters: [
            { type: 'Hardware', amount: 3 },
            { type: 'Robots', amount: 1 },
            { type: 'AI Cores', amount: 7 },
            { type: 'Real Estate', amount: 6 },
        ],
        makesProducts: true
    },
    'Computer': {
        inputs: [
            { type: 'Metal', amount: 2 },
            { type: 'Energy', amount: 1 },
        ],
        outputs: [
            { type: 'Hardware', amount: 1 },
        ],
        boosters: [
            { type: 'Hardware', amount: 1 },
            { type: 'Robots', amount: 7 },
            { type: 'AI Cores', amount: 3 },
            { type: 'Real Estate', amount: 4 },
        ],
        makesProducts: true
    },
};

export function autocomplete(data, args) {
    return [...data.servers];
}

/** @param {import("../../.").NS } ns */
export async function main(ns) {
    corp = eval('ns.corporation');

    let funds = corp.getCorporation().funds;

    upgradeCorporation(funds * 0.3);
    upgradeOffices(funds * 0.65);
    upgradeWarehouses(funds * 0.05);

    await hireEmployees();
    await balanceAutoEmployees();

    //setPrices();

    function buyBoosters() {
        // if instant buy is unlocked
        // determine how much storage to take up
        // purchase unit
    }

    function research() {
    }

    function setPrices() {
        let info = corp.getCorporation();

        info.divisions.forEach(function (div) {
            div.cities.forEach(function (city) {
                corp.setSmartSupply(div.name, city, true);

                industries[div.type].outputs.forEach(function (output) {
                    corp.setMaterialMarketTA2(div.name, city, output.type, true);
                });

                div.products.forEach(function (product) {
                    corp.setProductMarketTA2(div.name, product, true);
                });
            });
        });

    }

    function upgradeOffices(moneyToSpend) {
        let info = corp.getCorporation();

        let hasPurchased = false;
        do {
            hasPurchased = false;
            info.divisions.forEach(function (div) {
                div.cities.forEach(function (city) {
                    // upgrade size
                    var cost = corp.getOfficeSizeUpgradeCost(div.name, city, 6);
                    if (cost <= moneyToSpend) {
                        moneyToSpend -= cost;
                        corp.upgradeOfficeSize(div.name, city, 6);
                        hasPurchased = true;
                        ns.tprint("Upgrading " + div.name + " - " + city + " by 6");
                    }
                });
            });
        } while (hasPurchased);
    }

    function upgradeWarehouses(moneyToSpend) {
        let info = corp.getCorporation();

        let hasPurchased = false;
        do {
            hasPurchased = false;
            info.divisions.forEach(function (div) {
                div.cities.forEach(function (city) {
                    // upgrade size
                    var cost = corp.getUpgradeWarehouseCost(div.name, city);
                    if (cost <= moneyToSpend) {
                        moneyToSpend -= cost;
                        corp.upgradeWarehouse(div.name, city);
                        hasPurchased = true;
                        ns.tprint("Upgrading warehouse size for " + div.name + " - " + city);
                    }
                });
            });
        } while (hasPurchased);
    }

    function upgradeCorporation(moneyToSpend) {
        // check what can be unlocked
        // upgrade important stuff according
    }

    function setupCorporation() {
        // start software company
        // buy unlocks [Smart Supply]
        // buy upgrades ['Smart Factories': 5, 'ABC SalesBots': 5, 'Stat Boosters': 5, 'Wilson Analytics': 1, 'DreamSense':1]
        // focus on first city
        // upgrade office size to 18?
        // upgrade warehouse to 10?
        // set AI Cores to sell MAX @ MP
        //    Might be a bug where I can enable Market-TA.II
        // start developing first Software
    }

    async function hireEmployees() {
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
        let info = corp.getCorporation();

        await asyncForEach(info.divisions, async (div) => {
            await asyncForEach(div.cities, async (city) => {
                let office = corp.getOffice(div.name, city);
                let rnd = 6;
                let unit = Math.floor((office.size - rnd) / 6);
                let leftovers = office.size - rnd - (unit * 6);

                ns.tprint("Balancing " + div.name + " - " + city + " (" + office.employees.length + ")" + " - UNIT: " + unit);
                //ns.tprint("Op: " + (unit * 2) + " | En: " + (unit * 2) + ' | Bu: ' + unit + " | Ma: " + unit + " | RnD: " + rnd + " | Tr: " + leftovers);
                //ns.tprint("SIZE: " + office.size + " - TOTAL REQ: " + (unit * 6 + rnd + leftovers));
                //ns.tprint("Unit: " + unit + " | Unitx6: " + (unit * 6) + " | Rnd: " + rnd + " | Leftovers: " + leftovers);

                // Unallocate
                await corp.setAutoJobAssignment(div.name, city, 'Training', 1);
                await corp.setAutoJobAssignment(div.name, city, 'Operations', 1);
                await corp.setAutoJobAssignment(div.name, city, 'Engineer', 1);
                await corp.setAutoJobAssignment(div.name, city, 'Business', 1);
                await corp.setAutoJobAssignment(div.name, city, 'Management', 1);
                await corp.setAutoJobAssignment(div.name, city, 'Research & Development', 1);

                // Reallocate
                await corp.setAutoJobAssignment(div.name, city, 'Training', leftovers);
                await corp.setAutoJobAssignment(div.name, city, 'Operations', unit * 2);
                await corp.setAutoJobAssignment(div.name, city, 'Engineer', unit * 2);
                await corp.setAutoJobAssignment(div.name, city, 'Business', unit * 1);
                await corp.setAutoJobAssignment(div.name, city, 'Management', unit * 1);
                await corp.setAutoJobAssignment(div.name, city, 'Research & Development', rnd);

            });
            await ns.sleep(10);
        });
    }


    function displayCorp() {
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