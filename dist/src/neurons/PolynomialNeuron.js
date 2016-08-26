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
 * File containing the implementation of a polynomial
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.1
 */
/**
 * Class representing a polynomial neuron whose activation function is a polynomial of the degree specified in the constructor.
 * @since 0.0.1
 */
var PolynomialNeuron = (function (_super) {
    __extends(PolynomialNeuron, _super);
    /**
     * LinearNeuron constructor. Note how the bias unit is added automatically in the end of the variables array,
     * hence does not have to be passed into the constructor.
     * @since 0.0.1
     */
    function PolynomialNeuron(inputUnit, outputUnit, degree, coefficientGenerator, biasGenerator) {
        if (coefficientGenerator === void 0) { coefficientGenerator = function () { return Util_1.Util.randomInRage(-0.5, 0.5); }; }
        if (biasGenerator === void 0) { biasGenerator = function () { return 1.0; }; }
        var variableUnits = [];
        for (var i = 0; i < degree; i++) {
            variableUnits[i] = new Unit_1.Unit(coefficientGenerator());
        }
        var biasUnit = new Unit_1.Unit(biasGenerator());
        variableUnits.unshift(biasUnit);
        _super.call(this, [inputUnit], outputUnit, variableUnits);
    }
    /**
     * Logic for the forward pass of the neuron. The activation function is a polynomial which degree is equal to
     * `this.variableUnits.length - 1`
     * @since 0.0.1
     */
    PolynomialNeuron.prototype.forwardLogic = function () {
        var input = this.inputUnits[0].value;
        var output = 0;
        for (var i = 0; i < this.variableUnits.length; i++) {
            var variableUnit = this.variableUnits[i];
            variableUnit.gradient = 0.0;
            var coefficient = input;
            if (i === 0) {
                coefficient = 1.0;
            }
            output += Math.pow(coefficient, i) * variableUnit.value;
        }
        this.outputUnit.value = output;
    };
    /**
     * Logic for the backward pass, first backdrops the gradients to the input units and then adjusts the stored
     * variable units using the step size (if it is provided).
     * @since 0.0.1
     */
    PolynomialNeuron.prototype.backwardLogic = function (stepSize) {
        for (var i = 0; i < this.variableUnits.length; i++) {
            var variableUnit = this.variableUnits[i];
            var coefficient = 1.0;
            var adjustment = 0.0;
            if (i !== 0) {
                coefficient = i * Math.pow(this.inputUnits[0].value, i - 1);
                adjustment = variableUnit.value;
            }
            variableUnit.gradient += coefficient * this.outputUnit.gradient - adjustment;
            if (i !== 0) {
                this.inputUnits[i].gradient = variableUnit.value * this.outputUnit.gradient;
            }
            if (stepSize) {
                variableUnit.value += stepSize * variableUnit.gradient;
            }
        }
    };
    return PolynomialNeuron;
}(Neuron_1.Neuron));
exports.PolynomialNeuron = PolynomialNeuron;
