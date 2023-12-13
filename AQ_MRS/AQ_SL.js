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
    var sales_sublist;
    if (scriptContext.request.method === "GET") {
      const customerName =
        scriptContext.request.parameters.custpage_customer_name;
      const fromDate = scriptContext.request.parameters.custpage_from_date;
      const toDate = scriptContext.request.parameters.custpage_to_date;
      const SO_Array = scriptContext.request.parameters.custpage_arr;

      let form = serverWidget.createForm({
        title: "Sales Order",
      });
      form.clientScriptFileId = 8803;

      var customerField = form.addField({
        id: "custpage_customer_name",
        type: serverWidget.FieldType.SELECT,
        label: "Customer",
        source: "customer",
      });

      if (customerName) {
        customerField.defaultValue = customerName;
      }

      var fromField = form.addField({
        id: "custpage_from_date",
        type: serverWidget.FieldType.DATE,
        label: "From",
      });

      if (fromDate) {
        fromField.defaultValue = fromDate;
      }

      var toField = form.addField({
        id: "custpage_to_date",
        type: serverWidget.FieldType.DATE,
        label: "To",
      });

      if (toDate) {
        toField.defaultValue = toDate;
      }

      sales_sublist = form.addSublist({
        id: "sales_order_sublist",
        type: serverWidget.SublistType.LIST,
        label: "Sales Orders",
      });
      sales_sublist.addField({
        id: "custpage_checkbox",
        type: serverWidget.FieldType.CHECKBOX,
        label: "Select",
      });
      sales_sublist.addField({
        id: "custpage_tranid",
        type: serverWidget.FieldType.TEXT,
        label: "Sales Order Number",
      });
      sales_sublist.addField({
        id: "custpage_entity",
        type: serverWidget.FieldType.TEXT,
        label: "Customer Name",
      });
      sales_sublist.addField({
        id: "custpage_trandate",
        type: serverWidget.FieldType.TEXT,
        label: "Date",
      }),
        sales_sublist.addField({
          id: "custpage_amount",
          type: serverWidget.FieldType.TEXT,
          label: "Amount",
        });
      sales_sublist.addField({
        id: "custpage_status",
        type: serverWidget.FieldType.TEXT,
        label: "Status",
      });

      if (customerName && fromDate && toDate) {
        var salesorderSearchObj = search.create({
          type: "salesorder",
          filters: [
            ["mainline", "is", true],
            "AND",
            ["entity", "anyof", customerName],
            "AND",
            ["trandate", "within", fromDate, toDate],
          ],

          columns: [
            search.createColumn({
              name: "salesorder",
              sort: search.Sort.ASC,
              label: "Sales Order",
            }),
            search.createColumn({ name: "mainline", label: "*" }),
            search.createColumn({ name: "internalid", label: "Internal Id" }),
            search.createColumn({ name: "tranid", label: "Document Number" }),
            search.createColumn({ name: "trandate", label: "Date" }),
            search.createColumn({ name: "type", label: "Type" }),
            search.createColumn({ name: "entity", label: "Name" }),
            search.createColumn({ name: "account", label: "Account" }),
            search.createColumn({ name: "amount", label: "Amount" }),
            search.createColumn({ name: "status", label: "Status" }),
            search.createColumn({ name: "currency", label: "Currency" }),
          ],
        });

        var resultSearch = salesorderSearchObj
          .run()
          .getRange({ start: 0, end: 100 });

        resultSearch.forEach(function (result, i) {
          sales_sublist.setSublistValue({
            id: "custpage_tranid",
            line: i,
            value: result.getValue({ name: "internalid" }),
          });

          sales_sublist.setSublistValue({
            id: "custpage_trandate",
            line: i,
            value: result.getValue({ name: "trandate" }),
          });

          sales_sublist.setSublistValue({
            id: "custpage_entity",
            line: i,
            value: result.getText({ name: "entity" }),
          });

          sales_sublist.setSublistValue({
            id: "custpage_status",
            line: i,
            value: result.getValue({ name: "status" }),
          });

          sales_sublist.setSublistValue({
            id: "custpage_amount",
            line: i,
            value: result.getValue({ name: "amount" }),
          });
        });
      }

      form.addSubmitButton({
        label: "Set Memo",
      });

      scriptContext.response.writePage(form);
    } else if (scriptContext.request.method === "POST") {
      var salesOrderIds = [];

      const customerName =
        scriptContext.request.parameters.custpage_customer_name;
      const fromDate = scriptContext.request.parameters.custpage_from_date;
      const toDate = scriptContext.request.parameters.custpage_to_date;

      var lineCount = scriptContext.request.getLineCount({
        group: "sales_order_sublist",
      });

      log.debug({
        title: "line",
        details: lineCount,
      });

      for (var i = 0; i < lineCount; i++) {
        var checkBox = scriptContext.request.getSublistValue({
          group: "sales_order_sublist",
          name: "custpage_checkbox",
          line: i,
        });
        if (checkBox === "T") {
          var intId = scriptContext.request.getSublistValue({
            group: "sales_order_sublist",
            name: "custpage_tranid",
            line: i,
          });
          salesOrderIds.push(intId);
          log.debug("Internal Id of Sales Order", salesOrderIds);
        }
      }

      log.debug({
        title: "Array",
        details: salesOrderIds,
      });

      var scheduledScriptTask = task.create({
        taskType: task.TaskType.SCHEDULED_SCRIPT,
        scriptId: "customscript_sc_setmemo_soa",
        deploymentId: "customdeploy_sc_setmemo_soa",
      });

      scheduledScriptTask.params = {
        custscript_so_id_array: salesOrderIds.join(","),
      };

      var taskId = scheduledScriptTask.submit();
      log.debug("Scheduled Script Task ID", taskId);

      scriptContext.response.sendRedirect({
        type: "SUITELET",
        identifier: "customscript831",
        id: "customdeploy1",
      });
    }
  }
  return {
    onRequest: onRequest,
  };
});
