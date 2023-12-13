/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */

define([], function() {
    function pageInit(context) {
        alert('Trigger Point: pageInit');
    }

    function validateField(context) {
        alert('Trigger Point: validateField');
        return true;
    }

    function fieldChanged(context) {
        alert('Trigger Point: fieldChanged');
    }

    function postSourcing(context) {
        alert('Trigger Point: postSourcing');
    }

    function lineInit(context) {
        alert('Trigger Point: lineInit');
    }

    function validateLine(context) {
        alert('Trigger Point: validateLine');
        return true;
    }

    function validateInsert(context) {
        alert('Trigger Point: validateInsert');
        return true;
    }

    function validateDelete(context) {
        alert('Trigger Point: validateDelete');
        return true;
    }

    function saveRecord(context) {
        alert('Trigger Point: saveRecord');
        return true;
    }

    return {
        pageInit: pageInit,
        validateField: validateField,
        fieldChanged: fieldChanged,
        postSourcing: postSourcing,
        lineInit: lineInit,
        validateLine: validateLine,
        validateInsert: validateInsert,
        validateDelete: validateDelete,
        saveRecord: saveRecord
    };
});
