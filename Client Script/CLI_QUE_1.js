/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(["N/currentRecord"]
/**
 * @param{currentRecord} currentRecord
 */, function (currentRecord) {
  /**
   * Function to be executed after page is initialized.
   *
   * @param {Object} scriptContext
   * @param {Record} scriptContext.currentRecord - Current form record
   * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
   *
   * @since 2015.2
   */
  function pageInit(scriptContext) {
    var recordObject = currentRecord.get();
    recordObject.setValue({
      fieldId: "entity",
      value: 3,
    });
  }

  return {
    pageInit: pageInit,
  };
});
