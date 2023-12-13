/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(["N/search", "N/email", "N/log"], (search, email, log) => {
  const getInputData = (inputContext) => {
    var searchInvoice = search.create({
      type: "transaction",
      filters: [
        ["type", "anyof", "CustInvc"],
        "AND",
        ["status", "noneof", "VendBill:B"],
        "AND",
        ["amount", "greaterthan", "0.00"],
      ],
      columns: [
        search.createColumn({ name: "internalid", label: "Internal Id" }),
        search.createColumn({ name: "trandate", label: "Date" }),
        search.createColumn({ name: "tranid", label: "Document Number" }),
        search.createColumn({ name: "entity", label: "Name" }),
        search.createColumn({ name: "amount", label: "Amount" }),
      ],
    });

    var CustomerInvoices = searchInvoice.run();
    var invoicesList = CustomerInvoices.getRange({ start: 0, end: 1000 });
    return invoicesList;
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
    var muCustId = JSON.parse(reduceContext.values[0]).custpage_customerid;
    var bodyEmail =
      "Hello " + custName + ", These Are The Pending Due Invoices : ";
    var subjectEmail = "All Invoices For " + custName;

    for (var i = 0; i < reduceValue.length; i++) {
      var custInvoice = JSON.parse(reduceContext.values[i]);
      var InvoiceNumber = custInvoice.custpage_invoiceno;
      bodyEmail += " " + InvoiceNumber + " , ";
    }
    bodyEmail += "Thank You Have A Nice Day";
    var custEmail = search.lookupFields({
      type: search.Type.CUSTOMER,
      id: muCustId,
      columns: ["email"],
    });
    var senderId = -5;
    var recipientId = custEmail.email;

    email.send({
      author: senderId,
      recipients: recipientId,
      subject: subjectEmail,
      body: bodyEmail,
    });

    log.debug({
      title: " Email Sent To " + custName,
      details: " With Subject: " + subjectEmail + " And Body As: " + bodyEmail,
    });
  };

  const summarize = (summaryContext) => {};
  return { getInputData, map, reduce, summarize };
});
