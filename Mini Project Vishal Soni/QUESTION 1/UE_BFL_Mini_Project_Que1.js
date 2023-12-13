/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(["N/record", "N/ui/serverWidget", "N/runtime"], /**
 * @param{record} record
 */ (record, serverWidget, runtime) => {
  const beforeLoad = (scriptContext) => {
    var objRec = scriptContext.newRecord;

    var checkBoxValue = objRec.getValue({
      fieldId: "custbody_dropship",
    });

    var form = scriptContext.form;

    var role = runtime.getCurrentUser().role;

    form.clientScriptFileId = 8816;

    var sendForApprovalValue = form.addButton({
      id: "custpage_approvalrequest",
      label: "Send PO For Approval",
      functionName: "sendForApproval()",
    });

    if (scriptContext.type === "view" && checkBoxValue === true) {
      sendForApprovalValue.isHidden = false;
    } else {
      sendForApprovalValue.isHidden = true;
    }
    if (role == 1129) {
      var approvePOValue = form.addButton({
        id: "custpage_approve_button",
        label: "Approve PO",
        functionName: "approvePO()",
      });

      var rejectPOValue = form.addButton({
        id: "custpage_reject_button",
        label: "Reject PO",
        functionName: "rejectPO()",
      });
    }
  };

  const beforeSubmit = (scriptContext) => {
    var user = runtime.getCurrentUser().id;

    var newRecord = scriptContext.newRecord;
    newRecord.setValue({
      fieldId: "employee",
      value: user,
    });
  };

  const afterSubmit = (scriptContext) => {};

  return { beforeLoad, beforeSubmit, afterSubmit };
});
