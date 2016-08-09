/**
 * File containing util methods and classes that do not fit into other files
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.1
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
    return Util;
}());
exports.Util = Util;
//# sourceMappingURL=Util.js.map