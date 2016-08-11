"use strict";
var NeuralNetwork_1 = require('../src/NeuralNetwork');
var Util_1 = require('../src/Util');
/**
 * Some naive
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.1
 */
var expect = require('chai').expect;
describe('Neuron network with single input layer', function () {
    it('returns the input values as output', function () {
        var inputCount = 10;
        var nn = new NeuralNetwork_1.NeuralNetwork(inputCount);
        var inputValues = [];
        for (var i = 0; i < inputCount; i++) {
            inputValues[i] = Util_1.Util.randomInRage(0, inputCount, true);
        }
        expect(nn.runWith(inputValues)).to.equal(inputValues);
    });
});
