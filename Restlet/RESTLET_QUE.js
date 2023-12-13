/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */

define(["N/record", "N/log"], (record, log) => {
  function get(requestParams) {
    const customerId = requestParams.customerId;

    if (customerId) {
      const customerRecord = record.load({
        type: record.Type.CUSTOMER,
        id: customerId,
        isDynamic: true,
      });

      const customerName = customerRecord.getValue({
        fieldId: "companyname",
      });

      const customerPhone = customerRecord.getValue({
        fieldId: "phone",
      });

      const customerSubsidiary = customerRecord.getText({
        fieldId: "subsidiary",
      });

      const customerEmail = customerRecord.getValue({
        fieldId: "email",
      });

      const customerDetails = {
        Name: customerName,
        Phone: customerPhone,
        Subsidiary: customerSubsidiary,
        Email: customerEmail,
      };

      return customerDetails;
    } else {
      log.error("Customer ID is missing");
      return "Customer ID is missing";
    }
  }

  function post(requestBody) {
    log.debug("Request Body", requestBody);

    const customerName = requestBody.Name;
    const customerPhone = requestBody.Phone;
    const customerSubsidiary = requestBody.Subsidiary;

    if (customerName && customerPhone && customerSubsidiary) {
      const customerRecord = record.create({
        type: record.Type.CUSTOMER,
        isDynamic: true,
      });

      customerRecord.setValue({
        fieldId: "companyname",
        value: customerName,
      });
      customerRecord.setValue({
        fieldId: "phone",
        value: customerPhone,
      });
      customerRecord.setValue({
        fieldId: "subsidiary",
        value: customerSubsidiary,
      });

      const customerId = customerRecord.save({
        enableSourcing: true,
        ignoreMandatoryFields: true,
      });
      log.debug("Customer ID", customerId);

      return `CUSTOMER CREATED WITH: ${customerName} ${customerPhone} ${customerSubsidiary} ${customerId}`;
    } else {
      log.error("Required fields are missing");
      return "Required fields are missing (Name, Phone, Subsidiary)";
    }
  }

  function put(requestBody) {
    const customerId = requestBody.customerId;
    const customerEmail = requestBody.Email;

    if (customerId && customerEmail) {
      const customerRecord = record.load({
        type: record.Type.CUSTOMER,
        id: customerId,
        isDynamic: true,
      });

      customerRecord.setValue({
        fieldId: "email",
        value: customerEmail,
      });

      customerRecord.save();
      log.debug("Email added to Customer ID", customerId);

      return `Email ${customerEmail} added to Customer ID ${customerId}`;
    } else {
      log.error("Customer ID or Email missing");
      return "Customer ID or Email missing";
    }
  }

  function deleteRequest(requestParams) {
    const customerId = requestParams.customerId;
    if (customerId) {
      try {
        record.delete({
          type: record.Type.CUSTOMER,
          id: customerId,
        });

        log.debug("Customer deleted", customerId);
        return `Customer ID ${customerId} deleted successfully`;
      } catch (e) {
        log.error("Error deleting customer", e);
        return `Error deleting customer: ${e.message}`;
      }
    } else {
      log.error("Customer ID is missing");
      return "Customer ID is missing";
    }
  }

  return {
    get,
    post,
    put,
    delete: deleteRequest,
  };
});
