import {Unit} from './Unit';
import {Neuron} from './neurons/Neuron';
import {SigmoidalNeuron} from './neurons/SigmoidalNeuron';
/**
 * File containing all interfaces and classes related to the representation of a Neuron layer
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.4
 */

/**
 * Interface used to resolve the issue with complex type hinting in TypeScript when passing a class as a method
 * parameter. Used in Layer.fromUnits() for the `neuronType` parameter.
 * @since 0.0.4
 */
interface INeuronTypeParameter {
    new (...args: any[]): Neuron;
}

/**
 * Class representing the base layer, used mostly for hidden layers
 * @since 0.0.1
 */
export class Layer {

    /**
     * Reference to the previous layer, null if there is no previous layer. If the value is null, the current layer
     * is considered to be the input layer.
     * @since 0.0.1
     */
    private previousLayer: Layer;

    /**
     * Reference to the next layer, null if there is no next layer
     * @since 0.0.1
     */
    private nextLayer: Layer;

    /**
     * Neurons that make up the layer
     * @since 0.0.1
     */
    private neurons: Neuron[];

    /**
     * Output units from all of the neurons in the layer, can be requested by the next layer
     * @since 0.0.1
     */
    private outputUnits: Unit[];

    /**
     * Layer constructor.
     * @since 0.0.2 Removed `private` access modifier
     * @since 0.0.1
     */
    constructor(neurons: Neuron[], outputUnits: Unit[], previousLayer?: Layer) {
        this.neurons = neurons;
        this.outputUnits = outputUnits;
        if (previousLayer) {
            this.previousLayer = previousLayer;
        }
    }

    /**
     * Generates a layer of neurons using an array of Units. Each unit is mapped 1-to-1 with a single Neuron.
     * `neuronType` supplied determines the types of Neurons that will be used to populate this layer. Available
     * types of neurons are:
     * - Neuron (linear neuron)
     * - SigmoidalNeuron (log-sigmoidal neuron)
     * @since 0.0.4 The type of `neuronType` is now INeuronTypeParameter
     * @since 0.0.3 Renamed fromValues() to fromUnits(), now accepts `neuronType` as a parameter
     * @since 0.0.1
     */
    public static fromUnits(units: Unit[], neuronType: INeuronTypeParameter = Neuron): Layer {
        let neurons: Neuron[] = [];
        let outputUnits: Unit[] = [];
        for (let i = 0; i < units.length; i++) {
            outputUnits[i] = new Unit();
            let variableUnits = new Unit(1.0);
            switch (typeof neuronType) {
                case typeof SigmoidalNeuron:
                    neurons[i] = new SigmoidalNeuron(units[i], outputUnits[i], variableUnits);
                    break;
                case typeof Neuron:
                    neurons[i] = new Neuron(units.slice(i, i + 1), outputUnits[i], [variableUnits]);
                    break;
                default:
                    throw new Error('Unrecognised Neuron type supplied to the layer constructor!');
            }
        }
        return new Layer(neurons, outputUnits);
    }

    /**
     * Generates a layer of neurons using the previous layer as the input provider and the neuron count supplied. If
     * neuronCount is 1 this layer can be considered an output layer. The value for the variable units is determined
     * randomly in range from 0.5 to -0.5
     * @since 0.0.2 Added type for `variableUnits`
     * @since 0.0.1
     */
    public static fromLayer(neuronCount: number, previousLayer: Layer): Layer {
        let neurons: Neuron[] = [];
        let outputUnits: Unit[] = [];
        for (let i = 0; i < neuronCount; i++) {
            outputUnits[i] = new Unit();
            let variableUnits: Unit[] = [];
            let inputUnitsLength = previousLayer.getOutputUnits().length;
            for (let k = 0; k < inputUnitsLength + 1; k++) {
                variableUnits.push(new Unit((Math.random() - 0.5) / 4));
            }
            neurons[i] = new Neuron(previousLayer.getOutputUnits(), outputUnits[i], variableUnits);
        }
        return new Layer(neurons, outputUnits, previousLayer);
    }

    /**
     * Trigger the forward pass. Runs the forward pass on all of the neurons in the layer forcing them to update the
     * `outputUnits` array. When the pass is complete, triggers the forward pass in the next layer.
     * @since 0.0.1
     */
    public forward() {
        for (let i = 0; i < this.neurons.length; i++) {
            this.neurons[i].forward();
        }
        if (this.nextLayer) {
            this.nextLayer.forward();
        }
    }

    /**
     * Triggers a backward pass. Causes all of the neurons in the layer to backdrop the gradients of the output and
     * input units. If the current layer is not an input layer, also causes the neurons to
     * adjust their variable units.
     * @since 0.0.1
     */
    public backward(stepSize: number) {
        for (let i = 0; i < this.neurons.length; i++) {
            if (this.previousLayer) {
                this.neurons[i].backward(stepSize);
            } else {
                this.neurons[i].backward();
            }
        }
    }

    /**
     * Setter for nextLayer, used by the NeuralNetwork class
     * @since 0.0.1
     */
    public setNextLayer(layer: Layer) {
        this.nextLayer = layer;
    }

    /**
     * Output units getter, used by the next layer or to extract the result from output layer
     * @since 0.0.1
     */
    public getOutputUnits(): Unit[] {
        return this.outputUnits;
    }
}
