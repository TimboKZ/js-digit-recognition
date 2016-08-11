import {DataParser, IDigitDataSet, IDigitMatrix, IMAGE_SIZE} from '../src/DataParser';
import {DigitClassifier} from '../src/DigitClassifier';
import {Util} from '../src/Util';
import {ILayerConfiguration} from '../src/Layer';
import {LinearNeuron} from '../src/neurons/LinearNeuron';
import {ReLUNeuron} from '../src/neurons/ReLUNeuron';
/**
 * The core of the neural network
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.4
 */

// PREPARE THE DATA SETS
let dataSets: IDigitDataSet[] = [];
dataSets.push(DataParser.getDataSet(0));
dataSets.push(DataParser.getDataSet(1));
dataSets.push(DataParser.getDataSet(2));
dataSets.push(DataParser.getDataSet(3));
dataSets.push(DataParser.getDataSet(4));
dataSets.push(DataParser.getDataSet(5));
dataSets.push(DataParser.getDataSet(6));
dataSets.push(DataParser.getDataSet(7));
dataSets.push(DataParser.getDataSet(8));
dataSets.push(DataParser.getDataSet(9));
let dataSet = DataParser.combineDataSets(dataSets, true);

// INITIALISE A DIGIT CLASSIFIER
let coefficientGenerator = () => (Math.random() - 0.5);
let inputUnitsCount = IMAGE_SIZE * IMAGE_SIZE;
let hiddenLayers: ILayerConfiguration[] = [
    {
        coefficientGenerator: coefficientGenerator,
        neuronCount: 64,
        neuronType: LinearNeuron,
    },
    {
        coefficientGenerator: coefficientGenerator,
        neuronCount: 64,
        neuronType: ReLUNeuron,
    },
    {
        coefficientGenerator: coefficientGenerator,
        neuronCount: 16,
        neuronType: ReLUNeuron,
    },
    {
        coefficientGenerator: coefficientGenerator,
        neuronCount: 10,
        neuronType: LinearNeuron,
    },
];
let digitClassifier = new DigitClassifier(inputUnitsCount, hiddenLayers);

// SETUP THE TESTING/TRAINING ROUTINE
let testingMatrices: IDigitMatrix[] = dataSet.testingSet.slice(0, 1000);
let trainingMatrices: IDigitMatrix[] = dataSet.trainingSet.slice(0, 11000);
let trainIterations = 5;
let trainRounds = 100;
let colors = require('colors/safe');
console.time(colors.green('Time elapsed'));
console.log();
for (let i = 0; i < trainRounds; i++) {
    digitClassifier.test([testingMatrices[Math.floor(Math.random() * testingMatrices.length)]], true);
    let accuracy = digitClassifier.test(testingMatrices);
    console.log('Accuracy after ' + i * trainIterations + ' iterations: ' + accuracy.toFixed(3));
    digitClassifier.train(trainingMatrices, 0.0001, trainIterations);
}
console.timeEnd(colors.green('Time elapsed'));
