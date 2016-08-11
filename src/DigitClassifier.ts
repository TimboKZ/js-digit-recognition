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
 * @version 0.0.7
 */

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
     * The amount of output units in the neural network
     * @since 0.0.7 Now stores the amount of output units
     * @since 0.0.5
     */
    private outputCount: number;

    /**
     * DigitClassifier constructor, mirrors that of a NeuralNetwork, except output count is always
     * @since 0.0.7 No longer accepts `outputLayer`, it is now the last layer in the `layers` array
     * @since 0.0.5 Now stores `outputLayer` in
     * @since 0.0.4 Output layer is now an injected dependency
     * @since 0.0.3 Now uses the ILayerConfiguration interface
     * @since 0.0.1
     */
    public constructor(inputCount: number,
                       layers: ILayerConfiguration[] = []) {
        this.outputCount = layers.length > 0 ? layers[layers.length - 1].neuronCount : inputCount;
        this.neuralNetwork = new NeuralNetwork(inputCount, layers);
    }

    /**
     * Tests the classifier with the provided set of digit matrices, returns the accuracy of guesses over said set.
     * Prints each test case if `print` is set to true.
     * @since 0.0.7 Now uses maximum neuron output to classify the image
     * @since 0.0.6 Add support for multiple output neurons
     * @since 0.0.3 Replace all `var` with `let` keywords
     * @since 0.0.2 Now uses `MODIFIER` constant
     * @since 0.0.1
     */
    public test(digitMatrices: IDigitMatrix[],
                print: boolean = false): number {
        let correctGuesses = 0;
        digitMatrices.forEach((matrix: IDigitMatrix) => {
            let outputs = this.neuralNetwork.runWith(matrix.matrix);
            let maximumValue = -Infinity;
            let minimumValue = +Infinity;
            let maximumNeuron = NaN;
            for (let i = 0; i < outputs.length; i++) {
                if (outputs[i] > maximumValue) {
                    maximumValue = outputs[i];
                    maximumNeuron = i;
                }
                if (outputs[i] < minimumValue) {
                    minimumValue = outputs[i];
                }
            }
            let correct: boolean = maximumNeuron === matrix.digit;
            if (correct) {
                correctGuesses++;
            }
            if (print) {
                let colors = require('colors/safe');

                console.log();
                let expected = 'Expected ---> ' + colors.green(matrix.digit);
                let actual = 'Actual ---> ' + (correct ? colors.green(maximumNeuron) : colors.red(maximumNeuron));
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
                Util.logTest('Neuron outputs:');
                Util.logTest();
                let valueRange = Math.abs(maximumValue - minimumValue);
                for (let i = 0; i < outputs.length; i++) {
                    let neuronIndex = colors.cyan(i);
                    let prefix = '   ';
                    let suffix = '   ';
                    if (i === maximumNeuron) {
                        prefix = ' > ';
                        suffix = ' < ';
                    }
                    let neuronOutput = outputs[i];
                    let normalisedOutput = Math.floor((neuronOutput - minimumValue) / valueRange * 9);
                    let line = '';
                    for (let k = 0; k < 10; k++) {
                        if (k === normalisedOutput) {
                            line += colors.bgYellow(colors.black('X'));
                        } else {
                            line += colors.bgYellow(' ');
                        }
                    }
                    Util.logTest(prefix + neuronIndex + ' ' + line + ' ' + neuronIndex + suffix);
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
                for (let i = 0; i < this.outputCount; i++) {
                    expectedOutput[i] = i === matrix.digit ? 1 : 0;
                }
                this.neuralNetwork.trainWith(matrix.matrix, expectedOutput, stepSize);
            });
        }
    }
}
