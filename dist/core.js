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
var dataSets = [];
dataSets.push(DataParser_1.DataParser.getDataSet(0));
dataSets.push(DataParser_1.DataParser.getDataSet(1));
dataSets.push(DataParser_1.DataParser.getDataSet(2));
dataSets.push(DataParser_1.DataParser.getDataSet(3));
dataSets.push(DataParser_1.DataParser.getDataSet(4));
dataSets.push(DataParser_1.DataParser.getDataSet(5));
dataSets.push(DataParser_1.DataParser.getDataSet(6));
dataSets.push(DataParser_1.DataParser.getDataSet(7));
dataSets.push(DataParser_1.DataParser.getDataSet(8));
dataSets.push(DataParser_1.DataParser.getDataSet(9));
var dataSet = DataParser_1.DataParser.combineDataSets(dataSets, true);
for (var i = 0; i < dataSet.testingSet.length; i++) {
    var matrix = dataSet.testingSet[i].matrix;
    var newMatrix = [];
    for (var k = 0; k < matrix.length; k++) {
        newMatrix[k] = matrix[k] > 100 ? 1 : 0;
    }
    dataSet.testingSet[i].matrix = newMatrix;
}
var nn = new NeuralNetwork_1.NeuralNetwork(64, 1, [64]);
var roundOutput = function (output) {
    return Math.round(output);
};
var trainingStepSize = 0.0001;
var trainingMatricesCount = 6000;
var trainingMatrices = dataSet.trainingSet.slice(0, trainingMatricesCount + 1);
var testingMatricesCount = 250;
var testingMatrices = dataSet.testingSet.slice(0, testingMatricesCount + 1);
var trainingIterations = 25;
var trainingRounds = 75;
var totalIterations = 0;
var _loop_1 = function(round) {
    var correctGuesses = 0;
    var guesses = 0;
    var expected = 0;
    testingMatrices.forEach(function (matrix) {
        var output = nn.runWith(matrix.matrix, roundOutput)[0];
        guesses += output;
        expected += matrix.digit;
        if (output === matrix.digit) {
            correctGuesses++;
        }
    });
    // console.log((guesses / testingMatrices.length).toFixed(3) + ' <-> ' + (expected / testingMatrices.length).toFixed(3));
    var accuracy = (correctGuesses / testingMatrices.length).toFixed(3);
    console.log('Accuracy after ' + totalIterations + ' training iterations: ' + accuracy);
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