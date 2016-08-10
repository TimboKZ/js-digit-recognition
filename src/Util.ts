/**
 * File containing util methods and classes that do not fit into other files
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.2
 */

/**
 *
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
            output.forEach(function(outputString) {
                console.log(prefix + outputString);
            });
        }
    }
}
