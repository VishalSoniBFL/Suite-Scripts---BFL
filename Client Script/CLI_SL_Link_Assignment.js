/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(["N/currentRecord"]
/**
 * @param{currentRecord} currentRecord
 */, function (currentRecord) {
  var rec_obj = currentRecord.get();

  function pageInit(scriptContext) {
    rec_obj.setValue({
      fieldId: "custpage_emp_subsdiary",
      value: 12,
    });
  }
  return {
    pageInit: pageInit,
  };
});
