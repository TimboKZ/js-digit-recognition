import {DataParser, IDigitMatrix, IDigitDataSet} from './DataParser';
import {NeuralNetwork} from './NeuralNetwork';
/**
 * The core of the neural network
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.1
 */

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
for (let i = 0; i < dataSet.testingSet.length; i++) {
    let matrix = dataSet.testingSet[i].matrix;
    let newMatrix: number[] = [];
    for (let k = 0; k < matrix.length; k++) {
        newMatrix[k] = matrix[k] > 100 ? 1 : 0;
    }
    dataSet.testingSet[i].matrix = newMatrix;
}

let nn = new NeuralNetwork(64, 1, [32]);

let roundOutput = function (output: number): number {
    return Math.round(output);
};

let trainingStepSize = 0.001;

let trainingMatricesCount = 200;
let trainingMatrices = dataSet.trainingSet.slice(0, trainingMatricesCount + 1);
let testingMatricesCount = 100;
let testingMatrices = dataSet.testingSet.slice(0, testingMatricesCount + 1);

let trainingIterations = 25;
let trainingRounds = 50;

let totalIterations = 0;
for (let round = 0; round < trainingRounds; round++) {
    let correctGuesses = 0;
    let guesses = 0;
    let expected = 0;
    testingMatrices.forEach(function (matrix: IDigitMatrix) {
        let output = nn.runWith(matrix.matrix, roundOutput)[0];
        guesses += output;
        expected += matrix.digit;
        if (output === matrix.digit) {
            correctGuesses++;
        }
    });
    // console.log((guesses / testingMatrices.length).toFixed(3) + ' <-> ' + (expected / testingMatrices.length).toFixed(3));
    let accuracy = (correctGuesses / testingMatrices.length).toFixed(3);
    console.log('Accuracy after ' + totalIterations + ' training iterations: ' + accuracy);
    for (let iteration = 0; iteration < trainingIterations; iteration++) {
        trainingMatrices.forEach(function (matrix: IDigitMatrix) {
            nn.trainWith(matrix.matrix, [matrix.digit], trainingStepSize, roundOutput);
        });
        totalIterations++;
    }
}
