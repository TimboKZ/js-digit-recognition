/**
 * File containing util methods and classes that do not fit into other files
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.3
 */
"use strict";
/**
 *
 * @since 0.0.1
 */
var Util = (function () {
    function Util() {
    }
    /**
     * Sigma function that maps all integers into (0, 1)
     * @since 0.0.1
     */
    Util.sigma = function (x) {
        return 1 / (1 + Math.exp(-x));
    };
    /**
     * Logs NN test output
     * @since 0.0.2
     */
    Util.logTest = function (output) {
        if (output === void 0) { output = ''; }
        var colors = require('colors');
        var prefix = colors.yellow('[TEST] ');
        if (typeof output === 'string') {
            console.log(prefix + output);
        }
        else {
            output.forEach(function (outputString) {
                console.log(prefix + outputString);
            });
        }
    };
    /**
     * Generate a random number in specified range.
     * @since 0.0.3
     */
    Util.randomInRage = function (min, max, integersOnly) {
        if (integersOnly === void 0) { integersOnly = false; }
        if (integersOnly) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
        return Math.random() * (max - min) + min;
    };
    return Util;
}());
exports.Util = Util;
