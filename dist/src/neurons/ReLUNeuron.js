"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LinearNeuron_1 = require('./LinearNeuron');
/**
 * File containing all classes and interface related to ReLU neurons
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.2
 */
/**
 * ReLU neuron class
 * @since 0.0.2 Now extends LinearNeuron instead of Neuron which is now abstract
 * @since 0.0.1
 */
var ReLUNeuron = (function (_super) {
    __extends(ReLUNeuron, _super);
    function ReLUNeuron() {
        _super.apply(this, arguments);
    }
    /**
     * Applies ReLU after the forward pass of Neuron class
     * @since 0.0.2 Renamed `forward()` to `forwardLogic()` as per new architecture
     * @since 0.0.1
     */
    ReLUNeuron.prototype.forwardLogic = function () {
        _super.prototype.forwardLogic.call(this);
        this.outputUnit.value = Math.max(0, this.outputUnit.value);
    };
    /**
     * Stops the gradient backpropogation if the neuron did not fire
     * @since 0.0.2 Renamed `backward()` to `backwardLogic()` as per new architecture
     * @since 0.0.1
     */
    ReLUNeuron.prototype.backwardLogic = function (stepSize) {
        if (this.outputUnit.value === 0.0) {
            this.outputUnit.gradient = 0.0;
        }
        _super.prototype.backwardLogic.call(this, stepSize);
    };
    return ReLUNeuron;
}(LinearNeuron_1.LinearNeuron));
exports.ReLUNeuron = ReLUNeuron;
