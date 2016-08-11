import {LinearNeuron} from './LinearNeuron';
/**
 * File containing all classes and interface related to ReLU neurons
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.2
 */

/**
 * ReLU neuron class
 * @since 0.0.2 Now extends LinearNeuron instead of Neuron which is now abstract
 * @since 0.0.1
 */
export class ReLUNeuron extends LinearNeuron {
    /**
     * Applies ReLU after the forward pass of Neuron class
     * @since 0.0.2 Renamed `forward()` to `forwardLogic()` as per new architecture
     * @since 0.0.1
     */
    public forwardLogic() {
        super.forwardLogic();
        this.outputUnit.value = Math.max(0, this.outputUnit.value);
    }

    /**
     * Stops the gradient backpropogation if the neuron did not fire
     * @since 0.0.2 Renamed `backward()` to `backwardLogic()` as per new architecture
     * @since 0.0.1
     */
    public backwardLogic(stepSize?: number) {
        if (this.outputUnit.value === 0.0) {
            this.outputUnit.gradient = 0.0;
        }
        super.backwardLogic(stepSize);
    }
}
