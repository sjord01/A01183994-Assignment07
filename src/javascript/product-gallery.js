$(document).ready(function() {
    // Constants and cached jQuery objects
    const PRICE_PER_ITEM = 20.00;
    const $slideVariable = $('#slide-variable');
    const $thumbnails = $('#thumbnails a');
    const $quantityInput = $('.quantity-input');
    const $colorInputs = $('input[name="t-shirt-color"]');
    const $sizeInputs = $('input[name="t-shirt-size"]');
    const $submitButton = $('#container-form-btn button[name="buy-product"]');

    // Dynamic elements
    const $priceDisplay = $('<p>Price: $20.00</p>');
    const $totalDisplay = $('<p>Total: <span class="txt-blue">$20.00</span></p>');
    const $colorDescription = $('<p>Color: <span class="txt-blue">Black</span></p>');
    const $sizeDescription = $('<p>Size: <span class="txt-blue">Choose</span></p>');

    // State variables
    let currentView = 'no-model'; // Tracks the current t-shirt view (no-model, front, back)

    // Initialize dynamic elements
    $('#choose-quantity h4').after($priceDisplay);
    $('#choose-quantity').append($totalDisplay);
    $('#color-selection').append($colorDescription);
    $('#size-selection').append($sizeDescription);

    /**
     * Updates gallery images based on selected color while maintaining current view
     * @param {string} color - Selected t-shirt color
     */
    function updateGalleryImages(color) {
        const baseUrl = 'src/assets/images/product-images/t-shirt-';
        const imageTypes = ['-no-model.jpg', '-front.jpg', '-back.jpg'];

        // Update thumbnails
        $thumbnails.each(function(index) {
            const newSrc = baseUrl + color + imageTypes[index];
            $(this).attr('href', newSrc)
                   .find('img')
                   .attr({
                       'src': newSrc,
                       'alt': `T-shirt product ${color}, ${['no model', 'front', 'back'][index]}`
                   });
        });

        // Update main image while maintaining current view
        $slideVariable.attr({
            'src': baseUrl + color + '-' + currentView + '.jpg',
            'alt': `T-shirt product ${color}, ${currentView}`
        });
    }

    /**
     * Validates and updates quantity input
     * @returns {number} - Validated quantity value
     */
    function validateAndUpdateQuantity() {
        let value = parseInt($quantityInput.val().trim());
        value = isNaN(value) || value < 1 ? 1 : value;
        $quantityInput.val(value);
        return value;
    }

    /**
     * Updates total price display
     */
    function updateTotal() {
        const quantity = validateAndUpdateQuantity();
        const total = (PRICE_PER_ITEM * quantity).toFixed(2);
        $totalDisplay.html(`Total: <span class="txt-blue">$${total}</span>`);
    }

    // Event Handlers

    // Thumbnail click handler
    $thumbnails.on('click', function(event) {
        event.preventDefault();
        const src = $(this).attr('href');
        $slideVariable.attr({
            'src': src,
            'alt': $(this).find('img').attr('alt')
        });
        currentView = src.split('-').pop().replace('.jpg', '');
    });

    // Quantity decrease button handler
    $('#decrease-btn').on('click', function(e) {
        e.preventDefault();
        let value = validateAndUpdateQuantity();
        if (value > 1) {
            $quantityInput.val(value - 1);
            updateTotal();
        }
    });

    // Quantity increase button handler
    $('#increase-btn').on('click', function(e) {
        e.preventDefault();
        let value = validateAndUpdateQuantity();
        $quantityInput.val(value + 1);
        updateTotal();
    });

    // Quantity input handlers
    $quantityInput.on('input', updateTotal)
                  .on('blur', function() {
                      validateAndUpdateQuantity();
                      updateTotal();
                  });

    // Color selection handler
    $colorInputs.on('change', function() {
        const selectedColor = $(this).val();
        $colorDescription.html(`Color: <span class="txt-blue">${selectedColor}</span>`);
        updateGalleryImages(selectedColor.toLowerCase());
    });

    // Size selection handler
    $sizeInputs.on('change', function() {
        const selectedSize = $(this).val();
        $sizeDescription.html(`Size: <span class="txt-blue">${selectedSize}</span>`);
        $submitButton.prop('disabled', false)
                     .text('Add To Cart')
                     .attr('id', 'btn-form');
    });

    // Form reset handler
    $('#product-form').on('reset', function() {
        $colorDescription.html('Color: <span class="txt-blue">Black</span>');
        $sizeDescription.html('Size: <span class="txt-blue">Choose</span>');
        $submitButton.prop('disabled', true)
                     .text('Choose a size to submit')
                     .removeAttr('id');
        $quantityInput.val(1);
        updateTotal();
        updateGalleryImages('black');
    });

    // Initial setup
    $submitButton.prop('disabled', true).text('Choose a size');
    updateTotal();
});