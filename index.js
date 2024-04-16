const ADS = `https://dummyjson.com/products`;
let itemsData = [];
let MAP = "https://www.google.com/maps/embed/v1/place?q=okoko&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
const mapInput = document.querySelector('#map-input')
const mapButton = document.querySelector('#map-button')
let mapContainer = document.querySelector('#map-frame')
let ErrorText = document.querySelector('.error-text')
let formContainer = document.querySelector('.right-hand .formform')

mapContainer.src = MAP

const FetchAds = async () => {
    try {
        const response = await fetch(ADS);
        const result = await response.json();
        itemsData = result.products;
        RenderItems(itemsData);
    } catch (error) {
        console.log(error);
    }
};

// search products
document.querySelector('#searchProduct').addEventListener('keyup', event => {
    const value = event.target.value.trim().toLowerCase();
    const output = itemsData.filter(ele =>
        ele.title.toLowerCase().includes(value) ||
        ele.price.toString().includes(value) ||
        ele.discountPercentage.toString().includes(value) ||
        ele.brand.toLowerCase().includes(value) ||
        ele.description.toLowerCase().includes(value)
    );
    RenderItems(output);
});

function RenderItems(data) {
    const collection = document.querySelector('.collection');
    collection.innerHTML = ""; // Clear previous items
    if (data.length < 1) {
        new Array(9).fill(0).map(ele => {
            const item = document.createElement('div');
            item.innerHTML = `
    <div class="empty"></div>
    `
            collection.appendChild(item);
        })
    } else {
        data.forEach(ele => {
            const item = document.createElement('div');
            item.classList.add('card');
            item.onclick = () => openModal(ele.id);
            item.innerHTML = `
            <div class="card-image">
                <figure class="image">
                    <img src="${ele.thumbnail}">
                </figure>
                <div class="discount">${ele.discountPercentage}%</div>
            </div>
            <div class="card-content">
                <div class="media">
                    <div class="media-content">
                        <div class="stars">${GetStars(Math.floor(ele.rating)).join('')}</div>
                        <div class="subpricing">$${ele.price}</div>
                    </div>
                </div>
                <div class="subtitle">${ele.title}(${ele.brand})</div>
            </div>
        `;
            collection.appendChild(item);
        });
    }
}

const GetStars = (num) => {
    return new Array(num).fill().map(() => `<i class="far fa-star"></i>`);
};

FetchAds();

function closeModal() {
    document.querySelector('.modal').style.display = "none";
}

function openModal(id) {
    const item = itemsData.find(ele => ele.id === id);
    if (item) {
        document.querySelector('.modal').style.display = "flex";
        const modalBox = document.querySelector('.modal-box');
        modalBox.innerHTML = `
            <div>
                <div class="close-modal" onclick="closeModal()"><i class="fas fa-times"></i></div>
                <div><img src="${item.thumbnail}"></div>
                <div class="flexed">
                    <div class="stars">${GetStars(Math.floor(item.rating)).join('')}</div>
                    <div class="subpricing">$${item.price}</div>
                </div>
                <div class="subtitle">${item.title}</div>
                <div>${item.description}</div>
            </div>
        `;
    }
}


mapButton.addEventListener('click', () => {
    if (mapInput.value === '') {
        ErrorText.innerHTML = 'Enter a valid location'
        formContainer.style.border = "1px solid red"
        setTimeout(() => {
            ErrorText.innerHTML = ""
            formContainer.style.border = "1px solid #c7c4c4"
        }, 2000);
        return
    }
    const spins = document.querySelector('.lds-hourglass')
    spins.style.display = "inline-block"
    mapButton.style.backgroundColor = "#67b47e"
    mapButton.disabled = true
    setTimeout(() => {
        spins.style.display = "none"
        mapButton.style.backgroundColor = "#009a2e"
        mapButton.disabled = false
        mapContainer.src = `https://www.google.com/maps/embed/v1/place?q=${mapInput.value}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`
    }, 3000);

})