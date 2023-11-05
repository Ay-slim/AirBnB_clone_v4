#!/usr/bin/node
const $ = window.$;

let selectedNames = [];

const updateH4 = (selNames) => {
  const finalStr = selNames.length > 30 ? `${selNames.substr(0, 30)}...` : selNames;
  $('#amenityh4').text(finalStr);
};

$(document).ready(function () {
  const statusCheck = 'http://0.0.0.0:5001/api/v1/status/';

  $.get(statusCheck, function (data, textStatus) {
    const availableCheck = data && data.status === 'OK';
    if (availableCheck) {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

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

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({}),
    success: function (response) {
      for (const res of response) {
        const placeArticle = `<article><div class="title_box"><h2>${res.name}</h2><div class="price_by_night">$${res.price_by_night}</div></div><div class="information"><div class="max_guest">${res.max_guest} Guest${res.max_guest !== 1 ? 's' : ''}</div><div class="number_rooms">${res.number_rooms} Bedroom${res.number_rooms !== 1 ? 's' : ''}</div><div class="number_bathrooms">${res.number_bathrooms} Bathroom${res.number_bathrooms !== 1 ? 's' : ''}</div></div><div class="description">${res.description} Guest${res.description ? res.description : ''}</div></article>`;
        $('.places').append(placeArticle);
      }
    },
    error: function (xhr, status, error) {
      console.error('Error:', error);
    }
  });
});
