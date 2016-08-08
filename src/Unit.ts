/**
 * A class representing the unit in the neural network
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.1
 */

export class Unit {

    /**
     * Numerical value of the unit determined during the forward pass
     * @since 0.0.1
     */
    public value: number;

    /**
     * Numerical value of the gradient determined during the backwards pass
     * Initialised to 0.0 by default
     * @since 0.0.1
     */
    public gradient: number;

    /**
     * Unit constructor
     * @since 0.0.1
     */
    public constructor(value: number = 0.0, gradient: number = 0.0) {
        this.value = value;
        this.gradient = gradient;
    }

}
