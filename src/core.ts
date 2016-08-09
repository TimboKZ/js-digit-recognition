import {DataParser, IDigitDataSet, IDigitMatrix, IMAGE_SIZE} from './DataParser';
import {DigitClassifier} from './DigitClassifier';
import {ILayerConfiguration} from './Layer';
import {Neuron} from './neurons/Neuron';
import {SigmoidNeuron} from './neurons/SigmoidNeuron';
import {ReLUNeuron} from './neurons/ReLUNeuron';
/**
 * The core of the neural network
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.1
 */

// PREPARE THE DATA SETS
let dataSets: IDigitDataSet[] = [];
dataSets.push(DataParser.getDataSet(9));
let dataSet = DataParser.combineDataSets(dataSets, true);

// INITIALISE A DIGIT CLASSIFIER
let coefficientGenerator = () => (Math.random() - 0.5);
let inputUnitsCount = IMAGE_SIZE * IMAGE_SIZE;
let outputLayer: ILayerConfiguration = {
    coefficientGenerator: coefficientGenerator,
    neuronCount: 2,
    neuronType: Neuron,
};
let hiddenLayers = [
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
        neuronCount: 1,
        neuronType: Neuron,
    },
];
let digitClassifier = new DigitClassifier(inputUnitsCount, outputLayer, hiddenLayers);

// SETUP THE TESTING/TRAINING ROUTINE
let roundOutput = function (output: number): number {
    return Math.round(output);
};
let testingMatrices: IDigitMatrix[] = dataSet.testingSet.slice(0, 100);
let trainingMatrices: IDigitMatrix[] = dataSet.trainingSet.slice(0, 1000000);
let trainIterations = 100;
let trainRounds = 10;
let colors = require('colors/safe');
console.time(colors.green('Time elapsed'));
console.log();
for (let i = 0; i < trainRounds; i++) {
    digitClassifier.test([testingMatrices[Math.floor(Math.random() * testingMatrices.length)]], roundOutput, false);
    let accuracy = digitClassifier.test(testingMatrices, roundOutput);
    console.log('Accuracy after ' + i * trainIterations + ' iterations: ' + accuracy.toFixed(3));
    digitClassifier.train(trainingMatrices, 0.0001, trainIterations);
}
console.timeEnd(colors.green('Time elapsed'));
