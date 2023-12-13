/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(["N/record", "N/search"], /**
 * @param{record} record
 */ (record, search) => {
  const beforeSubmit = (scriptContext) => {
    var sales_obj = scriptContext.newRecord;

    var cust_id = sales_obj.getValue({ fieldId: "entity" });

    var cust_obj = record.load({
      type: record.Type.CUSTOMER,
      id: cust_id,
    });

    sales_obj.setValue({
      fieldId: "custbodyemail",
      value: cust_obj.getValue({ fieldId: "email" }),
    });

    sales_obj.setValue({
      fieldId: "custbody_phone",
      value: cust_obj.getValue({ fieldId: "phone" }),
    });

    log.debug("sales_obj : ", sales_obj);
  };

  return { beforeSubmit };
});
