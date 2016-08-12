# JS Digit Recognition

My attempt to write a digit recognition engine in JavaScript (TypeScript to be precise). This tool utilises some very basic concepts behind neural networks.

# Data set

As my data set I'm using [USPS Handwritten Digits](http://www.cs.nyu.edu/~roweis/data/usps_all.mat) (also found as jpeg in the `raw_data` folder). I do appreciate the fact that it is a **very** small data set but in my opinion it will suffice for this simple exercise.

# Demo output

[Click here](https://www.youtube.com/watch?v=8lpwIMJbLHU) for a short video of the classifier in action. 

Here's an excerpt of the console output after running `dist/test/digit-classification-test.js`:

```bash
[TEST] Output:  Expected > 7  Actual > 7
[TEST]
[TEST] CORRECT GUESS
[TEST]
[TEST] Neuron outputs:
[TEST]
[TEST]    0  ◆         0
[TEST]    1  ◆         1
[TEST]    2  ◆         2
[TEST]    3 ◆          3
[TEST]    4 ◆          4
[TEST]    5  ◆         5
[TEST]    6 ◆          6
[TEST]  > 7          ◆ 7 <
[TEST]    8 ◆          8
[TEST]    9  ◆         9
[TEST]
[TEST] Image of the digit:
[TEST]
[TEST] █
[TEST]       ██  █ ████
[TEST]   ██████████████
[TEST]  ███████ █ █████
[TEST] █████      ███
[TEST] ███        ███
[TEST]           ███
[TEST]          ████
[TEST]          ███
[TEST]         ███
[TEST]        ████
[TEST]        ███
[TEST]       ███
[TEST]      ███
[TEST]     ███
[TEST]     ██
[TEST]    ██

Accuracy after 243 iterations: 0.789 [---------------->

```

# Running the classifier

The TypeScript source code for the neural network abstraction itself can be found in the `src` folder. Technically, it can be used as a standalone solution so feel free to reuse any of the code found there.

The TypeScript source code for the tests can be found in the `test` folder. All of the files there are [Mocha](https://mochajs.org/) tests except for the digit classification test itself, found in `digit-classification-test.ts`. 

The easiest way to run the tests is to [compile all of the TypeScript into JavaScript](https://www.typescriptlang.org/docs/tutorial.html), I have provided the `tsconfig.json` I used during the development. You can find the precompiled JavaScript source code for the neural network in the `dist/src` folder and the source code for tests in `dist/test` folder.

One can run the classifier by executing `node dist/test/digit-classification-test.js` in the terminal after having installed all of the dependencies (run `npm install` and `typings install` for that).  

# Using the source code

I tried to document all of the TypeScript source code for the neural network implementation itself, although the tests are quite poorly documented. I suggest you use the TypeScript tests to understand how a neural network is initialised and then consult the code in the `src` folder to understand how the actual implementation works.

# Suggestions and feedback

If you feel like something has to be changed or find an error, feel free to create [a new issue thread](https://github.com/TimboKZ/js-digit-recognition/issues).