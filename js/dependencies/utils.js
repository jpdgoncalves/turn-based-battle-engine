
/**
 * A group of utility functions
 */
class Utils {

    /**
     * Utility function to transform a html string into the correspondent element.
     * @param {string} html The html string to be transformed.
     * @returns {Element} a Element object
     */
    static createElement(html) {
        Utils._helper.innerHTML = html;
        var element = Utils._helper.firstChild;
        Utils._helper.innerHTML = "";
        return element;
    }

    /**
     * Tests if a value is of the expected type, throwing a error if it isn't or returning it otherwise;
     * @param {*} expected_type the expected type of the value
     * @param {*} value the value to check
     * @returns {*} the value that was passed for checking
     */
    static checkValueType(expected_type,val) {
        if(typeof(expected_type) == "function") {
            if( !(val instanceof expected_type) ) {
                throw new TypeError(`value: "${String(val)}" is not of type: "${expected_type.name}"`);
            }
        } else {
            if(typeof(val) !== expected_type) {
                throw new TypeError(`value: "${String(val)}" is not of type: "${expected_type}"`);
            }
        }

        return val;
    }
}
Utils._helper = document.createElement("DIV");
export {Utils};