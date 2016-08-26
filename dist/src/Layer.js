"use strict";
var Unit_1 = require('./Unit');
var InputNeuron_1 = require('./neurons/InputNeuron');
var LinearNeuron_1 = require('./neurons/LinearNeuron');
var PolynomialNeuron_1 = require('./neurons/PolynomialNeuron');
var ReLUNeuron_1 = require('./neurons/ReLUNeuron');
var SigmoidNeuron_1 = require('./neurons/SigmoidNeuron');
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
     * Generates an input layer using passive input neurons that simply relay the value of the input unit to the
     * output unit.
     * @since 0.1.0
     */
    Layer.fromInput = function (inputUnits) {
        var inputNeurons = [];
        var outputUnits = [];
        for (var i = 0; i < inputUnits.length; i++) {
            var outputUnit = new Unit_1.Unit();
            var inputNeuron = new InputNeuron_1.InputNeuron(inputUnits[i], outputUnit);
            inputNeurons.push(inputNeuron);
            outputUnits.push(outputUnit);
        }
        return new Layer(inputNeurons, outputUnits);
    };
    /**
     * Generates a layer of neurons using an array of Unit objects. Uses ILayerConfiguration object to
     * determine the type and amount of neurons used.
     * - LinearNeuron (linear neuron)
     * - PolynomialNeuron (polynomial neuron)
     * - SigmoidNeuron (log-sigmoidal neuron)
     * - ReLUNeuron (ReLU neuron)
     * @since 0.1.2 Removed leftover unused variables
     * @since 0.1.1 ReLU/Linear neurons now take all input units, added polynomial neuron support
     * @since 0.0.9 Now uses LinearNeuron since Neruon is now abstract
     * @since 0.0.8 Added ReLUNeurons
     * @since 0.0.7 Removed `typeof` keywords from switch-case statement
     * @since 0.0.5 Now accepts `previousLayer` as a parameter, ILayerConfiguration instead of `neuronType`
     * @since 0.0.4 The type of `neuronType` is now INeuronTypeParameter
     * @since 0.0.3 Renamed fromValues() to fromUnits(), now accepts `neuronType` as a parameter
     * @since 0.0.1
     */
    Layer.fromUnits = function (units, config, previousLayer) {
        var neurons = [];
        var outputUnits = [];
        switch (config.neuronType) {
            case SigmoidNeuron_1.SigmoidNeuron:
                for (var i = 0; i < units.length; i++) {
                    var variableUnit = new Unit_1.Unit(config.coefficientGenerator());
                    outputUnits[i] = new Unit_1.Unit();
                    neurons[i] = new SigmoidNeuron_1.SigmoidNeuron(units[i], outputUnits[i], variableUnit);
                }
                break;
            case PolynomialNeuron_1.PolynomialNeuron:
                for (var i = 0; i < units.length; i++) {
                    outputUnits[i] = new Unit_1.Unit();
                    neurons[i] = new PolynomialNeuron_1.PolynomialNeuron(units[i], outputUnits[i], config.degree, config.coefficientGenerator);
                }
                break;
            case ReLUNeuron_1.ReLUNeuron:
            case LinearNeuron_1.LinearNeuron:
                var neuronCount = config.neuronCount;
                for (var i = 0; i < neuronCount; i++) {
                    outputUnits[i] = new Unit_1.Unit();
                    neurons[i] = new config.neuronType(units, outputUnits[i], config.coefficientGenerator);
                }
                break;
            default:
                throw new Error('Unrecognised Neuron type supplied to the layer constructor!');
        }
        return new Layer(neurons, outputUnits, previousLayer);
    };
    /**
     * A convenience method that calls `fromUnits()` using the output units of the supplied layer as inputs.
     * @since 0.1.1 No longer contains any logic, now simply a wrapper for `fromUnits()`
     * @since 0.0.8 Added ReLUNeurons
     * @since 0.0.7 Removed `typeof` keywords from switch-case statement
     * @since 0.0.5 Now takes ILayerConfiguration instead of neuron count
     * @since 0.0.2 Added type for `variableUnits`
     * @since 0.0.1
     */
    Layer.fromLayer = function (config, previousLayer) {
        return Layer.fromUnits(previousLayer.getOutputUnits(), config, previousLayer);
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
