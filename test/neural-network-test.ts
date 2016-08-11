import {ILayerConfiguration, INeuronTypeParameter} from '../src/Layer';
import {NeuralNetwork} from '../src/NeuralNetwork';
import {Util} from '../src/Util';
import {LinearNeuron} from '../src/neurons/LinearNeuron';
import {ReLUNeuron} from '../src/neurons/ReLUNeuron';
import {SigmoidNeuron} from '../src/neurons/SigmoidNeuron';
import {expect} from 'chai';
/**
 * Some naive
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.2
 */

/**
 * Testing a neural network with a single input layer
 * @since 0.0.1
 */
describe('Neural network with single input layer', function () {
    it('Returns the input values as output', function () {
        let inputCount = 10;
        let nn = new NeuralNetwork(inputCount);
        let inputValues: number[] = [];
        for (let i = 0; i < inputCount; i++) {
            inputValues[i] = Util.randomInRage(0, inputCount, true);
        }
        expect(nn.runWith(inputValues)).deep.equal(inputValues);
    });
});

/**
 * Testing a neural network with an input layer, an output layer and no hidden layers, using linear neurons
 * @since 0.0.2
 */
describe('Neural network with an output layer', function () {
    it('Returns the right amount of outputs', function () {
        let testCases: number[] = [1, 10, 20];
        testCases.forEach(function (outputCount: number) {
            let layers: ILayerConfiguration[] = [
                {
                    coefficientGenerator: () => 0,
                    neuronCount: outputCount,
                    neuronType: LinearNeuron,
                },
            ];
            let nn = new NeuralNetwork(1, layers);
            expect(nn.runWith([1]).length).to.equal(outputCount);
        });
    });

    let trainingIterations = 2000;
    let neuronTypes: {[neuronType: string]: INeuronTypeParameter} = {
        'linear': LinearNeuron,
        'ReLU': ReLUNeuron,
    };
    for (let neuronType in neuronTypes) {
        if (neuronTypes.hasOwnProperty(neuronType)) {
            it('Learns with one ' + neuronType + ' neuron after ' + trainingIterations + ' iterations', function () {
                let layers: ILayerConfiguration[] = [
                    {
                        coefficientGenerator: () => Util.randomInRage(-0.5, 0.5),
                        neuronCount: 1,
                        neuronType: neuronTypes[neuronType],
                    },
                ];
                let nn = new NeuralNetwork(1, layers);
                let input = [5];
                let expectedOutput = [3];
                for (let i = 0; i < trainingIterations; i++) {
                    nn.trainWith(input, expectedOutput, 0.0001);
                }
                expect(nn.runWith(input, Math.round)).deep.equal(expectedOutput);
            });
        }
    }

});
