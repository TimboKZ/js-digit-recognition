import {ILayerConfiguration} from '../src/Layer';
import {NeuralNetwork} from '../src/NeuralNetwork';
import {Util} from '../src/Util';
import {LinearNeuron} from '../src/neurons/LinearNeuron';
import {ReLUNeuron} from '../src/neurons/ReLUNeuron';
import {knuthShuffle} from 'knuth-shuffle';
import {expect} from 'chai';
/**
 * Basic smoke tests to check that classification works correctly with 2 classes
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.1
 */

/**
 * Simple classification using an array of 2D vectors as the data set. The neural network should output 1.0 if the
 * number belongs to the `positive` region (i.e. x > 0 and y > 0) or 0.0 if it doesn't.
 * @since 0.0.1
 */
describe('Neural network with 3 linear, 1 ReLU and 1 sigmoid output neurons', function () {
    let trainingIterations = 500;
    let trainingSetSize = 5000;
    let layers: ILayerConfiguration[] = [
        {
            coefficientGenerator: () => Util.randomInRage(-0.5, 0.5),
            neuronCount: 5,
            neuronType: LinearNeuron,
        },
        {
            coefficientGenerator: () => Util.randomInRage(-0.5, 0.5),
            neuronCount: 16,
            neuronType: ReLUNeuron,
        },
        {
            coefficientGenerator: () => Util.randomInRage(-0.5, 0.5),
            neuronCount: 1,
            neuronType: LinearNeuron,
        },
    ];
    let nn = new NeuralNetwork(2, layers);
    let trainingSet: { label: number, vector: number[] }[] = [];
    for (let i = 0; i < trainingSetSize; i++) {
        if (i < trainingSetSize * 4 / 5) {
            trainingSet.push({
                label: 1,
                vector: [Util.randomInRage(50, 200), Util.randomInRage(50, 200)],
            });
        } else {
            let random = Util.randomInRage(1, 3, true);
            switch (random) {
                case 1:
                    trainingSet.push({
                        label: 0,
                        vector: [-Util.randomInRage(50, 200), Util.randomInRage(50, 200)],
                    });
                    break;
                case 2:
                    trainingSet.push({
                        label: 0,
                        vector: [-Util.randomInRage(50, 200), -Util.randomInRage(50, 200)],
                    });
                    break;
                default:
                    trainingSet.push({
                        label: 0,
                        vector: [Util.randomInRage(50, 200), -Util.randomInRage(50, 200)],
                    });
                    break;
            }
        }
    }
    trainingSet = knuthShuffle(trainingSet);
    for (let i = 0; i < trainingIterations; i++) {
        for (let k = 0; k < trainingSet.length; k++) {
            let trainingCase = trainingSet[k];
            nn.trainWith(trainingCase.vector, [trainingCase.label], 0.00001);
        }
    }
    let vector0 = [-Util.randomInRage(50, 150), -Util.randomInRage(50, 150)];
    let vector1 = [Util.randomInRage(50, 150), Util.randomInRage(50, 150)];

    let vector0Output = nn.runWith(vector0)[0];
    it('Correctly labels a vector as 0.0 after ' + trainingIterations + ' iterations', function () {
        expect(Math.round(vector0Output), vector0Output + '').to.equal(0);
    });
    let vector1Output = nn.runWith(vector1)[0];
    it('Correctly labels a vector as 1.0 after ' + trainingIterations + ' iterations', function () {
        expect(Math.round(vector1Output), vector1Output + '').to.equal(1);
    });
});
