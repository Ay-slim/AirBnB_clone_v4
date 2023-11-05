#!/usr/bin/node
const $ = window.$;

let selectedAmenities = [];
let selectedStates = [];
let selectedAmenitiesId = [];
const selectedFilters = {
  amenities: [],
  states: [],
  cities: []
}

const updateH4 = (selNames, updateId='#amenityh4') => {
  const finalStr = selNames.length > 30 ? `${selNames.substr(0, 30)}...` : selNames;
  $(updateId).text(finalStr);
};

const setPlacesElements = (response) => {
  for (const res of response) {
    const placeArticle = `<article><div class="title_box"><h2>${res.name}</h2><div class="price_by_night">$${res.price_by_night}</div></div><div class="information"><div class="max_guest">${res.max_guest} Guest${res.max_guest !== 1 ? 's' : ''}</div><div class="number_rooms">${res.number_rooms} Bedroom${res.number_rooms !== 1 ? 's' : ''}</div><div class="number_bathrooms">${res.number_bathrooms} Bathroom${res.number_bathrooms !== 1 ? 's' : ''}</div></div><div class="description">${res.description} Guest${res.description ? res.description : ''}</div></article>`;
    $('.places').append(placeArticle);
  }
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
      const checkDataId = $(this).data().id;
      if ($(this).prop('checked') && !selectedAmenities.includes(checkDataName)) {
        selectedAmenities.push(checkDataName);
        selectedFilters.amenities.push(checkDataId);
        updateH4(selectedAmenities.join(', '));
      }
      if (!$(this).prop('checked') && selectedAmenities.includes(checkDataName)) {
        selectedAmenities = selectedAmenities.filter(sN => sN !== checkDataName);
        selectedFilters.amenities = selectedFilters.amenities.filter(sI => sI !== checkDataId);
        updateH4(selectedAmenities.join(', '));
      }
    }
  );

  $('.statecheck').change(
    function () {
      const checkDataName = $(this).data().name;
      const checkDataId = $(this).data().id;
      if ($(this).prop('checked') && !selectedStates.includes(checkDataName)) {
        selectedStates.push(checkDataName);
        selectedFilters.states.push(checkDataId);
        updateH4(selectedStates.join(', '), '#stateh4');
      }
      if (!$(this).prop('checked') && selectedStates.includes(checkDataName)) {
        selectedStates = selectedStates.filter(sS => sS !== checkDataName);
        selectedFilters.states = selectedFilters.states.filter(sI => sI !== checkDataId);
        updateH4(selectedStates.join(', '), '#stateh4');
      }
    }
  );

  $('.citycheck').change(
    function () {
      const checkDataName = $(this).data().name;
      const checkDataId = $(this).data().id;
      if ($(this).prop('checked') && !selectedStates.includes(checkDataName)) {
        selectedStates.push(checkDataName);
        selectedFilters.cities.push(checkDataId);
        updateH4(selectedStates.join(', '), '#stateh4');
      }
      if (!$(this).prop('checked') && selectedStates.includes(checkDataName)) {
        selectedStates = selectedStates.filter(sS => sS !== checkDataName);
        selectedFilters.cities = selectedFilters.cities.filter(sI => sI !== checkDataId);
        updateH4(selectedStates.join(', '), '#stateh4');
      }
    }
  );

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({}),
    success: function (response) {
      setPlacesElements(response);
    },
    error: function (xhr, status, error) {
      console.error('Error:', error);
    }
  });

  $('#filter_button').click(
    function () {
      $.ajax({
        url: 'http://0.0.0.0:5001/api/v1/places_search',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(selectedFilters),
        success: function (response) {
          $('.places').empty();
          $('.places').append('<!-- <h1>Places</h1> -->');
          setPlacesElements(response);
        },
        error: function (xhr, status, error) {
          console.error('Error:', error);
        }
      });
    }
  );
});
