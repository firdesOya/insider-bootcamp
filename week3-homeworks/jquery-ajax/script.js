$(document).ready(function () {
  $(".button").click(function () {
    if ($(".product-list").children().length === 0) {
      $.ajax({
        url: "products.json",
        type: "GET",
        dataType: "json",
        success: function (data) {
          let productsHTML = "";
          data.forEach((product) => {
            productsHTML += `
          <div class="product-card">
            <h3>${product.name}</h3>
            <p>${product.price}</p>
            <a href="${product.link}" target="_blank">Ürünü incele ></a>
            </div>
          `;
          });

          $(".product-list").html(productsHTML);

          $(".product-card").css({
            "background-color": "lightgray",
            padding: "10px",
            margin: "10px",
            "border-radius": "5px",
            width: "calc(33.33% - 20px)",
            maxWidth: "400px",
            cursor: "pointer",
          });
          $(".product-card").hover(
            function () {
              $(this).css({ "background-color": "gray", color: "white" });
              $(this).find("a").css({
                color: "white",
              });
            },
            function () {
              $(this).css({
                "background-color": "lightgray",
                color: "black",
              });
              $(this).find("a").css({
                color: "black",
              });
            }
          );
          $(".product-card a").css({
            textDecoration: "none",
            color: "black",
          });
        },
        error: function () {
          $("#product-list").html(
            "<p>Ürünler yüklenirken hata oluştu.</p>"
          );
        },
      });
    } else {
      $(".product-list").html("");
    }
  });
  $(document).on("click", ".product-card", function () {
    let link = $(this).find("a").attr("href");
    if (link) {
      window.open(link, "_blank");
    }
  });

  $(".button").css({
    "background-color": "blue",
    color: "white",
    padding: "10px",
    "border-radius": "5px",
    cursor: "pointer",
    border: "none",
  });
  $(".button").hover(
    function () {
      $(this).css("background-color", "darkblue");
    },
    function () {
      $(this).css("background-color", "blue");
    }
  );
  $(".product-list").css({
    display: "flex",
    "flex-wrap": "wrap",
    gap: "10px",
    "justify-content": "start",
  });
});