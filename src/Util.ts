/**
 * File containing util methods and classes that do not fit into other files
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.4
 */

/**
 * Class containing various static helper functions
 * @since 0.0.1
 */
export class Util {
    /**
     * Sigma function that maps all integers into (0, 1)
     * @since 0.0.1
     */
    public static sigma(x: number): number {
        return 1 / (1 + Math.exp(-x));
    }

    /**
     * Logs NN test output
     * @since 0.0.2
     */
    public static logTest(output: string | string[] = '') {
        let colors = require('colors');
        let prefix = colors.yellow('[TEST] ');
        if (typeof output === 'string') {
            console.log(prefix + output);
        } else {
            output.forEach(function (outputString) {
                console.log(prefix + outputString);
            });
        }
    }

    /**
     * Generate a random number in specified range.
     * @since 0.0.3
     */
    public static randomInRage(min: number, max: number, integersOnly: boolean = false) {
        if (integersOnly) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
        return Math.random() * (max - min) + min;
    }

    /**
     * Recursive function that runs an asynchronous for loop. The last parameter, `index`, is used as an accumulator.
     * @since 0.0.4
     */
    public static asyncFor(iterations: number, operation: () => void, callback: () => void, index: number = 0) {
        if (index < iterations) {
            operation();
            Util.asyncFor(iterations, operation, callback, index + 1);
        } else {
            callback();
        }
    }
}
