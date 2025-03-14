$(document).ready(function () {
  $(".apply-btn").click(function () {
    $("form").css("display", "flex").fadeIn();
  });

  $(".close-btn").click(function (e) {
    e.preventDefault();
    let isFormEmpty = true;

    $("#applicationForm")
      .find("input")
      .each(function () {
        if ($(this).val().trim() !== "") {
          isFormEmpty = false;
        }
      });

    $("#applicationForm").fadeOut(300, function () {
      if (!isFormEmpty) {
        $(this).find("input").val("");
        $(this).validate().resetForm();
        $(this).find("input").removeClass("error");
        $(this).find("span.error").remove();
      }
    });
  });

  $("#applicationForm").validate({
    rules: {
      name: { required: true, minlength: 3 },
      surname: { required: true, minlength: 3 },
      email: { required: true, email: true },
      phone: {
        required: true,
        minlength: 9,
        digits: true,
      },
      position: { required: true, minlength: 3 },
    },
    messages: {
      name: {
        required: "Name is required",
        minlength: "Name must be at least 3 characters",
      },
      surname: {
        required: "Surname is required",
        minlength: "Surname must be at least 3 characters",
      },
      email: {
        required: "Email is required",
        email: "Please enter a valid email",
      },
      phone: {
        required: "Phone is required",
        minlength: "Phone must be at least 9 characters",
        digits: "Only numbers are allowed",
      },
      position: {
        required: "Position is required",
        minlength: "Position must be at least 3 characters",
      },
    },
    submitHandler: function (form) {
      $(form).fadeOut(300);

      const formData = $(form).serializeArray();

      $(".pop-up")
        .fadeIn(300)
        .delay(2000)
        .fadeOut(300, function () {
          console.log("Form submitted with data:", formData);
          $(form).find("input").val("");
          $(form).validate().resetForm();
          $(form).find("input").removeClass("error");
        });
    },
    errorClass: "error",
    validClass: "valid",
    errorElement: "span",
  });
});
