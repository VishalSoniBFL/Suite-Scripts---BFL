/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(["N/ui/serverWidget", "N/search"], function (serverWidget, search) {
  function onRequest(context) {
    if (context.request.method === "GET") {
      var form = serverWidget.createForm({
        title: "Orders by Customer",
      });

      var customerField = form.addField({
        id: "custpage_customer",
        type: serverWidget.FieldType.SELECT,
        label: "Customer",
        source: "customer",
      });
      customerField.isMandatory = true;

      form.addSubmitButton({
        label: "Load Orders",
      });

      context.response.writePage(form);
    } else {
      var customerId = context.request.parameters.custpage_customer;

      var ordersSearch = search.create({
        type: search.Type.SALES_ORDER,
        filters: [
          ["mainline", "is", true],
          "AND",
          ["entity", "anyof", customerId],
        ],
        columns: ["tranid", "status", "total"],
      });

      var searchResult = ordersSearch.run().getRange({ start: 0, end: 100 });

      var form = serverWidget.createForm({
        title: "Orders by Customer",
      });

      var sublist = form.addSublist({
        id: "custpage_salesorder_sublist",
        type: serverWidget.SublistType.LIST,
        label: "Orders",
      });

      sublist.addField({
        id: "custpage_tranid",
        type: serverWidget.FieldType.TEXT,
        label: "Transaction ID",
      });

      sublist.addField({
        id: "custpage_status",
        type: serverWidget.FieldType.TEXT,
        label: "Status",
      });

      sublist.addField({
        id: "custpage_total",
        type: serverWidget.FieldType.CURRENCY,
        label: "Total",
      });

      searchResult.forEach(function (result, i) {
        sublist.setSublistValue({
          id: "custpage_tranid",
          line: i,
          value: result.getValue("tranid"),
        });

        sublist.setSublistValue({
          id: "custpage_status",
          line: i,
          value: result.getText("status"),
        });

        sublist.setSublistValue({
          id: "custpage_total",
          line: i,
          value: result.getValue("total"),
        });
      });

      context.response.writePage(form);
    }
  }

  return {
    onRequest: onRequest,
  };
});
