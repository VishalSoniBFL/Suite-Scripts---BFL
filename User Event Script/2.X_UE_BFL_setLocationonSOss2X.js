/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */

define(["N/record"], function (record) {
  function myAfterSubmit(context) {
    var t_rec = record.Type.SALES_ORDER;
    var i_rec = 22777;
    var objRecord = record.load({
      type: t_rec,
      id: i_rec,
    });

    objRecord.setValue({
      fieldId: "location",
      value: 1,
    });

    objRecord.save();
  }

  return {
    afterSubmit: myAfterSubmit,
  };
});
