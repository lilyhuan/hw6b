// if (document.readyState == 'loading') {
//     document.addEventListener('DOMContentLoaded', ready)
// } else {
//     ready()
// }
// function ready() {

// }


var glazes = document.getElementsByClassName('glaze-card')
console.log(glazes);
for (var i = 0; i < glazes.length; i++) {
    var glaze = glazes[i]
    glaze.addEventListener('click', function(event) {
        var clicked = event.target
        if (clicked.tagName != 'DIV') {
            clicked = clicked.parentElement
        }
        // console.log(clicked)
        // var unselect = document.getElementsByClassName('glaze-selected')
        // for (var j = 0; j < unselect.length; j++) {
        //     un = unselect[j]
        //     un.classList.remove("glaze-selected")
        // }
        // clicked.classList.add("glaze-selected")
        // console.log(clicked)

        var unselect = document.getElementById('glaze-selected')
        if (unselect != null) {
            unselect.removeAttribute('id')
        }
        clicked.id = "glaze-selected"

        let amount = document.getElementById('amount-selected')
        if (amount) {
            document.getElementById('bag').id = "bag-clickable"
            activateBag()
        }

    })
}

var amounts = document.getElementsByClassName('amount-card')
for (var i = 0; i < amounts.length; i++) {
    var amount = amounts[i]
    amount.addEventListener('click', function(event) {
        var clicked = event.target
        if (clicked.tagName != 'DIV') {
            clicked = clicked.parentElement
        }
        // console.log(clicked)
        // var unselect = document.getElementsByClassName('amount-selected')
        // for (var j = 0; j < unselect.length; j++) {
        //     un = unselect[j]
        //     un.classList.remove("amount-selected")
        // }
        // clicked.classList.add("amount-selected")
        // console.log(clicked)

        var unselect = document.getElementById('amount-selected')
        if (unselect != null) {
            unselect.removeAttribute('id')
        }
        clicked.id = "amount-selected"

        let glaze = document.getElementById('glaze-selected')
        if (glaze) {
            document.getElementById('bag').id = "bag-clickable"
            activateBag()
        }
    })
}

function activateBag() {
    var addBag = document.getElementById('bag-clickable')
    addBag.addEventListener('click', function(event) {
        bagAmount();
    })
}


function onLoadBag() {
    let amount = localStorage.getItem('bagAmount')
    if (amount) {
        document.getElementById('bag-val').textContent = amount
    }
}

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

onLoadBag()