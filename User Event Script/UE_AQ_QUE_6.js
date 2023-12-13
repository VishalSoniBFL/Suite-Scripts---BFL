/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(["N/currentRecord"], function (currentRecord) {
  function lineInit(scriptContext) {
    var currentRecordObj = scriptContext.currentRecord;
    var lineCount = currentRecordObj.getLineCount({
      sublistId: "item",
    });
    var runningTotal = 0;

    for (var i = 0; i < lineCount; i++) {
      var lineAmount = currentRecordObj.getSublistValue({
        sublistId: "item",
        fieldId: "amount",
        line: i,
      });
      runningTotal += lineAmount;
    }

    currentRecordObj.setValue({
      fieldId: "custbody3",
      value: runningTotal,
    });

    return true;
  }

  return {
    lineInit: lineInit,
  };
});
