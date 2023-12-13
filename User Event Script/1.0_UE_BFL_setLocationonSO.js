function MyafterSubmit() {
  var record_object = nlapiLoadRecord("salesorder", 946);
  record_object.setFieldValue("location", 1);
  nlapiSubmitRecord(record_object);
}
