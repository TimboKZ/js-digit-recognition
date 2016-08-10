"use strict";
var DataParser_1 = require('./DataParser');
var NeuralNetwork_1 = require('./NeuralNetwork');
var Util_1 = require('./Util');
/**
 * A file containing all interfaces and classes related to the classifier matching images of handwritten digits to
 * their integer representation.
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.6
 */
/**
 * Scales the output of the NeuralNetwork, i.e. if your expected output is 8 and `MODIFIER` is 5, neural network
 * will be trained to output 40 when the expected output is 5. Modifier is also applied during testing to scale down
 * the answer.
 * @since 0.0.2
 */
var MODIFIER = 0.5;
/**
 * Class responsible for setting up, testing and training a neural network
 * @since 0.0.1
 */
var DigitClassifier = (function () {
    /**
     * DigitClassifier constructor, mirrors that of a NeuralNetwork, except output count is always
     * @since 0.0.5 Now stores `outputLayer` in
     * @since 0.0.4 Output layer is now an injected dependency
     * @since 0.0.3 Now uses the ILayerConfiguration interface
     * @since 0.0.1
     */
    function DigitClassifier(inputCount, outputLayer, hiddenLayers) {
        if (hiddenLayers === void 0) { hiddenLayers = []; }
        this.outputLayerConfig = outputLayer;
        this.neuralNetwork = new NeuralNetwork_1.NeuralNetwork(inputCount, outputLayer, hiddenLayers);
    }
    /**
     * Tests the classifier with the provided set of digit matrices, returns the accuracy of guesses over said set.
     * Prints each test case if `print` is set to true.
     * @since 0.0.6 Add support for multiple output neurons
     * @since 0.0.3 Replace all `var` with `let` keywords
     * @since 0.0.2 Now uses `MODIFIER` constant
     * @since 0.0.1
     */
    DigitClassifier.prototype.test = function (digitMatrices, outputOperation, print) {
        var _this = this;
        if (outputOperation === void 0) { outputOperation = function (output) { return output; }; }
        if (print === void 0) { print = false; }
        var correctGuesses = 0;
        digitMatrices.forEach(function (matrix) {
            var outputs = _this.neuralNetwork.runWith(matrix.matrix);
            var neuronsFired = [];
            for (var i = 0; i < outputs.length; i++) {
                if (outputOperation(outputs[i]) > MODIFIER / 2) {
                    neuronsFired.push(i);
                }
            }
            var singleNeuron = neuronsFired.length === 1;
            var correct = singleNeuron && neuronsFired[0] === matrix.digit;
            if (correct) {
                correctGuesses++;
            }
            if (print) {
                var colors = require('colors/safe');
                console.log();
                var expected = 'Expected ---> ' + colors.green(matrix.digit);
                var outputString = neuronsFired.toString();
                var actual = 'Actual ---> ' + (correct ? colors.green(outputString) : colors.red(outputString));
                Util_1.Util.logTest('Output:    ' + expected + '    ' + actual);
                Util_1.Util.logTest();
                var result = 'CORRECT GUESS';
                if (correct) {
                    result = colors.green(result);
                }
                else {
                    result = colors.red('IN' + result);
                }
                Util_1.Util.logTest(result);
                Util_1.Util.logTest();
                Util_1.Util.logTest('Sigmoid neuron outputs:');
                Util_1.Util.logTest();
                for (var i = 0; i < outputs.length; i++) {
                    var neuronIndex = colors.cyan(i);
                    var neuronOutput = outputs[i];
                    var neuronDisplayOutput = colors.cyan(neuronOutput.toFixed(2));
                    if (neuronsFired.indexOf(i) !== -1) {
                        neuronDisplayOutput += ' <';
                    }
                    Util_1.Util.logTest(neuronIndex + ' ---> ' + neuronDisplayOutput);
                }
                Util_1.Util.logTest();
                Util_1.Util.logTest('Image of the digit:');
                Util_1.Util.logTest();
                DataParser_1.DataParser.printImage(matrix.matrix, Util_1.Util.logTest);
                console.log();
            }
        });
        return correctGuesses / digitMatrices.length;
    };
    /**
     * Trains the neural network using provided set of matrices. Repeats the process `iterationCount` times.
     * @since 0.0.6 Change the way expected output is generated
     * @since 0.0.5 Now works with output layers with neuron count higher than 1
     * @since 0.0.2 Now uses `MODIFIER` constant
     * @since 0.0.1
     */
    DigitClassifier.prototype.train = function (digitMatrices, stepSize, iterationCount) {
        var _this = this;
        for (var i = 0; i < iterationCount; i++) {
            digitMatrices.forEach(function (matrix) {
                var expectedOutput = [];
                for (var i_1 = 0; i_1 < _this.outputLayerConfig.neuronCount; i_1++) {
                    expectedOutput[i_1] = i_1 === matrix.digit ? MODIFIER : 0;
                }
                _this.neuralNetwork.trainWith(matrix.matrix, expectedOutput, stepSize);
            });
        }
    };
    return DigitClassifier;
}());
exports.DigitClassifier = DigitClassifier;
//# sourceMappingURL=DigitClassifier.js.map