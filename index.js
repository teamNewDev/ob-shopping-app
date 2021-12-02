const db = new Dexie('ShoppingApp');
db.version(1).stores( { items: '++id,name,price,isPurchased'} );

const itemForm = document.getElementById('itemForm');
const itemsDiv = document.getElementById('itemsDiv');
const totalPriceDiv = document.getElementById('totalPriceDiv');

const populateItemsDiv = async () => {
    const allItems = await db.items.reverse().toArray()

    itemsDiv.innerHTML = allItems.map( item => `
        <div class="item ${item.isPurchased && 'purchased'}">
            <label>
                <input 
                type="checkbox" 
                class="checkbox" 
                onchange="toggleItemStatus(event, ${item.id})"
                ${item.isPurchased && 'checked'}>
            </label>

            <div class="itemInfo">
                <p id = "itemName">
                    ${item.name}
                </p>
                <p>
                    $${item.price} x ${item.quantity}
                </p>
            </div>

            <button id="editButton" onclick = "editItem(${item.id})">
                <img src="./shopping-app-images/assets/edit_black_24dp.svg">
            </button>

            <button class="deleteButton" onclick = "removeItem(${item.id})">
                <img src="./shopping-app-images/assets/delete_black_24dp.svg">
            </button>
        </div>
    `).join('');

    const arrayOfPrices = allItems.map(item => item.price * item.quantity);
    const totalPrice = arrayOfPrices.reduce((a, b) => a + b, 0);
    
    totalPriceDiv.innerText = 'Total price: $'+ totalPrice;
}

window.onload = populateItemsDiv

itemForm.onsubmit = async (event) => {
    event.preventDefault();

    const name = document.getElementById('nameInput').value;
    const quantity = document.getElementById('quantityInput').value;
    const price = document.getElementById('priceInput').value;

    await db.items.add({ name, quantity, price });
    await populateItemsDiv();

    itemForm.reset();
};

const toggleItemStatus = async (event, id) => {
    await db.items.update(id, { isPurchased: !!event.target.checked })
    await populateItemsDiv()
}

const removeItem = async (id) => {
    await db.items.delete(id);
    await populateItemsDiv();
}









const clearItems = () => {
    let items = document.getElementsByClassName('itemsDiv');

    items.innerHTML = '';
    db.items.clear();
    populateItemsDiv();
}

const editItem = () => {
   let itemName = document.getElementById('itemName');

    itemName.setAttribute('contentEditable', 'true');
    itemName.focus();
}


/*const editItem = (id) => {
    let item_name = document.getElementById('nameInput').value;
    let item_quantity = document.getElementById('quantityInput').value;
    let item_price = document.getElementById('priceInput').value;
    
 
    item_name = items.name;
    item_quantity = items.quantity;
    item_price = items.price;
    item_name.focus();
 }*/

 const updateItems = async (id) => {
     let updateButton = getElementById('updateItemButton')

     await updateButton.addEventListener("click", function(){
        db.items.update(id);
        populateItemsDiv();
     })
}
