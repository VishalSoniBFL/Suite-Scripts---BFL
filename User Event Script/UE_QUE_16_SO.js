/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(["N/record", "N/search"], /**
 * @param{record} record
 */ (record, search) => {
  const beforeLoad = (scriptContext) => {
    var rec_obj = scriptContext.newRecord;
    var cust_id = 1536;
    log.debug("Id of Cuatomer : ", cust_id);

    var cust_obj = search.lookupFields({
      type: "customer",
      id: cust_id,
      columns: ["email", "phone"],
    });

    log.debug("email : ", cust_obj.email);
    log.debug("phone : ", cust_obj.phone);

    rec_obj.setValue({
      fieldId: "entity",
      value: 1536,
    });
    rec_obj.setValue({
      fieldId: "custbodyemail",
      value: cust_obj.email,
    });
    rec_obj.setValue({
      fieldId: "custbody_phone",
      value: cust_obj.phone,
    });
  };

  return { beforeLoad };
});
