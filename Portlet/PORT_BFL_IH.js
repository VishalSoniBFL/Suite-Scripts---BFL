/**
 * @NApiVersion 2.x
 * @NScriptType Portlet
 */

define([], function () {
  function render(params) {
    params.portlet.title = "Suitelet View";

    var suiteletURL = "/app/site/hosting/scriptlet.nl?script=829&deploy=1";

    var content =
      '<iframe src="' +
      suiteletURL +
      '" width="100%" height="500px" frameborder="0"></iframe>';

    params.portlet.html = content;
  }

  return {
    render: render,
  };
});
