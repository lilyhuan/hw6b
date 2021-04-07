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
    let cost = document.getElementById('cost').textContent.substring(1)

    let item = {"glaze":glaze, "amount":amount, "type": type, "cost": cost}
    return item
}

// add selected item to bag in local storage
function addItemToBag(item) {
    let bagItems = JSON.parse(localStorage.getItem('itemsInBag'))
    
    if(bagItems != null) {
        let total = Object.keys(bagItems).length
        itemName = item.type + total
        bagItems = {
            ...bagItems,
            [itemName]: item
        }
    } else {
        let itemName = item.type + "0"
        bagItems = { [itemName]: item }
    }
    localStorage.setItem("itemsInBag", JSON.stringify(bagItems))
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



// ===================================== Cart page ===================================== //

// updates amount of an item and all dependencies (cost and order summary)
function updateAmount(index, type) {
    // item name in local storage
    let itemName = type + index
    let newAmount = document.getElementById(`amount${index}`).value
    let bagItems = JSON.parse(localStorage.getItem('itemsInBag'))
    var item = bagItems[itemName]

    item.amount = newAmount

    bagItems = {
        ...bagItems,
        [itemName]: item
    }

    localStorage.setItem("itemsInBag", JSON.stringify(bagItems))

    // update cost of item
    document.getElementById(`cost${index}`).textContent = "$" + newAmount * item.cost

    // update order summary
    orderSummary(bagItems)
}

// display the bag content
function displayBag() {
    let bagItems = JSON.parse(localStorage.getItem('itemsInBag'))

    // check if on bag page
    let orderContainer = document.querySelector(".order-container")

    // if bag items exist and on cart page
    if (bagItems && orderContainer) {
        // remove empty bag tag
        document.getElementById("emptyBag").remove()
        
        // inserts item cards into HTML
        Object.values(bagItems).map((item, index) => {
            // make sure img name is matches assets/image name
            let imgName = item.type.toLowerCase()
            orderContainer.innerHTML += `
            <div class="cart-card-container">
                <img src="assets/${imgName}.png" alt="${item.type}" />

                 <div class="cart-card-content">
                    <h3>${item.type}, ${item.glaze}</h3>
                    <p id="cost${index}">$${item.cost*item.amount}</p>

                    <label for="amount${index}"></label>

                    <select name="amount${index}" id="amount${index}" onchange="updateAmount(${index}, '${item.type}')">
                        <option value="1">1</option>
                        <option value="3">3</option>
                        <option value="6">6</option>
                        <option value="12">12</option>
                    </select>
                    <br />
                </div>
             <span class="delete">&times;</span>
            </div>
            `
        })

        // sets select tag to correct amount
        Object.values(bagItems).map((item, index) => {
            let sel = document.getElementById(`amount${index}`)
            let opts = sel.options
            for (var opt, i = 0; opt = opts[i]; i++) {
                if (opt.value == item.amount) {
                    opts.selectedIndex = i;
                }
            }
        })

        // enables x button to delete item
        Object.keys(bagItems).map((itemName, index) => {
            removeItem(itemName, index, bagItems)
        })

        // sets order summary card
        orderSummary(bagItems)
    } 
}

displayBag()

// deletes corresponding item when x is hit
function removeItem(itemName, i, bagItems) {
    let remove = document.getElementsByClassName('delete')
    var btn = remove[i]
    btn.addEventListener('click', function(event) {
        var btnClicked = event.target
        btnClicked.parentElement.remove()

        let deleteAmount = parseInt(bagItems[itemName].amount)
        delete bagItems[itemName]
        localStorage.setItem("itemsInBag", JSON.stringify(bagItems))

        // update bag display
        let amount = parseInt(localStorage.getItem('bagAmount'))
        localStorage.setItem("bagAmount", JSON.stringify(amount - deleteAmount))
        document.getElementById('bag-val').textContent = amount-deleteAmount

        // update order summary since item was deleted
        orderSummary(bagItems)
    })
    
}

// sets order summary to have correct values
function orderSummary(bagItems) {
    // find cost of all rolls
    var rollTotal = 0
    Object.values(bagItems).map((item) => {
        rollTotal = rollTotal + (item.cost * item.amount)
    })

    // sets floats to 2 decimal places
    rollTotal = rollTotal.toFixed(2)
    let tax = (rollTotal * .07).toFixed(2)
    let subtotal = parseFloat(tax) + parseFloat(rollTotal)

    document.getElementById("rollTotal").innerText = "$" + rollTotal
    document.getElementById("tax").innerText = "$" + tax
    document.getElementById("subtotal").innerText = "$" + subtotal
}

