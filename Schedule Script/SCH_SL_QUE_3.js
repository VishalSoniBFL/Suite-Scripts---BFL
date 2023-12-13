/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(["N/ui/serverWidget", "N/task"], function (serverWidget, task) {
  function onRequest(context) {
    if (context.request.method === "GET") {
      var form = serverWidget.createForm({
        title: "Calling SCHEDULED SCRIPT",
      });

      form.addSubmitButton({
        label: "Call Suitelet",
      });

      context.response.writePage(form);
    } else {
      var scriptTask = task.create({
        taskType: task.TaskType.SCHEDULED_SCRIPT,
      });
      scriptTask.scriptId = "customdeploy_link_ss_bfl_sl";
      scriptTask.deploymentId = "customdeploy_ss_bfl_suiteletassignment";
      var scriptTaskId = scriptTask.submit();
      context.response.write(
        "Scheduled script triggered with ID: " + scriptTaskId
      );
    }
  }

  return {
    onRequest: onRequest,
  };
});
