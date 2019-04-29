import { Utils } from '../../../dependencies/utils.js';
import { Logger } from '../../../dependencies/logger.js';

import { BattleMoments, BattleResults } from './battle_enums.js';
import { BattleAction } from './battle_action.js';
import { Participant } from './participant.js';

/**
 * A Class that represents a battle between Participants.
 */
class Battle {

    /**
     * Instantiate a new Battle with the following Participants.
     * @param {Participant[]} allies Participants that are allies.
     * @param {Participant[]} enemies Participants that are enemies.
     */
    constructor(allies,enemies) {
        Utils.checkValueType(Array,allies);
        Utils.checkValueType(Array,enemies);

        /**
         * @private
         * @type {Object.<string,Participant>}
         */
        this._allies = {};
        /**
         * @private
         * @type {Object.<string,Participant>}
         */
        this._enemies = {};
        /**
         * @private
         * @type {Participant[]}
         */
        this._participants = allies.concat(enemies);

        /**
         * @private
         * @type {BattleMoments}
         */
        this._current_moment = BattleMoments.BEGIN;

        /**
         * @private
         * @type {BattleAction[]}
         */
        this._actions_log = [];
        /**
         * @private
         * @type {BattleAction[]}
         */
        this._repeating_actions = [];

        /**
         * @private
         * @type {number}
         */
        this._current_participant_turn = 0;
        /**
         * @private
         * @type {number}
         */
        this._current_turn = 1;

        for(let ally of allies) {
            Utils.checkValueType(Participant,ally);
            this._allies[ally.name] = ally;
        }

        for(let enemy of enemies) {
            Utils.checkValueType(Participant,enemy);
            this._enemies[enemy.name] = enemy;
        }
    }

    /**
     * @readonly
     * @returns {Participant[]} The allies in this battle.
     */
    get allies() {return Object.values(this._allies);}

    /**
     * @readonly
     * @returns {Participant[]} The enemies in this battle.
     */
    get enemies() {return Object.values(this._enemies);}

    /**
     * @readonly
     * @returns {Participant[]} An array with all of the participants in a battle.
     */
    get participants() {return this._participants;}

    /**
     * @readonly
     * @returns {BattleMoments} the current moment of the battle.
     */
    get current_moment() {return this._current_moment;}

    /**
     * @readonly
     * @returns {number} the current turn of the battle.
     */
    get current_turn() {return this._current_turn;}

    /**
     * @readonly
     * @return {bumber} the number of turns that have passed in this battle.
     */
    get turn_count() {return this._current_turn-1;}

    /**
     * @readonly
     * @return {boolean} tells if the battle has ended or not.
     */
    get has_battle_ended() {
        let death_team = true, death_enemies = true;

        for(let key in this._allies) {
            if(this._allies[key].hp.current_value != 0) {
                death_team = false;
                break;
            }
        }

        for(let key in this._enemies) {
            if(this._enemies[key].hp.current_value != 0) {
                death_enemies = false;
                break;
            }
        }

        return death_team || death_enemies;
    }

    /**
     * @readonly
     * @returns {boolean} tells wether the current turn of this battle has ended or not.
     */
    get has_turn_ended() {return this._current_participant_turn == this._participants.length;}

    /**
     * @readonly
     * @returns {BattleResults} the result of the this battle.
     */
    get battle_result() {

        let death_team = true, death_enemies = true;

        for(let key in this._allies) {
            if(this._allies[key].hp.current_value != 0) {
                death_team = false;
                break;
            }
        }

        for(let key in this._enemies) {
            if(this._enemies[key].hp.current_value != 0) {
                death_enemies = false;
                break;
            }
        }

        if(death_enemies && death_team) {
            return BattleResults.TIE;
        } else if(death_team) {
            return BattleResults.LOSE;
        } else if(death_enemies) {
            return BattleResults.WIN;
        } else if(this._current_moment === BattleMoments.END) {
            return BattleResults.TIE;
        } else {
            return BattleResults.UNDECIDED;
        }
    }

    /**
     * @returns {BattleAction[]} the action log of this battle.
     */
    get actions_log() {return this._actions_log;}

