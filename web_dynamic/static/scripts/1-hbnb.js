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
})