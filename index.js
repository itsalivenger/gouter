let tabs = document.querySelectorAll('.tabs');
let products = document.getElementsByClassName('produit');
const productsContainer = document.getElementsByClassName('categoryContainer');
let cup = document.getElementsByClassName('addedProdsContainer')[0];
const addedProds = document.getElementsByClassName('addedProd');
let wachKhtaritiBase1 = false;
var juice = {};
let counter = 0;
let orderConfirmation = 0;
let selectedProdContainer = document.getElementsByClassName('cup');

for (let i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener('click', ()=> targetToProducts(i))
    if(i){
        document.getElementById(`products${i}`).style.display = 'none';
    }
}

for (let i = 0; i < products.length; i++) {
    products[i].addEventListener('click', ()=> addToCup(i));
}

function targetToProducts(i) {
    for (let i = 0; i < document.getElementsByClassName('categoryContainer').length; i++) {
        document.getElementById(`products${i}`).style.opacity = '0';
        document.getElementById(`products${i}`).style.display = 'none';
        document.getElementById(`products${i}`).className = 'categoryContainer'
    }
    document.getElementById(`products${i}`).style.display = 'flex';
    document.getElementById(`products${i}`).className = 'categoryContainer active';
    setTimeout(()=>document.getElementById(`products${i}`).style.opacity = '8', 100);
    counter = i;
}

function addToCup(i) {
    // setTimeout(()=>products[i].style.background = 'white', 1500);
    //if mazal makhtariti base
    selectedProdContainer[0].style.display = 'block';
    document.getElementsByClassName('confirmAll')[0].style.display = 'none';
    orderConfirmation = 0;
    if(!products[i].className.includes('base') && (!juice.base1 || !juice.base2)){
        let george = true;
        let alertText = document.getElementById('alertText');
        alertText.style.display = 'block';
        let int = setInterval(()=>{
            alertText.style.color = george ? 'white' : 'black';
            alertText.style.background = george ? '#dc3545' : 'white';
            george = !george
        }, 500);
        setTimeout(()=>{
            clearInterval(int);
            alertText.style.display = 'none';
            targetToProducts(0)
        }, 2000);
        return;
    }

    let chooseBtn = document.getElementById('btnChoisir'),
        deleteBtn = document.getElementById('btnDelete'),
        confirmBtn = document.getElementById('btnConfirm');
    let alertText = document.getElementById('alertText');
    //displaying buttons depending on the actions
    deleteBtn.style.display = 'inline-block';
    confirmBtn.style.display = 'inline-block';
    alertText.style.display = 'none';
    chooseBtn.style.display = 'none';

    // add a base and replace the chosen one if there is anyone
    if(products[i].className.includes('base')){
        let gregor = 2;
        if(products[i].className.includes('base1')){
            gregor = 1;
        }
            juice['base' + gregor] = {
                name: products[i].getAttribute('value'),
                qty: 1,
                price: parseInt(products[i].getAttribute('price')),
                type: products[i].parentElement.firstElementChild.getAttribute('value'),
                imgSrc: products[i].getElementsByClassName('images')[0].src
            };
            if(document.getElementById(`base${gregor}`)){
                document.getElementById(`base${gregor}`).remove();
            }
            cup.innerHTML += `
            <div value='${products[i].getAttribute('value')}' id='base${gregor}'
                class="addedProd ${products[i].getAttribute('value')}">
                <img class='addedImg img rounded-circle' src='${products[i].getElementsByClassName('images')[0].src}'/>
                <div class='qtyInCup'>${products[i].getElementsByClassName('qty')[0].firstChild.innerText}</div>
                <div class='priceInCup'>${products[i].getElementsByClassName('price')[0].innerText}</div>
                <div class='addedRemoveBtn'>x</div>
            </div>`;
            assignEventListenerToAddedProd();
            targetToProducts(gregor);
            getTotal();
            return;
    }
    //if element exists just multiply its qty instead of adding more of it
    if(juice.hasOwnProperty(products[i].getAttribute('value'))){
        // adding the qty to the selected product in the middle div
        handleQty(i, 1);
        getTotal();
        return;
    }

    juice[products[i].getAttribute('value')] = {
        name: products[i].getAttribute('value'),
        qty: 1,
        price: parseInt(products[i].getAttribute('price')),
        type: products[i].parentElement.firstElementChild.getAttribute('value'),
        imgSrc: products[i].getElementsByClassName('images')[0]
    };
    cup.innerHTML += `
    <div value='${products[i].getAttribute('value')}' class="addedProd ${products[i].getAttribute('value')}">
        <img class='addedImg img rounded-circle' src='${products[i].getElementsByClassName('images')[0].src}'/>
        <div class='qtyInCup'>${products[i].getElementsByClassName('qty')[0].firstChild.innerText}</div>
        <div class='priceInCup'>${products[i].getElementsByClassName('price')[0].innerText}</div>
        <div class='addedRemoveBtn'>x</div>
    </div>`;
    assignEventListenerToAddedProd();
    getTotal();
}

