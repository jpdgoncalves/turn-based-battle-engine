import { Stat } from './stat.js';
import { Utils } from '../../../dependencies/utils.js';

/**
 * Class which represents an Participant in a battle
 */
class Participant {

    /**
     * Instantiate a Participant for a battle
     * @param {string} name name of the Participant
     * @param {number} hp health of the Participant
     * @param {number} energy energy of the Participant
     * @param {number} shield shield of the Participant
     */
    constructor(name, hp, energy, shield, attack, speed) {
        Utils.checkValueType("string",name);
        Utils.checkValueType("number",hp);
        Utils.checkValueType("number",energy);
        Utils.checkValueType("number",shield);
        Utils.checkValueType("number",attack);
        Utils.checkValueType("number",speed);

        /**
         * @private
         */
        this._name = name;
        /**
         * @private
         */
        this._hp = new Stat("hp",hp,false);
        /**
         * @private
         */
        this._energy = new Stat("energy",energy,false);
        /**
         * @private
         */
        this._shield = new Stat("shield",shield,false);
        /**
         * @private
         */
        this._attack = new Stat("attack",attack,false);
        /**
         * @private
         */
        this._speed = new Stat("speed",speed,false);
        /**
         * @private
         */
        this._number_of_turns = new Stat("number of turns", 1,false);
        /**
         * @private
         */
        this._skills = {};
    }

    get name() {return this._name;}

    get hp() {return this._hp;}

    get energy() {return this._energy;}

    get shield() {return this._shield;}

    get attack() {return this._attack;}

    get speed() {return this._speed;}

    /**
     * @returns {Object[]} The list of skills that the Participant currently has.
     */
    get skills() {return this._skills.values();}

    /**
     * @param {Object[]} skills Sets the provided skills list for this character.
     */
    set skills(skills) {
        this._skills = {};
        for(let skill of skills) {
            this._skills[skill.name] = skill;
        }
    }

    /**
     * Determines wether a certain character has a skill or not.
     * @param {*} skill 
     */
    hasSkill(skill) {
        return this._skills[skill.name] !== undefined;
    }
    
    /**
     * Utility function to cause damage to a Participant in a battle.
     * @param {number} amount Amount of damage to cause.
     * @param {boolean} bypass_shield If the damage should bypass the shield. Default is false.
     * @param {boolean} bypass_energy If the damage should bypass the energy. Default is false.
     */
    damage(amount, bypass_shield = false, bypass_energy = false) {
        let amount_left = amount;
        let shield_left = this._shield.current_value;
        let energy_left = this._energy.current_value;
        let hp_left;
        
        if (!bypass_shield) {
            var temp = shield_left;
            shield_left -= amount_left;
            amount_left -= amount_left <= temp ? amount_left : temp;
        }

        if (!bypass_energy) {
            var temp = energy_left;
            energy_left -= amount_left;
            amount_left -= amount_left <= temp ? amount_left : temp;
        }

        hp_left = this._hp.current_value - amount_left;

        this._shield.current_value = shield_left;
        this._energy.current_value = energy_left;
        this._hp.current_value = hp_left;
    }

    /**
     * Utility function to reverse damage done to this participant.
     * @param {number} amount The desired amount.
     * @param {boolean} bypass_shield If shield should be ignored. Default is false.
     * @param {boolean} bypass_energy If energy should be ignored. Default is false.
     */
    reverseDamage(amount, bypass_shield = false, bypass_energy = false) {
        let amount_left = amount;
        let hp = this._hp;
        let energy = this._energy;
        let shield = this._shield;
        let temp;

        temp = hp.current_value + amount_left > hp.base_value ? hp.base_value - hp.current_value : amount_left;
        hp.add(amount_left);
        amount_left -= temp;

        if(!bypass_energy) {
            temp = energy.current_value + amount_left > energy.base_value ? energy.base_value - energy.current_value : amount_left;
            energy.add(amount_left);
            amount_left -= temp;
        }

        if(!bypass_shield) {
            temp = shield.current_value + amount_left > shield.base_value ? shield.base_value - shield.current_value : amount_left;
            shield.add(amount_left);
            amount_left -= temp;
        }
    }
}

export {Participant};