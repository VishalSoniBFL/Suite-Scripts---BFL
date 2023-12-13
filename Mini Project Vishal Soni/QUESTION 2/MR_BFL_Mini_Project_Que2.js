/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(["N/search", "N/email", "N/log", "N/runtime", "N/render", "N/file"], (
  search,
  email,
  log,
  runtime,
  render,
  file
) => {
  const getInputData = (inputContext) => {
    var selectedInvoices = runtime.getCurrentScript().getParameter({
      name: "custscript_invoices_ids",
    });

    if (!selectedInvoices) {
      log.error("No invoices selected.");
      return;
    }
    var invoiceIds = selectedInvoices.split(",");

    var invintarr = [];

    invoiceIds.forEach((element) => {
      invintarr.push(parseInt(element));
    });

    var searchInvoice = search.create({
      type: "transaction",
      filters: [
        ["mainline", "is", "T"],
        "AND",
        ["type", "anyof", "CustInvc"],
        "AND",
        ["internalid", "anyof", invintarr],
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
      "Hello " + custName + ", These Are The Invoices : ";
    var subjectEmail = "Invoices For " + custName;
    var attach = [];

    for (var i = 0; i < reduceValue.length; i++) {
      
      var currentInvoice = JSON.parse(
        reduceContext.values[i]
      ).custpage_invoiceno;
      var InvoiceNumber = parseInt(currentInvoice);
      log.debug("Processing Invoice Number", InvoiceNumber);

      var pdf_file = render.transaction({
        entityId: InvoiceNumber,
        printMode: render.PrintMode.PDF,
        formId: 325,
        inCustLocale: true,
      });
      log.debug("Processed PDF : ", pdf_file);

      attach.push(pdf_file);
    }
    log.debug("All Attachments For Current Customer ", attach);
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
      recipients: -5,
      subject: subjectEmail,
      body: bodyEmail,
      attachments: attach,
    });

    log.debug({
      title: " Email Sent To " + custName,
      details: " With Subject: " + subjectEmail + " And Body As: " + bodyEmail,
    });

    log.debug({
      title: 'Email Sent',
      details: 'Email Sent Succesfully Completed For Customer : ' + custName,
    })
  };

  const summarize = (summaryContext) => {
    log.debug({
      title: "Done",
      details: "Email Sent Success Through MR",
    });
  };
  return { getInputData, map, reduce, summarize };
});
