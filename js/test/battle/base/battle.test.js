import {Tester} from '../../../dependencies/tester.js';
import { Logger } from '../../../dependencies/logger.js';

import {Battle} from '../../../src/battle/base/battle.js';
import { Participant } from '../../../src/battle/base/participant.js';
import { BattleAction } from '../../../src/battle/base/battle_action.js';
import { BattleMoments, BattleResults } from '../../../src/battle/base/battle_enums.js';


class Attack extends BattleAction {

    /**
     * 
     * @param {Participant} author 
     * @param {Participant} target 
     */
    constructor(author,target) {
        super("attack");
        this._author = author;
        this._target = target;
    }

    /**
     * 
     * @param {Battle} battle 
     */
    check(battle) {
        return !battle.has_battle_ended && this._target.hp.current_value > 0;
    }

    /**
     * @param {Battle} battle 
     */
    perform(battle) {
        this._damage = Math.floor(this._author.attack.current_value * Math.random());
        this._target.damage(this._damage);
    }

    /**
     * @param {Battle} battle
     */
    reverse(battle) {
        if(this._damage !== undefined) {
            this._target.reverseDamage(this._damage);
            this._damage = undefined;
        }
    }

    /**
     * 
     * @param {Battle} battle 
     */
    preLore(battle) {
        return `${this._author.name} has attacked ${this._target.name}!`;
    }

    /**
     * 
     * @param {Battle} battle 
     */
    postLore(battle) {
        if(this._damage !== undefined) {
            return `${this._target.name} received ${this._damage}!`;
        } else {
            return "";
        }
    }

}

class EndTurnAttack extends BattleAction {

    /**
     * 
     * @param {Battle} battle 
     */
    check(battle) {
        return battle.current_moment === BattleMoments.END_TURN;
    }

    /**
     * 
     * @param {Battle} battle 
     */
    perform(battle) {
        let participants = battle.participants;
        for(let participant of participants) {
            participant.damage(30);
        }
    }

    reverse(battle) {

    }

    preLore(battle) {
        return "";
    }

    /**
     * 
     * @param {Battle} battle 
     */
    postLore(battle) {
        return "Everyone in battle took 30 damage from a mysterious force";
    }
}

function createParticipant(name) {
    return new Participant(name,100,100,100,50,50);
}

class BattleTest {

    test() {
        Tester.assertFunction(this.testBattleVariables);
        Tester.assertFunction(this.testGetAddRemoveParticipants);
        Tester.assertFunction(this.testBattleFlow);
    }

    testBattleVariables() {
        let allies = [createParticipant("Soldier")];
        let enemies = [createParticipant("Enemy Soldier")];
        let battle = new Battle(allies,enemies);

        Tester.assertValue(0, battle.actions_log.length, "Battle action_log size");
        Tester.assertValue(allies[0], battle.allies[0], "Battle allies");
        Tester.assertValue(enemies[0], battle.enemies[0], "Battle enemies");
        Tester.assertValue(allies[0], battle.participants[0], "Battle participants ally");
        Tester.assertValue(enemies[0], battle.participants[1], "Battle participant enemy");
        Tester.assertValue(BattleMoments.BEGIN, battle.current_moment, "Battle moment");
        Tester.assertValue(1, battle.current_turn, "Battle current turn");
        Tester.assertValue(0, battle.turn_count, "Battle turn count");
        Tester.assertValue(false, battle.has_battle_ended, "Battle has ended");
        Tester.assertValue(false, battle.has_turn_ended, "Battle turn ended");
        Tester.assertValue(BattleResults.UNDECIDED, battle.battle_result, "Battle result");
        Tester.assertValue(allies[0], battle.who_is_next, "Battle next participant");
    }

    testGetAddRemoveParticipants() {
        let new_ally = createParticipant("Guard");
        let new_enemy = createParticipant("Enemy Guard");
        let allies = [createParticipant("Soldier")];
        let enemies = [createParticipant("Enemy Soldier")];
        let battle = new Battle(allies,enemies);

        Tester.assertValue(allies[0], battle.getParticipant("Soldier"),"Get ally");
        Tester.assertValue(enemies[0], battle.getParticipant("Enemy Soldier"), "Get enemy");

        battle.addParticipant(new_ally);
        battle.addParticipant(new_enemy,true);

        Tester.assertValue(new_ally, battle.getParticipant("Guard"), "Get new ally");
        Tester.assertValue(new_enemy, battle.getParticipant("Enemy Guard"), "get new enemy");
        Tester.assertValue(new_enemy, battle.participants[3], "4 Participant is new enemy");

        battle.removeParticipant(new_ally);
        battle.removeParticipant(new_enemy);

        Tester.assertValue(allies[0], battle.getParticipant("Soldier"),"Get ally after remove");
        Tester.assertValue(enemies[0], battle.getParticipant("Enemy Soldier"), "Get enemy after remove");
        Tester.assertValue(enemies[0], battle.participants[1], "Get participant after remove")
    }

    testBattleFlow() {
        let allies = [createParticipant("Soldier")];
        let enemies = [createParticipant("Enemy Soldier")];
        let battle = new Battle(allies,enemies);
        let end_turn_attack = new EndTurnAttack("end_turn_attack");

        battle.addRepeatingBattleAction(end_turn_attack);

        Tester.assertValue(end_turn_attack, battle.repeating_actions[0], "Battle repeating action");

        battle.begin();
        battle.beginTurn();

        battle.beginTurnForNextParticipant();

        battle.addSingleBattleAction(new Attack(battle.who_is_next,enemies[0]));

        battle.endTurnForPreviousParticipant();
        battle.beginTurnForNextParticipant();

        battle.addSingleBattleAction(new Attack(battle.who_is_next,allies[0]));

        battle.endTurnForPreviousParticipant();

        battle.endTurn();
        battle.processTurn();
        console.log(battle.actions_log);
        console.log(battle.participants);
        Tester.assertValue(3,battle.actions_log.length, "Number of actions in log");

        for(let action of battle.actions_log) {
            Logger.log(action.preLore());
            Logger.log(action.postLore());
        }

        battle.end();
        Tester.assertValue(0, battle.actions_log.length, "Empty battle actions log");
    }
}

export {BattleTest};