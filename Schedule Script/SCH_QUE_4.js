/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(["N/log", "N/record", "N/runtime", "N/search"]
/**
 * @param{log} log
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 */, (log, record, runtime, search) => {
  /**
   * Defines the Scheduled script trigger point.
   * @param {Object} scriptContext
   * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
   * @since 2015.2
   */
  const execute = (scriptContext) => {
    var id = runtime.getCurrentScript().getParameter({
      name: "so_id",
    });
    var memo = runtime.getCurrentScript().getParameter({
      name: "so_memo",
    });

    var salesorder = record.load({
      type: record.Type.SALES_ORDER,
      id: so_id,
      isDynamic: true,
    });

    log.debug("Sales Order Loaded Success : ", so_id);

    salesorder.setValue({
      fieldId: "memo",
      value: so_memo,
    });

    salesorder.save({
      enableSourcing: true,
      ignoreMandatoryFields: true,
    });

    log.debug("value set successfully");
  };

  return { execute };
});
