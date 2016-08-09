import {Unit} from '../Unit';
import {Util} from '../Util';
import {Neuron} from './Neuron';
/**
 * File containing all methods and functions related to the log-sigmoidal neuron
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.1
 */

/**
 * Class representing the log-sigmoidal neuron
 * @since 0.0.1
 */
export class SigmoidalNeuron extends Neuron {
    /**
     * SigmoidalNeuron constructor. Similar to that of the base Neuron class but accepts singular object instead of
     * arrays
     * @since 0.0.1
     */
    public constructor(inputUnits: Unit, outputUnit: Unit, variables: Unit) {
        this.inputUnits = [inputUnits];
        this.outputUnit = outputUnit;
        this.variableUnits = [variables];
    }

    /**
     * Forward pass logic. Uses sigmoid function on a single input to calculate the output
     * @since 0.0.1
     */
    public forward() {
        this.outputUnit.value = this.sigmaWrapper();
    }

    /**
     * Backdrops the gradient of the output unit to the input unit by multiplying it with the derivative of the
     * sigmoid function. Then adjusts the value of the stored variable unit.
     * @since 0.0.1
     */
    public backward(stepSize?: number) {
        let sigmaValue = this.sigmaWrapper();
        let gradient = this.variableUnits[0].value * sigmaValue * (1 - sigmaValue);
        this.inputUnits[0].gradient = gradient * this.outputUnit.gradient;
        if (stepSize) {
            variableUnit.value += stepSize * variableUnit.gradient;
        }
    }

    /**
     * Function calculating sigma multiplying the input value by a coefficient stored in the variable unit
     * @since 0.0.1
     */
    public sigmaWrapper(): number {
        return Util.sigma(this.inputUnits[0].value * this.variableUnits[0].value);
    }
}
