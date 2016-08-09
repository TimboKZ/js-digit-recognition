import {Layer} from './Layer';
import {Unit} from './Unit';
import {Util} from './Util';
/**
 * File containing all classes and interfaces related to the NeuralNetwork object
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.5
 */

/**
 * The neural network class that manages Layers of Neurons
 * @since 0.0.1
 */
export class NeuralNetwork {
    /**
     * The layer of neurons that accepts input and passes it to the subsequent layers
     * @since 0.0.1
     */
    private inputLayer: Layer;
    /**
     * The layer of neurons that produces an output based on the input from the previous layers
     * @since 0.0.1
     */
    private outputLayer: Layer;

    /**
     * Units representing the data sent to the Input Layer in the neural network
     * @since 0.0.1
     */
    private inputUnits: Unit[];

    /**
     * Units representing the output produced by the Output Layer of the neural network
     * @since 0.0.1
     */
    private outputUnits: Unit[];

    /**
     * NeuralNetwork constructor. Takes the amount of expected input and output values as arguments.
     * @since 0.0.4 Fixed a bug where the output layer would not get linked correctly
     * @since 0.0.3 Fixed a bug where layers were not interconnected
     * @since 0.0.1
     */
    public constructor(inputCount: number, outputCount: number, hiddenLayers: number[] = []) {
        let inputUnits: Unit[] = [];
        for (let i = 0; i < inputCount; i++) {
            inputUnits[i] = new Unit();
        }
        this.inputLayer = Layer.fromValues(inputUnits);
        let lastLayer = this.inputLayer;
        for (let i = 0; i < hiddenLayers.length; i++) {
            let memoryLayer = lastLayer;
            lastLayer = Layer.fromLayer(hiddenLayers[i], lastLayer);
            memoryLayer.setNextLayer(lastLayer);
        }
        this.outputLayer = Layer.fromLayer(outputCount, lastLayer);
        lastLayer.setNextLayer(this.outputLayer);
        this.inputUnits = inputUnits;
        this.outputUnits = this.outputLayer.getOutputUnits();
    }

    /**
     * Trains the network using some input data and the expected output data, adjusting the variable inputs in the
     * neurons by the step size supplied. The `outputOperation` function is applied to the output before comparing
     * it to the expected output.
     * @since 0.0.5 Now uses the sigma function to calculate the pull
     * @since 0.0.1
     */
    public trainWith(inputData: number[],
                     outputData: number[],
                     stepSize: number,
                     outputOperation?: (output: number) => number) {
        for (let i = 0; i < inputData.length; i++) {
            if (this.inputUnits[i]) {
                this.inputUnits[i].value = inputData[i];
            }
        }
        this.inputLayer.forward();
        for (let i = 0; i < outputData.length; i++) {
            let output = this.outputUnits[i].value;
            let expectedOutput = outputData[i];
            if (outputOperation) {
                output = outputOperation(output);
            }
            let pull = 0;
            let difference = Math.abs(expectedOutput - output);
            if (output < expectedOutput) {
                pull = 1 + Util.sigma(difference);
            } else if (output > expectedOutput) {
                pull = -1 - Util.sigma(difference);
            }
            this.outputUnits[i].gradient = pull;
        }
        this.outputLayer.backward(stepSize);
    }

    /**
     * Uses the network on some input data to retrieve the output, The `outputOperation` function is applied
     * to the output before returning it.
     * @since 0.0.2 Now simply returns the output instead of testing it
     * @since 0.0.1
     */
    public runWith(inputData: number[],
                   outputOperation?: (output: number) => number): number[] {
        for (let i = 0; i < inputData.length; i++) {
            if (this.inputUnits[i]) {
                this.inputUnits[i].value = inputData[i];
            }
        }
        this.inputLayer.forward();
        let outputArray: number[] = [];
        for (let i = 0; i < this.outputUnits.length; i++) {
            let output = this.outputUnits[i].value;
            if (outputOperation) {
                output = outputOperation(output);
            }
            outputArray[i] = output;
        }
        return outputArray;
    }
}
