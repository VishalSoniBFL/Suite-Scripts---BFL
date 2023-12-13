/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(["N/record", "N/runtime", "N/search", "N/email"]
/**
 * @param{record} record
 */, (record, runtime, search, email) => {
  const getInputData = (inputContext) => {
    var transactionSearchObj = search.create({
      type: "transaction",
      filters: [["type", "anyof", "CustInvc"]],
      columns: [
        search.createColumn({ name: "internalid", label: "Internal Id" }),
        search.createColumn({
          name: "ordertype",
          sort: search.Sort.ASC,
          label: "Order Type",
        }),
        search.createColumn({ name: "mainline", label: "*" }),
        search.createColumn({ name: "trandate", label: "Date" }),
        search.createColumn({ name: "asofdate", label: "As-Of Date" }),
        search.createColumn({ name: "postingperiod", label: "Period" }),
        search.createColumn({ name: "taxperiod", label: "Tax Period" }),
        search.createColumn({ name: "type", label: "Type" }),
        search.createColumn({ name: "tranid", label: "Document Number" }),
        search.createColumn({ name: "entity", label: "Name" }),
        search.createColumn({ name: "account", label: "Account" }),
        search.createColumn({ name: "memo", label: "Memo" }),
        search.createColumn({ name: "amount", label: "Amount" }),
        search.createColumn({
          name: "custbody_4599_mx_operation_type",
          label: "MX Operation Type",
        }),
        search.createColumn({
          name: "custbody_4599_sg_import_permit_num",
          label: "Import Permit No.",
        }),
        search.createColumn({
          name: "custbody_my_import_declaration_num",
          label: "Import Declaration No.",
        }),
      ],
    });

    var myInvoices = transactionSearchObj.run();
    var resultRange = myInvoices.getRange({
      start: 0,
      end: 100,
    });
    return resultRange;
  };

  const map = (mapContext) => {
    var mapValue = JSON.parse(mapContext.value);
    var customerId = mapValue.values.entity[0].value;
    var customerName = mapValue.values.entity[0].text;
    var invoiceNo = mapValue.values.internalid[0].value;
    var amount = mapValue.values.amount;
    var tranDate = mapValue.values.trandate;
    mapContext.write({
      key: customerId,
      value: {
        custpage_customerid: customerId,
        custpage_customername: customerName,
        custpage_invoiceno: invoiceNo,
        custpage_amount: amount,
        custpage_trandate: tranDate,
      },
    });
  };
  const reduce = (reduceContext) => {
    var reduceValue = reduceContext.values;
    var custName = JSON.parse(reduceContext.values[0]).custpage_customername;
    log.debug("custName", custName);
    var muCustId = JSON.parse(reduceContext.values[0]).custpage_customerid;
    log.debug("muCustId", muCustId);
    var mailBody = "Hi, These are the Invoices ";
    var subject = "Invoices of " + custName;
    for (var i = 0; i < reduceValue.length; i++) {
      var custInvoice = JSON.parse(reduceContext.values[i]);
      var custId = custInvoice.custpage_customerid;
      var InvoiceNumber = custInvoice.custpage_invoiceno;
      mailBody += " " + InvoiceNumber + " ";
      var amount = custInvoice.custpage_amount;
      var date = custInvoice.custpage_trandate;
    }
    mailBody += "Thank You";
    log.debug("mailBody", mailBody);
    var custEmail = search.lookupFields({
      type: search.Type.CUSTOMER,
      id: muCustId,
      columns: ["email"],
    });
    var senderId = -5;
    var recipientId = muCustId;
    log.debug("recipientId", recipientId);
    email.send({
      author: senderId,
      recipients: recipientId,
      subject: subject,
      body: mailBody,
    });
    log.debug("mail sent", "mail sent");
  };

  const summarize = (summaryContext) => {};
  return { getInputData, map, reduce, summarize };
});
