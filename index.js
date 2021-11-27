const db = new Dexie('ShoppingApp');
db.version(1).stores( { items: '++id,name,price,isPurchased'} );

const itemForm = document.getElementById('itemForm');
const itemsDiv = document.getElementById('itemsDiv');
const totalPriceDiv = document.getElementById('totalPriceDiv');

const populateItemsDiv = async () => {
    const allItems = await db.items.reverse().toArray()
    /*[
        {
            name: 'hello',
            quantity: 4,
            price: 10,
            isPurchased: true
        },
        {
            name: 'Milk',
            quantity: 1,
            price: 10,
            isPurchased: false
        }
    ]*/

    itemsDiv.innerHTML = allItems.map( item => `
        <div class="item ${item.isPurchased && 'purchased'}">
            <label>
                <input 
                type="checkbox" 
                class="checkbox" 
                ${item.isPurchased && 'checked'}>
            </label>

            <div class="itemInfo">
                <p>${item.name}</p>
                <p>$${item.price} x ${item.quantity}</p>
            </div>

            <button class="deleteButton">X</button>
        </div>
    `)

    const arrayOfPrices = allItems.map(item => item.price * item.quantity);
    const totalPrice = arrayOfPrices.reduce((a, b) => a + b, 0);
    
    totalPriceDiv.innerText = 'Total price: $'+ totalPrice;
}

itemForm.onsubmit = async (event) => {
    event.preventDefault();

    const name = document.getElementById('nameInput').value;
    const quantity = document.getElementById('quantityInput').value;
    const price = document.getElementById('priceInput').value;

    await db.items.add({ name, quantity, price });

    itemForm.reset();
};