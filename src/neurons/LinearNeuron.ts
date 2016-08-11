import {Unit} from '../Unit';
import {Util} from '../Util';
import {Neuron} from './Neuron';
/**
 * File containing the implementation of a basic linear neuron
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.1
 */

/**
 * Class representing a linear neuron whose activation function is a simple linear combination of inputs plus a bias
 * term.
 * @since 0.0.1
 */
export class LinearNeuron extends Neuron {
    /**
     * LinearNeuron constructor. Note how the bias unit is added automatically in the end of the variables array,
     * hence does not have to be passed into the constructor.
     * @since 0.0.1
     */
    public constructor(inputUnits: Unit[],
                       outputUnit: Unit,
                       coefficientGenerator: () => number = () => Util.randomInRage(-0.5, 0.5),
                       biasGenerator: () => number = () => 1.0) {
        let variableUnits: Unit[] = [];
        for (let i = 0; i < inputUnits.length; i++) {
            variableUnits[i] = new Unit(coefficientGenerator());
        }
        let biasUnit = new Unit(biasGenerator());
        variableUnits.push(biasUnit);
        super(inputUnits, outputUnit, variableUnits);
    }

    /**
     * Logic for the forward pass of the neuron. That activation function is a simple linear combination of weighted
     * inputs plus the bias unit.
     * @since 0.0.1
     */
    protected forwardLogic() {
        let output = 0;
        for (let i = 0; i < this.variableUnits.length; i++) {
            let variableUnit = this.variableUnits[i];
            variableUnit.gradient = 0.0;
            let coefficient = 1.0;
            if (this.inputUnits[i]) {
                coefficient = this.inputUnits[i].value;
            }
            output += coefficient * variableUnit.value;
        }
        this.outputUnit.value = output;
    }

    /**
     * Logic for the backward pass, first backdrops the gradients to the input units and then adjusts the stored
     * variable units using the step size (if it is provided).
     * @since 0.0.1
     */
    protected backwardLogic(stepSize?: number) {
        for (let i = 0; i < this.variableUnits.length; i++) {
            let variableUnit = this.variableUnits[i];
            let coefficient = 1.0;
            let adjustment = 0.0;
            if (this.inputUnits[i]) {
                coefficient = this.inputUnits[i].value;
                adjustment = variableUnit.value;
            }
            variableUnit.gradient += coefficient * this.outputUnit.gradient - adjustment;
            if (this.inputUnits[i]) {
                this.inputUnits[i].gradient = variableUnit.value * this.outputUnit.gradient;
            }
            if (stepSize) {
                variableUnit.value += stepSize * variableUnit.gradient;
            }
        }
    }
}
