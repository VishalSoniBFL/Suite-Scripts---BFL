/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(["N/currentRecord", "N/format"], /**
 * @param{currentRecord} currentRecord
 */ function (currentRecord, format) {
  var custName;
  var custFrom;
  var custTo;

  function fieldChanged(scriptContext) {
    if (
      scriptContext.fieldId == "custpage_customer_name" ||
      scriptContext.fieldId == "custpage_from_date" ||
      scriptContext.fieldId == "custpage_to_date"
    ) {
      var objRecord = scriptContext.currentRecord;

      custName = objRecord.getValue({
        fieldId: "custpage_customer_name",
      });

      custFrom = objRecord.getValue({
        fieldId: "custpage_from_date",
      });

      custTo = objRecord.getValue({
        fieldId: "custpage_to_date",
      });

      if (custName && custFrom && custTo) {
        custFrom_Format = format.format({
          value: custFrom,
          type: format.Type.DATE,
        });
        custTo_Format = format.format({
          value: custTo,
          type: format.Type.DATE,
        });

        var url =
          "https://tstdrv2816488.app.netsuite.com/app/site/hosting/scriptlet.nl?script=831&deploy=1";
        url +=
          "&custpage_customer_name=" +
          custName +
          "&custpage_from_date=" +
          custFrom_Format +
          "&custpage_to_date=" +
          custTo_Format;
        window.open(url, "_self");
      }
    }
  }

  return {
    fieldChanged: fieldChanged,
  };
});
