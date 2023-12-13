/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(["N/record", "N/ui/serverWidget"], /**
 * @param{record} record
 * @param{serverWidget} serverWidget
 */ (record, serverWidget) => {
  const onRequest = (scriptContext) => {
    if (scriptContext.request.method === "GET") {
      let Form = serverWidget.createForm({
        title: "Sales Order By Script",
        hideNavBar: false,
      });

      var Primary = Form.addFieldGroup({
        id: "primary_information",
        label: "Primary Information",
      });

      var customer = Form.addField({
        id: "custpage_customer",
        label: "Select Customer",
        type: serverWidget.FieldType.SELECT,
        source: "customer",
        container: "primary_information",
      });

      var item = Form.addSublist({
        id: "custpage_sublist_item",
        label: "custpage_items",
        type: serverWidget.SublistType.INLINEEDITOR,
      });

      var item_name = sublist.addField({
        id: "custpage_itemName",
        label: "ITEM",
        type: serverWidget.FieldType.SELECT,
        source: "items",
      });

      var quantity = sublist.addField({
        id: "custpage_item_quantity",
        label: "Quantity",
        type: serverWidget.FieldType.INTEGER,
      });

      var postbutton = Form.addSubmitButton({
        label: "Submit",
      });

      scriptContext.response.writePage(Form);
    } else {
      var delimiter = /\u0001/;
      scriptContext.response.sendRedirect({});
    }
  };

  return { onRequest };
});
