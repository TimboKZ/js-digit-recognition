/**
 * File containing all interfaces and classes related to data parsing and structuring
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.4
 */

/**
 * Format for the path of the JPEG files with raw data. The `{DIGIT}` substring will be replaced with the actual
 * digit supplied to the data parser.
 * @since 0.0.1
 */
const IMAGE_PATH_FORMAT = 'raw_data/usps_{DIGIT}.jpg';

/**
 * Size of the image in pixels, assuming square image
 * @since 0.0.1
 */
const IMAGE_SIZE = 16;

/**
 * Default data set size, JPEG images in `raw_data` directory all have 1100 16x16 pixel images
 * @since 0.0.1
 */
const DATA_SET_SIZE = 1100;

/**
 * Size of the subset of the data set that will be used for training. The rest will be used for testing.
 * @since 0.0.1
 */
const TRAINING_SET_SIZE = 550;

/**
 * Interface representing a digit, contains the integer corresponding to the digit and an 16x16 matrix of pixels.
 * The images are greyscale so just one number per pixel is enough to retrieve the RGB breakdown.
 * @since 0.0.4 Added `export` keyword
 * @since 0.0.1
 */
export interface IDigitMatrix {
    digit: number;
    matrix: number[];
}

/**
 * A data set consisting of a training set and testing set, to be used for training and testing of the
 * neural network respectively
 * @since 0.0.1
 */
interface IDigitDataSet {
    trainingSet: IDigitMatrix[];
    testingSet: IDigitMatrix[];
}

/**
 * Interface for the data for the neural network. Consists of key-value pairs where an integer is the key and
 * IDigitDataSet is the value.
 * @since 0.0.1
 */
interface IData {
    [digit: number]: IDigitDataSet;
}

/**
 * Structure of the data returned by the jpeg-js' decode method
 * @since 0.0.1
 */
interface IImageData {
    height: number;
    width: number;
    data: Uint8Array;
}

/**
 * Reads data from the JPG images in `raw_data` folder, breaking down the images into individual digits and converting
 * @since 0.0.1
 */
export class DataParser {

    /**
     * Stores data for each digits that were previously accessed in case a specific data set will be requested again
     * @since 0.0.3 Variable now static
     * @since 0.0.1
     */
    private static dataCache: IData = [];

    /**
     * Returns a data set for the specified number either from the JPEG file or cache
     * @since 0.0.3 Variable now static
     * @since 0.0.1
     */
    public static getDataSet(digit: number): IDigitDataSet {
        if (this.dataCache[digit]) {
            return this.dataCache[digit];
        }
        var regexp = new RegExp('\{DIGIT\}');
        var imageData = DataParser.getImageData(IMAGE_PATH_FORMAT.replace(regexp, digit.toString()));
        if (!imageData) {
            return null;
        }
        var dataSet = DataParser.buildDataSet(digit, imageData);
        this.dataCache[digit] = dataSet;
        return dataSet;
    }

    /**
     * Attempts to extract raw image data from the specified image, otherwise returns null
     * @since 0.0.3 Method now static
     * @since 0.0.1
     */
    public static getImageData(imagePath: string): IImageData {
        var jpeg = require('jpeg-js');
        var fs = require('fs');
        var jpegData: string;
        try {
            jpegData = fs.readFileSync(imagePath);
        } catch (exception) {
            throw new Error('Could not find the specified image! `' + imagePath + '`');
        }
        return jpeg.decode(jpegData, true);
    }

    /**
     * Builds a data set based on the supplied image data. Uses the following assumptions:
     * - The dimensions of the image are multiples of IMAGE_SIZE
     * - Each handwritten digit is a IMAGE_SIZExIMAGE_SIZE pixel image
     * - There are exactly DATA_SET_SIZE images to be extracted
     * - Images are to be read from top to bottom, starting at the leftmost column
     * - The size of the training subset is TRAINING_SET_SIZE
     * - The size of the testing subset is DATA_SET_SIZE - TRAINING_SET_SIZE
     * @since 0.0.1
     */
    public static buildDataSet(digit: number, imageData: IImageData): IDigitDataSet {
        let rows = imageData.width / IMAGE_SIZE;
        let columns = imageData.height / IMAGE_SIZE;
        if (DATA_SET_SIZE > rows * columns) {
            throw new Error('Provided imageData contains less images than expected! ' + rows * columns + ' < ' + DATA_SET_SIZE);
        }
        let trainingMatrices: IDigitMatrix[] = [];
        let testingMatrices: IDigitMatrix[] = [];
        let matrixCounter = 0;
        for (let columnsIterator = 0; columnsIterator < columns; columnsIterator++) {
            for (let rowsIterator = 0; rowsIterator < rows; rowsIterator++) {
                matrixCounter++;
                let digitMatrix = {
                    digit: digit,
                    matrix: DataParser.subImage(
                        rowsIterator * IMAGE_SIZE,
                        columnsIterator * IMAGE_SIZE,
                        IMAGE_SIZE,
                        columns,
                        imageData.data
                    ),
                };
                if (matrixCounter < TRAINING_SET_SIZE) {
                    trainingMatrices.push(digitMatrix);
                } else {
                    testingMatrices.push(digitMatrix);
                }
            }
        }
        return {
            trainingSet: trainingMatrices,
            testingSet: testingMatrices,
        }
    }

    /**
     * Extract a sub-image from the supplied imageData
     * @since 0.0.1
     */
    private static subImage(startX: number, startY: number, size: number, columns: number, imageData: Uint8Array): number[] {
        let subImage: number[] = [];
        let index = 0;
        for (let row = 0; row < size; row++) {
            for (let column = 0; column < size; column++) {
                let imageDataIndex = DataParser.coordinatesToIndex(row + startX, column + startY, columns);
                subImage[index] = imageData[imageDataIndex * 4];
                index++;
            }
        }
        return subImage;
    }

    /**
     * Converts 2D coordinates to an array assuming enumeration goes from left to right and then from top to bottom.
     * Uses the IMAGE_SIZE constant.
     * @since 0.0.1
     */
    private static coordinatesToIndex(x: number, y: number, columns: number): number {
        return x + y * columns * IMAGE_SIZE;
    }

    /**
     * Combines the supplied data sets, randomising the order of matrices if required
     * @since 0.0.3 Fixed bug where empty arrays would be returned for sets
     * @since 0.0.2
     */
    public static combineDataSets(dataSets: IDigitDataSet[], randomise: boolean = false): IDigitDataSet {
        let allTrainingSets: IDigitMatrix[] = [];
        let allTestingSets: IDigitMatrix[] = [];
        for(let i = 0; i < dataSets.length; i++) {
            allTrainingSets = allTrainingSets.concat(dataSets[i].trainingSet);
            allTestingSets = allTestingSets.concat(dataSets[i].testingSet);
        }
        if(randomise) {
            var shuffle = require('knuth-shuffle').knuthShuffle;
            allTrainingSets = shuffle(allTrainingSets);
            allTestingSets = shuffle(allTestingSets);
        }
        return {
            trainingSet: allTrainingSets,
            testingSet: allTestingSets
        }
    }

}
