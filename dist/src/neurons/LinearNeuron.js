"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Unit_1 = require('../Unit');
var Util_1 = require('../Util');
var Neuron_1 = require('./Neuron');
/**
 * File containing the implementation of a basic linear neuron
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.1
 */
/**
 * Class representing a linear neuron whose activation function is a simple linear combination of inputs plus a bias
 * term.
 * @since 0.0.1
 */
var LinearNeuron = (function (_super) {
    __extends(LinearNeuron, _super);
    /**
     * LinearNeuron constructor. Note how the bias unit is added automatically in the end of the variables array,
     * hence does not have to be passed into the constructor.
     * @since 0.0.1
     */
    function LinearNeuron(inputUnits, outputUnit, coefficientGenerator, biasGenerator) {
        if (coefficientGenerator === void 0) { coefficientGenerator = function () { return Util_1.Util.randomInRage(-0.5, 0.5); }; }
        if (biasGenerator === void 0) { biasGenerator = function () { return 1.0; }; }
        var variableUnits = [];
        for (var i = 0; i < inputUnits.length; i++) {
            variableUnits[i] = new Unit_1.Unit(coefficientGenerator());
        }
        var biasUnit = new Unit_1.Unit(biasGenerator());
        variableUnits.push(biasUnit);
        _super.call(this, inputUnits, outputUnit, variableUnits);
    }
    /**
     * Logic for the forward pass of the neuron. That activation function is a simple linear combination of weighted
     * inputs plus the bias unit.
     * @since 0.0.1
     */
    LinearNeuron.prototype.forwardLogic = function () {
        var output = 0;
        for (var i = 0; i < this.variableUnits.length; i++) {
            var variableUnit = this.variableUnits[i];
            variableUnit.gradient = 0.0;
            var coefficient = 1.0;
            if (this.inputUnits[i]) {
                coefficient = this.inputUnits[i].value;
            }
            output += coefficient * variableUnit.value;
        }
        this.outputUnit.value = output;
    };
    /**
     * Logic for the backward pass, first backdrops the gradients to the input units and then adjusts the stored
     * variable units using the step size (if it is provided).
     * @since 0.0.1
     */
    LinearNeuron.prototype.backwardLogic = function (stepSize) {
        for (var i = 0; i < this.variableUnits.length; i++) {
            var variableUnit = this.variableUnits[i];
            var coefficient = 1.0;
            var adjustment = 0.0;
            if (this.inputUnits[i]) {
                coefficient = this.inputUnits[i].value;
                adjustment = variableUnit.value;
            }
            variableUnit.gradient += coefficient * this.outputUnit.gradient - adjustment;
            if (this.inputUnits[i]) {
                this.inputUnits[i].gradient = variableUnit.value * this.outputUnit.gradient;
            }
            if (stepSize) {
                variableUnit.value += stepSize * variableUnit.gradient;
            }
        }
    };
    return LinearNeuron;
}(Neuron_1.Neuron));
exports.LinearNeuron = LinearNeuron;
