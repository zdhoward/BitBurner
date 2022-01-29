import { formatNumber } from '/nm/lib.js';
const BLANK = '⠐';
const EIGHT = '⣿';
const SEVEN_L = '⣷';
const SEVEN_R = '⣾';
const SIX = '⣶';
const FIVE_L = '⣦';
const FIVE_R = '⣴';
const FOUR = '⣤';
const THREE_L = '⣄';
const THREE_R = '⣠';
const TWO = '⣀';
const ONE_L = '⡀';
const ONE_R = '⢀';
// ⣿⣷⣾⣶⣦⣴⣤⣄⣠⣀⡀⢀⠐

/** @param {import("../../.").NS } ns */
export async function main(ns) {
    function createGraph(title, data, min, max, width, height) {
        let output = [];
        let curRow = 0;
        let curVal = 0;
        for (let row = 0; row < height; row++) {
            output += '\n';
            for (let col = 0; col < width; col++) {
                let scale = row / height;
                let value = data[col] / max;
                if (value > scale) {
                    if (col == data.length - 1) {
                        curRow = Math.max(height - row, 1);
                        curVal = data[col];
                    }
                    let subvalue = (value - scale) * 100;
                    if (subvalue > 4) {
                        output += EIGHT;
                    } else if (subvalue > 3) {
                        output += SIX;
                    } else if (subvalue > 2) {
                        output += FOUR;
                    } else if (subvalue > 1) {
                        output += TWO;
                    } else {
                        output += TWO;
                    }
                } else {
                    output += BLANK;
                }
            }
        }
        output = output.split('\n').reverse();

        // SMOOTH GRAPH
        for (let col = 0; col < width; col++) {
            for (let row = 1; row < height; row++) {
                if (output[row][col] != BLANK && output[row - 1][col] == BLANK) {
                    if (output[row][col] == EIGHT) {
                        if (output[row][col - 1] == BLANK && output[row][col + 1] == BLANK)
                            output[row] = output[row].replaceAt(col, SIX);
                        else if (output[row][col - 1] == BLANK)
                            output[row] = output[row].replaceAt(col, SEVEN_R);
                        else if (output[row][col + 1] == BLANK)
                            output[row] = output[row].replaceAt(col, SEVEN_L);
                    } else
                        if (output[row][col] == SIX) {
                            if (output[row][col - 1] == BLANK && output[row][col + 1] == BLANK)
                                output[row] = output[row].replaceAt(col, FOUR);
                            else if (output[row][col - 1] == BLANK)
                                output[row] = output[row].replaceAt(col, FIVE_R);
                            else if (output[row][col + 1] == BLANK)
                                output[row] = output[row].replaceAt(col, FIVE_L);
                            else if (output[row][col - 1] == EIGHT && output[row][col + 1] == EIGHT)
                                output[row] = output[row].replaceAt(col, EIGHT);
                            else if (output[row][col - 1] == EIGHT)
                                output[row] = output[row].replaceAt(col, SEVEN_L);
                            else if (output[row][col + 1] == BLANK)
                                output[row] = output[row].replaceAt(col, SEVEN_R);
                        } else
                            if (output[row][col] == FOUR) {
                                if (output[row][col - 1] == BLANK && output[row][col + 1] == BLANK)
                                    output[row] = output[row].replaceAt(col, TWO);
                                else if (output[row][col - 1] == BLANK)
                                    output[row] = output[row].replaceAt(col, THREE_R);
                                else if (output[row][col + 1] == BLANK)
                                    output[row] = output[row].replaceAt(col, THREE_L);
                                else if (output[row][col - 1] == EIGHT && output[row][col + 1] == EIGHT)
                                    output[row] = output[row].replaceAt(col, SIX);
                                else if (output[row][col - 1] == EIGHT)
                                    output[row] = output[row].replaceAt(col, FIVE_L);
                                else if (output[row][col + 1] == BLANK)
                                    output[row] = output[row].replaceAt(col, FIVE_R);
                            } else
                                if (output[row][col] == TWO) {
                                    if (output[row][col - 1] == BLANK && output[row][col + 1] == BLANK)
                                        output[row] = output[row].replaceAt(col, BLANK);
                                    else if (output[row][col - 1] == BLANK)
                                        output[row] = output[row].replaceAt(col, ONE_R);
                                    else if (output[row][col + 1] == BLANK)
                                        output[row] = output[row].replaceAt(col, ONE_L);
                                    else if (output[row][col - 1] == EIGHT && output[row][col + 1] == EIGHT)
                                        output[row] = output[row].replaceAt(col, FOUR);
                                    else if (output[row][col - 1] == EIGHT)
                                        output[row] = output[row].replaceAt(col, THREE_L);
                                    else if (output[row][col + 1] == BLANK)
                                        output[row] = output[row].replaceAt(col, THREE_R);
                                }
                }
            }
        }

        //add labels
        output[0] += " == " + formatNumber(max);
        output[output.length - 2] += " == " + formatNumber(min);
        output[curRow] += " -> " + formatNumber(curVal);

        return "\t\t\t\t\t" + title + "\n" + output.join('\n');
    }

    function graph(title, newData) {
        // Dynamically adjust scale
        if (newData < lowest)
            lowest = newData;
        if (newData > highest)
            highest = newData;

        graphingData.shift();
        graphingData.push(newData);
        let output = createGraph(title, graphingData, lowest, highest, width, height);
        ns.clearLog();
        ns.print(output);
    }

    // INIT GRAPH //
    ns.disableLog("ALL");

    let graphingData = [];
    let lowest = 0;
    let highest = 0;

    let width = 70;
    let height = 25;

    graphingData = [];
    for (let i = 0; i < width; i++)
        graphingData.push(0);

    // RUN GRAPH //
    while (true) {
        //graph('RNG (0-100)', Math.floor(Math.random() * 100));
        graph("Income / sec", ns.getScriptIncome()[0]);
        await ns.sleep(1000);
    }


}

String.prototype.replaceAt = function (index, char) {
    let a = this.split("");
    a[index] = char;
    return a.join("");
}