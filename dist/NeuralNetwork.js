"use strict";
var Layer_1 = require('./Layer');
var Unit_1 = require('./Unit');
var Util_1 = require('./Util');
/**
 * File containing all classes and interfaces related to the NeuralNetwork object
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.6
 */
/**
 * The neural network class that manages Layers of Neurons
 * @since 0.0.1
 */
var NeuralNetwork = (function () {
    /**
     * NeuralNetwork constructor. Takes the amount of expected input and output values as arguments.
     * @since 0.0.6 Changed `number` to `ILayerConfiguration` in types of `outputLayer` and `hiddenLayers`
     * @since 0.0.4 Fixed a bug where the output layer would not get linked correctly
     * @since 0.0.3 Fixed a bug where layers were not interconnected
     * @since 0.0.1
     */
    function NeuralNetwork(inputCount, outputLayer, hiddenLayers) {
        if (hiddenLayers === void 0) { hiddenLayers = []; }
        var inputUnits = [];
        for (var i = 0; i < inputCount; i++) {
            inputUnits[i] = new Unit_1.Unit();
        }
        this.inputLayer = Layer_1.Layer.fromUnits(inputUnits);
        var lastLayer = this.inputLayer;
        for (var i = 0; i < hiddenLayers.length; i++) {
            var memoryLayer = lastLayer;
            lastLayer = Layer_1.Layer.fromLayer(hiddenLayers[i], lastLayer);
            memoryLayer.setNextLayer(lastLayer);
        }
        this.outputLayer = Layer_1.Layer.fromLayer(outputLayer, lastLayer);
        lastLayer.setNextLayer(this.outputLayer);
        this.inputUnits = inputUnits;
        this.outputUnits = this.outputLayer.getOutputUnits();
    }
    /**
     * Trains the network using some input data and the expected output data, adjusting the variable inputs in the
     * neurons by the step size supplied. The `outputOperation` function is applied to the output before comparing
     * it to the expected output.
     * @since 0.0.5 Now uses the sigma function to calculate the pull
     * @since 0.0.1
     */
    NeuralNetwork.prototype.trainWith = function (inputData, outputData, stepSize, outputOperation) {
        for (var i = 0; i < inputData.length; i++) {
            if (this.inputUnits[i]) {
                this.inputUnits[i].value = inputData[i];
            }
        }
        this.inputLayer.forward();
        for (var i = 0; i < outputData.length; i++) {
            var output = this.outputUnits[i].value;
            var expectedOutput = outputData[i];
            if (outputOperation) {
                output = outputOperation(output);
            }
            var pull = 0;
            var difference = Math.abs(expectedOutput - output);
            if (output < expectedOutput) {
                pull = 1 + Util_1.Util.sigma(difference);
            }
            else if (output > expectedOutput) {
                pull = -1 - Util_1.Util.sigma(difference);
            }
            this.outputUnits[i].gradient = pull;
        }
        this.outputLayer.backward(stepSize);
    };
    /**
     * Uses the network on some input data to retrieve the output, The `outputOperation` function is applied
     * to the output before returning it.
     * @since 0.0.2 Now simply returns the output instead of testing it
     * @since 0.0.1
     */
    NeuralNetwork.prototype.runWith = function (inputData, outputOperation) {
        for (var i = 0; i < inputData.length; i++) {
            if (this.inputUnits[i]) {
                this.inputUnits[i].value = inputData[i];
            }
        }
        this.inputLayer.forward();
        var outputArray = [];
        for (var i = 0; i < this.outputUnits.length; i++) {
            var output = this.outputUnits[i].value;
            if (outputOperation) {
                output = outputOperation(output);
            }
            outputArray[i] = output;
        }
        return outputArray;
    };
    return NeuralNetwork;
}());
exports.NeuralNetwork = NeuralNetwork;
//# sourceMappingURL=NeuralNetwork.js.map