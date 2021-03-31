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

    // Get the modal
    var modal = document.getElementById("modal");

    // Get the button that opens the modal
    var btn = document.getElementById("bag-clickable");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal 
    btn.onclick = function() {
    modal.style.display = "block";
    let glaze = document.getElementById('glaze-selected').children[1].textContent
    let amount = document.getElementById('amount-selected').children[0].textContent
    let type = document.getElementById('type').textContent
        console.log(`x${amount} ${type}, ${glaze}`)
    document.getElementById('m-description').textContent = `x${amount} ${type}, ${glaze}`

    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
    modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    }
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