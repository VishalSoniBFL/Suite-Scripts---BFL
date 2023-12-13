/**
 *@NApiVersion 2.x
 *@NScriptType Portlet
 */

// This sample creates a portlet with two links
define([], function () {
  function render(params) {
    var portlet = params.portlet;
    portlet.title = "Search Engines";
    portlet.addLine({
      text: "NetSuite",
      url: "http://www.netsuite.com/",
    });
    portlet.addLine({
      text: "Oracle",
      url: "http://www.oracle.com/",
    });
  }

  return {
    render: render,
  };
});
