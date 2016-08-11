"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Util_1 = require('../Util');
var Neuron_1 = require('./Neuron');
/**
 * File containing all methods and functions related to the log-sigmoidal neuron
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.4
 */
/**
 * Class representing the log-sigmoidal neuron
 * @since 0.0.1
 */
var SigmoidNeuron = (function (_super) {
    __extends(SigmoidNeuron, _super);
    /**
     * SigmoidNeuron constructor. Similar to that of the base Neuron class but accepts singular object instead of
     * arrays
     * @since 0.0.2 Now uses super()
     * @since 0.0.1
     */
    function SigmoidNeuron(inputUnit, outputUnit, variable) {
        _super.call(this, [inputUnit], outputUnit, [variable]);
    }
    /**
     * Forward pass logic. Uses sigmoid function on a single input to calculate the output
     * @since 0.0.4 Renamed `forward()` to `forwardLogic()` as per new architecture
     * @since 0.0.1
     */
    SigmoidNeuron.prototype.forwardLogic = function () {
        this.outputUnit.value = this.sigmaWrapper();
    };
    /**
     * Backdrops the gradient of the output unit to the input unit by multiplying it with the derivative of the
     * sigmoid function. Then adjusts the value of the stored variable unit.
     * @since 0.0.4 Renamed `backward()` to `backwardLogic()` as per new architecture
     * @since 0.0.3 Remove leftover debug code
     * @since 0.0.2 Fixed incorrect variable being used
     * @since 0.0.1
     */
    SigmoidNeuron.prototype.backwardLogic = function (stepSize) {
        var sigmaValue = this.sigmaWrapper();
        var gradient = this.variableUnits[0].value * sigmaValue * (1 - sigmaValue);
        this.inputUnits[0].gradient = gradient * this.outputUnit.gradient;
        if (stepSize) {
            this.variableUnits[0].value += stepSize * this.variableUnits[0].gradient;
        }
    };
    /**
     * Function calculating sigma multiplying the input value by a coefficient stored in the variable unit
     * @since 0.0.1
     */
    SigmoidNeuron.prototype.sigmaWrapper = function () {
        return Util_1.Util.sigma(this.inputUnits[0].value * this.variableUnits[0].value);
    };
    return SigmoidNeuron;
}(Neuron_1.Neuron));
exports.SigmoidNeuron = SigmoidNeuron;
//# sourceMappingURL=SigmoidNeuron.js.map