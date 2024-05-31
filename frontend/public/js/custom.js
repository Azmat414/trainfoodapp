//custom.js

// to get current year
function getYear() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    document.querySelector("#displayYear").innerHTML = currentYear;
}

getYear();

// isotope js
$(window).on('load', function () {
    $('.filters_menu li').click(function () {
        $('.filters_menu li').removeClass('active');
        $(this).addClass('active');

        var data = $(this).attr('data-filter');
        $grid.isotope({
            filter: data
        })
    });

    var $grid = $(".grid").isotope({
        itemSelector: ".all",
        percentPosition: false,
        masonry: {
            columnWidth: ".all"
        }
    })
});

// nice select
$(document).ready(function() {
    $('select').niceSelect();
});

/** google_map js **/
function myMap() {
    var mapProp = {
        center: new google.maps.LatLng(40.712775, -74.005973),
        zoom: 18,
    };
    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
}

// client section owl carousel
$(".client_owl-carousel").owlCarousel({
    loop: true,
    margin: 0,
    dots: false,
    nav: true,
    navText: [],
    autoplay: true,
    autoplayHoverPause: true,
    navText: [
        '<i class="fa fa-angle-left" aria-hidden="true"></i>',
        '<i class="fa fa-angle-right" aria-hidden="true"></i>'
    ],
    responsive: {
        0: {
            items: 1
        },
        768: {
            items: 2
        },
        1000: {
            items: 2
        }
    }
});

//Cart Page
$(document).ready(function() {
    loadCartItems();

    function loadCartItems() {
        // Load cart items and calculate totals
        updateTotals();
    }

    function updateTotals() {
        // Dummy data and logic for subtotal, delivery charge, and total
        let subtotal = 0; // Implement this
        req.session.cart.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        let deliveryCharge = subtotal < 12.50 ? 2.00 : 0;
        let total = subtotal + deliveryCharge;

        $('#subtotal').text(subtotal.toFixed(2));
        $('#delivery-charge').text(deliveryCharge.toFixed(2));
        $('#total').text((subtotal + deliveryCharge).toFixed(2));

        if (subtotal < 12.50) {
            $('#minimum-notice').show();
            $('#extras-section').show();
        } else {
            $('#minimum-notice').hide();
            $('#extras-section').hide();
        }
    }

    window.applyVoucher = function() {
        // Implement voucher application
    }

    window.goBack = function() {
        // Navigate back
     
        window.location.href = '/menu';
    }

    window.proceedToCheckout = function() {
        // Proceed to checkout or payment page
    }
});

//Modal functionality
function closeModal() {
    var modal = document.getElementById("customizationModal");
    modal.style.display = "none";
    console.log("Modal closed.");
}

window.onclick = function(event) {
    var modal = document.getElementById("customizationModal");
    if (event.target === modal) {
        closeModal();
    }
}

// Update total price in real-time on the frontend
function updateTotalPrice() {
    let basePrice = parseFloat($('input[name="size"]:checked').data('price'));
    let toppingPrice = 0;

    $('input[name="topping"]:checked').each(function() {
        toppingPrice += parseFloat($(this).data('price'));
    });

    let totalPrice = basePrice + toppingPrice;
    $('#totalPrice').text(`£${totalPrice.toFixed(2)}`);
}

$(document).ready(function() {
    // Attach change event listeners to size and topping options
    $(document).on('change', 'input[name="size"], input[name="topping"]', updateTotalPrice);

    // Initialize total price on page load
    updateTotalPrice();
});

function addItemToCart(event) {
    event.preventDefault(); // Stop the form from causing a page reload

    let size = $('input[name="size"]:checked').val();
    let basePrice = $('input[name="size"]:checked').data('price');
    let item = $('#customizationModal').data('item');
    
    let toppings = [];
    $('input[name="topping"]:checked').each(function() {
        toppings.push({
            name: $(this).val(),
            price: $(this).data('price')
        });
    });

    let data = {
        item: item,
        size: size,
        basePrice: basePrice,
        toppings: toppings,
        totalPrice: parseFloat($('#totalPrice').text().replace('£', ''))
    };

    $.ajax({
        url: '/add-to-cart',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            alert('Item added to cart!');
            console.log(response);
        },
        error: function(xhr) {
            alert('Error adding item to cart');
            console.error("Error: ", xhr.responseText);
        }
    });
}

// Similar AJAX setup for updating item in cart
function updateCart(itemConfig) {
    $.ajax({
        url: '/update-cart',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(itemConfig),
        success: function(response) {
            $('#cartSummary').html(response.html); // Assuming server sends back new HTML for the cart
        },
        error: function(xhr) {
            console.error("Error updating cart: ", xhr.responseText);
        }
    });
}

// Function to display the customization model
function showCustomizationModal(event, itemName) {
    event.preventDefault();
    var modal = document.getElementById("customizationModal");
    modal.style.display = "block";
    $('#customizationModal').data('item', itemName);
    // Update the total price when the modal is opened
    updateTotalPrice();
}

// Remove item from cart
function removeItem(itemIndex) {
    $.ajax({
        url: '/remove-from-cart',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ index: itemIndex }),
        success: function(response) {
            location.reload();
        },
        error: function() {
            alert('Failed to remove item.');
        }
    });
}
