$(document).ready(function () {
    var checkedAmenities = {};

    $(".amenities .popover ul li input[type='checkbox']").change(function () {
        var amenityID = $(this).data('id');
        if ($(this).is(':checked')) {
            checkedAmenities[amenityID] = true;
        } else {
            delete checkedAmenities[amenityID];
        }
    });
    $.ajax({
        url: 'http://127.0.0.1:5001/api/v1/status/',
        type: 'GET',
        success: function (response) {
            // Check if the status is "OK"
            if (response.status === 'OK') {
                // Add the class 'available' to the div#api_status
                $('#api_status').addClass('available');
            } else {
                // Remove the class 'available' from the div#api_status
                $('#api_status').removeClass('available');
            }
        },
        error: function () {
            // Handle the error if the request fails
            console.error('Failed to retrieve API status');
        }
    });

    search_places()
});

function search_places(data = {}) {
    $.ajax({
        url: 'http://127.0.0.1:5001/api/v1/places_search',
        type: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        data: JSON.stringify(data),
        success: function (response) {
            const places_section = $('section.places');
            places_section.empty();
            for (let place of response) {
                let article = document.createElement('article');
                article.innerHTML = `
                <div class="title_box">
                    <h2>#${place.name}</h2>
                    <div class="price_by_night">$${place.price_by_night}</div>
                </div>
                <div class="information">
                    <div class="max_guest">${place.max_guest} Guest${place.max_guest != 1 ? "s" : ""}</div>
                    <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms != 1 ? "s" : ""}</div>
                    <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms != 1 ? "s" : ""}</div>
                </div>
                <div class="description">
                    ${place.description}
                </div>
            `;
                places_section.append(article);
            }
        },
        error: function () {
            console.error('Failed to retrieve places');
        }
    });
}