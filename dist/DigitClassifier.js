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
 * @version 0.0.1
 */
/**
 * Class responsible for setting up, testing and training a neural network
 * @since 0.0.1
 */
var DigitClassifier = (function () {
    /**
     * DigitClassifier constructor, mirrors that of a NeuralNetwork, except output count is always
     * @since 0.0.1
     */
    function DigitClassifier(inputCount, hiddenLayers) {
        if (hiddenLayers === void 0) { hiddenLayers = []; }
        this.neuralNetwork = new NeuralNetwork_1.NeuralNetwork(inputCount, 1, hiddenLayers);
    }
    /**
     * Tests the classifier with the provided set of digit matrices, returns the accuracy of guesses over said set.
     * Prints each test case if `print` is set to true.
     * @since 0.0.1
     */
    DigitClassifier.prototype.test = function (digitMatrices, outputOperation, print) {
        var _this = this;
        if (outputOperation === void 0) { outputOperation = function (output) { return output; }; }
        if (print === void 0) { print = false; }
        var correctGuesses = 0;
        digitMatrices.forEach(function (matrix) {
            var output = _this.neuralNetwork.runWith(matrix.matrix)[0];
            var displayOutput = output.toFixed(4);
            var parsedOutput = outputOperation(output);
            var correct = parsedOutput === matrix.digit;
            if (correct) {
                correctGuesses++;
            }
            if (print) {
                console.log('[TEST]   Expected -> ' + matrix.digit + '   Actual -> ' + displayOutput + ' (' + parsedOutput + ')');
                console.log((correct ? '' : 'IN') + 'CORRECT GUESS');
                console.log('Image of the digit:');
                DataParser_1.DataParser.printImage(matrix.matrix);
                console.log();
            }
        });
        return correctGuesses / digitMatrices.length;
    };
    /**
     * Trains the neural network using provided set of matrices. Repeats the process `iterationCount` times.
     * @since 0.0.1
     */
    DigitClassifier.prototype.train = function (digitMatrices, stepSize, iterationCount) {
        var _this = this;
        for (var i = 0; i < iterationCount; i++) {
            digitMatrices.forEach(function (matrix) {
                _this.neuralNetwork.trainWith(matrix.matrix, [matrix.digit], stepSize);
            });
        }
    };
    return DigitClassifier;
}());
exports.DigitClassifier = DigitClassifier;
//# sourceMappingURL=DigitClassifier.js.map