import {Unit} from './Unit';
import {Neuron} from './neurons/Neuron';
import {ReLUNeuron} from './neurons/ReLUNeuron';
import {SigmoidNeuron} from './neurons/SigmoidNeuron';
/**
 * File containing all interfaces and classes related to the representation of a Neuron layer
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.8
 */

/**
 * Interface used to resolve the issue with complex type hinting in TypeScript when passing a class as a method
 * parameter. Used in Layer.fromUnits() for the `neuronType` parameter.
 * @since 0.0.5 Add `export` keyword
 * @since 0.0.4
 */
export interface INeuronTypeParameter {
    new (...args: any[]): Neuron;
}

/**
 * An interface used for configuration of the layer
 * @since 0.0.6 Renamed `generateCoefficient` to `coefficientGenerator`
 * @since 0.0.5
 */
export interface ILayerConfiguration {
    neuronType: INeuronTypeParameter;
    coefficientGenerator: () => number;
    neuronCount?: number;
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
     * - SigmoidNeuron (log-sigmoidal neuron)
     * @since 0.0.8 Added ReLUNeurons
     * @since 0.0.7 Removed `typeof` keywords from switch-case statement
     * @since 0.0.5 Now accepts `previousLayer` as a parameter, ILayerConfiguration instead of `neuronType`
     * @since 0.0.4 The type of `neuronType` is now INeuronTypeParameter
     * @since 0.0.3 Renamed fromValues() to fromUnits(), now accepts `neuronType` as a parameter
     * @since 0.0.1
     */
    public static fromUnits(units: Unit[], config: ILayerConfiguration, previousLayer?: Layer): Layer {
        let neurons: Neuron[] = [];
        let outputUnits: Unit[] = [];
        for (let i = 0; i < units.length; i++) {
            outputUnits[i] = new Unit();
            let variableUnits = new Unit(config.coefficientGenerator());
            switch (config.neuronType) {
                case SigmoidNeuron:
                    neurons[i] = new SigmoidNeuron(units[i], outputUnits[i], variableUnits);
                    break;
                case ReLUNeuron:
                    neurons[i] = new ReLUNeuron(units.slice(i, i + 1), outputUnits[i], [variableUnits]);
                    break;
                case Neuron:
                    neurons[i] = new Neuron(units.slice(i, i + 1), outputUnits[i], [variableUnits]);
                    break;
                default:
                    throw new Error('Unrecognised Neuron type supplied to the layer constructor!');
            }
        }
        return new Layer(neurons, outputUnits, previousLayer);
    }

    /**
     * Generates a layer of neurons using the previous layer as the input provider and the layer configuration
     * supplied. The value for the variable units is determined randomly, check the code to see how the value for
     * variable `coefficient` is calculated.
     * @since 0.0.8 Added ReLUNeurons
     * @since 0.0.7 Removed `typeof` keywords from switch-case statement
     * @since 0.0.5 Now takes ILayerConfiguration instead of neuron count
     * @since 0.0.2 Added type for `variableUnits`
     * @since 0.0.1
     */
    public static fromLayer(config: ILayerConfiguration, previousLayer: Layer): Layer {
        switch (config.neuronType) {
            case SigmoidNeuron:
                return Layer.fromUnits(previousLayer.getOutputUnits(), config, previousLayer);
            case ReLUNeuron:
            case Neuron:
                let neurons: Neuron[] = [];
                let outputUnits: Unit[] = [];
                let neuronCount = config.neuronCount;
                for (let i = 0; i < neuronCount; i++) {

                    outputUnits[i] = new Unit();
                    let variableUnits: Unit[] = [];
                    let inputUnitsLength = previousLayer.getOutputUnits().length;
                    for (let k = 0; k < inputUnitsLength + 1; k++) {
                        variableUnits.push(new Unit(config.coefficientGenerator()));
                    }
                    neurons[i] = new config.neuronType(previousLayer.getOutputUnits(), outputUnits[i], variableUnits);

                }
                return new Layer(neurons, outputUnits, previousLayer);
            default:
                throw new Error('Unrecognised Neuron type supplied to the layer constructor!');
        }
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
