import {DataParser, IDigitMatrix} from './DataParser';
import {ILayerConfiguration} from './Layer';
import {NeuralNetwork} from './NeuralNetwork';
import {Util} from './Util';
/**
 * A file containing all interfaces and classes related to the classifier matching images of handwritten digits to
 * their integer representation.
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.6
 */

/**
 * Scales the output of the NeuralNetwork, i.e. if your expected output is 8 and `MODIFIER` is 5, neural network
 * will be trained to output 40 when the expected output is 5. Modifier is also applied during testing to scale down
 * the answer.
 * @since 0.0.2
 */
const MODIFIER = 0.5;

/**
 * Class responsible for setting up, testing and training a neural network
 * @since 0.0.1
 */
export class DigitClassifier {
    /**
     * An instance of NeuralNetwork that will be tested and trained
     * @since 0.0.1
     */
    private neuralNetwork: NeuralNetwork;

    /**
     * Stored output layer configuration
     * @since 0.0.5
     */
    private outputLayerConfig: ILayerConfiguration;

    /**
     * DigitClassifier constructor, mirrors that of a NeuralNetwork, except output count is always
     * @since 0.0.5 Now stores `outputLayer` in
     * @since 0.0.4 Output layer is now an injected dependency
     * @since 0.0.3 Now uses the ILayerConfiguration interface
     * @since 0.0.1
     */
    public constructor(inputCount: number,
                       outputLayer: ILayerConfiguration,
                       hiddenLayers: ILayerConfiguration[] = []) {
        this.outputLayerConfig = outputLayer;
        this.neuralNetwork = new NeuralNetwork(inputCount, outputLayer, hiddenLayers);
    }

    /**
     * Tests the classifier with the provided set of digit matrices, returns the accuracy of guesses over said set.
     * Prints each test case if `print` is set to true.
     * @since 0.0.6 Add support for multiple output neurons
     * @since 0.0.3 Replace all `var` with `let` keywords
     * @since 0.0.2 Now uses `MODIFIER` constant
     * @since 0.0.1
     */
    public test(digitMatrices: IDigitMatrix[],
                outputOperation: (output: number) => number = (output) => output,
                print: boolean = false): number {
        let correctGuesses = 0;
        digitMatrices.forEach((matrix: IDigitMatrix) => {
            let outputs = this.neuralNetwork.runWith(matrix.matrix);
            let neuronsFired: number[] = [];
            for (let i = 0; i < outputs.length; i++) {
                if (outputOperation(outputs[i]) > MODIFIER / 2) {
                    neuronsFired.push(i);
                }
            }
            let singleNeuron = neuronsFired.length === 1;
            let correct: boolean = singleNeuron && neuronsFired[0] === matrix.digit;
            if (correct) {
                correctGuesses++;
            }
            if (print) {
                let colors = require('colors/safe');

                console.log();
                let expected = 'Expected ---> ' + colors.green(matrix.digit);
                let outputString = neuronsFired.toString();
                let actual = 'Actual ---> ' + (correct ? colors.green(outputString) : colors.red(outputString));
                Util.logTest('Output:    ' + expected + '    ' + actual);
                Util.logTest();
                let result = 'CORRECT GUESS';
                if (correct) {
                    result = colors.green(result);
                } else {
                    result = colors.red('IN' + result);
                }
                Util.logTest(result);
                Util.logTest();
                Util.logTest('Sigmoid neuron outputs:');
                Util.logTest();
                for (let i = 0; i < outputs.length; i++) {
                    let neuronIndex = colors.cyan(i);
                    let neuronOutput = outputs[i];
                    let neuronDisplayOutput = colors.cyan(neuronOutput.toFixed(2));
                    if (neuronsFired.indexOf(i) !== -1) {
                        neuronDisplayOutput += ' <';
                    }
                    Util.logTest(neuronIndex + ' ---> ' + neuronDisplayOutput);
                }
                Util.logTest();
                Util.logTest('Image of the digit:');
                Util.logTest();
                DataParser.printImage(matrix.matrix, Util.logTest);
                console.log();
            }
        });
        return correctGuesses / digitMatrices.length;
    }

    /**
     * Trains the neural network using provided set of matrices. Repeats the process `iterationCount` times.
     * @since 0.0.6 Change the way expected output is generated
     * @since 0.0.5 Now works with output layers with neuron count higher than 1
     * @since 0.0.2 Now uses `MODIFIER` constant
     * @since 0.0.1
     */
    public train(digitMatrices: IDigitMatrix[], stepSize: number, iterationCount: number) {
        for (let i = 0; i < iterationCount; i++) {
            digitMatrices.forEach((matrix: IDigitMatrix) => {
                let expectedOutput: number[] = [];
                for (let i = 0; i < this.outputLayerConfig.neuronCount; i++) {
                    expectedOutput[i] = i === matrix.digit ? MODIFIER : 0;
                }
                this.neuralNetwork.trainWith(matrix.matrix, expectedOutput, stepSize);
            });
        }
    }
}
