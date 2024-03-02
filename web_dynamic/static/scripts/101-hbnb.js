const HOST = "http://127.0.0.1:5001";

$(document).ready(function () {
    const h4Tag = $(".locations h4")
    const checkedAmenities = [];
    const checkedStates = [];
    const checkedCities = [];
    let h4Content = [];
    search_places()

    function updateH4() {
        h4Tag.empty();
        h4Tag.text(h4Content.join(", "));
    }

    function appendH4(name) {
        if (h4Content.indexOf(name) === -1) {
            h4Content.push(name);
            updateH4();
        }
    }

    function removeH4(name) {
        const index = h4Content.indexOf(name);
        if (index > -1) {
            h4Content.splice(index, 1);
            updateH4();
        }
    }

    $(".amenities .popover ul li input[type='checkbox']").change(function () {
        var amenityID = $(this).data('id');
        if ($(this).is(':checked')) {
            checkedAmenities.push(amenityID);
        } else {
            var index = checkedAmenities.indexOf(amenityID);
            if (index > -1) {
                checkedAmenities.splice(index, 1);
            }
        }
    });
    $(".locations .popover ul li h2 input[type='checkbox']").change(function () {
        var stateID = $(this).data('id');
        if ($(this).is(':checked')) {
            checkedStates.push(stateID);
            appendH4($(this).data('name'));
        } else {
            var index = checkedStates.indexOf(stateID);
            if (index > -1) {
                checkedStates.splice(index, 1);
                removeH4($(this).data('name'));
            }
        }
    });

    $(".locations .popover ul li ul li input[type='checkbox']").change(function () {
        var cityID = $(this).data('id');
        if ($(this).is(':checked')) {
            checkedCities.push(cityID);
            appendH4($(this).data('name'));
        } else {
            var index = checkedCities.indexOf(cityID);
            if (index > -1) {
                checkedCities.splice(index, 1);
                removeH4($(this).data('name'));
            }
        }
    });

    $.ajax({
        url: `${HOST}/api/v1/status/`,
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



    $("section.filters button").click(function () {
        search_places({ amenities: checkedAmenities, states: checkedStates, cities: checkedCities })
    });

    $(".toggle-review").click(function () {
        // const place_id = $(this).data("place")
        console.log("place_id")

    });

});

function search_places(data = {}) {
    $.ajax({
        url: `${HOST}/api/v1/places_search`,
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
                <div class="reviews"  data-place="${place.id}">
					<h2></h2>
					<ul></ul>
                </div>
            `;
                places_section.append(article);
                fetchReviews(place.id)
            }
        },
        error: function () {
            console.error('Failed to retrieve places');
        }
    });

}

function fetchReviews(placeId) {
    $.ajax({
        url: `${HOST}/api/v1/places/${placeId}/reviews`,
        type: 'GET',
        success: function (data) {
            $(`.reviews[data-place="${placeId}"] h2`)
                .text("test")
                .html(`${data.length} Reviews <span id="toggle_review">show</span>`);
            $(`.reviews[data-place="${placeId}"] h2 #toggle_review`).click(function () {
                if ($(this).text() == "show") {
                    $(this).text("hide")
                    data.forEach(review => {
                        fetchUser(review)
                    });
                }
                else {
                    $(this).text("show")
                    const rev = $(`.reviews[data-place="${placeId}"] ul`);
                    rev.empty()
                }

            })
        }
    });
}

function fetchUser(review) {
    $.ajax({
        url: `${HOST}/api/v1/users/${review.user_id}`,
        type: 'GET',
        success: function (user) {
            const rev = $(`.reviews[data-place="${review.place_id}"] ul`);
            rev.append(`
            		  <li>
            			<h3>From ${user.first_name + " " + user.last_name} the ${review.created_at
                }</h3>
            			<p>${review.text}</p>
            		  </li>`);
        }
    })
}