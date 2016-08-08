/**
 * File containing all interfaces and classes related to data parsing and structuring
 *
 * @author Timur Kuzhagaliyev <tim@xaerus.co.uk>
 * @copyright 2016
 * @license https://opensource.org/licenses/mit-license.php MIT License
 * @version 0.0.3
 */
"use strict";
/**
 * Format for the path of the JPEG files with raw data. The `{DIGIT}` substring will be replaced with the actual
 * digit supplied to the data parser.
 * @since 0.0.1
 */
var IMAGE_PATH_FORMAT = 'raw_data/usps_{DIGIT}.jpg';
/**
 * Size of the image in pixels, assuming square image
 * @since 0.0.1
 */
var IMAGE_SIZE = 16;
/**
 * Default data set size, JPEG images in `raw_data` directory all have 1100 16x16 pixel images
 * @since 0.0.1
 */
var DATA_SET_SIZE = 1100;
/**
 * Size of the subset of the data set that will be used for training. The rest will be used for testing.
 * @since 0.0.1
 */
var TRAINING_SET_SIZE = 550;
/**
 * Reads data from the JPG images in `raw_data` folder, breaking down the images into individual digits and converting
 * @since 0.0.1
 */
var DataParser = (function () {
    function DataParser() {
    }
    /**
     * Returns a data set for the specified number either from the JPEG file or cache
     * @since 0.0.3 Variable now static
     * @since 0.0.1
     */
    DataParser.getDataSet = function (digit) {
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
    };
    /**
     * Attempts to extract raw image data from the specified image, otherwise returns null
     * @since 0.0.3 Method now static
     * @since 0.0.1
     */
    DataParser.getImageData = function (imagePath) {
        var jpeg = require('jpeg-js');
        var fs = require('fs');
        var jpegData;
        try {
            jpegData = fs.readFileSync(imagePath);
        }
        catch (exception) {
            throw new Error('Could not find the specified image! `' + imagePath + '`');
        }
        return jpeg.decode(jpegData, true);
    };
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
    DataParser.buildDataSet = function (digit, imageData) {
        var rows = imageData.width / IMAGE_SIZE;
        var columns = imageData.height / IMAGE_SIZE;
        if (DATA_SET_SIZE > rows * columns) {
            throw new Error('Provided imageData contains less images than expected! ' + rows * columns + ' < ' + DATA_SET_SIZE);
        }
        var trainingMatrices = [];
        var testingMatrices = [];
        var matrixCounter = 0;
        for (var columnsIterator = 0; columnsIterator < columns; columnsIterator++) {
            for (var rowsIterator = 0; rowsIterator < rows; rowsIterator++) {
                matrixCounter++;
                var digitMatrix = {
                    digit: digit,
                    matrix: DataParser.subImage(rowsIterator * IMAGE_SIZE, columnsIterator * IMAGE_SIZE, IMAGE_SIZE, columns, imageData.data),
                };
                if (matrixCounter < TRAINING_SET_SIZE) {
                    trainingMatrices.push(digitMatrix);
                }
                else {
                    testingMatrices.push(digitMatrix);
                }
            }
        }
        return {
            trainingSet: trainingMatrices,
            testingSet: testingMatrices,
        };
    };
    /**
     * Extract a sub-image from the supplied imageData
     * @since 0.0.1
     */
    DataParser.subImage = function (startX, startY, size, columns, imageData) {
        var subImage = [];
        var index = 0;
        for (var row = 0; row < size; row++) {
            for (var column = 0; column < size; column++) {
                var imageDataIndex = DataParser.coordinatesToIndex(row + startX, column + startY, columns);
                subImage[index] = imageData[imageDataIndex * 4];
                index++;
            }
        }
        return subImage;
    };
    /**
     * Converts 2D coordinates to an array assuming enumeration goes from left to right and then from top to bottom.
     * Uses the IMAGE_SIZE constant.
     * @since 0.0.1
     */
    DataParser.coordinatesToIndex = function (x, y, columns) {
        return x + y * columns * IMAGE_SIZE;
    };
    /**
     * Combines the supplied data sets, randomising the order of matrices if required
     * @since 0.0.3 Fixed bug where empty arrays would be returned for sets
     * @since 0.0.2
     */
    DataParser.combineDataSets = function (dataSets, randomise) {
        if (randomise === void 0) { randomise = false; }
        var allTrainingSets = [];
        var allTestingSets = [];
        for (var i = 0; i < dataSets.length; i++) {
            allTrainingSets = allTrainingSets.concat(dataSets[i].trainingSet);
            allTestingSets = allTestingSets.concat(dataSets[i].testingSet);
        }
        if (randomise) {
            var shuffle = require('knuth-shuffle').knuthShuffle;
            allTrainingSets = shuffle(allTrainingSets);
            allTestingSets = shuffle(allTestingSets);
        }
        return {
            trainingSet: allTrainingSets,
            testingSet: allTestingSets
        };
    };
    /**
     * Stores data for each digits that were previously accessed in case a specific data set will be requested again
     * @since 0.0.3 Variable now static
     * @since 0.0.1
     */
    DataParser.dataCache = [];
    return DataParser;
}());
exports.DataParser = DataParser;
//# sourceMappingURL=DataParser.js.map