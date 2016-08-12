"use strict";
var DataParser_1 = require('../src/DataParser');
var DigitClassifier_1 = require('../src/DigitClassifier');
var Util_1 = require('../src/Util');
var LinearNeuron_1 = require('../src/neurons/LinearNeuron');
var ReLUNeuron_1 = require('../src/neurons/ReLUNeuron');
/**
 * The core of the neural network
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.5
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
var coefficientGenerator = function () { return Util_1.Util.randomInRage(-0.5, 0.5); };
var inputUnitsCount = DataParser_1.IMAGE_SIZE * DataParser_1.IMAGE_SIZE;
var hiddenLayers = [
    {
        coefficientGenerator: coefficientGenerator,
        neuronCount: 32,
        neuronType: LinearNeuron_1.LinearNeuron,
    },
    {
        coefficientGenerator: coefficientGenerator,
        neuronCount: 512,
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
var trainIterations = 1;
var trainRounds = 250;
var colors = require('colors/safe');
console.time(colors.green('Time elapsed'));
console.log();
for (var i = 0; i < trainRounds; i++) {
    digitClassifier.test([testingMatrices[Math.floor(Math.random() * testingMatrices.length)]], true);
    var accuracy = digitClassifier.test(testingMatrices);
    var displayIterations = (i * trainIterations).toString();
    while (displayIterations.length < 3) {
        displayIterations = ' ' + displayIterations;
    }
    displayIterations = colors.yellow(displayIterations);
    var displayAccuracy = colors.yellow(accuracy.toFixed(3));
    var line = '[';
    for (var i_1 = 0; i_1 < accuracy * 20; i_1++) {
        line += '-';
    }
    line += '>';
    line = colors.green(line);
    console.log('Accuracy after ' + displayIterations + ' iterations: ' + displayAccuracy + ' ' + line);
    var stepSize = 0.0001;
    if (accuracy > 0.3) {
        stepSize = 0.00001;
    }
    if (accuracy > 0.50) {
        stepSize = 0.000001;
    }
    if (accuracy > 0.65) {
        stepSize = 0.0000008;
    }
    if (accuracy > 0.75) {
        stepSize = 0.0000006;
    }
    digitClassifier.train(trainingMatrices, stepSize, trainIterations);
}
console.timeEnd(colors.green('Time elapsed'));
