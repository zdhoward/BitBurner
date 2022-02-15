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

    if (!ns.getPlayer().hasCorporation) {
        setupCorporation();
    } else {

        let funds = corp.getCorporation().funds;

        setPrices();
        corp.issueDividends(0.10);

        //upgradeCorporation(funds * 0.3);
        upgradeOffices(funds); // * 0.65);
        upgradeWarehouses(funds * 0.05);

        await hireEmployees();
        await balanceAutoEmployees();

        ns.tprint("corp.js is done");
    }

    function setupCorporation() {
        ns.tprint("Setting up a corporation...");

        // start software company
        ns.tprint("Starting the software company...");
        let selfFund = ns.getPlayer().money > 150e9 ? true : false;
        corp.createCorporation("ZxCorp", selfFund);
        corp.expandIndustry("Software", "ZxSoft");

        // Expand To All Cities
        ns.tprint("Expanding to all cities...");
        corp.expandCity("ZxSoft", "Aevum");
        corp.expandCity("ZxSoft", "Chongqing");
        corp.expandCity("ZxSoft", "New Tokyo");
        corp.expandCity("ZxSoft", "Ishima");
        corp.expandCity("ZxSoft", "Volhaven");

        // upgrade office sizes to 6
        ns.tprint("OFFICES NEED TO BE MANUALLY UPGRADED TO 6 EMPLOYEES");
        ns.tprint("NO OFFICE API TO DO THIS AUTOMATICALLY");
        ns.tprint("ASSIGN 2 TO EACH: Operations, Engineer, R&D");

        // buy unlocks [Smart Supply]
        corp.unlockUpgrade("Smart Supply");

        // upgrade warehouses a bunch for insurance fraud
        ns.tprint("WAREHOUSES NEED TO BE MANUALLY UPGRADED A LOT FOR INSURANCE FRAUD");
        ns.tprint("NO WAREHOUSE API TO DO THIS AUTOMATICALLY");

        // buy upgrades ['Smart Factories': 5, 'ABC SalesBots': 5, 'Stat Boosters': 5, 'Wilson Analytics': 1, 'DreamSense':1]

        // set AI Cores to sell MAX @ MP
        //    Might be a bug where I can enable Market-TA.II
        // start developing first Software
    }

    function insuranceFraud() {
        // purchase a certain amount of warehouse space
        // stockpile best quality product or output until warehouse is full
        // sell all products @ MP
        // wait a couple seconds
        // get investors
    }

    function buyShares() {
        // if public, buy as many shares as possible
    }

    function expandIndustries() {
        // SOFTWARE FIRST
        // TOBACCO SECOND
        // ROBOTS THIRD
    }

    function expandCities(divName) {
        // if money is available
        // expand to as many cities as possible
        // upgrade office size
        // set prices
        // hire employees
        // start developing product
    }

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
                    corp.setMaterialMarketTA2(div.name, city, output.type, false);
                    corp.sellMaterial(div.name, city, output.type, "MAX", "MP", false);
                    corp.setMaterialMarketTA2(div.name, city, output.type, true);
                });

                div.products.forEach(function (product) {
                    corp.setProductMarketTA2(div.name, product, false);
                    corp.sellProduct(div.name, city, product, "MAX", "MP", true);
                    corp.setProductMarketTA2(div.name, product, true);
                });
            });
        });

    }

    function upgradeOffices(moneyToSpend) {
        ns.tprint('Upgrading Office Sizes with $' + moneyToSpend);
        let info = corp.getCorporation();

        let offices = {};

        let currentMaxSize = 0;
        info.divisions.forEach(function (div) {
            offices[div.name] = {};
            div.cities.forEach(function (city) {
                let size = corp.getOffice(div.name, city).size;
                offices[div.name][city] = size;
                if (size > currentMaxSize)
                    currentMaxSize = size;
            });
        });

        Object.keys(offices).forEach(function (div) {
            Object.keys(offices[div]).forEach(function (city) {
                if (offices[div][city] < currentMaxSize) {
                    let cost = corp.getOfficeSizeUpgradeCost(div, city, 6);
                    while (moneyToSpend > cost && offices[div][city] < currentMaxSize) {
                        corp.upgradeOfficeSize(div, city, 6);
                        //ns.tprint('Upgrading ' + div + ' - ' + city + ' Office to ' + (offices[div][city] + 6));
                        moneyToSpend -= cost;
                        offices[div][city] += 6;
                        cost = corp.getOfficeSizeUpgradeCost(div, city, 6);
                    }
                }
            });
        });
    }

    function upgradeWarehouses(moneyToSpend) {
        ns.tprint('Upgrading Warehouse Sizes with $' + moneyToSpend);
        let info = corp.getCorporation();

        let warehouses = {};

        let currentMaxLevel = 0;
        info.divisions.forEach(function (div) {
            warehouses[div.name] = {};
            div.cities.forEach(function (city) {
                let level = corp.getWarehouse(div.name, city).level;
                warehouses[div.name][city] = level;
                if (level > currentMaxLevel)
                    currentMaxLevel = level;
            });
        });

        Object.keys(warehouses).forEach(function (div) {
            Object.keys(warehouses[div]).forEach(function (city) {
                if (warehouses[div][city] < currentMaxLevel) {
                    let cost = corp.getUpgradeWarehouseCost(div, city);
                    while (moneyToSpend > cost && warehouses[div][city] < currentMaxLevel) {
                        corp.upgradeWarehouse(div, city);
                        //ns.tprint('Upgrading ' + div + ' - ' + city + ' Warehouse to ' + (warehouses[div][city] + 1));
                        moneyToSpend -= cost;
                        warehouses[div][city]++;
                        cost = corp.getUpgradeWarehouseCost(div, city);
                    }
                }
            });
        });
    }

    function upgradeCorporation(moneyToSpend) {
        // check what can be unlocked
        //corp.hasUnlockUpgrade('Smart Supply');
        // corp.unlockUpgrade('Smart Supply');

        // upgrade important stuff according
        //corp.getUpgradeLevelCost('Smart Factories');
        //corp.levelUpgrade('Smart Factories');
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
                await corp.setAutoJobAssignment(div.name, city, 'Operations', 1);
                await corp.setAutoJobAssignment(div.name, city, 'Engineer', 1);
                await corp.setAutoJobAssignment(div.name, city, 'Business', 1);
                await corp.setAutoJobAssignment(div.name, city, 'Management', 1);
                await corp.setAutoJobAssignment(div.name, city, 'Research & Development', 1);
                await corp.setAutoJobAssignment(div.name, city, 'Training', 1);

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