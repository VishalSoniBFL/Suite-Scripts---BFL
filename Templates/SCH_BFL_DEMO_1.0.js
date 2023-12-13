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
  const execute = (scriptContext) => {};

  return { execute };
});
