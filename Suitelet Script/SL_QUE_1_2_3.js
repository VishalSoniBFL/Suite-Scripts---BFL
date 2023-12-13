/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(["N/ui/serverWidget", "N/record", "N/redirect", "N/log", "N/http"], (
  serverWidget,
  record,
  redirect,
  log,
  http
) => {
  const onRequest = (scriptContext) => {
    if (scriptContext.request.method === "GET") {
      let form = serverWidget.createForm({
        title: "Custom Employee Registration Form",
      });

      // Primary Information Field Group
      var cust_primary_information = form.addFieldGroup({
        id: "cust_primary_information",
        label: "Primary Information",
      });

      var emp_name = form.addField({
        id: "custpage_emp_name",
        type: serverWidget.FieldType.TEXT,
        label: "Name",
        container: "cust_primary_information",
      });

      var emp_id = form.addField({
        id: "custpage_emp_id",
        type: serverWidget.FieldType.TEXT,
        label: "Employee Id",
        container: "cust_primary_information",
      });

      var emp_doj = form.addField({
        id: "custpage_emp_doj",
        type: serverWidget.FieldType.DATE,
        label: "Date Of Joining",
        container: "cust_primary_information",
      });

      var emp_subsidiary = form.addField({
        id: "custpage_emp_subsidiary",
        type: serverWidget.FieldType.SELECT,
        label: "Employee Subsidiaries",
        source: "subsidiary",
        container: "cust_primary_information",
      });

      var emp_supervisor = form.addField({
        id: "custpage_supervisor",
        type: serverWidget.FieldType.TEXT,
        label: "Supervisor",
        container: "cust_primary_information",
      });

      var currency = form.addField({
        id: "custpage_currency",
        type: serverWidget.FieldType.SELECT,
        label: "Currency",
        container: "cust_primary_information",
        source: "currency",
      });

      var job_title = form.addField({
        id: "custpage_job_title",
        type: serverWidget.FieldType.TEXT,
        label: "Job Title",
        container: "cust_primary_information",
      });

      // Primary Communication Field Group
      var cust_primary_communication = form.addFieldGroup({
        id: "cust_primary_communication",
        label: "Primary Communication",
      });

      let emp_email = form.addField({
        id: "custpage_emp_email",
        type: serverWidget.FieldType.EMAIL,
        label: "Email",
        container: "cust_primary_communication",
      });

      let emp_phone = form.addField({
        id: "custpage_emp_phone",
        type: serverWidget.FieldType.TEXT,
        label: "Phone Number",
        container: "cust_primary_communication",
      });

      // Official Communication Field Group
      var cust_communication = form.addFieldGroup({
        id: "cust_communication",
        label: "Offical Communication",
      });

      var emp_fax = form.addField({
        id: "custpage_emp_fax",
        type: serverWidget.FieldType.TEXT,
        label: "Fax",
        container: "cust_communication",
      });

      var emp_office_phone = form.addField({
        id: "custpage_emp_office_phone",
        type: serverWidget.FieldType.TEXT,
        label: "Office Phone",
        container: "cust_communication",
      });

      // Classification Field Group
      var cust_classification = form.addFieldGroup({
        id: "cust_classification",
        label: "Classification",
      });

      var emp_department = form.addField({
        id: "custpage_emp_department",
        type: serverWidget.FieldType.SELECT,
        label: "Department",
        container: "cust_classification",
        source: "department",
      });

      var emp_class = form.addField({
        id: "custpage_emp_class",
        type: serverWidget.FieldType.SELECT,
        label: "Class",
        container: "cust_classification",
        source: "classification",
      });

      var emp_location = form.addField({
        id: "custpage_emp_location",
        type: serverWidget.FieldType.SELECT,
        label: "Location",
        container: "cust_classification",
        source: "location",
      });

      var emp_payment_notification = form.addField({
        id: "custpage_emp_payment_notification",
        type: serverWidget.FieldType.EMAIL,
        label: "Email Address for Payment Notification",
        container: "cust_classification",
      });

      let emp_address = form.addSublist({
        id: "custpage_emp_address",
        label: "Address",
        type: serverWidget.SublistType.INLINEEDITOR,
      });

      let address_type = emp_address.addField({
        id: "custpage_address_type",
        label: "Address Type",
        type: serverWidget.FieldType.SELECT,
      });

      address_type.addSelectOption({
        value: "0",
        text: "",
      });

      address_type.addSelectOption({
        value: "1",
        text: "HOME",
      });

      address_type.addSelectOption({
        value: "2",
        text: "OFFICE",
      });

      address_type.addSelectOption({
        value: "3",
        text: "PG",
      });

      let address_city = emp_address.addField({
        id: "custpage_address_city",
        label: "City",
        type: serverWidget.FieldType.TEXT,
      });

      let address_Street = emp_address.addField({
        id: "custpage_address_street",
        label: "Address Street",
        type: serverWidget.FieldType.TEXT,
      });

      let address_CountryName = emp_address.addField({
        id: "custpage_address_countryname",
        label: "Country",
        type: serverWidget.FieldType.TEXT,
      });

      emp_name.isMandatory = true;
      emp_id.isMandatory = true;
      emp_doj.isMandatory = true;
      emp_subsidiary.isMandatory = true;

      form.addSubmitButton({
        label: "SAVE RECORD",
      });

      scriptContext.response.writePage(form);
    } else {
      var delimiter = /\u0001/;

      var emp_name = scriptContext.request.parameters.custpage_emp_name;
      var emp_id = scriptContext.request.parameters.custpage_emp_id;
      var emp_doj = scriptContext.request.parameters.custpage_emp_doj;
      var emp_subsidiary =
        scriptContext.request.parameters.custpage_emp_subsidiary;
      var emp_supervisor = scriptContext.request.parameters.custpage_supervisor;
      var currency = scriptContext.request.parameters.custpage_currency;
      var job_title = scriptContext.request.parameters.custpage_job_title;
      var emp_email = scriptContext.request.parameters.custpage_emp_email;
      var emp_phone = scriptContext.request.parameters.custpage_emp_phone;
      var emp_fax = scriptContext.request.parameters.custpage_emp_fax;
      var emp_office_phone =
        scriptContext.request.parameters.custpage_emp_office_phone;
      var emp_department =
        scriptContext.request.parameters.custpage_emp_department;
      var emp_class = scriptContext.request.parameters.custpage_emp_class;
      var emp_location = scriptContext.request.parameters.custpage_emp_location;
      var emp_payment_notification =
        scriptContext.request.parameters.custpage_emp_payment_notification;

      var emp_rec = record.create({
        type: "employee",
        isDynamic: true,
      });

      emp_rec.setValue({
        fieldId: "firstname",
        value: emp_name,
      });

      emp_rec.setValue({
        fieldId: "subsidiary",
        value: emp_subsidiary,
      });
      emp_rec.setValue({
        fieldId: "location",
        value: emp_location,
      });
      emp_rec.setValue({
        fieldId: "department",
        value: emp_department,
      });
      emp_rec.setValue({
        fieldId: "class",
        value: emp_class,
      });
      emp_rec.setValue({
        fieldId: "currency",
        value: currency,
      });

      emp_rec.setValue({
        fieldId: "email",
        value: emp_email,
      });

      emp_rec.setValue({
        fieldId: "phone",
        value: emp_phone,
      });

      var recordId = emp_rec.save({
        enableSourcing: false,
        ignoreMandatoryFields: false,
      });

      scriptContext.response.sendRedirect({
        type: http.RedirectType.RECORD,
        identifier: record.Type.EMPLOYEE,
        parameters: {
          id: recordId,
        },
      });
    }
  };

  return { onRequest };
});
