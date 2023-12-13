/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(["N/record", "N/ui/dialog"], function (record, dialog) {
  function showAlert(message) {
    dialog.alert({
      title: "Warning",
      message: message,
    });
  }

  function saveRecord(context) {
    var currentRecord = context.currentRecord;
    var salesOrderId = currentRecord.id;

    var amount = currentRecord.getValue({ fieldId: "total" });

    if (amount >= 1000 && amount <= 5000) {
      showAlert(
        "The Sales Order amount is between 1000 and 5000. Do you want to proceed with saving the record?"
      );
      dialog
        .confirm({
          title: "Confirmation",
          message: "Do you want to save the record?",
        })
        .then(function (result) {
          if (result) {
            return true;
          } else {
            return false;
          }
        });
    } else if (amount > 5000) {
      showAlert(
        "Need approval to save this sales order. Please contact the administrator."
      );
      return false;
    }

    return true;
  }

  return {
    saveRecord: saveRecord,
  };
});
