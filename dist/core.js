"use strict";
var DataParser_1 = require('./DataParser');
var NeuralNetwork_1 = require('./NeuralNetwork');
/**
 * The core of the neural network
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.1
 */
var digit0DataSet = DataParser_1.DataParser.getDataSet(0);
var digit1DataSet = DataParser_1.DataParser.getDataSet(1);
var dataSet = DataParser_1.DataParser.combineDataSets([digit0DataSet, digit1DataSet], true);
var nn = new NeuralNetwork_1.NeuralNetwork(16, 1, [64]);
var roundOutput = function (output) {
    return Math.round(output);
};
var trainingStepSize = 0.1;
var trainingMatricesCount = 50;
var trainingMatrices = dataSet.trainingSet.slice(0, trainingMatricesCount + 1);
var testingMatricesCount = 50;
var testingMatrices = dataSet.testingSet.slice(0, testingMatricesCount + 1);
var trainingIterations = 25;
var trainingRounds = 20;
var totalIterations = 0;
var _loop_1 = function(round) {
    var correctGuesses = 0;
    testingMatrices.forEach(function (matrix) {
        if (nn.runWith(matrix.matrix, roundOutput)[0] === matrix.digit) {
            correctGuesses++;
        }
    });
    var accuracy = (correctGuesses / testingMatrices.length).toFixed(3);
    console.log('Accuracy after ' + totalIterations + ' iterations: ' + accuracy);
    for (var iteration = 0; iteration < trainingIterations; iteration++) {
        trainingMatrices.forEach(function (matrix) {
            nn.trainWith(matrix.matrix, [matrix.digit], trainingStepSize, roundOutput);
        });
        totalIterations++;
    }
};
for (var round = 0; round < trainingRounds; round++) {
    _loop_1(round);
}
//# sourceMappingURL=core.js.map