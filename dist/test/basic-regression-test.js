"use strict";
var NeuralNetwork_1 = require('../src/NeuralNetwork');
var Util_1 = require('../src/Util');
var LinearNeuron_1 = require('../src/neurons/LinearNeuron');
var chai_1 = require('chai');
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
    var trainingIterations = 2000;
    var maximumError = 20;
    var f = function (x) { return 10 * x + 15; };
    var fWithNoise = function (x) { return f(x) + Util_1.Util.randomInRage(-5, 5); };
    it('Worked out f(x) after ' + trainingIterations + ' iterations', function () {
        var layers = [
            {
                coefficientGenerator: function () { return Util_1.Util.randomInRage(-0.5, 0.5); },
                neuronCount: 16,
                neuronType: LinearNeuron_1.LinearNeuron,
            },
            {
                coefficientGenerator: function () { return Util_1.Util.randomInRage(-0.5, 0.5); },
                neuronCount: 1,
                neuronType: LinearNeuron_1.LinearNeuron,
            },
        ];
        var nn = new NeuralNetwork_1.NeuralNetwork(1, layers);
        for (var i = 0; i < trainingIterations; i++) {
            var input = Util_1.Util.randomInRage(0, 100);
            var output = [fWithNoise(input)];
            nn.trainWith([input], output, 0.0001);
        }
        var testInput = Util_1.Util.randomInRage(0, 100);
        var testOutput = nn.runWith([testInput])[0];
        var error = Math.abs(f(testInput) - testOutput);
        chai_1.expect(error < maximumError, 'The error was ' + error).to.be.true;
    });
});
