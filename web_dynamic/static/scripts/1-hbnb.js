#!/usr/bin/node
const $ = window.$;
let selectedNames = [];
const updateH4 = (selNames) => {
  const finalStr = selNames.length > 30 ? `${selNames.substr(0, 30)}...` : selNames;
  $('#amenityh4').text(finalStr);
};
$(document).ready(function () {
  $('.amenitycheck').change(
    function () {
      const checkDataName = $(this).data().name;
      if ($(this).prop('checked') && !selectedNames.includes(checkDataName)) {
        selectedNames.push(checkDataName);
        updateH4(selectedNames.join(', '));
      }
      if (!$(this).prop('checked') && selectedNames.includes(checkDataName)) {
        selectedNames = selectedNames.filter(sN => sN !== checkDataName);
        updateH4(selectedNames.join(', '));
      }
    }
  );
});
