import {Unit} from '../Unit';
/**
 * File containing classes and interfaces for the base linear Neuron
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.1.0
 */

/**
 * Class representing the base neuron, used in hidden layers
 * @since 0.0.1
 */
export class Neuron {
    /**
     * Units supplied by the previous layer of neurons
     * @since 0.0.7 Changed access modifier to `protected`
     * @since 0.0.1
     */
    protected inputUnits: Unit[];

    /**
     * Output unit to be supplied to the next layer of neurons
     * @since 0.0.7 Changed access modifier to `protected`
     * @since 0.0.1
     */
    protected outputUnit: Unit;

    /**
     * Variable units that will be adjusted during training
     * @since 0.0.7 Changed access modifier to `protected`
     * @since 0.0.1
     */
    protected variableUnits: Unit[];

    /**
     * Neuron constructor
     * @since 0.0.2 outputUnit is now an injected dependency
     * @since 0.0.1
     */
    public constructor(inputUnits: Unit[], outputUnit: Unit, variables: Unit[]) {
        this.inputUnits = inputUnits;
        this.outputUnit = outputUnit;
        this.variableUnits = variables;
    }

    /**
     * Logic for the forward pass, similar to:
     * output = ax + by + ... + cz + d
     * Where a,b,...c,d are variable units stored in the neuron and x,y,...z are values of input units
     * @since 0.0.9 Forward pass now resets gradients
     * @since 0.0.8 Removed ReLU
     * @since 0.0.6 Added ReLU
     * @since 0.0.4 Fixed a bug where `i` would be compared to Unit[]
     * @since 0.0.1
     */
    public forward() {
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
        this.outputUnit.gradient = 0.0;
    }

    /**
     * Logic for the backward pass, first backdrops the gradients to the input units and then adjusts the stored
     * variable units using the step size
     * @since 0.1.0 Setup proper back-propagation to the input units
     * @since 0.0.9 Added `adjustment`
     * @since 0.0.8 Removed ReLU
     * @since 0.0.6 Minor tweaks to logic
     * @since 0.0.5 Added a rectifier for inputUnit.gradient
     * @since 0.0.4 Fixed a bug where `i` would be compared to Unit[]
     * @since 0.0.3 stepSize is now optional
     * @since 0.0.1
     */
    public backward(stepSize?: number) {
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
