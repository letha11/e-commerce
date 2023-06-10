const bar = document.getElementById("bar");
const close = document.getElementById("close");
const nav = document.getElementById("navbar");
const root = document.querySelector(".root-container");

const delayPage = 300; // millisecond

const navLinks = nav.querySelectorAll("li a");

window.scrollTo({
  top: 0,
  behavior: "smooth",
});

navLinks.forEach((e) => {
  e.addEventListener("click", (el) => {
    el.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    document.querySelector(".active").classList.remove("active");
    el.currentTarget.classList.add("active");

    let path = el.currentTarget.getAttribute("href");

    // prevent the same route from being pushed
    if (`/${path.split("/").at(-1)}` === window.location.pathname) {
      return; // do nothing
    }

    handleLocation(path);
  });
});

function toggleLoadingIndicator() {
  const loadingIndicatorElement = document.querySelector(".loading-indicator");
  const loadingIndicatorContainer = document.querySelector(
    ".loading-indicator-container",
  );

  loadingIndicatorElement.classList.toggle("active");
  loadingIndicatorContainer.classList.toggle("active");
}

const routes = {
  "": {
    init: homePage, // an initializer function that will be called when the page finished loading.
  },
  "home.html": {
    init: homePage, // an initializer function that will be called when the page finished loading.
  },
  "shop.html": {
    init: shopPage,
  },
  "cart.html": {
    init: cartPage,
  },
  "about.html": {
    init: aboutPage,
  },
  "contact.html": {
    init: contactPage,
  },
};

/**
 * @param {string} path
 */
async function handleLocation(path) {
  if (path === "index.html" || path === "") {
    path = "home.html";
  }

  toggleLoadingIndicator(); // show
  root.innerHTML = "";
  let newPage = await fetch(path).then((response) => response.text());
  // for loading effect to show (only for demo purposes)
  setTimeout(async () => {
    toggleLoadingIndicator(); // hide
    root.innerHTML = newPage;

    routes[path].init();
  }, delayPage);
}

handleLocation("home.html");

function homePage() {
  console.log("home page loaded");
  const firstProductContainer = document.querySelector(".pro-container");

  products.forEach((p) => {
    const productDiv = document.createElement("div");
    productDiv.className = "pro";
    productDiv.innerHTML = `
     <img src="${p.imagePath}" alt="">
     <div class="des">
         <span>${p.category}</span>
         <h5>${p.name}</h5>
         <div class="star">
             <i class="fas fa-star"></i>
             <i class="fas fa-star"></i>
             <i class="fas fa-star"></i>
             <i class="fas fa-star"></i>
             <i class="fas fa-star"></i>
         </div>
         <h4>Rp. ${p.price}</h4>
     </div>
     <a href="#" ><i class="fa-sharp fa-solid fa-cart-shopping"></i></a>
`;

    firstProductContainer.appendChild(productDiv);
  });
}

function shopPage() {
  console.log("shop page loaded");
}

