"use strict";
var Unit_1 = require('./Unit');
var Neuron_1 = require('./neurons/Neuron');
var SigmoidalNeuron_1 = require('./neurons/SigmoidalNeuron');
/**
 * File containing all interfaces and classes related to the representation of a Neuron layer
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.3
 */
/**
 * Class representing the base layer, used mostly for hidden layers
 * @since 0.0.1
 */
var Layer = (function () {
    /**
     * Layer constructor.
     * @since 0.0.2 Removed `private` access modifier
     * @since 0.0.1
     */
    function Layer(neurons, outputUnits, previousLayer) {
        this.neurons = neurons;
        this.outputUnits = outputUnits;
        if (previousLayer) {
            this.previousLayer = previousLayer;
        }
    }
    /**
     * Generates a layer of neurons using an array of Units. Each unit is mapped 1-to-1 with a single Neuron.
     * `neuronType` supplied determines the types of Neurons that will be used to populate this layer. Available
     * types of neurons are:
     * - Neuron (linear neuron)
     * - SigmoidalNeuron (log-sigmoidal neuron)
     * @since 0.0.3 Renamed fromValues() to fromUnits(), now accepts `neuronType` as a parameter
     * @since 0.0.1
     */
    Layer.fromUnits = function (units, neuronType) {
        if (neuronType === void 0) { neuronType = typeof Neuron_1.Neuron; }
        var neurons = [];
        var outputUnits = [];
        for (var i = 0; i < units.length; i++) {
            outputUnits[i] = new Unit_1.Unit();
            var variableUnits = new Unit_1.Unit(1.0);
            switch (neuronType) {
                case typeof SigmoidalNeuron_1.SigmoidalNeuron:
                    neurons[i] = new SigmoidalNeuron_1.SigmoidalNeuron(units[i], outputUnits[i], variableUnits);
                    break;
                case typeof Neuron_1.Neuron:
                    neurons[i] = new Neuron_1.Neuron(units.slice(i, i + 1), outputUnits[i], [variableUnits]);
                    break;
                default:
                    throw new Error('Unrecognised Neuron type supplied to the layer constructor!');
            }
        }
        return new Layer(neurons, outputUnits);
    };
    /**
     * Generates a layer of neurons using the previous layer as the input provider and the neuron count supplied. If
     * neuronCount is 1 this layer can be considered an output layer. The value for the variable units is determined
     * randomly in range from 0.5 to -0.5
     * @since 0.0.2 Added type for `variableUnits`
     * @since 0.0.1
     */
    Layer.fromLayer = function (neuronCount, previousLayer) {
        var neurons = [];
        var outputUnits = [];
        for (var i = 0; i < neuronCount; i++) {
            outputUnits[i] = new Unit_1.Unit();
            var variableUnits = [];
            var inputUnitsLength = previousLayer.getOutputUnits().length;
            for (var k = 0; k < inputUnitsLength + 1; k++) {
                variableUnits.push(new Unit_1.Unit((Math.random() - 0.5) / 4));
            }
            neurons[i] = new Neuron_1.Neuron(previousLayer.getOutputUnits(), outputUnits[i], variableUnits);
        }
        return new Layer(neurons, outputUnits, previousLayer);
    };
    /**
     * Trigger the forward pass. Runs the forward pass on all of the neurons in the layer forcing them to update the
     * `outputUnits` array. When the pass is complete, triggers the forward pass in the next layer.
     * @since 0.0.1
     */
    Layer.prototype.forward = function () {
        for (var i = 0; i < this.neurons.length; i++) {
            this.neurons[i].forward();
        }
        if (this.nextLayer) {
            this.nextLayer.forward();
        }
    };
    /**
     * Triggers a backward pass. Causes all of the neurons in the layer to backdrop the gradients of the output and
     * input units. If the current layer is not an input layer, also causes the neurons to
     * adjust their variable units.
     * @since 0.0.1
     */
    Layer.prototype.backward = function (stepSize) {
        for (var i = 0; i < this.neurons.length; i++) {
            if (this.previousLayer) {
                this.neurons[i].backward(stepSize);
            }
            else {
                this.neurons[i].backward();
            }
        }
    };
    /**
     * Setter for nextLayer, used by the NeuralNetwork class
     * @since 0.0.1
     */
    Layer.prototype.setNextLayer = function (layer) {
        this.nextLayer = layer;
    };
    /**
     * Output units getter, used by the next layer or to extract the result from output layer
     * @since 0.0.1
     */
    Layer.prototype.getOutputUnits = function () {
        return this.outputUnits;
    };
    return Layer;
}());
exports.Layer = Layer;
//# sourceMappingURL=Layer.js.map