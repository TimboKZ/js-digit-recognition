import {ILayerConfiguration} from '../src/Layer';
import {NeuralNetwork} from '../src/NeuralNetwork';
import {Util} from '../src/Util';
import {LinearNeuron} from '../src/neurons/LinearNeuron';
import {expect} from 'chai';
/**
 * File containing some fairly simple tests to confirm that neural network has at least some capabilities to
 * approximate the output of linear functions.
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.1
 */

/**
 * A very simple test to see if the neural network can work out the function that was used on the data set to
 * produce the expected output. The function used is f(x) = 10x + 15
 * @since 0.0.1
 */
describe('Neural network with 16 hidden linear neurons', function () {
    let trainingIterations = 2000;
    let maximumError = 20;
    let f = (x: number) => 10 * x + 15;
    let fWithNoise = (x: number) => f(x) + Util.randomInRage(-5, 5);
    it('Worked out f(x) after ' + trainingIterations + ' iterations', function () {
        let layers: ILayerConfiguration[] = [
            {
                coefficientGenerator: () => Util.randomInRage(-0.5, 0.5),
                neuronCount: 16,
                neuronType: LinearNeuron,
            },
            {
                coefficientGenerator: () => Util.randomInRage(-0.5, 0.5),
                neuronCount: 1,
                neuronType: LinearNeuron,
            },
        ];
        let nn = new NeuralNetwork(1, layers);
        for (let i = 0; i < trainingIterations; i++) {
            let input = Util.randomInRage(0, 100);
            let output = [fWithNoise(input)];
            nn.trainWith([input], output, 0.0001);
        }
        let testInput = Util.randomInRage(0, 100);
        let testOutput = nn.runWith([testInput])[0];
        let error = Math.abs(f(testInput) - testOutput);
        expect(error < maximumError, 'The error was ' + error).to.be.true;
    });
});
