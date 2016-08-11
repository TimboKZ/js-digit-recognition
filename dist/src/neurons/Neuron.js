"use strict";
/**
 * File containing classes and interfaces for the base linear Neuron
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.1.1
 */
/**
 * Class representing the base neuron, used in hidden layers
 * @since 0.1.1 Class is now abstract and represent a generic neuron implementation
 * @since 0.0.1
 */
var Neuron = (function () {
    /**
     * Neuron constructor
     * @since 0.1.1 Rename `variables` to `variableUnits`, set its default value to empty array
     * @since 0.0.2 outputUnit is now an injected dependency
     * @since 0.0.1
     */
    function Neuron(inputUnits, outputUnit, variableUnits) {
        if (variableUnits === void 0) { variableUnits = []; }
        this.inputUnits = inputUnits;
        this.outputUnit = outputUnit;
        this.variableUnits = variableUnits;
    }
    /**
     * Method that can be called externally to trigger the forward pass logic, clearing the output unit gradient
     * before hand.
     * @since 0.1.1 No longer contains logic apart from clearing the output unit gradient and calling forwardLogic()
     * @since 0.0.9 Forward pass now resets gradients
     * @since 0.0.8 Removed ReLU
     * @since 0.0.6 Added ReLU
     * @since 0.0.4 Fixed a bug where `i` would be compared to Unit[]
     * @since 0.0.1
     */
    Neuron.prototype.forward = function () {
        this.outputUnit.gradient = 0;
        this.forwardLogic();
    };
    ;
    /**
     * Method that can be called externally to trigger the backward pass logic of the child class neuron. Does not
     * do anything else as of v0.1.1 but is left here for future use.
     * @since 0.1.1 No longer contains logic apart from calling backwardLogic()
     * @since 0.1.0 Setup proper back-propagation to the input units
     * @since 0.0.9 Added `adjustment`
     * @since 0.0.8 Removed ReLU
     * @since 0.0.6 Minor tweaks to logic
     * @since 0.0.5 Added a rectifier for inputUnit.gradient
     * @since 0.0.4 Fixed a bug where `i` would be compared to Unit[]
     * @since 0.0.3 stepSize is now optional
     * @since 0.0.1
     */
    Neuron.prototype.backward = function (stepSize) {
        this.backwardLogic(stepSize);
    };
    return Neuron;
}());
exports.Neuron = Neuron;
