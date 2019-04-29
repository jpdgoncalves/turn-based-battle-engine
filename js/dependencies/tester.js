import {Logger} from './logger.js';

/**
 * Base class to develop unit tests.
 */
class Tester {

    /**
     * Instantiates and runs the tests of a test class.
     * @param {*} test_class 
     */
    static test(test_class) {
        let test_instance = new test_class();
        test_instance.test();
    }

    /**
     * Tests wether 2 values are equal or not and logs a error if not.
     * @param {*} expected 
     * @param {*} obtained
     * @param {string} tag
     */
    static assertValue(expected, obtained,tag = "Default assertValue") {
        if(expected === obtained) {
            Logger.log(`- ${tag} has passed!`);
        } else {
            Logger.error(`- ${tag} has failed!`);
            throw new Error(`Failed assertion ${tag}`);
        }
    }

    /**
     * Tests if a function does not throw a error
     * @param {Function} test 
     */
    static assertFunction(test) {
        try {
            test();
        } catch (e) {
            Logger.error(`${test.name} has failed with exception: ${e.message}!`);
            console.error(e);
            return;
        }
        Logger.log(`${test.name} has passed with no exceptions!`);
    }

    /**
     * Tests if a function throws a error
     * @param {Function} test
     */
    static assertError(test) {
        try{
            test();
        } catch (e) {
           Logger.log(`${test.name} has passed with exception: ${e.message}!`);
           console.log(e);
           return;
        }
        Logger.error(`${test.name} has failed!`);
    }
}

export {Tester};