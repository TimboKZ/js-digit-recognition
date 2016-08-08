/**
 * A class representing the unit in the neural network
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.1
 */
"use strict";
var Unit = (function () {
    /**
     * Unit constructor
     * @since 0.0.1
     */
    function Unit(value, gradient) {
        if (value === void 0) { value = 0.0; }
        if (gradient === void 0) { gradient = 0.0; }
        this.value = value;
        this.gradient = gradient;
    }
    return Unit;
}());
exports.Unit = Unit;
//# sourceMappingURL=Unit.js.map