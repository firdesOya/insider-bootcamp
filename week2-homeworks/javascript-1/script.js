//object içinde saklama
let fullname = prompt("Your name please").trim();
let ageInput = prompt("Your age please");
let age = parseFloat(ageInput);
let job = prompt("your job please").trim();
let userInfo = { fullname, age, job };
console.log(userInfo);

//dinamik sepete ekleme
let productList = [];

while (true) {
  let product = prompt(
    "Sepete eklemek istedğiniz ürünü yazın:(Ekleme işleminiz bittiğinde q tuşuna basın!)"
  ).trim();
  if (product.toLowerCase() === "q") break;
  let productPrice = parseFloat(prompt("Ürünün fiyatınız yazın"));
  
  if (!isNaN(productPrice) && productPrice > 0) {
    productList.push({ name: product, price: productPrice });
  } else {
    alert("geçerli fiyat girin");
    console.log("Geçerli bir fiyat girin!");
  }
}
console.log("Sepetiniz:", productList);

//Sepetten çıkartma

let removeItem = prompt("silmek istediğiniz ürünü yazın(Çıkmak için q basın):").trim();
if (removeItem.toLowerCase() !== "q") {
  let newProductList = productList.filter(
    (item) => item.name.toLowerCase().trim() !== removeItem.toLowerCase()
  );
  if (newProductList.length < productList.length) {
    productList = newProductList;
  } else {
    console.log("Ürün sepette bulunamadı");
  }

}

//güncel sepet ve toplam tutar

console.log("Güncel Sepetiniz:", [...productList]);

const totalPrice = productList.reduce((total, item) => total + item.price, 0);

console.log(`Sepet Tutarınız: ${totalPrice} TL`);
