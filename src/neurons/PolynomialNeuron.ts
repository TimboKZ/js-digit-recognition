import {Unit} from '../Unit';
import {Util} from '../Util';
import {Neuron} from './Neuron';
/**
 * File containing the implementation of a polynomial
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.1
 */

/**
 * Class representing a polynomial neuron whose activation function is a polynomial of the degree specified in the constructor.
 * @since 0.0.1
 */
export class PolynomialNeuron extends Neuron {
    /**
     * LinearNeuron constructor. Note how the bias unit is added automatically in the end of the variables array,
     * hence does not have to be passed into the constructor.
     * @since 0.0.1
     */
    public constructor(inputUnit: Unit,
                       outputUnit: Unit,
                       degree: number,
                       coefficientGenerator: () => number = () => Util.randomInRage(-0.5, 0.5),
                       biasGenerator: () => number = () => 1.0) {
        let variableUnits: Unit[] = [];
        for (let i = 0; i < degree; i++) {
            variableUnits[i] = new Unit(coefficientGenerator());
        }
        let biasUnit = new Unit(biasGenerator());
        variableUnits.unshift(biasUnit);
        super([inputUnit], outputUnit, variableUnits);
    }

    /**
     * Logic for the forward pass of the neuron. The activation function is a polynomial which degree is equal to
     * `this.variableUnits.length - 1`
     * @since 0.0.1
     */
    protected forwardLogic() {
        let input = this.inputUnits[0].value;
        let output = 0;
        for (let i = 0; i < this.variableUnits.length; i++) {
            let variableUnit = this.variableUnits[i];
            variableUnit.gradient = 0.0;
            let coefficient = input;
            if (i === 0) {
                coefficient = 1.0;
            }
            output += Math.pow(coefficient, i) * variableUnit.value;
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
            if (i !== 0) {
                coefficient = i * Math.pow(this.inputUnits[0].value, i - 1);
                adjustment = variableUnit.value;
            }
            variableUnit.gradient += coefficient * this.outputUnit.gradient - adjustment;
            if (i !== 0) {
                this.inputUnits[i].gradient = variableUnit.value * this.outputUnit.gradient;
            }
            if (stepSize) {
                variableUnit.value += stepSize * variableUnit.gradient;
            }
        }
    }
}
