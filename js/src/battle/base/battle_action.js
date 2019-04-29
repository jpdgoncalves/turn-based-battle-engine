import {Logger} from '../../../dependencies/logger.js';
import {Utils} from '../../../dependencies/utils.js';

/**
 * Base class to be extendeded for use in a battle.
 */
class BattleAction {

    /**
     * Instantiate a new Battle Action.
     * @abstract
     * @param {string} name The name of the action.
     */
    constructor(name) {
        Utils.checkValueType("string",name);
        /**
         * @type {string}
         */
        this.name = name;
    }

    /**
     * Checks wether this action should be performed or not.
     * @abstract
     * @param {Battle} battle the battle this action applies too.
     * @returns {boolean} true if this action can be performed or false otherwise.
     */
    check(battle) {
        Logger.warn("Method check was not overriden!");
        return false;
    }

    /**
     * Performs this action in the battle it belongs too.
     * @abstract
     * @param {Battle} battle the battle this action applies too.
     */
    perform(battle) {
        Logger.warn("Method check was not overriden!");
    }

    /**
     * Performs the reverse of this action in the battle it belongs too.
     * @abstract
     * @param {Battle} battle the battle this action applies too.
     */
    reverse(battle) {
        Logger.warn("Method check was not overriden!");
    }

    /**
     * Returns a string containing the pre lore of this action.
     * @abstract
     * @param {Battle} battle the battle this action applies too.
     */
    preLore(battle) {
        Logger.warn("Method check was not overriden!");
        return "";
    }

    /**
     * Returns a string containing the post lore of this action.
     * @abstract
     * @param {Battle} battle the battle this action applies too.
     */
    postLore(battle) {
        Logger.warn("Method check was not overriden!");
        return "";
    }
}

export {BattleAction};