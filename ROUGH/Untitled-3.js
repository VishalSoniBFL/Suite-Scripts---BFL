/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define([
  "N/currentRecord",
  "N/ui/serverWidget",
  "N/url",
  "N/https",
  "N/task",
  "N/search",
], (currentRecord, serverWidget, url, http, task, search) => {
  function onRequest(scriptContext) {
    var invoice_sublist;
    if (scriptContext.request.method === "GET") {
      const customerId = scriptContext.request.parameters.custpage_customer;
      const invoiceDate =
        scriptContext.request.parameters.custpage_invoice_date;
      const invoiceNumber =
        scriptContext.request.parameters.custpage_invoice_number;

      let form = serverWidget.createForm({
        title: "SL INVOICE SEARCH",
      });
      form.clientScriptFileId = 8813;

      var customerField = form.addField({
        id: "custpage_customer",
        type: serverWidget.FieldType.SELECT,
        label: "Customer",
        source: "customer",
      });

      if (customerId) {
        customerField.defaultValue = customerId;
      }

      var invoiceDateField = form.addField({
        id: "custpage_invoice_date",
        type: serverWidget.FieldType.DATE,
        label: "Date",
      });

      if (invoiceDate) {
        invoiceDateField.defaultValue = invoiceDate;
      }

      var invoiceNumberField = form.addField({
        id: "custpage_invoice_number",
        type: serverWidget.FieldType.TEXT,
        label: "INV Number",
      });

      if (invoiceNumber) {
        invoiceNumberField.defaultValue = invoiceNumber;
      }

      invoice_sublist = form.addSublist({
        id: "custpage_invoice_sublist",
        type: serverWidget.SublistType.LIST,
        label: "Invoices",
      });
      invoice_sublist.addField({
        id: "custpage_checkbox",
        type: serverWidget.FieldType.CHECKBOX,
        label: "Select",
      });
      invoice_sublist.addField({
        id: "custpage_tranid",
        type: serverWidget.FieldType.TEXT,
        label: "Invoice Number",
      });
      invoice_sublist.addField({
        id: "custpage_internal_id",
        type: serverWidget.FieldType.TEXT,
        label: "Internal Id",
      });
      invoice_sublist.addField({
        id: "custpage_trandate",
        type: serverWidget.FieldType.TEXT,
        label: "Transaction Date",
      });
      invoice_sublist.addField({
        id: "custpage_amount",
        type: serverWidget.FieldType.TEXT,
        label: "Amount",
      });

      log.debug({
        title: "customer Id :",
        details: customerId,
      });

      log.debug({
        title: "number : ",
        details: invoiceDate,
      });

      log.debug({
        title: "number : ",
        details: invoiceNumber,
      });
      //Search
      log.debug(customerId);
      if (customerId || invoiceDate || invoiceNumber) {
        var filters = [["mainline", "is", "T"]];
        if (customerId) {
          filters.push("AND", ["entity", "anyof", customerId]);
        }
        if (invoiceDate) {
          filters.push("AND", ["trandate", "on", invoiceDate]);
        }
        if (invoiceNumber) {
          filters.push("AND", ["tranid", "is", invoiceNumber]);
        }

        var invoiceSearchObj = search.create({
          type: "invoice",
          filters: filters,
          columns: [
            search.createColumn({
              name: "internalid",
              label: "Internal Id",
            }),
            search.createColumn({
              name: "invoicenum",
              label: "Invoice Number",
            }),
            search.createColumn({ name: "trandate", label: "Date" }),
            search.createColumn({ name: "amount", label: "Amount" }),
          ],
        });

        var searchResultCount = invoiceSearchObj.runPaged().count;
        log.debug("invoiceSearchObj result count", searchResultCount);

        var resultSearch = invoiceSearchObj
          .run()
          .getRange({ start: 0, end: 100 });

        resultSearch.forEach(function (result, i) {
          invoice_sublist.setSublistValue({
            id: "custpage_tranid",
            line: i,
            value: result.getValue({ name: "invoicenum" }),
          });

          invoice_sublist.setSublistValue({
            id: "custpage_trandate",
            line: i,
            value: result.getValue({ name: "trandate" }),
          });

          invoice_sublist.setSublistValue({
            id: "custpage_internal_id",
            line: i,
            value: result.getText({ name: "internalid" }),
          });

          invoice_sublist.setSublistValue({
            id: "custpage_amount",
            line: i,
            value: result.getValue({ name: "amount" }),
          });
        });

        form.addSubmitButton({
          label: "Send Email",
        });
      }
      scriptContext.response.writePage(form);
    } else if (scriptContext.request.method === "POST") {
      var selectedInvoices = [];

      const customerId = scriptContext.request.parameters.custpage_customer;
      const invoiceDate =
        scriptContext.request.parameters.custpage_invoice_date;
      const invoiceNumber =
        scriptContext.request.parameters.custpage_invoice_number;

      var lineCount = scriptContext.request.getLineCount({
        group: "custpage_invoice_sublist",
      });

      log.debug({
        title: "line",
        details: lineCount,
      });

      for (var i = 0; i < lineCount; i++) {
        var checkBox = scriptContext.request.getSublistValue({
          group: "custpage_invoice_sublist",
          name: "custpage_checkbox",
          line: i,
        });
        if (checkBox === "T") {
          var INVNUMBER = scriptContext.request.getSublistValue({
            group: "custpage_invoice_sublist",
            name: "custpage_internal_id",
            line: i,
          });
          selectedInvoices.push(INVNUMBER);
          log.debug("Internal Id of Invoice Selected", INVNUMBER);
        }
      }

      log.debug({
        title: "Invoices",
        details: selectedInvoices,
      });

      var scheduledScriptTask = task.create({
        taskType: task.TaskType.SCHEDULED_SCRIPT,
        scriptId: "customscript843",
        deploymentId: "customdeploy1",
      });

      scheduledScriptTask.params = {
        custscript_selected_invoices: selectedInvoices.join(","),
      };

      var taskId = scheduledScriptTask.submit();
      log.debug("Scheduled Script Task ID", taskId);

      scriptContext.response.sendRedirect({
        type: "SUITELET",
        identifier: "customscript842",
        id: "customdeploy1",
      });
    }
  }
  return {
    onRequest: onRequest,
  };
});
