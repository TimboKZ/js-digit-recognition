"use strict";
var Layer_1 = require('./Layer');
var Unit_1 = require('./Unit');
/**
 * File containing all classes and interfaces related to the NeuralNetwork object
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.2
 */
/**
 * The neural network class that manages Layers of Neurons
 * @since 0.0.1
 */
var NeuralNetwork = (function () {
    /**
     * NeuralNetwork constructor. Takes the amount of expected input and output values as arguments.
     * @since 0.0.1
     */
    function NeuralNetwork(inputCount, outputCount, hiddenLayers) {
        if (hiddenLayers === void 0) { hiddenLayers = []; }
        var inputUnits = [];
        for (var i = 0; i < inputCount; i++) {
            inputUnits[i] = new Unit_1.Unit();
        }
        this.inputLayer = Layer_1.Layer.fromValues(inputUnits);
        var lastLayer = this.inputLayer;
        for (var i = 0; i < hiddenLayers.length; i++) {
            lastLayer = Layer_1.Layer.fromLayer(hiddenLayers[i], lastLayer);
        }
        this.outputLayer = Layer_1.Layer.fromLayer(outputCount, lastLayer);
        this.inputUnits = inputUnits;
        this.outputUnits = this.outputLayer.getOutputUnits();
    }
    /**
     * Trains the network using some input data and the expected output data, adjusting the variable inputs in the
     * neurons by the step size supplied. The `outputOperation` function is applied to the output before comparing
     * it to the expected output.
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
            if (output < expectedOutput) {
                pull = 1;
            }
            else if (output > expectedOutput) {
                pull = -1;
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