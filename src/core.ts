import {DataParser, IDigitMatrix} from './DataParser';
import {NeuralNetwork} from './NeuralNetwork';
/**
 * The core of the neural network
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.1
 */

let digit0DataSet = DataParser.getDataSet(0);
let digit1DataSet = DataParser.getDataSet(1);
let dataSet = DataParser.combineDataSets([digit0DataSet, digit1DataSet], true);

let nn = new NeuralNetwork(16, 1, [64]);

let roundOutput = function (output: number): number {
    return Math.round(output);
};

let trainingStepSize = 0.1;

let trainingMatricesCount = 50;
let trainingMatrices = dataSet.trainingSet.slice(0, trainingMatricesCount + 1);
let testingMatricesCount = 50;
let testingMatrices = dataSet.testingSet.slice(0, testingMatricesCount + 1);

let trainingIterations = 25;
let trainingRounds = 20;

let totalIterations = 0;
for (let round = 0; round < trainingRounds; round++) {
    let correctGuesses = 0;
    testingMatrices.forEach(function (matrix: IDigitMatrix) {
        if (nn.runWith(matrix.matrix, roundOutput)[0] === matrix.digit) {
            correctGuesses++;
        }
    });
    let accuracy = (correctGuesses / testingMatrices.length).toFixed(3);
    console.log('Accuracy after ' + totalIterations + ' iterations: ' + accuracy);
    for (let iteration = 0; iteration < trainingIterations; iteration++) {
        trainingMatrices.forEach(function (matrix: IDigitMatrix) {
            nn.trainWith(matrix.matrix, [matrix.digit], trainingStepSize, roundOutput);
        });
        totalIterations++;
    }
}
