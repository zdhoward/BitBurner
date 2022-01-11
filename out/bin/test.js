import { generateIPs } from '/bin/contracts.js';

/** @param {NS} ns **/
export async function main(ns) {
    var msg = 'Hello World';
    var payloadInfo = { hostname: 'test-server', msg: 'Hello World' };
    msg = JSON.stringify(payloadInfo);
    ns.tryWritePort(20, msg);
}

function contract_main(ns) {
    var data = '(a)())()'; //'(()()aa(a)()(';
    var validate = ['(a)()()', '(a())()'];
    ns.tprint('DATA: ' + data);
    var result = sanitizeParenthesis(data);
    ns.tprint('RESULT: ' + result);
    ns.tprint("VALIDATE: " + validate);
}

function sanitizeParenthesis(data) {
    function isParenthesis(char) {
        return char == '(' || char == ')';
    }

    function isValid(str) {
        var cnt = 0;

        for (var i = 0; i < str.length; i++) {
            if (str[i] == '(')
                cnt++;
            else if (str[i] == ')')
                cnt--;
            if (cnt < 0)
                return false;
        }

        return (cnt == 0);
    }

    function removeInvalidParenthesis(str) {
        var results = [];
        if (str.length == 0)
            return;

        var visited = new Set();

        var queue = [];
        var temp;
        var level = false;

        queue.push(str);
        visited.add(str);

        while (queue.length != 0) {
            str = queue.shift();
            if (isValid(str)) {
                //ns.tprint('VALID: ' + str);
                results.push(str);

                level = true;
            }
            if (level)
                continue;
            for (var i = 0; i < str.length; i++) {
                if (!isParenthesis(str[i]))
                    continue;

                temp = str.substring(0, i) + str.substring(i + 1);

                if (!visited.has(temp)) {
                    queue.push(temp);
                    visited.add(temp);
                }
            }
        }
        return results;
    }

    return removeInvalidParenthesis(data);
}
