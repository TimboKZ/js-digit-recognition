import {NeuralNetwork} from '../src/NeuralNetwork';
import {Util} from '../src/Util';
/**
 * Some naive
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.1
 */

let expect = require('chai').expect;
describe('Neuron network with single input layer', function () {
    it('returns the input values as output', function () {
        let inputCount = 10;
        let nn = new NeuralNetwork(inputCount);
        let inputValues: number[] = [];
        for (let i = 0; i < inputCount; i++) {
            inputValues[i] = Util.randomInRage(0, inputCount, true);
        }
        expect(nn.runWith(inputValues)).to.equal(inputValues);
    });
});
