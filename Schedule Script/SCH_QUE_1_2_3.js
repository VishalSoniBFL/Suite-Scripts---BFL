/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(["N/log", "N/record", "N/runtime", "N/search"], (
  log,
  record,
  runtime,
  search
) => {
  const execute = (scriptContext) => {
    var scriptParameter = runtime.getCurrentScript().getParameter({
      name: "custscript_myparameter",
    });

    log.debug({
      title: "Scheduled Script Execution Parameter",
      details:
        "Scheduled script was executed with parameter value: " +
        scriptParameter,
    });
  };

  return { execute };
});
