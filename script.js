
const bar = document.getElementById("bar");
const close = document.getElementById("close");
const nav = document.getElementById("navbar");

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

const firstProductContainer = document.querySelector(".pro-container");

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
    "Adidas",
    "img/products/f2.jpg",
  ),
  new Product(
    "Jaket wibu",
    55000,
    "Hehe",
    "img/products/f3.jpg",
  ),
];
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

// <div class="pro">
//     <img src="img/products/f1.jpg" alt="">
//     <div class="des">
//         <span>Adiddas</span>
//         <h5>Cotton shirts pure cotton</h5>
//         <div class="star">
//             <i class="fas fa-star"></i>
//             <i class="fas fa-star"></i>
//             <i class="fas fa-star"></i>
//             <i class="fas fa-star"></i>
//             <i class="fas fa-star"></i>
//         </div>
//         <h4>$78</h4>
//     </div>
//     <a href="#" ><i class="fa-sharp fa-solid fa-cart-shopping"></i></a>
// </div>

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

const toTop = document.querySelector(".to-top");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 100) {
    toTop.classList.add("active");
  } else {
    toTop.classList.remove("active");
  }
});
