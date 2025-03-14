$(document).ready(function () {
  $("#todo-form").on("submit", function (e) {
    e.preventDefault();
    let todoItem = $("#todo-input").val().trim();
    if (todoItem !== "") {
      $("#todo-list").append(`
        <li>
         <div>
          <input type="checkbox" class="check" />
          <span class="input-text">${todoItem}</span>
          </div>
         <button class="delete">Delete</button>
        </li>
      `);
      $("#todo-input").val("");
    }
  });
  $("#todo-list").on("change", ".check", function () {
    $(this).next().toggleClass("check");
  });
  $("#todo-list").on("click", ".delete", function () {
    $(this).parent().remove();
  });
});