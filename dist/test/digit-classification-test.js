"use strict";
var DataParser_1 = require('../src/DataParser');
var DigitClassifier_1 = require('../src/DigitClassifier');
var LinearNeuron_1 = require('../src/neurons/LinearNeuron');
var ReLUNeuron_1 = require('../src/neurons/ReLUNeuron');
/**
 * The core of the neural network
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.4
 */
// PREPARE THE DATA SETS
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
// INITIALISE A DIGIT CLASSIFIER
var coefficientGenerator = function () { return (Math.random() - 0.5); };
var inputUnitsCount = DataParser_1.IMAGE_SIZE * DataParser_1.IMAGE_SIZE;
var hiddenLayers = [
    {
        coefficientGenerator: coefficientGenerator,
        neuronCount: 64,
        neuronType: LinearNeuron_1.LinearNeuron,
    },
    {
        coefficientGenerator: coefficientGenerator,
        neuronCount: 64,
        neuronType: ReLUNeuron_1.ReLUNeuron,
    },
    {
        coefficientGenerator: coefficientGenerator,
        neuronCount: 16,
        neuronType: ReLUNeuron_1.ReLUNeuron,
    },
    {
        coefficientGenerator: coefficientGenerator,
        neuronCount: 10,
        neuronType: LinearNeuron_1.LinearNeuron,
    },
];
var digitClassifier = new DigitClassifier_1.DigitClassifier(inputUnitsCount, hiddenLayers);
// SETUP THE TESTING/TRAINING ROUTINE
var testingMatrices = dataSet.testingSet.slice(0, 1000);
var trainingMatrices = dataSet.trainingSet.slice(0, 11000);
var trainIterations = 5;
var trainRounds = 100;
var colors = require('colors/safe');
console.time(colors.green('Time elapsed'));
console.log();
for (var i = 0; i < trainRounds; i++) {
    digitClassifier.test([testingMatrices[Math.floor(Math.random() * testingMatrices.length)]], true);
    var accuracy = digitClassifier.test(testingMatrices);
    console.log('Accuracy after ' + i * trainIterations + ' iterations: ' + accuracy.toFixed(3));
    digitClassifier.train(trainingMatrices, 0.0001, trainIterations);
}
console.timeEnd(colors.green('Time elapsed'));
