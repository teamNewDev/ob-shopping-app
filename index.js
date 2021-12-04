const db = new Dexie('ShoppingApp');
db.version(1).stores({ items: '++id,name,price,isPurchased' });

const itemForm = document.getElementById('itemForm');
const itemsDiv = document.getElementById('itemsDiv');
const totalPriceDiv = document.getElementById('totalPriceDiv');

const populateItemsDiv = async () => {
    const allItems = await db.items.reverse().toArray()

    itemsDiv.innerHTML = allItems.map(item => `
        <div class="item ${item.isPurchased && 'purchased'}">
            <label>
                <input 
                type="checkbox" 
                class="checkbox" 
                onchange="toggleItemStatus(event, ${item.id})"
                ${item.isPurchased && 'checked'}>
            </label>

            <div class="itemInfo">
                <p class= "itemName">
                    ${item.name}
                </p>
                <p>
                    <span class= "itemPrice"> $${item.price} </span> <span class="itemQuantity"> x ${item.quantity}</span> 
                </p>
            </div>

            <button class="editButton" onclick="editItem(${item.id})">
                <img src="./shopping-app-images/assets/edit_black_24dp.svg">
            </button>

            <button class="deleteButton" onclick = "removeItem(${item.id})">
                <img src="./shopping-app-images/assets/delete_black_24dp.svg">
            </button>
        </div>
    `).join('');

    const arrayOfPrices = allItems.map(item => item.price * item.quantity);
    const totalPrice = arrayOfPrices.reduce((a, b) => a + b, 0);

    totalPriceDiv.innerText = 'Total price: $' + totalPrice;
}

window.onload = populateItemsDiv

itemForm.onsubmit = async (event) => {
    event.preventDefault();

    let name = document.getElementById('nameInput').value;
    let quantity = document.getElementById('quantityInput').value;
    let price = document.getElementById('priceInput').value;

    await db.items.add({ name, quantity, price });
    await populateItemsDiv();

    itemForm.reset();
};

const toggleItemStatus = async (event, id) => {
    await db.items.update(id, { isPurchased: !!event.target.checked })
    await populateItemsDiv()
}

//Delete an item
const removeItem = async (id) => {
    await db.items.delete(id);
    await populateItemsDiv();
}

//Delete all items button
const clearAllItems = () => {
    let items = document.getElementsByClassName('itemsDiv');

    items.innerHTML = '';
    db.items.clear();
    populateItemsDiv();
}

//Update item button
const updateItems = (id, name, quantity, price) => {
    let updateButton = getElementById('updateItemButton')

    updateButton.addEventListener("click", function () {
        db.items.modify(id, {
            name: document.getElementById('nameInput').value,
            quantity: document.getElementById('quantityInput').value,
            price: document.getElementById('priceInput').value
        });
    })
    populateItemsDiv();
}

//Edit item button
editItem = async (id) => {
    db.open().then(async db => {
        return await db.items.where('id').equals(id).toArray();
    }).then(item =>{
        document.getElementById('nameInput').value = item[0].name;
        document.getElementById('quantityInput').value = parseInt(item[0].quantity);
        document.getElementById('priceInput').value = parseInt(item[0].price);
    });
}


//Animation
let slideIndex = 0;
showSlides();

function showSlides() {
    let i;
    let slides = document.getElementsByClassName("slides");

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }

    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 4000);
}
