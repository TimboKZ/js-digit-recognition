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
 * @version 0.0.7
 */
/**
 * Class responsible for setting up, testing and training a neural network
 * @since 0.0.1
 */
var DigitClassifier = (function () {
    /**
     * DigitClassifier constructor, mirrors that of a NeuralNetwork, except output count is always
     * @since 0.0.7 No longer accepts `outputLayer`, it is now the last layer in the `layers` array
     * @since 0.0.5 Now stores `outputLayer` in
     * @since 0.0.4 Output layer is now an injected dependency
     * @since 0.0.3 Now uses the ILayerConfiguration interface
     * @since 0.0.1
     */
    function DigitClassifier(inputCount, layers) {
        if (layers === void 0) { layers = []; }
        this.outputCount = layers.length > 0 ? layers[layers.length - 1].neuronCount : inputCount;
        this.neuralNetwork = new NeuralNetwork_1.NeuralNetwork(inputCount, layers);
    }
    /**
     * Tests the classifier with the provided set of digit matrices, returns the accuracy of guesses over said set.
     * Prints each test case if `print` is set to true.
     * @since 0.0.7 Now uses maximum neuron output to classify the image
     * @since 0.0.6 Add support for multiple output neurons
     * @since 0.0.3 Replace all `var` with `let` keywords
     * @since 0.0.2 Now uses `MODIFIER` constant
     * @since 0.0.1
     */
    DigitClassifier.prototype.test = function (digitMatrices, print) {
        var _this = this;
        if (print === void 0) { print = false; }
        var correctGuesses = 0;
        digitMatrices.forEach(function (matrix) {
            var outputs = _this.neuralNetwork.runWith(matrix.matrix);
            var maximumValue = -Infinity;
            var minimumValue = +Infinity;
            var maximumNeuron = -1;
            for (var i = 0; i < outputs.length; i++) {
                if (outputs[i] > maximumValue) {
                    maximumValue = outputs[i];
                    maximumNeuron = i;
                }
                if (outputs[i] < minimumValue) {
                    minimumValue = outputs[i];
                }
            }
            var correct = maximumNeuron === matrix.digit;
            if (correct) {
                correctGuesses++;
            }
            if (print) {
                var colors = require('colors/safe');
                console.log();
                var expected = 'Expected ---> ' + colors.green(matrix.digit);
                var actual = 'Actual ---> ' + (correct ? colors.green(maximumNeuron) : colors.red(maximumNeuron));
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
                Util_1.Util.logTest('Neuron outputs:');
                Util_1.Util.logTest();
                var valueRange = Math.abs(maximumValue - minimumValue);
                for (var i = 0; i < outputs.length; i++) {
                    var neuronIndex = colors.cyan(i);
                    var prefix = '   ';
                    var suffix = '   ';
                    if (i === maximumNeuron) {
                        prefix = ' > ';
                        suffix = ' < ';
                    }
                    var neuronOutput = outputs[i];
                    var normalisedOutput = Math.floor((neuronOutput - minimumValue) / valueRange * 9);
                    var line = '';
                    for (var k = 0; k < 10; k++) {
                        if (k === normalisedOutput) {
                            line += colors.bgYellow(colors.black('X'));
                        }
                        else {
                            line += colors.bgYellow(' ');
                        }
                    }
                    Util_1.Util.logTest(prefix + neuronIndex + ' ' + line + ' ' + neuronIndex + suffix);
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
                for (var i_1 = 0; i_1 < _this.outputCount; i_1++) {
                    expectedOutput[i_1] = i_1 === matrix.digit ? 1 : 0;
                }
                _this.neuralNetwork.trainWith(matrix.matrix, expectedOutput, stepSize);
            });
        }
    };
    return DigitClassifier;
}());
exports.DigitClassifier = DigitClassifier;
