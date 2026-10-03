const API_URL = "https://e-commerce-stb9.onrender.com/api";


// =========================
// SIGNUP
// =========================

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const message = document.getElementById("signupMessage");

        try {

            const response = await fetch(`${API_URL}/auth/signup`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password
                })

            });

            const data = await response.json();

            if (response.ok) {

                message.textContent = "Account created successfully!";

                signupForm.reset();

                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1500);

            } else {

                message.textContent =
                    data.message || "Signup failed.";

            }

        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to connect to the server.";

        }

    });

}
// =========================
// LOGIN
// =========================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        const message = document.getElementById("loginMessage");

        try {

            const response = await fetch(`${API_URL}/auth/login`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })

            });

            const data = await response.json();

            if (response.ok) {

                // Save JWT token
                localStorage.setItem("token", data.token);

                // Save user information
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                message.textContent = "Login successful!";

                loginForm.reset();

                setTimeout(() => {
                    window.location.href = "products.html";
                }, 1000);

            } else {

                message.textContent =
                    data.message || "Login failed.";

            }

        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to connect to the server.";

        }

    });

}
// =========================
// PRODUCTS
// =========================

const productsContainer =
    document.getElementById("productsContainer");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");


let allProducts = [];


// LOAD PRODUCTS

async function loadProducts() {

    if (!productsContainer) {
        return;
    }

    try {

        const response =
            await fetch(`${API_URL}/products`);

        const products =
            await response.json();

        if (!response.ok) {

            productsContainer.innerHTML =
                "<p>Failed to load products.</p>";

            return;
        }

        allProducts = products;

        displayProducts(allProducts);

        loadCategories(allProducts);

    } catch (error) {

        console.error(error);

        productsContainer.innerHTML =
            "<p>Unable to connect to the server.</p>";

    }
}


// DISPLAY PRODUCTS

function displayProducts(products) {

    if (products.length === 0) {

        productsContainer.innerHTML =
            "<p>No products found.</p>";

        return;
    }


    productsContainer.innerHTML = "";


    products.forEach(product => {

        const productCard =
            document.createElement("div");

        productCard.className =
            "product-card";


        productCard.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
            >

            <div class="product-info">

                <h3>
                    ${product.name}
                </h3>

                <p class="product-description">
                    ${product.description}
                </p>

                <span class="product-category">
                    ${product.category}
                </span>

                <p class="product-price">
                    ₹${product.price}
                </p>

                <button
                    class="add-cart-btn"
                    onclick="addToCart('${product._id}')"
                >
                    Add to Cart
                </button>

            </div>

        `;


        productsContainer.appendChild(productCard);

    });

}


// LOAD CATEGORIES

function loadCategories(products) {

    if (!categoryFilter) {
        return;
    }


    const categories =
        [...new Set(
            products.map(product => product.category)
        )];


    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value = category;

        option.textContent = category;

        categoryFilter.appendChild(option);

    });

}


// SEARCH PRODUCTS

function filterProducts() {

    const searchText =
        searchInput.value.toLowerCase();

    const selectedCategory =
        categoryFilter.value;


    const filteredProducts =
        allProducts.filter(product => {

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchText);


            const matchesCategory =
                selectedCategory === "all" ||
                product.category === selectedCategory;


            return matchesSearch &&
                   matchesCategory;

        });


    displayProducts(filteredProducts);

}


// SEARCH EVENT

if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterProducts
    );

}


// CATEGORY EVENT

if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        filterProducts
    );

}


// LOAD PRODUCTS WHEN PAGE OPENS

loadProducts();
// =========================
// CART
// =========================

let cart = JSON.parse(
    localStorage.getItem("cart")
) || [];


// ADD TO CART

async function addToCart(productId) {

    try {

        const response =
            await fetch(`${API_URL}/products/${productId}`);

        const product =
            await response.json();

        if (!response.ok) {

            alert("Unable to add product.");

            return;
        }


        const existingProduct =
            cart.find(
                item => item.productId === product._id
            );


        if (existingProduct) {

            existingProduct.quantity += 1;

        } else {

            cart.push({

                productId: product._id,

                name: product.name,

                price: product.price,

                image: product.image,

                quantity: 1

            });

        }


        saveCart();

        alert(
            `${product.name} added to cart!`
        );

    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to the server."
        );

    }

}


// SAVE CART

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


// DISPLAY CART

function displayCart() {

    const cartContainer =
        document.getElementById("cartContainer");

    const cartItemCount =
        document.getElementById("cartItemCount");

    const cartTotal =
        document.getElementById("cartTotal");


    if (!cartContainer) {
        return;
    }


    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>

                <p>
                    Add some products to your cart.
                </p>

                <a
                    href="products.html"
                    class="btn"
                >
                    Continue Shopping
                </a>
            </div>
        `;


        if (cartItemCount) {
            cartItemCount.textContent = "0";
        }

        if (cartTotal) {
            cartTotal.textContent = "0";
        }

        return;
    }


    cartContainer.innerHTML = "";


    let totalItems = 0;
    let totalAmount = 0;


    cart.forEach((item, index) => {

        totalItems += item.quantity;

        totalAmount +=
            item.price * item.quantity;


        const cartItem =
            document.createElement("div");

        cartItem.className =
            "cart-item";


        cartItem.innerHTML = `

            <img
                src="${item.image}"
                alt="${item.name}"
            >

            <div class="cart-item-info">

                <h3>
                    ${item.name}
                </h3>

                <p>
                    ₹${item.price}
                </p>

            </div>


            <div class="quantity-controls">

                <button
                    onclick="decreaseQuantity(${index})"
                >
                    -
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button
                    onclick="increaseQuantity(${index})"
                >
                    +
                </button>

            </div>


            <div class="cart-item-total">

                ₹${item.price * item.quantity}

            </div>


            <button
                class="remove-cart-btn"
                onclick="removeFromCart(${index})"
            >
                Remove
            </button>

        `;


        cartContainer.appendChild(cartItem);

    });


    if (cartItemCount) {

        cartItemCount.textContent =
            totalItems;

    }


    if (cartTotal) {

        cartTotal.textContent =
            totalAmount;

    }

}


// INCREASE QUANTITY

function increaseQuantity(index) {

    cart[index].quantity += 1;

    saveCart();

    displayCart();

}


// DECREASE QUANTITY

function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity -= 1;

    } else {

        cart.splice(index, 1);

    }


    saveCart();

    displayCart();

}


