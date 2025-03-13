let styleTag = document.createElement("style");
styleTag.textContent = `
body{
    margin:0 auto;
    width:100%;
    height:100vh;
    font-family: Montserrat,sans-serif;
    background-color:#F8F8F8;
}
.container{
    max-width:1200px;
    margin:0 auto;
    padding:20px;
}
.ins-api-users{
    margin:0;
}
h1{
    margin:0;
}
hr{
    background-color:#E5E5E5;
    height:1px;
    border:none;
    margin:10px 0;
} 
table{
  width:100%;
  border-spacing:0 10px;
  font-size:14px
}
thead{
 color:#ACACAC;

}
tbody tr{
 background-color:#ffff;

}

th,td{
 padding:10px;
 text-align:left;
 background-color:#ffff;

}
.delete-btn{
border:none;
background:#FEAF00;
color:white;
padding:5px 8px;
border-radius:4px;
cursor:pointer;
} 


`;
document.head.appendChild(styleTag);
let container = document.createElement("div");
container.classList.add("container");
document.body.appendChild(container);
let userListContent = document.querySelector(".ins-api-users");
container.appendChild(userListContent);
let userListTitle = document.createElement("h1");
userListTitle.textContent = "User List";
userListContent.appendChild(userListTitle);
let hr = document.createElement("hr");
userListTitle.appendChild(hr);
let table = document.createElement("table");
userListContent.appendChild(table);
let thead = document.createElement("thead");
table.appendChild(thead);
let tbody = document.createElement("tbody");
table.appendChild(tbody);

let titles = [
  "Name",
  "Email",
  "Phone",
  "Address",
  "Website",
  "Company Name",
  " ",
];
let trH = document.createElement("tr");
thead.appendChild(trH);
titles.forEach((title) => {
  let th = document.createElement("th");
  th.textContent = title;
  trH.appendChild(th);
});

let userList = [];

const showErrorMessage = (message) => {
  let errorRow = document.createElement("tr");
  let errorTd = document.createElement("td");
  errorTd.colSpan = 7;
  errorTd.style.textAlign = "center";
  errorTd.style.color = "red";
  errorTd.textContent = `${message}`;
  errorRow.appendChild(errorTd);
  tbody.appendChild(errorRow);
};

const fetchUser = async () => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Veri çekme hatası:", error);
    showErrorMessage(
      "Veri yüklenirken hata oluştu. Lütfen daha sonra tekrar deneyin."
    );
    return null;
  }
};

const initializeUserList = async () => {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  let localStored = JSON.parse(localStorage.getItem("userList"));

  if (localStored?.users?.length > 0 && now < localStored.timestamp) {
    userList = localStored.users;
  } else {
    const users = await fetchUser();
    if (!users) return;
    userList = users.map((user) => ({
      id: user.id,
      name: `${user.name} ${user.username}`,
      email: user.email,
      phone: user.phone,
      address: `${user.address.street} ${user.address.suite} ${user.address.city}`,
      website: user.website,
      companyName: user.company.name,
    }));

    localStorage.setItem(
      "userList",
      JSON.stringify({
        users: userList,
        timestamp: now + oneDay,
        startTimestamp: localStored?.startTimestamp || new Date(now).toLocaleString()
      })
    );
    console.log(
      "Başlangıç Zamanı:",
      new Date(localStored?.startTimestamp || now).toLocaleString()
    );
  }

  renderUsers();
};

const renderUsers = () => {
  userList.forEach((user) => {
    let trD = document.createElement("tr");
    tbody.appendChild(trD);

    Object.entries(user).forEach(([key, value]) => {
      if (key !== "id") {
        let td = document.createElement("td");
        td.textContent = value;
        trD.appendChild(td);
      }
    });

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    let deleteTd = document.createElement("td");
    deleteTd.appendChild(deleteBtn);
    trD.appendChild(deleteTd);

    deleteBtn.addEventListener("click", () => deleteUser(user.id, trD));
  });
};

const deleteUser = (userId, rowElement) => {
  userList = userList.filter((u) => u.id !== userId);

  if (userList.length === 0) {
    localStorage.removeItem("userList");
    showErrorMessage("Kullanıcı bulunamadı.");
  } else {
    const storedData = JSON.parse(localStorage.getItem("userList")) || {};
    localStorage.setItem(
      "userList",
      JSON.stringify({ users: userList, timestamp: storedData.timestamp, startTimestamp: storedData.startTimestamp,  })
    );
  }

  rowElement?.remove();
};

initializeUserList();
