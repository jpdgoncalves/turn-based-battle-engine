import {BattleAction} from '../../../src/battle/base/battle_action.js';
import {Tester} from '../../../dependencies/tester.js';

class BattleActionImplementation extends BattleAction {

    constructor(name) {
        super(name);
    }
    
    check(battle) {
        return true;
    }

    perform(battle) {

    }

    reverse(battle) {

    }

    preLore(battle) {
        return "test prelore";
    }

    postLore(battle) {
        return "test postlore";
    }
}

class BattleActionTest {

    test() {
        Tester.assertFunction(this.testBattleActionWarns);
        Tester.assertFunction(this.testBattleActionImplementation);
    }

    testBattleActionWarns() {
        let battle_action = new BattleAction("test");
        battle_action.check();
        battle_action.perform();
        battle_action.reverse();
        battle_action.preLore();
        battle_action.postLore();
    }

    testBattleActionImplementation() {
        let battle_action = new BattleActionImplementation("test");
        Tester.assertValue(true, battle_action.check(), "BattleAction check");
        Tester.assertValue("test prelore", battle_action.preLore(), "BattleAction preLore");
        Tester.assertValue("test postlore", battle_action.postLore(), "BattleActio postLore");
        battle_action.perform();
        battle_action.reverse();
    }
}

export {BattleActionTest};