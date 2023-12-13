/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(["N/currentRecord"], /**
 * @param{currentRecord} currentRecord
 */ 
 function (currentRecord) {
  var rec_obj = currentRecord.get();

  function pageInit(scriptContext) {
    rec_obj.setValue({
      fieldId: "entity",
      value: 3,
    });
  }

  function fieldChanged(scriptContext) {
    if (scriptContext.fieldId == "entity") {
      var cust_name = rec_obj.getText({ fieldId: "entity" });

      rec_obj.setValue({
        fieldId: "memo",
        value: cust_name,
      });
    }
  }

  function validateDelete(scriptContext) {
    var qty = rec_obj.getCurrentSublistValue({
      sublistId: "item",
      fieldId: "quantity",
    });

    if (qty == 4) {
      alert("You Cant Delete Item With 4 Quantity");
      return false;
    }

    return true;
  }

  function validateLine(scriptContext) {
    var qty = rec_obj.getCurrentSublistValue({
      sublistId: "item",
      fieldId: "quantity",
    });

    if (qty > 3) {
      alert("Items Greater Than 3 Quantity Cant Be Added");
      return false;
    }
    return true;
  }

  return {
    pageInit: pageInit,
    fieldChanged: fieldChanged,
    validateLine: validateLine,
    validateDelete: validateDelete,
  };
});
