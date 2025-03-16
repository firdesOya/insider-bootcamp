let appendLocation = "#user-list";

function loadJQuery(callback) {
  if (typeof jQuery !== "undefined") {
    console.log("jQuery zaten yüklü.");
    callback();
    return;
  }
  const script = document.createElement("script");
  script.src = "https://code.jquery.com/jquery-3.7.1.min.js";
  script.integrity = "sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=";
  script.crossOrigin = "anonymous";
  script.onload = function () {
    console.log("jQuery başarıyla yüklendi!");
    callback();
  };
  document.head.appendChild(script);
}

function loadCSS() {
  if (!document.getElementById("staticStyles")) {
    let styleTag = document.createElement("style");
    styleTag.id = "staticStyles";
    styleTag.innerHTML = `
      body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f0f2f5;
          text-align: center;
          margin: 0;
          padding: 20px;
      }
      #container {
          padding: 20px;
          margin: 0 auto;
          width: 100%;
          max-width: 1200px;
          background: transparent;
          box-sizing: border-box;
      }
      .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
      }
      .header h1 {
          margin: 0;
          color: #2c3e50;
      }
      .header #reload {
          padding: 8px 12px;
          cursor: pointer;
          border-radius: 8px;
          border: none;
          background-color: #3498DB;
          color: white;
          font-weight: bold;
          transition: background 0.3s ease, transform 0.1s ease;
      }
      .header #reload:hover {
          background-color: #2980B9;
          transform: scale(1.05);
      }
      .header #reload.disabled {
          background-color: #ccc !important;
         cursor: not-allowed !important;
         transition: none !important; 
         pointer-events: none; 
         }
      #user-list {
          padding: 0;
          background: transparent;
          width: 100%;
          margin: 0 auto;
      }
      #user-table {
          border-collapse: collapse;
          width: 100%;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
      }
      #user-table th, #user-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #eef0f5;
          font-size: 14px;
      }
      #user-table th {
          background-color: #2c3e50;
          color: white;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.5px;
      }
      #user-table img {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          object-fit: cover;
          transition: transform 0.2s ease;
      }
      #user-table img:hover {
          transform: scale(1.1);
      }
      .delete-btn {
          background-color: #E74C3C;
          padding: 6px 12px;
          border: none;
          cursor: pointer;
          color: white;
          border-radius: 10px;
          font-weight: bold;
          transition: background 0.3s ease, transform 0.1s ease;
      }
      .delete-btn:hover {
          background-color: #C0392B;
          transform: scale(1.05);
      }
      .no-user td {
          text-align: center !important;
          padding: 20px;
      }
      @media screen and (max-width: 900px) {
          #user-list {
              overflow-x: auto;
          }
          #user-table {
              max-width: 700px;
          }
      }
    `;
    document.head.appendChild(styleTag);
  }
}

function observeTbody(tbody) {
  const tbodyObserver = new MutationObserver(() => {
    checkTbodyEmpty();
  });
  const observerConfig = { childList: true, subtree: false };
  tbodyObserver.observe(tbody[0], observerConfig);
}
function checkTbodyEmpty() {
  let tbody = $("#user-table tbody");
  let reloadButton = $("#reload");
  if (!tbody.length) return;
  let row = tbody.children("tr").not(".no-user").length;

  if (row === 0) {
    reloadButton.show();
  } else {
    reloadButton.hide();
  }
}

loadJQuery(function () {
  $(document).ready(function () {
    loadCSS();

    if ($("#container").length === 0) {
      console.log("Ana div oluşturuluyor..");
      $("body").append('<div id="container"></div>');
    }
    let wrapper = $(appendLocation);
    if (wrapper.length === 0) {
      wrapper = $("<div>");
      if (appendLocation.startsWith("#")) {
        wrapper.attr("id", appendLocation.replace("#", ""));
      } else if (appendLocation.startsWith(".")) {
        wrapper.addClass(appendLocation.replace(".", ""));
      }
      $("#container").append(wrapper);
    }
    let header = `<div class="header">
    <h1>User List</h1>
    <button id="reload">Show Users</button>
    </div>`;
    $(wrapper).append(header);

    let table = $(`
      <table id="user-table">
          <thead>
              <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Country</th>
                  <th>Company Name</th>
                  <th></th>
              </tr>
          </thead>
          <tbody data-id="user-list"></tbody>
      </table>
  `);

    $(wrapper).append(table);

    let tbody = $("#user-table tbody");

    if (tbody.length > 0) {
      observeTbody(tbody);
      checkTbodyEmpty();
    }

    function loadUsers() {
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;

      let storedData = JSON.parse(localStorage.getItem("userList"));

      if (storedData && storedData.users && storedData.timestamp) {
        if (now - storedData.timestamp < oneDay) {
          console.log("LocalStorage'dan kullanıcıları yüklüyorum...");
          displayUsers(storedData.users);
          return;
        } else {
          console.log("24 saat geçti, eski veriyi siliyorum...");
          localStorage.removeItem("userList");
        }
      }

      $.ajax({
        url: "https://dummyjson.com/users?limit=10",
        type: "GET",
        dataType: "json",
        success: function (data) {
          let newData = {
            users: data.users,
            timestamp: now,
          };
          localStorage.setItem("userList", JSON.stringify(newData));
          displayUsers(data.users);
        },
        error: function (error) {
          console.log(error);
        },
      });
    }

    function displayUsers(users) {
      tbody.empty();
      users.forEach((user) => {
        tbody.append(`
          <tr data-id="${user.id}">
            <td><img src=${user.image} alt="User Image" /></td>
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>      
            <td>${user.phone}</td>        
            <td>${user.address.country}</td>
            <td>${user.company.name}</td>
            <td><button class="delete-btn">Delete</button></td>
          </tr>
        `);
      });
      if (users.length > 0) {
        $("#reload").hide();
      }
    }

    $(document).on("click", ".delete-btn", function () {
      let row = $(this).closest("tr");
      let userId = row.data("id");

      let storedData = JSON.parse(localStorage.getItem("userList"));
      storedData.users = storedData.users.filter((user) => user.id !== userId);

      localStorage.setItem("userList", JSON.stringify(storedData));

      row.remove();
      if ($("#user-table tbody tr").length === 0) {
        addNoUserMessage();
      }
    });

    let addNoUserMessage = () => {
      tbody.html(`
        <tr class="no-user">
        <td colspan="7">User not found</td>
        </tr>
        `);
    };
    let button = $("#reload");

    let disableButton = () => {
      button.addClass("disabled").text("Already Clicked");
    };

    if (sessionStorage.getItem("reloadClicked")) {
      disableButton();
    }

    $(document).on("click", "#reload", function () {
      sessionStorage.setItem("reloadClicked", "true");
      disableButton();
      localStorage.removeItem("userList");
      loadUsers(true);
    });

    loadUsers();
  });
});
