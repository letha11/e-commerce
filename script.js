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
  }
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
    "Cotton Shirts pure cotton",
    10000,
    "Adidas",
    "img/products/f1.jpg",
  ),
  new Product(
    "Cotton Shirts pure cotton",
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
