import {DataParser, IDigitDataSet, IDigitMatrix, IMAGE_SIZE} from './DataParser';
import {DigitClassifier} from './DigitClassifier';
import {ILayerConfiguration} from './Layer';
import {Neuron} from './neurons/Neuron';
import {ReLUNeuron} from './neurons/ReLUNeuron';
import {SigmoidNeuron} from './neurons/SigmoidNeuron';
/**
 * The core of the neural network
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.2
 */

// PREPARE THE DATA SETS
let dataSets: IDigitDataSet[] = [];
dataSets.push(DataParser.getDataSet(1));
dataSets.push(DataParser.getDataSet(4));
let dataSet = DataParser.combineDataSets(dataSets, true);

// INITIALISE A DIGIT CLASSIFIER
let coefficientGenerator = () => (Math.random() - 0.5);
let inputUnitsCount = IMAGE_SIZE * IMAGE_SIZE;
let outputLayer: ILayerConfiguration = {
    coefficientGenerator: coefficientGenerator,
    neuronType: SigmoidNeuron,
};
let hiddenLayers = [
    {
        coefficientGenerator: coefficientGenerator,
        neuronCount: 32,
        neuronType: Neuron,
    },
    {
        coefficientGenerator: coefficientGenerator,
        neuronCount: 16,
        neuronType: ReLUNeuron,
    },
    {
        coefficientGenerator: coefficientGenerator,
        neuronType: SigmoidNeuron,
    },
    {
        coefficientGenerator: coefficientGenerator,
        neuronCount: 10,
        neuronType: Neuron,
    },
];
let digitClassifier = new DigitClassifier(inputUnitsCount, outputLayer, hiddenLayers);

// SETUP THE TESTING/TRAINING ROUTINE
let roundOutput = function (output: number): number {
    return Math.round(output);
};
let testingMatrices: IDigitMatrix[] = dataSet.testingSet.slice(0, 100);
let trainingMatrices: IDigitMatrix[] = dataSet.trainingSet.slice(0, 10000);
let trainIterations = 150;
let trainRounds = 50;
let colors = require('colors/safe');
console.time(colors.green('Time elapsed'));
console.log();
for (let i = 0; i < trainRounds; i++) {
    digitClassifier.test([testingMatrices[Math.floor(Math.random() * testingMatrices.length)]], roundOutput, true);
    let accuracy = digitClassifier.test(testingMatrices, roundOutput);
    console.log('Accuracy after ' + i * trainIterations + ' iterations: ' + accuracy.toFixed(3));
    digitClassifier.train(trainingMatrices, 0.01, trainIterations);
}
console.timeEnd(colors.green('Time elapsed'));
