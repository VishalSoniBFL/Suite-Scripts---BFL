/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(["N/currentRecord"], function (currentRecord) {
  function lineInit(scriptContext) {
    var objRecord = scriptContext.currentRecord;

    var lineCount = objRecord.getLineCount({
      sublistId: "item",
    });

    var currentTotal = 0;

    for (var i = 0; i < lineCount; i++) {
      var lineAmount = objRecord.getSublistValue({
        sublistId: "item",
        fieldId: "amount",
        line: i,
      });

      currentTotal = currentTotal + lineAmount;
    }

    objRecord.setValue({
      fieldId: "custbody_custpage_current_total",
      value: currentTotal,
    });

    return true;
  }

  return {
    lineInit: lineInit,
  };
});
