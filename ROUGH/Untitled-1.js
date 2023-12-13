/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(["N/currentRecord", "N/record", "N/email", "N/url", "N/runtime"], /**
 * @param{currentRecord} currentRecord
 */ function (currentRecord, record, email, url) {
  function pageInit(scriptContext) {}
  var currentRec = currentRecord.get();
  var currentRecId = currentRec.id;

  function sendForApproval(scriptContext) {
    var user = runtime.getCurrentUser();
    var sendOrder = record.submitFields({
      type: record.Type.PURCHASE_ORDER,
      id: currentRecId,
      values: {
        custbody_purchasemanagerapproval: 2,
        approvalstatus: 1,
      },
    });
    var senderId = user;
    var recipientId = -5;

    var scheme = "https://";
    var host = url.resolveDomain({
      hostType: url.HostType.APPLICATION,
    });
    var result = url.resolveRecord({
      recordType: "purchaseorder",
      recordId: currentRecId,
      isEditMode: true,
    });

    var myUrl = scheme + host + result;

    var message =
      "Hello Purchase Admin I Am Requesting Approval For Following Purchase Order #";

    message += "<a href= " + myUrl + ">" + currentRecId + "</a>";

    email.send({
      author: senderId,
      recipients: recipientId,
      subject: "Requesting For Approval",
      body: message,
    });
    location.reload();
  }

  function approvePO(scriptContext) {
    var approveOrder = record.submitFields({
      type: record.Type.PURCHASE_ORDER,
      id: currentRecId,
      values: {
        custbody_purchasemanagerapproval: 1,
        approvalstatus: 2,
      },
    });

    log.debug({
      title: "Aproved",
      details: approveOrder,
    });
    location.reload();
  }

  function rejectPO(scriptContext) {
    var reason = prompt("Enter The Reason For Your Rejection");

    var rejectOrder = record.submitFields({
      type: record.Type.PURCHASE_ORDER,
      id: currentRecId,
      values: {
        custbody_purchasemanagerapproval: 3,
        approvalstatus: 3,
        custbody_reason: reason,
      },
    });

    var senderId = -5;
    var recipientId = -5;

    var message =
      " Sorry Your Purchase Order Is Been Rejected Due to Reason : " + reason;

    email.send({
      author: senderId,
      recipients: recipientId,
      subject: "Purchase Order Rejected",
      body: message,
    });
    log.debug({
      title: "Rejected",
      details: rejectOrder,
    });
    location.reload();
  }

  return {
    pageInit: pageInit,
    sendForApproval: sendForApproval,
    approvePO: approvePO,
    rejectPO: rejectPO,
  };
});
