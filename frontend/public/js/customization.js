// Function to update the total price in real-time within the customization modal
function updateTotalPrice() {
    let basePrice = parseFloat(document.querySelector('input[name="size"]:checked').dataset.price);
    let toppingPrice = 0;

    document.querySelectorAll('input[name="topping"]:checked').forEach(function(topping) {
        toppingPrice += parseFloat(topping.dataset.price);
    });

    let totalPrice = basePrice + toppingPrice;
    document.getElementById('totalPrice').innerText = `£${totalPrice.toFixed(2)}`;
}

// Function to initialize event listeners for updating the total price within the customization modal
function initializePriceUpdateListeners() {
    document.querySelectorAll('input[name="size"], input[name="topping"]').forEach(function(element) {
        element.addEventListener('change', updateTotalPrice);
    });
}

// Function to close the modal
function closeModal() {
    var modal = document.getElementById("customizationModal");
    modal.style.display = "none";
}

window.onclick = function(event) {
    var modal = document.getElementById("customizationModal");
    if (event.target === modal) {
        closeModal();
    }
}

// Function to show the customization modal and set the item name
function showCustomizationModal(event, itemName) {
    event.preventDefault();
    var modal = document.getElementById("customizationModal");
    modal.style.display = "block";
    modal.dataset.item = itemName;
    updateTotalPrice();
}

// Function to add the item to the cart
function addItemToCart(event) {
    event.preventDefault(); // Stop the form from causing a page reload

    let size = document.querySelector('input[name="size"]:checked').value;
    let basePrice = document.querySelector('input[name="size"]:checked').dataset.price;
    let item = document.getElementById("customizationModal").dataset.item;
    
    let toppings = [];
    document.querySelectorAll('input[name="topping"]:checked').forEach(function(topping) {
        toppings.push({
            name: topping.value,
            price: topping.dataset.price
        });
    });

    let data = {
        item: item,
        size: size,
        basePrice: basePrice,
        toppings: toppings,
        totalPrice: parseFloat(document.getElementById('totalPrice').innerText.replace('£', ''))
    };

    fetch('/add-to-cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(response => {
        alert('Item added to cart!');
        console.log(response);
        closeModal();
    })
    .catch(error => {
        alert('Error adding item to cart');
        console.error("Error: ", error);
    });
}

// Initialize event listeners on page load
document.addEventListener('DOMContentLoaded', function() {
    initializePriceUpdateListeners();
});
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