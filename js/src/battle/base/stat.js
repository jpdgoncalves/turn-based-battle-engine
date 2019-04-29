import { Utils } from "../../../dependencies/utils.js";

/**
 * Class used to store stats.
 * It is used mostly to easily reset values
 */
class Stat {

    /**
     * Instantiate a Stat
     * @param {string} name name of the stat
     * @param {number} value original value of the stat
     * @param {boolean} can_be_negative if the stat can be negative or not. Default is true.
     */
    constructor(name,value,can_be_negative = true) {
        Utils.checkValueType("string",name);
        Utils.checkValueType("number",value);
        Utils.checkValueType("boolean",can_be_negative);

        this._name = name;
        this._original_value = value;
        this._base_value = value;
        this._current_value = value;
        this._can_be_negative = can_be_negative;
        
    }

    get name() {return this._name;}

    get base_value() {return this._base_value;}
    
    set base_value(value) {
        Utils.checkValueType("number",value);

        if(!this._can_be_negative && value < 0) {
            this._base_value = 0;
        } else {
            this._base_value = value;
        }
    }

    get current_value() {return this._current_value;}

    set current_value(value) {
        Utils.checkValueType("number",value);

        if(!this._can_be_negative && value < 0) {
            this._current_value = 0;
        } else {
            this._current_value = value;
        } 
    }

    /**
     * Adds the specified amount to the current value
     * @param {number} value The amount to add to the stat.
     * @param {boolean} can_overload Wether overload is allowed or not. Default is false.
     */
    add(value,can_overload = false) {
        Utils.checkValueType("number",value);
        Utils.checkValueType("boolean",can_overload);

        if(!can_overload && this.current_value + value > this.base_value) {
            this.current_value = this.base_value;
        } else {
            this.current_value += value;
        }
    }

    /**
     * Resets the base and current value to the original value.
     */
    reset() {
        this._base_value = this._original_value;
        this._current_value = this._original_value;
    }
}

export {Stat};