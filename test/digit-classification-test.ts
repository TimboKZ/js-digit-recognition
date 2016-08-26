import {DataParser, IDigitDataSet, IDigitMatrix, IMAGE_SIZE} from '../src/DataParser';
import {DigitClassifier} from '../src/DigitClassifier';
import {ILayerConfiguration} from '../src/Layer';
import {Util} from '../src/Util';
import {LinearNeuron} from '../src/neurons/LinearNeuron';
import {PolynomialNeuron} from '../src/neurons/PolynomialNeuron';
import {ReLUNeuron} from '../src/neurons/ReLUNeuron';
import colors = require('colors');
/**
 * The core of the neural network
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.5
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
let coefficientGenerator = () => Util.randomInRage(-0.5, 0.5);
let inputUnitsCount = IMAGE_SIZE * IMAGE_SIZE;
let hiddenLayers: ILayerConfiguration[] = [
    {
        coefficientGenerator: coefficientGenerator,
        degree: 9,
        neuronType: PolynomialNeuron,
    },
    {
        coefficientGenerator: coefficientGenerator,
        neuronCount: 512,
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
let testingMatrices: IDigitMatrix[] = dataSet.testingSet.slice(0, 2000);
let trainingMatrices: IDigitMatrix[] = dataSet.trainingSet.slice(0, 11000);
let trainIterations = 1;
let trainRounds = 250;

let prevAccuracy = 0.0;
let maxAccuracy = 0.0;
console.time(colors.green('Time elapsed'));
console.log();
for (let i = 0; i < trainRounds; i++) {
    let accuracy = digitClassifier.test(testingMatrices);
    let change = accuracy - prevAccuracy;
    prevAccuracy = accuracy;
    let displayChange = colors.red(change.toFixed(4));
    if (change > 0) {
        maxAccuracy = accuracy;
        displayChange = colors.green('+' + change.toFixed(4));
    }
    let displayIterations = (i * trainIterations).toString();
    while (displayIterations.length < 3) {
        displayIterations = ' ' + displayIterations;
    }
    displayIterations = colors.yellow(displayIterations);
    let displayAccuracy = colors.yellow(accuracy.toFixed(3));
    let line = '[';
    for (let i = 0; i < accuracy * 20; i++) {
        line += '-';
    }
    line += '>';
    line = colors.green(line);
    console.log('Accuracy after ' + displayIterations + ' iterations: ' + displayAccuracy + ' ' + line);
    console.log();
    console.log(
        'Accuracy gradient:     ' + displayChange + '     Best accuracy:     ' + colors.blue(maxAccuracy.toFixed(3))
    );
    digitClassifier.test([testingMatrices[Math.floor(Math.random() * testingMatrices.length)]], true);
    let stepSize = 0.0001;
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
