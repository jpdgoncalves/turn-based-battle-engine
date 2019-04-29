import {Stat} from '../../../src/battle/base/stat.js';
import {Tester} from '../../../dependencies/tester.js';

/**
 * Class used to conduct tests Stat
 */
class StatTest {

    test() {
        Tester.assertError(this.testInvalidConstruct);
        this.testNegativeStat();
        this.testNonNegativeStat();
        this.testResetStat();
        Tester.assertFunction(this.testAddStat);
    }

    testInvalidConstruct() {
        let bad_stat = new Stat();
    }

    testNegativeStat() {
        let stat = new Stat("hp",10);
        stat.current_value = -1;
        stat.base_value = -1;
        Tester.assertValue(-1,stat.current_value,"Negative Stat current value");
        Tester.assertValue(-1,stat.base_value,"Negative Stat base value");
    }

    testNonNegativeStat() {
        let stat = new Stat("hp",10,false);
        stat.current_value = -1;
        stat.base_value = -1;
        Tester.assertValue(0,stat.current_value,"Non negative Stat current value");
        Tester.assertValue(0,stat.base_value,"Non negative Stat base value");
    }

    testResetStat() {
        let stat = new Stat("hp",10,false);
        stat.current_value = -1;
        stat.base_value = -1;
        stat.reset(); 
        Tester.assertValue(10,stat.current_value,"Reset Stat current value");
        Tester.assertValue(10,stat.base_value,"Reset negative Stat base value");
    }

    testAddStat() {
        let stat = new Stat("hp",10,false);
        stat.current_value -= 11;
        stat.add(12);
        Tester.assertValue(10,stat.current_value,"Add stat current value");
    }
}
export {StatTest};