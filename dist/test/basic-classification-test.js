"use strict";
var NeuralNetwork_1 = require('../src/NeuralNetwork');
var Util_1 = require('../src/Util');
var LinearNeuron_1 = require('../src/neurons/LinearNeuron');
var ReLUNeuron_1 = require('../src/neurons/ReLUNeuron');
var chai_1 = require('chai');
var knuth_shuffle_1 = require('knuth-shuffle');
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
    var trainingIterations = 500;
    var trainingSetSize = 5000;
    var layers = [
        {
            coefficientGenerator: function () { return Util_1.Util.randomInRage(-0.5, 0.5); },
            neuronCount: 5,
            neuronType: LinearNeuron_1.LinearNeuron,
        },
        {
            coefficientGenerator: function () { return Util_1.Util.randomInRage(-0.5, 0.5); },
            neuronCount: 16,
            neuronType: ReLUNeuron_1.ReLUNeuron,
        },
        {
            coefficientGenerator: function () { return Util_1.Util.randomInRage(-0.5, 0.5); },
            neuronCount: 1,
            neuronType: LinearNeuron_1.LinearNeuron,
        },
    ];
    var nn = new NeuralNetwork_1.NeuralNetwork(2, layers);
    var trainingSet = [];
    for (var i = 0; i < trainingSetSize; i++) {
        if (i < trainingSetSize * 4 / 5) {
            trainingSet.push({
                label: 1,
                vector: [Util_1.Util.randomInRage(50, 200), Util_1.Util.randomInRage(50, 200)],
            });
        }
        else {
            var random = Util_1.Util.randomInRage(1, 3, true);
            switch (random) {
                case 1:
                    trainingSet.push({
                        label: 0,
                        vector: [-Util_1.Util.randomInRage(50, 200), Util_1.Util.randomInRage(50, 200)],
                    });
                    break;
                case 2:
                    trainingSet.push({
                        label: 0,
                        vector: [-Util_1.Util.randomInRage(50, 200), -Util_1.Util.randomInRage(50, 200)],
                    });
                    break;
                default:
                    trainingSet.push({
                        label: 0,
                        vector: [Util_1.Util.randomInRage(50, 200), -Util_1.Util.randomInRage(50, 200)],
                    });
                    break;
            }
        }
    }
    trainingSet = knuth_shuffle_1.knuthShuffle(trainingSet);
    for (var i = 0; i < trainingIterations; i++) {
        for (var k = 0; k < trainingSet.length; k++) {
            var trainingCase = trainingSet[k];
            nn.trainWith(trainingCase.vector, [trainingCase.label], 0.00001);
        }
    }
    var vector0 = [-Util_1.Util.randomInRage(50, 150), -Util_1.Util.randomInRage(50, 150)];
    var vector1 = [Util_1.Util.randomInRage(50, 150), Util_1.Util.randomInRage(50, 150)];
    var vector0Output = nn.runWith(vector0)[0];
    it('Correctly labels a vector as 0.0 after ' + trainingIterations + ' iterations', function () {
        chai_1.expect(Math.round(vector0Output), vector0Output + '').to.equal(0);
    });
    var vector1Output = nn.runWith(vector1)[0];
    it('Correctly labels a vector as 1.0 after ' + trainingIterations + ' iterations', function () {
        chai_1.expect(Math.round(vector1Output), vector1Output + '').to.equal(1);
    });
});
