$(document).ready(function () {
  $("head").append(`
  <style>
    body{
     font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f5f7fa;
      margin: 0;
      padding: 0;
    }
    h1{
      text-align: center;
      color: #1a1a1a;
      font-weight: 700;
    }
     h2 {
      font-size: 20px;
      margin: 0 0 12px 0;
      color: #1a1a1a;
    }

    .container{
      max-width: 1200px;
      margin: 50px auto;
      padding: 0 15px;
       color: #1a1a1a;
    }


    .popup-overlay{
    position:fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background:rgba(0,0,0,0.5);
    display:none;
    z-index: 1000;
    }

    .popup-content{
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    background:#fff;
    padding:32px;
    border-radius:12px;
    box-shadow:0 4px 24px rgba(0,0,0,0.1);
    max-width: 500px;
    width: 80%;
    display:flex;
    flex-direction:column;
    }

    .popup-content a{
      display:inline-block;
      text-align:center;
      color:#4F46E5;
      padding:12px 24px;
      border-radius:6px;
      text-decoration:none;
      margin-top:24px;
      margin-left:auto;
      background-color: #EEF2FF;
    }

    .popup-content a:hover {
      background-color: #E0E7FF;
    }

    .close{
      position:absolute;
      top:16px;
      right:16px;
      cursor:pointer;
      width:32px;
      height:32px;
      border-radius:50%;
      display:flex;
      justify-content:center;
      align-items:center;
      color:#6B7280;
      font-size: 18px;
      background-color: #F3F4F6;
      border: 1px solid #E5E7EB;
    }

    .close:hover {
      background-color: #E5E7EB;
      color: #374151;

    }

    .products{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
      gap: 24px;
      margin-top: 50px;
    }

    .product{
      background-color: #fff;
      padding: 24px;
      border-radius: 8px;
      transition: 0.3s;
      cursor: pointer;
      position: relative;
      top:0;
      display: flex;
      flex-direction: column;
    }
    .product-bottom{
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-top: 20px;
    }

    .product p {
      font-size: 15px;
      line-height: 1.5;
      color: #4a5568;

    }

    .product-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
    }

    .product-bottom span {
      font-size: 20px;
      font-weight: 600;
      color: #2d3748;
      padding:0;
      margin:0;
    }

    .add-btn{
       background-color: #4F46E5;
       color: white;
       border: none;
       padding: 8px 16px;
       border-radius: 6px;
       font-weight: 500;
       font-size: 14px;
       cursor: pointer;
       transform:scale(1);
    }



  </style>`);

  $("body").append(`
    <div class="container">
      <h1>Products</h1>
      <div class="products"></div>
      <div class="popup-overlay">
        <div class="popup-content">
         <div class="close">X</div>
         <h2></h2>
         <p></p>
         <a target="_blank">Ürünü incele</a>
        </div>
      </div>
    </div>
  `);

  let productsHTML = "";
  $.ajax({
    url: "products.json",
    type: "GET",
    dataType: "json",
    success: function (data) {
      data.products.forEach((element) => {
        productsHTML += `
        <div class="product"
        data-name="${element.name}"
        data-detail="${element.details}"
        data-url="${element.link}"
        >
          <h2>${element.name}</h2>
          <p>${element.shortDetails}</p>
          <div class="product-bottom">
            <span>${element.price} TL</span>
            <button class="add-btn">Sepete Ekle</button>
            </div>
        </div>
        `;
      });
      $(".products").html(productsHTML).css("opacity", 0).animate(
        {
          opacity: 1,
        },
        800
      );
      $(".products").on("click", ".product", function () {
        $(".popup-overlay").fadeIn();
        $(".popup-content").find("h2").text($(this).data("name"));
        $(".popup-content").find("p").text($(this).data("detail"));
        $(".popup-content").find("a").attr("href", $(this).data("url"));
      });

      $(".popup-content a").on("click", function () {
        $(".popup-overlay").fadeOut();
      });

      $(".close").on("click", function () {
        $(".popup-overlay").fadeOut();
      });

      $(".products").on("mouseenter mouseleave", ".product", function (event) {
        if (event.type === "mouseenter") {
          $(this)
            .stop()
            .animate(
              {
                top: "-6px",
              },
              200
            )
            .css({
              "box-shadow": "0 8px 16px rgba(0,0,0,0.1)",
            });
        } else {
          $(this)
            .stop()
            .animate(
              {
                top: "0px",
              },
              200
            )
            .css({
              "box-shadow": "0 4px 6px rgba(0,0,0,0.05)",
            });
        }
      });

      $(".products").on("click", ".add-btn", function (e) {
        e.stopPropagation();
        $(this).css("transform", "scale(0.95)");
        setTimeout(() => {
          $(this).css("transform", "scale(1)");
        }, 100);
      });

      $(".products").on("mouseenter mouseleave", ".add-btn", function (event) {
        if (event.type === "mouseenter") {
          $(this).css({
            backgroundColor: "#4338CA",
          });
        } else {
          $(this).css({
            backgroundColor: "#4F46E5",
          });
        }
      });
    },
    error: function (err) {
      console.log(err);
    },
  });
});
