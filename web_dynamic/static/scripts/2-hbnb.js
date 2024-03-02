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
            console.log(response)
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
});

