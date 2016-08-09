"use strict";
var Unit_1 = require('./Unit');
var Neuron_1 = require('./neurons/Neuron');
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
     * Generates a layer of neurons using an array of Units. Each unit is mapped 1-to-1 with a single Neuron.
     * `neuronType` supplied determines the types of Neurons that will be used to populate this layer. Available
     * types of neurons are:
     * - Neuron (linear neuron)
     * - SigmoidNeuron (log-sigmoidal neuron)
     * @since 0.0.7 Removed `typeof` keywords from switch-case statement
     * @since 0.0.5 Now accepts `previousLayer` as a parameter, ILayerConfiguration instead of `neuronType`
     * @since 0.0.4 The type of `neuronType` is now INeuronTypeParameter
     * @since 0.0.3 Renamed fromValues() to fromUnits(), now accepts `neuronType` as a parameter
     * @since 0.0.1
     */
    Layer.fromUnits = function (units, config, previousLayer) {
        var neurons = [];
        var outputUnits = [];
        for (var i = 0; i < units.length; i++) {
            outputUnits[i] = new Unit_1.Unit();
            var variableUnits = new Unit_1.Unit(config.coefficientGenerator());
            switch (config.neuronType) {
                case SigmoidNeuron_1.SigmoidNeuron:
                    neurons[i] = new SigmoidNeuron_1.SigmoidNeuron(units[i], outputUnits[i], variableUnits);
                    break;
                case Neuron_1.Neuron:
                    neurons[i] = new Neuron_1.Neuron(units.slice(i, i + 1), outputUnits[i], [variableUnits]);
                    break;
                default:
                    throw new Error('Unrecognised Neuron type supplied to the layer constructor!');
            }
        }
        return new Layer(neurons, outputUnits, previousLayer);
    };
    /**
     * Generates a layer of neurons using the previous layer as the input provider and the layer configuration
     * supplied. The value for the variable units is determined randomly, check the code to see how the value for
     * variable `coefficient` is calculated.
     * @since 0.0.7 Removed `typeof` keywords from switch-case statement
     * @since 0.0.5 Now takes ILayerConfiguration instead of neuron count
     * @since 0.0.2 Added type for `variableUnits`
     * @since 0.0.1
     */
    Layer.fromLayer = function (config, previousLayer) {
        switch (config.neuronType) {
            case SigmoidNeuron_1.SigmoidNeuron:
                return Layer.fromUnits(previousLayer.getOutputUnits(), config, previousLayer);
            case Neuron_1.Neuron:
                var neurons = [];
                var outputUnits = [];
                var neuronCount = config.neuronCount;
                for (var i = 0; i < neuronCount; i++) {
                    outputUnits[i] = new Unit_1.Unit();
                    var variableUnits = [];
                    var inputUnitsLength = previousLayer.getOutputUnits().length;
                    for (var k = 0; k < inputUnitsLength + 1; k++) {
                        variableUnits.push(new Unit_1.Unit(config.coefficientGenerator()));
                    }
                    neurons[i] = new Neuron_1.Neuron(previousLayer.getOutputUnits(), outputUnits[i], variableUnits);
                }
                return new Layer(neurons, outputUnits, previousLayer);
            default:
                throw new Error('Unrecognised Neuron type supplied to the layer constructor!');
        }
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