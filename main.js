// Used the following tutorials to help develop the cart updates
// https://www.youtube.com/watch?v=YeFzkC2awTM
// https://www.youtube.com/watch?v=PoTGs38DR9E
// Used this for modals: https://www.w3schools.com/howto/howto_css_modals.asp

// make sure doc is loaded before loading javascript
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    // tracks selected glaze and changes card color to hover color
    var glazes = document.getElementsByClassName('glaze-card')
    for (var i = 0; i < glazes.length; i++) {
        var glaze = glazes[i]
        glaze.addEventListener('click', function(event) {
            var clicked = event.target
            // make sure entire card changes color
            if (clicked.tagName != 'DIV') {
                clicked = clicked.parentElement
            }

            // revert card color if deselected
            var unselect = document.getElementById('glaze-selected')
            if (unselect != null) {
                unselect.removeAttribute('id')
            }

            // set glaze to selected color
            clicked.id = 'glaze-selected'

            // checks if "add to bag" should be clickable
            let amount = document.getElementById('amount-selected')
            if (amount) {
                document.getElementById('bag').id = 'bag-clickable'
                activateBag()
            }
        })
    }

    // tracks selected amount and changes card color to hover color
    var amounts = document.getElementsByClassName('amount-card')
    for (var i = 0; i < amounts.length; i++) {
        var amount = amounts[i]
        amount.addEventListener('click', function(event) {
            var clicked = event.target
            // make sure entire card changes color
            if (clicked.tagName != 'DIV') {
                clicked = clicked.parentElement
            }

            // revert card color if deselected
            var unselect = document.getElementById('amount-selected')
            if (unselect != null) {
                unselect.removeAttribute('id')
            }

            // set amount to selected color
            clicked.id = 'amount-selected'

            // checks if "add to bag" should be clickable
            let glaze = document.getElementById('glaze-selected')
            if (glaze) {
                document.getElementById('bag').id = 'bag-clickable'
                activateBag()
            }
        })
    }
}

// get item details
function itemDetails() {
    let glaze = document.getElementById('glaze-selected').children[1].textContent
    let amount = document.getElementById('amount-selected').children[0].textContent
    let type = document.getElementById('type').textContent

    let item = {"glaze":glaze, "amount":amount, "type": type}
    return item
}

function addItemToBag(item) {
    let bagItems = JSON.parse(localStorage.getItem('itemsInCart'))
    
    if(bagItems != null) {
        let total = Object.keys(bagItems).length
        itemName = item.type + total
        bagItems = {
            ...bagItems,
            [itemName]: item
        }
    } else {
        bagItems = { [item.type]: item }
    }
    localStorage.setItem("itemsInCart", JSON.stringify(bagItems))
}


// sets bag to darker (selectable) color to indicate clickability
// and activates modal
function activateBag() {
    var addBag = document.getElementById('bag-clickable')
    addBag.addEventListener('click', function(event) {
        bagAmount();
        let item = itemDetails()
        addItemToBag(item)
    })

    // code for modal
    var modal = document.getElementById('modal');

    // button that opens the modal
    var btn = document.getElementById('bag-clickable');

    // open the modal if button hit
    btn.onclick = function() {
        modal.style.display = 'block';

        // custom text to display product details on modal
        let item = itemDetails()
        document.getElementById('m-description').textContent = `x${item.amount} ${item.type}, ${item.glaze}`
    }

    // clicks anywhere outside of the modal closes and resets page
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.getElementById('glaze-selected').removeAttribute('id')
            document.getElementById('amount-selected').removeAttribute('id')
            document.getElementById('bag-clickable').removeAttribute('id')
        }
    }
}

// updates bag amount display when adding products to bag
function bagAmount() {
    let amount = localStorage.getItem('bagAmount')
    amount = parseInt(amount)

    let addAmount = document.getElementById('amount-selected').textContent
    addAmount = parseInt(addAmount)

    if (amount) {
        localStorage.setItem('bagAmount', amount + addAmount);
        document.getElementById('bag-val').textContent = amount + addAmount
    } else {
        localStorage.setItem('bagAmount', addAmount)
        document.getElementById('bag-val').textContent = addAmount
    }
}

// check local storage upon loading to make sure bag count is accurate
function onLoadBag() {
    let amount = localStorage.getItem('bagAmount')
    if (amount) {
        document.getElementById('bag-val').textContent = amount
    }
}
onLoadBag()



// Cart page
function displayBag() {
    let bagItems = localStorage.getItems()
}