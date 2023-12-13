/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 */
define(["N/email", "N/record", "N/runtime", "N/render", "N/file"], function (
  email,
  record,
  runtime,
  render,
  file
) {
  function execute(context) {
    var selectedInvoices = runtime.getCurrentScript().getParameter({
      name: "custscript_selected_invoices",
    });

    log.debug("Selected Invoices:", selectedInvoices);

    if (!selectedInvoices) {
      log.error("No invoices selected.");
      return;
    }

    var invoiceIds = selectedInvoices.split(",");

    log.debug("Invoice IDs:", invoiceIds);

    for (var i = 0; i < invoiceIds.length; i++) {
      var InvoiceId = invoiceIds[i];
      var invoiceRecord = record.load({
        type: record.Type.INVOICE,
        id: InvoiceId,
        isDynamic: true,
      });

      var name = invoiceRecord.getText({
        fieldId: "entity",
      });

      log.debug("Processing Invoice ID:", InvoiceId);
      var customerId = invoiceRecord.getValue({
        fieldId: "entity",
      });

      log.debug("Customer ID:", customerId);
      var emailSubject = "Invoice pdf attachment email for : " + name;
      var emailBody =
        "Hello " +
        name +
        " this is email for your invoice " +
        InvoiceId +
        " PDF file attached";

      var invoicePdf = render.transaction({
        entityId: parseInt(InvoiceId),
        printMode: render.PrintMode.PDF,
        formId: 325,
        inCustLocale: true,
      });

      log.debug("pdf file:", invoicePdf);
      email.send({
        author: -5,
        recipients: customerId,
        subject: emailSubject,
        body: emailBody,
        attachments: [invoicePdf],
      });

      log.debug({
        title: "email sent to " + name,
        details: "with subject : " + emailSubject + " And Body : " + emailBody,
      });
    }

    log.debug("All Email Sent Successfully!");
  }

  return { execute: execute };
});