function cartPage() {
  console.log("cart page loaded");
  class CartLocalStorage {
    /**
     * get cart from the local storage
     *
     * @returns {CartItem[]}
     */
    get() {
      let cartItems = localStorage.getItem("cartItems") ?? [];

      if (cartItems.length !== 0) {
        cartItems = JSON.parse(cartItems).map(
          (item) =>
            new CartItem(
              item.id,
              item.amount,
              new Product(
                item.product.name,
                item.product.price,
                item.product.quantity,
                item.product.image,
              ),
            ),
        );
      }

      return cartItems;
    }

    /**
     * store list of product in the cart into local storage
     *
     * @param {CartItem[]} cartItems
     */
    store(cartItem) {
      localStorage.setItem("cartItems", JSON.stringify(cartItem));
    }
  }

  class CartItem {
    /**
     * Create new instnace of CartItem
     *
     * @param {number} id
     * @param {number} amount - amount of item that are in the cart
     * @param {Product} product - the product that are in the cart
     */
    constructor(id, amount, product) {
      this.id = id;
      this.amount = amount;
      this.product = product;
    }

    /**
     * @method
     */
    addAmount = () => this.amount++;

    /**
     * @method
     */
    decreaseAmount = () => this.amount--;

    /**
     * @method
     */
    changeAmount = (amount) => this.amount = amount;
  }

  class Cart {
    /**
     * Create new instance of Cart object/class
     *
     * @param {CartLocalStorage} cartLocalStorage
     */
    constructor(cartLocalStorage) {
      this.totalPrice = 0;
      this.cartLocalStorage = cartLocalStorage;

      /**
       * @type {CartItem[]}
       */
      // this.cartItems = this.cartLocalStorage.get();
      this.cartItems = [
        new CartItem(1, 5, products[0]),
        new CartItem(2, 1, products[1]),
      ];
    }

    /**
     * Will show up pop up menu that notify the user the product are getting added into the cart
     */
    // notifyAdded() {
    //   const successAddingElement = document.querySelector(".success-add");
    //
    //   togglePopupMenu(successAddingElement);
    // }

    /**
     * Adding a product that passed in into the cart
     * @param {Product} product
     * @param {boolean} shouldNotify - wether notify product has been added or not (will open up a popup)
     * @param {HTMLElement} amountElement - element that show the current amount
     */
    addProduct(product, shouldNotify, amountElement) {
      const existingProduct = this.cartItems.findIndex(
        (item) => item.product.name === product.name,
      );

      if (existingProduct === -1) {
        const lastIndex = this.cartItems.length - 1;
        this.cartItems.push(
          new CartItem((this.cartItems[lastIndex]?.id ?? 0) + 1, 1, product),
        );
      } else {
        this.cartItems[existingProduct].addAmount();
        // if (amountElement !== undefined && amountElement !== null) {
        // console.log("")
        // amountElement.innerText = this.cartItems[existingProduct].amount;
        // }
      }

      // if (shouldNotify) {
      //   this.notifyAdded();
      // }

      cartCount.innerText = this.cartItems.length;
      this.calculateAndShowTotalPrice();
      this.cartLocalStorage.store(this.cartItems);
    }

    /**
     * get cart item by id
     *
     * @param {number} id
     * @returns {CartItem}
     */
    getCartById(id) {
      return this.cartItems.find((item) => item.id === id);
    }

    /**
     * Removing/reduce(the amount) of a product that are in the [cartItems]
     * @param {number} id - id that will get removed/deleted
     * @param {HTMLElement} amountElement - element that show the current amount
     */
    removeProductById(id, amountElement) {
      const indexToRemove = this.cartItems.findIndex((item) => item.id === id);
      let currentAmount = this.cartItems[indexToRemove].amount;

      if (currentAmount === 1) {
        this.cartItems.splice(indexToRemove, 1);
        this.generateCartItem(); // re-render
      } else {
        this.cartItems[indexToRemove].decreaseAmount();
        amountElement.innerText = this.cartItems[indexToRemove].amount;
      }

      this.calculateAndShowTotalPrice(); // calculate the totalPrice and showing it
      cartCount.innerText = this.cartItems.length; //update cart counter
      this.cartLocalStorage.store(this.cartItems);
    }

    /**
     * Create a cart item element
     * @param {Product} product
     * @returns {HTMLElement}
     */
    generateCartItem() {
      const cartItemsContainer = document.querySelector("table");

      this.cartItems.forEach((item) => {
        const newItem = document.createElement("tr");
        const productDetail = document.createElement("td");
        const quantityProduct = document.createElement("td");
        const price = document.createElement("td");
        let totalPrice = item.product.price * item.amount;

        productDetail.innerHTML = `
         <div class="cart-info">
           <img src="${item.product.imagePath}"/>
           <div>
             <p>${item.product.name}</p>
             <small>Price: ${item.product.price}</small>
             <br />
             <a href="#">Remove</a>
           </div>
         </div>
      `;
        quantityProduct.innerHTML =
          `<input type="number" value="${item.amount}" min="1" />`;
        price.innerHTML = `Rp. ${totalPrice}`;

        quantityProduct.querySelector("input").addEventListener(
          "change",
          (e) => {
            let val = e.currentTarget.value;
            
            if (parseInt(val) <= 0) {
              // TODO: should remove the item when it reached 0 or below
              e.currentTarget.value = 1;
              val = 1;
            }

            item.changeAmount(val);
            totalPrice = item.product.price * item.amount;
            price.innerHTML = `Rp. ${totalPrice}`;
          },
        );

        newItem.appendChild(productDetail);
        newItem.appendChild(quantityProduct);
        newItem.appendChild(price);

        cartItemsContainer.append(newItem);
      });
    }

    calculateAndShowTotalPrice() {
      this.totalPrice = this.cartItems.reduce(
        (acc, item) => acc + item.product.price * item.amount,
        0,
      );

      document.querySelector(
        ".price",
      ).innerText = `Total Price: ${this.totalPrice}`;
    }
  }

  const cartDB = new CartLocalStorage();
  const cart = new Cart(cartDB);

  cart.generateCartItem();

  //   <tr>
  //   <td>
  //     <div class="cart-info">
  //       <img src="img/products/f1.jpg" alt="Tshirt" />
  //       <div>
  //         <p>Orange Printed Tshirt</p>
  //         <small>Price: $78.00</small>
  //         <br />
  //         <a href="#">Remove</a>
  //       </div>
  //     </div>
  //   </td>
  //   <td><input type="number" value="1" /></td>
  //   <td>$78.00</td>
  // </tr>
}

function aboutPage() {
  console.log("about page loaded");
}

function contactPage() {
  console.log("contact page loaded");
}

class Product {
  /**
   * Creating new instance of product
   *
   * @param {string} name
   * @param {number} price
   * @param {string} imagePath - URL of the image product
   */
  constructor(name, price, category, imagePath) {
    this.name = name;
    this.price = price;
    this.category = category;
    this.imagePath = imagePath;
  }
}

// Dynamic product example
const products = [
  new Product(
    "Baju lebih adem",
    10000,
    "Adidas",
    "img/products/f1.jpg",
  ),
  new Product(
    "Baju Pantai Adem",
    20000,
    "Tropical",
    "img/products/f2.jpg",
  ),
  new Product(
    "Jaket wibu",
    55000,
    "Hehe",
    "img/products/f3.jpg",
  ),
];

if (bar) {
  bar.addEventListener("click", () => {
    nav.classList.add("active");
  });
}
if (close) {
  close.addEventListener("click", () => {
    nav.classList.remove("active");
  });
}

/* Bottom to Top button */

// const toTop = document.querySelector(".to-top");
//
// window.addEventListener("scroll", () => {
//   if (window.pageYOffset > 100) {
//     toTop.classList.add("active");
//   } else {
//     toTop.classList.remove("active");
//   }
// });
