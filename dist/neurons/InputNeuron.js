"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Neuron_1 = require('./Neuron');
/**
 * File representing the implementation of an input neuron.
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.1
 */
/**
 * A very simple passive neuron that simple relays the input value to the output value.
 * @since 0.0.1
 */
var InputNeuron = (function (_super) {
    __extends(InputNeuron, _super);
    /**
     * InputNeuron constructor. Accepts a single input unit and an output unit to which the value will be relayed.
     * Does not accept any variable units since the input value will not be processed before relaying it further.
     * @since 0.0.1
     */
    function InputNeuron(inputUnit, outputUnit) {
        _super.call(this, [inputUnit], outputUnit);
    }
    /**
     * Simply relay the value of the input to the output unit.
     * @since 0.0.1
     */
    InputNeuron.prototype.forwardLogic = function () {
        this.outputUnit.value = this.inputUnits[0].value;
    };
    return InputNeuron;
}(Neuron_1.Neuron));
exports.InputNeuron = InputNeuron;
//# sourceMappingURL=InputNeuron.js.map