"use strict";
var DataParser_1 = require('./DataParser');
var DigitClassifier_1 = require('./DigitClassifier');
var Neuron_1 = require('./neurons/Neuron');
var ReLUNeuron_1 = require('./neurons/ReLUNeuron');
/**
 * The core of the neural network
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.3
 */
// PREPARE THE DATA SETS
var dataSets = [];
dataSets.push(DataParser_1.DataParser.getDataSet(4));
var dataSet = DataParser_1.DataParser.combineDataSets(dataSets, true);
// INITIALISE A DIGIT CLASSIFIER
var coefficientGenerator = function () { return (Math.random() - 0.5); };
var inputUnitsCount = DataParser_1.IMAGE_SIZE * DataParser_1.IMAGE_SIZE;
var outputLayer = {
    coefficientGenerator: coefficientGenerator,
    neuronCount: 10,
    neuronType: ReLUNeuron_1.ReLUNeuron,
};
var hiddenLayers = [
    {
        coefficientGenerator: coefficientGenerator,
        neuronCount: 16,
        neuronType: ReLUNeuron_1.ReLUNeuron,
    },
    {
        coefficientGenerator: coefficientGenerator,
        neuronCount: 10,
        neuronType: Neuron_1.Neuron,
    },
];
var digitClassifier = new DigitClassifier_1.DigitClassifier(inputUnitsCount, outputLayer, hiddenLayers);
// SETUP THE TESTING/TRAINING ROUTINE
var roundOutput = function (output) {
    return Math.round(output);
};
var testingMatrices = dataSet.testingSet.slice(0, 100);
var trainingMatrices = dataSet.trainingSet.slice(0, 10000);
var trainIterations = 50;
var trainRounds = 50;
var colors = require('colors/safe');
console.time(colors.green('Time elapsed'));
console.log();
for (var i = 0; i < trainRounds; i++) {
    digitClassifier.test([testingMatrices[Math.floor(Math.random() * testingMatrices.length)]], roundOutput, true);
    var accuracy = digitClassifier.test(testingMatrices, roundOutput);
    console.log('Accuracy after ' + i * trainIterations + ' iterations: ' + accuracy.toFixed(3));
    digitClassifier.train(trainingMatrices, 0.0001, trainIterations);
}
console.timeEnd(colors.green('Time elapsed'));
//# sourceMappingURL=core.js.map