// REMOVE PRODUCT

function removeFromCart(index) {

    cart.splice(index, 1);

    saveCart();

    displayCart();

}


// CHECKOUT BUTTON

const checkoutBtn =
    document.getElementById("checkoutBtn");

if (checkoutBtn) {

    checkoutBtn.addEventListener(
        "click",
        function () {

            if (cart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;
            }


            window.location.href =
                "checkout.html";

        }
    );

}


// LOAD CART

displayCart();
// =========================
// CHECKOUT
// =========================

const checkoutForm =
    document.getElementById("checkoutForm");

const checkoutItems =
    document.getElementById("checkoutItems");

const checkoutTotal =
    document.getElementById("checkoutTotal");


// DISPLAY CHECKOUT SUMMARY

function displayCheckout() {

    if (!checkoutItems) {
        return;
    }


    if (cart.length === 0) {

        checkoutItems.innerHTML = `
            <p>
                Your cart is empty.
            </p>

            <a
                href="products.html"
                class="btn"
            >
                Continue Shopping
            </a>
        `;

        if (checkoutTotal) {
            checkoutTotal.textContent = "0";
        }

        return;
    }


    checkoutItems.innerHTML = "";


    let totalAmount = 0;


    cart.forEach(item => {

        const itemTotal =
            item.price * item.quantity;

        totalAmount += itemTotal;


        const checkoutItem =
            document.createElement("div");

        checkoutItem.className =
            "checkout-item";


        checkoutItem.innerHTML = `

            <div>

                <div class="checkout-item-name">
                    ${item.name}
                </div>

                <div class="checkout-item-quantity">
                    Quantity: ${item.quantity}
                </div>

            </div>

            <div class="checkout-item-price">
                ₹${itemTotal}
            </div>

        `;


        checkoutItems.appendChild(
            checkoutItem
        );

    });


    checkoutTotal.textContent =
        totalAmount;

}


// PLACE ORDER

if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const token =
                localStorage.getItem("token");


            // Check login

            if (!token) {

                alert(
                    "Please login before placing an order."
                );

                window.location.href =
                    "login.html";

                return;
            }


            // Check cart

            if (cart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                window.location.href =
                    "products.html";

                return;
            }


            const customerDetails = {

                name:
                    document.getElementById(
                        "customerName"
                    ).value,

                address:
                    document.getElementById(
                        "customerAddress"
                    ).value,

                phone:
                    document.getElementById(
                        "customerPhone"
                    ).value

            };


            const totalAmount =
                cart.reduce(
                    (total, item) =>
                        total +
                        item.price * item.quantity,
                    0
                );


            const products =
                cart.map(item => ({

                    product:
                        item.productId,

                    quantity:
                        item.quantity

                }));


            const message =
                document.getElementById(
                    "checkoutMessage"
                );


            try {

                const response =
                    await fetch(
                        `${API_URL}/orders`,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`

                            },

                            body: JSON.stringify({

                                products,

                                totalAmount,

                                customerDetails

                            })

                        }
                    );


                const data =
                    await response.json();


                if (response.ok) {

                    message.textContent =
                        "Order placed successfully!";


                    // Clear cart

                    localStorage.removeItem(
                        "cart"
                    );

                    cart = [];


                    checkoutForm.reset();


                    setTimeout(() => {

                        window.location.href =
                            "index.html";

                    }, 1500);


                } else {

                    message.textContent =
                        data.message ||
                        "Failed to place order.";

                }


            } catch (error) {

                console.error(error);

                message.textContent =
                    "Unable to connect to the server.";

            }

        }
    );

}


// LOAD CHECKOUT

displayCheckout();
// LOGOUT
const logoutButtons = [
    document.getElementById("productLogoutBtn"),
    document.getElementById("cartLogoutBtn"),
    document.getElementById("checkoutLogoutBtn")
];

logoutButtons.forEach(button => {
    if (button) {
        button.addEventListener("click", function () {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "login.html";
        });
    }
});

// SHOW LOGOUT BUTTON WHEN USER IS LOGGED IN
const token = localStorage.getItem("token");

if (token) {
    const productLogoutBtn = document.getElementById("productLogoutBtn");
    const cartLogoutBtn = document.getElementById("cartLogoutBtn");
    const checkoutLogoutBtn = document.getElementById("checkoutLogoutBtn");

    if (productLogoutBtn) productLogoutBtn.style.display = "inline-block";
    if (cartLogoutBtn) cartLogoutBtn.style.display = "inline-block";
    if (checkoutLogoutBtn) checkoutLogoutBtn.style.display = "inline-block";
}