function handleQty(i, params) {
    juice[products[i].getAttribute('value')].qty += params;
    let currentQty = juice[products[i].getAttribute('value')].qty;
    cup.getElementsByClassName(products[i].getAttribute('value'))[0]
    .getElementsByClassName('qtyInCup')[0].innerHTML = `
    x ${currentQty}`;
    products[i].getElementsByClassName('qty')[0].firstChild.innerText = 'x ' + currentQty;
}

function deleteAll() {
    let chooseBtn = document.getElementById('btnChoisir'),
        deleteBtn = document.getElementById('btnDelete'),
        confirmBtn = document.getElementById('btnConfirm');
    var alertText = document.getElementById('alertText');
    juice = {};
    let leng = document.getElementsByClassName('addedProd').length;
    for (let i = 0; i < products.length; i++) {
        if(i < leng){
            document.getElementsByClassName('addedProd')[0].remove();
        }
        products[i].getElementsByClassName('qty')[0].firstChild.innerText = 'x 1';
    }
    chooseBtn.style.display = 'inline-block';
    deleteBtn.style.display = 'none';
    confirmBtn.style.display = 'none';
    alertText.style.display = 'none';
    getTotal();
    targetToProducts(0)
}

function redirectToBase() {
    targetToProducts(0)
}

function getTotal() {
    let totalDiv = document.getElementById('total');
    let total = 0;
    for (const prop in juice) {
        total += juice[prop].price * juice[prop].qty;
    }
    totalDiv.innerHTML = `<div>Total: </div> <div>${total} $</div>`;
    document.getElementsByClassName('total')[0].innerHTML = `<div>Total: </div> <div>${total} $</div>`;
}

function handleArrows(param) {
    if((counter == productsContainer.length - 1 && param == 1) 
    || (counter == 0 && param == -1)){
        return;
    }
    targetToProducts(counter + param);
}

function handleDeleteAddedProd(event) {
    for (let i = 0; i < products.length; i++) {
        if(products[i].getAttribute('value') == event.target.getAttribute('value')){
            products[i].getElementsByClassName('qty')[0].firstChild.innerText = 'x 1';
        }
    }
    let id;
    let propName = event.target.getAttribute('value');
    if(!propName){
        event.target.parentElement.remove();
        propName = event.target.parentElement.getAttribute('value');
        id = event.target.parentElement.id;
    }else{
        event.target.remove();
        id = event.target.id;
    }
    delete juice[id == 'base1' ? 'base1' :
     id == 'base2' ? 'base2' : propName];
    if(addedProds.length == 0){
        deleteAll()
        return;
    }
    getTotal();
    for (let i = 0; i < products.length; i++) {
        if(products[i].getAttribute('value') == propName){
            products[i].getElementsByClassName('qty')[0].innerHTML = `<h5>x 1</h5>`
        }
    }
}

function assignEventListenerToAddedProd(){
    for (let i = 0; i < addedProds.length; i++) {
        addedProds[i].addEventListener('click', (e)=> handleDeleteAddedProd(e));
    }
}

async function submit() {
    if(orderConfirmation){
        let user = {
            num: document.getElementById('numeroDeTele').value,
            fullname: document.getElementById('fullname').value,
            address: document.getElementById('address').value
        };
        document.getElementsByClassName('submitBtn')[0].click();
        let req = await fetch('', {
            method: 'POST',
            body: JSON.stringify({juice, user}),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: true
        });
    let res = await req.json();
    console.log(res);
    alert('your order has been confirmed !');
    }else{
        selectedProdContainer[0].style.display = 'none';
        document.getElementsByClassName('confirmAll')[0].style.display = 'flex';
        document.getElementsByClassName('confirmAll')[0].style.height = '';
        orderConfirmation = 1
    }
}

function goBackfct() {
    selectedProdContainer[0].style.display = 'block';
    document.getElementsByClassName('confirmAll')[0].style.display = 'none';
    orderConfirmation = 0;
}

