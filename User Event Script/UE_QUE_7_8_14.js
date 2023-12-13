/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(["N/record", "N/log"], (record, log) => {
  const beforeLoad = (scriptContext) => {
    // QUE 7

    // var form = scriptContext.form;
    // form.addButton({
    //   id: "custpage_custom_button",
    //   label: "Custom Button",
    // });

    log.debug({
      title: "Before Load Log",
      details: "Current Log Is For : Before Load",
    });
  };

  const beforeSubmit = (scriptContext) => {
    log.debug({
      title: "Before Submit Log",
      details: "Current Log Is For : Before Submit",
    });
  };

  const afterSubmit = (scriptContext) => {
    // Que 8
    // throw new Error("You Cant Submit");

    log.debug({
      title: "After Submit Log",
      details: "Current Log Is For : After Submit",
    });
  };

  return { beforeLoad, beforeSubmit, afterSubmit };
});
