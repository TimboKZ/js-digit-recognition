import {Neuron} from './Neuron';
/**
 * File containing all classes and interface related to ReLU neurons
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.1
 */

/**
 * ReLU neuron class
 * @since 0.0.1
 */
export class ReLUNeuron extends Neuron {
    /**
     * Applies ReLU after the forward pass of Neuron class
     * @since 0.0.1
     */
    public forward() {
        super.forward();
        this.outputUnit.value = Math.max(0, this.outputUnit.value);
    }

    /**
     * Stops the gradient backpropogation if the neuron did not fire
     * @since 0.0.1
     */
    public backward(stepSize?: number) {
        if (this.outputUnit.value === 0.0) {
            return;
        }
        super.backward(stepSize);
    }
}