    /**
     * @returns {BattleAction[]} the actions that will be repeating during the battle.
     */
    get repeating_actions() {return this._repeating_actions;}

    /**
     * @readonly
     * @returns {Participant} the name of who is the next participant to perform an action in a battle.
     */
    get who_is_next() {return this._participants[this._current_participant_turn];}

    /**
     * Method to get the participant that has the following name.
     * @param {string} name The name of the participant.
     * @returns {Participant} The participant that has this name.
     */
    getParticipant(name) {
        if(name in this._allies) {
            return this._allies[name];
        } else if(name in this._enemies) {
            return this._enemies[name];
        }
    }

    /**
     * Adds a new participant to the battle.
     * It will log an warning if a participant with this name was already in the battle.
     * @param {Participant} participant The participant to add.
     * @param {boolean} is_enemy Determines wether it's an enemy or not. The default is false.
     */
    addParticipant(participant,is_enemy = false) {
        Utils.checkValueType(Participant,participant);
        Utils.checkValueType("boolean",is_enemy);

        let object_to_add;

        if(is_enemy) {
            object_to_add = this._enemies;
        } else {
            object_to_add = this._allies;
        }

        if(object_to_add[participant.name]) {
            Logger.warn(`The participant ${participant.name} was already placed in battle and is going to be overwriten!`);
        }

        object_to_add[participant.name] = participant;
        this._participants.push(participant);
    }

    /**
     * Removes a participant from the battle.
     * @param {Participant} participant The participant to remove.
     */
    removeParticipant(participant) {
        Utils.checkValueType(Participant,participant);

        delete this._enemies[participant.name];
        delete this._allies[participant.name];
        this._participants.filter(function(value) {
            return value.name !== participant.name;
        });
    }

    /**
     * Function to be called when the battle begins.
     */
    begin() {
        this._current_moment = BattleMoments.BEGIN;
        this._addRepeatingActions();
    }

    /**
     * Function to be called when the battle ends.
     */
    end() {
        this._current_moment = BattleMoments.END;
        this._actions_log = [];
    }

    /**
     * Function to be called at the beggining of a new turn.
     */
    beginTurn() {
        this._current_moment = BattleMoments.BEGIN_TURN;
        this._actions_log = [];
        this._updateParticipants();
        this._addRepeatingActions();
    }

    /**
     * Function to be called at the end of a turn.
     */
    endTurn() {
        this._current_moment = BattleMoments.END_TURN;
        this._addRepeatingActions();
    }

    /**
     * Function to be called for a participant to take a turn.
     */
    beginTurnForNextParticipant() {
        this._current_moment = BattleMoments.BEGIN_PARTICIPANT_TURN;
        this._addRepeatingActions();
    }

    /**
     * Function to be called after a participant has taken the turn.
     */
    endTurnForPreviousParticipant() {
        this._current_moment = BattleMoments.END_PARTICIPANT_TURN;
        this._addRepeatingActions();
        if(!this.has_turn_ended) {
            this._current_participant_turn += 1;
        }
    }

    /**
     * Adds a action to be used in a single turn.
     * @param {BattleAction} action action to be added.
     */
    addSingleBattleAction(action) {
        this._actions_log.push(action);
    }

    /**
     * Adds a action to be done in each moment of the battle.
     * @param {BattleAction} action The action to be added. 
     */
    addRepeatingBattleAction(action) {
        this._repeating_actions.push(action);
    }

    /**
     * Function to be called after everyone has taken their turn and endTurnPreviousParticipant has been called.
     */
    processTurn() {
        for(let action of this._actions_log) {
            action.perform(this);
        }
    }

    /**
     * Function to be called each time the battle moment changes.
     * @private
     */
    _addRepeatingActions() {
        for(let action of this._repeating_actions) {
            if(action.check(this)) {
                this._actions_log.push(action);
            }
        }
    }

    /**
     * Function used to order the participants by its speed.
     * @private
     */
    _updateParticipants() {
        this._participants.sort(function(a,b) {
            if(a.speed.current_value > b.speed.current_value) {
                return -1;
            } else if(a.speed.current_value < b.speed.current_value) {
                return 1;
            } else {
                return 0;
            }
        });
    }

}

export { Battle };