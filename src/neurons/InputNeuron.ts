import {Unit} from '../Unit';
import {Neuron} from './Neuron';
/**
 * File representing the implementation of an input neuron.
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.2
 */

/**
 * A very simple passive neuron that simple relays the input value to the output value.
 * @since 0.0.1
 */
export class InputNeuron extends Neuron {
    /**
     * InputNeuron constructor. Accepts a single input unit and an output unit to which the value will be relayed.
     * Does not accept any variable units since the input value will not be processed before relaying it further.
     * @since 0.0.1
     */
    public constructor(inputUnit: Unit, outputUnit: Unit) {
        super([inputUnit], outputUnit);
    }

    /**
     * Simply relay the value of the input to the output unit.
     * @since 0.0.1
     */
    public forwardLogic() {
        this.outputUnit.value = this.inputUnits[0].value;
    }

    /**
     * Do nothing.
     * @since 0.0.2 Add curly brackets to emphasise the empty method body
     * @since 0.0.1
     */
    public backwardLogic() {}
}
