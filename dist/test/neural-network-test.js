"use strict";
var NeuralNetwork_1 = require('../src/NeuralNetwork');
var Util_1 = require('../src/Util');
var LinearNeuron_1 = require('../src/neurons/LinearNeuron');
var ReLUNeuron_1 = require('../src/neurons/ReLUNeuron');
var chai_1 = require('chai');
/**
 * Some naive
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.3
 */
/**
 * Testing a neural network with a single input layer
 * @since 0.0.1
 */
describe('Neural network with single input layer', function () {
    it('Returns the input values as output', function () {
        var inputCount = 10;
        var nn = new NeuralNetwork_1.NeuralNetwork(inputCount);
        var inputValues = [];
        for (var i = 0; i < inputCount; i++) {
            inputValues[i] = Util_1.Util.randomInRage(0, inputCount, true);
        }
        chai_1.expect(nn.runWith(inputValues)).deep.equal(inputValues);
    });
});
/**
 * Testing a neural network with an input layer, an output layer and no hidden layers, using linear neurons
 * @since 0.0.3 Increased `trainingIterations` to give a more consistent ReLU neuron performance
 * @since 0.0.2
 */
describe('Neural network with an output layer', function () {
    it('Returns the right amount of outputs', function () {
        var testCases = [1, 10, 20];
        testCases.forEach(function (outputCount) {
            var layers = [
                {
                    coefficientGenerator: function () { return 0; },
                    neuronCount: outputCount,
                    neuronType: LinearNeuron_1.LinearNeuron,
                },
            ];
            var nn = new NeuralNetwork_1.NeuralNetwork(1, layers);
            chai_1.expect(nn.runWith([1]).length).to.equal(outputCount);
        });
    });
    var trainingIterations = 5000;
    var neuronTypes = {
        'linear': LinearNeuron_1.LinearNeuron,
        'ReLU': ReLUNeuron_1.ReLUNeuron,
    };
    var _loop_1 = function(neuronType) {
        if (neuronTypes.hasOwnProperty(neuronType)) {
            it('Learns with one ' + neuronType + ' neuron after ' + trainingIterations + ' iterations', function () {
                var layers = [
                    {
                        coefficientGenerator: function () { return Util_1.Util.randomInRage(-0.5, 0.5); },
                        neuronCount: 1,
                        neuronType: neuronTypes[neuronType],
                    },
                ];
                var nn = new NeuralNetwork_1.NeuralNetwork(1, layers);
                var input = [5];
                var expectedOutput = [3];
                for (var i = 0; i < trainingIterations; i++) {
                    nn.trainWith(input, expectedOutput, 0.0001);
                }
                chai_1.expect(nn.runWith(input, Math.round)).deep.equal(expectedOutput);
            });
        }
    };
    for (var neuronType in neuronTypes) {
        _loop_1(neuronType);
    }
});
