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



// Cart page
function updateAmount(index, type) {
    let selectID = "amount" + index
    let itemName = type + index
    let newAmount = document.getElementById(`amount${index}`).value
    let bagItems = JSON.parse(localStorage.getItem('itemsInBag'))
    // console.log(selectID)
    // console.log(newAmount)
    var item = bagItems[itemName]
    item.amount = newAmount
    // console.log(bagItems[itemName].amount)
    // bagItems[itemName].amount = newAmount
    // console.log(item)

    // let item = {"glaze":glaze, "amount":amount, "type": type, "cost": cost}

    bagItems = {
        ...bagItems,
        [itemName]: item
    }

    localStorage.setItem("itemsInBag", JSON.stringify(bagItems))
    document.getElementById(`cost${index}`).textContent = "$" + newAmount * item.cost

    orderSummary(bagItems)
}


function displayBag() {
    let bagItems = JSON.parse(localStorage.getItem('itemsInBag'))

    // check if on bag page
    let cartContainer = document.querySelector(".order-container")

    if (bagItems && cartContainer) {
        Object.values(bagItems).map((item, index) => {
    //         var options = {"1":"<option value='1'>1</option>",
    // "3": "<option value='3'>3</option>",
    // "6":"<option value='6'>6</option>",
    // "12": "<option value='12'>12</option>"}
            // let amount = item.amount
            // options[amount] = `<option value='${amount}' selected="selected">${amount}</option>`
            // console.log(options)
            cartContainer.innerHTML += `
            <div class="cart-card-container">
                <img src="assets/${item.type}.png" alt="${item.type}" />

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
            // console.log(id)
            // console.log(document.querySelector(`option[value="${item.amount}"]`))
            // document.querySelector(`option[value="${item.amount}"]`)
        })

        Object.values(bagItems).map((item, index) => {
            let sel = document.getElementById(`amount${index}`)
                let opts = sel.options
                for (var opt, i = 0; opt = opts[i]; i++) {
                    if (opt.value == item.amount) {
                        opts.selectedIndex = i;
                    }
                }
                // console.log(opts)
        })
        Object.keys(bagItems).map((itemName, index) => {
            removeItem(itemName, index, bagItems)
        })
        // removeItem(bagItems)
        orderSummary(bagItems)
    }
}

// function removeItem(bagItems) {
//     let remove = document.getElementsByClassName('delete')
//     for (var i = 0; i < remove.length; i++) {
//         var btn = remove[i]
//         btn.addEventListener('click', function(event) {
//             var btnClicked = event.target
//             btnClicked.parentElement.remove()
//             // localStorage.removeItem()
//             console.log(bagItems)
//         })
//     }
// }

function removeItem(itemName, i, bagItems) {
    let remove = document.getElementsByClassName('delete')
        var btn = remove[i]
        btn.addEventListener('click', function(event) {
            var btnClicked = event.target
            btnClicked.parentElement.remove()
            // localStorage.removeItem(itemName)
            // console.log(localStorage.getItem(`${itemName}`))
            // console.log(typeof(itemName))
            // console.log(localStorage.getItem('Original3'))
            // console.log(bagItems)
            delete bagItems[itemName]
            // console.log(bagItems)
            localStorage.setItem("itemsInBag", JSON.stringify(bagItems))
            orderSummary(bagItems)

        })
    
}

function orderSummary(bagItems) {
    var rollTotal = 0
    Object.values(bagItems).map((item) => {
        rollTotal = rollTotal + (item.cost * item.amount)
    })

    rollTotal = rollTotal.toFixed(2)
    let tax = (rollTotal * .07).toFixed(2)
    let subtotal = parseFloat(tax) + parseFloat(rollTotal)

    document.getElementById("rollTotal").innerText = "$" + rollTotal
    document.getElementById("tax").innerText = "$" + tax
    document.getElementById("subtotal").innerText = "$" + subtotal

}


displayBag()