import {Utils} from './utils.js';

/**
 * Static class to log debugging information.
 */
class Logger {

    /**
     * Sets the id of the element to display to the supplied argument.
     * @param {string} id id of the element which will be used to log into.
     */
    static setElementDisplay(id) {
        Logger._element = document.getElementById(id);
    }

    /**
     * Sets the template to be used for each log to the HTML supplied.
     * The string should contain a "%log" in the place to place the log string.
     * @param {*} html HTML string to be used as template.
     */
    static setTemplate(html) {
        if(html.indexOf("%log") == -1) throw new Error("The template does not contain %log");
        Logger._template = html;
    }

    /**
     * Logs the data passed as the argument as info.
     * @param {*} data Data to be logged.
     */
    static log(data) {
        let log_text = "INFO: " + data;
        let log_html = Logger._template.replace("%log",log_text);
        let log_element = Utils.createElement(log_html);
        console.log(log_text);
        Logger._element.appendChild(log_element);
    }

    /**
     * Logs the data passed as the argument as warn.
     * @param {*} data Data to be logged.
     */
    static warn(data) {
        let log_text = "WARN: " + data;
        let log_html = Logger._template.replace("%log",log_text);
        let log_element = Utils.createElement(log_html);
        console.warn(log_text);
        Logger._element.appendChild(log_element);
    }

    /**
     * Logs the data passed as the argument as error.
     * @param {*} data Data to be logged.
     */
    static error(data) {
        let log_text = "ERROR: " + data;
        let log_html = Logger._template.replace("%log",log_text);
        let log_element = Utils.createElement(log_html);
        console.error(log_text);
        Logger._element.appendChild(log_element);
    }
}
Logger._element = document.createElement("DIV");
Logger._template = "<p>%log</p>";
Logger._parser = new DOMParser();

export {Logger};