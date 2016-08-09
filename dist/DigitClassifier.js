"use strict";
var DataParser_1 = require('./DataParser');
var NeuralNetwork_1 = require('./NeuralNetwork');
/**
 * A file containing all interfaces and classes related to the classifier matching images of handwritten digits to
 * their integer representation.
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.5
 */
/**
 * Scales the output of the NeuralNetwork, i.e. if your expected output is 8 and `MODIFIER` is 5, neural network
 * will be trained to output 40 when the expected output is 5. Modifier is also applied during testing to scale down
 * the answer.
 * @since 0.0.2
 */
var MODIFIER = 5.0;
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
            var output = _this.neuralNetwork.runWith(matrix.matrix)[0] / MODIFIER;
            var displayOutput = output.toFixed(4);
            var parsedOutput = outputOperation(output);
            var correct = parsedOutput === matrix.digit;
            if (correct) {
                correctGuesses++;
            }
            if (print) {
                var colors = require('colors/safe');
                console.log('[TEST]   Expected -> ' + matrix.digit + '   Actual -> ' + displayOutput + ' (' + parsedOutput + ')');
                var correctString = 'CORRECT GUESS';
                if (correct) {
                    correctString = colors.green(correctString);
                }
                else {
                    correctString = colors.red('IN' + correctString);
                }
                console.log(correctString);
                console.log('Image of the digit:');
                DataParser_1.DataParser.printImage(matrix.matrix);
                console.log();
            }
        });
        return correctGuesses / digitMatrices.length;
    };
    /**
     * Trains the neural network using provided set of matrices. Repeats the process `iterationCount` times.
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
                    expectedOutput.push(matrix.digit * MODIFIER);
                }
                _this.neuralNetwork.trainWith(matrix.matrix, expectedOutput, stepSize);
            });
        }
    };
    return DigitClassifier;
}());
exports.DigitClassifier = DigitClassifier;
//# sourceMappingURL=DigitClassifier.js.map