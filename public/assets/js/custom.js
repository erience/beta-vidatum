const blurScreen = (x) => {
  const body = document.getElementsByTagName("body")[0];
  const height = document.body.scrollHeight;
  const width = document.documentElement.scrollWidth;
  if (x) {
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = `${width}px`;
    overlay.style.height = `${height}px`;
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
    overlay.style.filter = "blur(px)";
    overlay.style.zIndex = "9999";
    overlay.style.cursor = "wait";
    body.appendChild(overlay);
  } else {
    const overlay = body.querySelector(".overlay");
    if (overlay) {
      overlay.remove();
    }
  }
};
const blurScreen1 = (x) => {
  if (x) {
    const body = document.getElementsByTagName("body")[0];
    body.style.filter = "blur(2px)";
    body.style.cursor = "wait";

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.1)"; // semi-transparent black
    overlay.style.zIndex = "99";
    overlay.style.pointerEvents = "none";
  } else {
    const body = document.getElementsByTagName("body")[0];
    body.style.filter = "blur(0px)";
    body.style.cursor = "";
    const overlay = body.querySelector(".overlay");
    // if (overlay) {
    //   overlay.remove();
    // }
  }
};

$(document).ajaxError(function (event, jqxhr, settings, thrownError) {
  if (jqxhr.status === 401) {
    // Unauthorized
    window.location.href = "/login";
  }
  // Handle other statuses or errors accordingly
});

$(document).ready(function () {
  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });

  // if (window.location.href.includes("user")) {
  //   // Call function with 'UserData' parameter
  //   getCookie("UserData");
  // }
  // // Check if URL contains "admin"
  // else if (window.location.href.includes("admin")) {
  //   // Call function with 'userdata' parameter
  //   getCookie("userData");
  // }

  // function getCookie(cookieName) {
  //   var value = document.cookie;
  //   console.log({ value });
  //   var parts = value.split("; " + "username" + "=");
  //   const decodedString = decodeURIComponent(value);
  //   // Extracting JSON data
  //   const jsonData = decodedString.split("=")[1];

  //   // Parsing JSON
  //   console.log({ jsonData });
  //   const jsonDataSubstring = jsonData.substring(2);
  //   const parsedData = JSON.parse(jsonDataSubstring);

  //   const username = parsedData.username;

  //   const stg = document.querySelectorAll(".user-name")[1];
  //   stg.innerHTML = username;
  // }

  function getCookie(name) {
    var value = document.cookie;
    var parts = value.split("; " + "username" + "=");
    const decodedString = decodeURIComponent(value);
    const jsonData = decodedString.split("=")[1];

    // Parsing JSON
    const jsonDataSubstring = jsonData.substring(2);
    const parsedData = JSON.parse(jsonDataSubstring);

    const username = parsedData.username;

    const stg = document.querySelectorAll(".user-name")[1];
    stg.innerHTML = username;
  }

  var userData = getCookie("userData");

  // Retrieve the value of the userData cookie
  // var userData = getCookie("userData");

  // If the cookie exists, set its value as the content of the user-name element
  // if (userData) {
  //     document.querySelector(".user-name").textContent = username;
  // }
  arrows = {
    leftArrow: '<i class="feather icon-chevron-left"></i>',
    rightArrow: '<i class="feather icon-chevron-right"></i>',
  };
  // minimum setup
  $("#pc-datepicker-1").datepicker({
    format: "yyyy-mm-dd",
    todayHighlight: true,
    orientation: "bottom left",
    templates: arrows,
  });

  $("#pc-datepicker-2").datepicker({
    format: "yyyy-mm-dd",
    todayHighlight: true,
    orientation: "bottom left",
    templates: arrows,
  });

  // minimum setup for modal demo
  $("#pc-datepicker-1_modal").datepicker({
    format: "yyyy-mm-dd",
    todayHighlight: true,
    orientation: "bottom left",
    templates: arrows,
  });

  // input group layout
  $("#pc-datepicker-1").datepicker({
    format: "yyyy-mm-dd",
    todayHighlight: true,
    orientation: "bottom left",
    templates: arrows,
  });
  $("#pc-datepicker-2").datepicker({
    format: "yyyy-mm-dd",
    todayHighlight: true,
    orientation: "bottom left",
    templates: arrows,
  });

  // input group layout for modal demo
  $("#pc-datepicker-2_modal").datepicker({
    format: "yyyy-mm-dd",
    todayHighlight: true,
    orientation: "bottom left",
    templates: arrows,
  });

  // enable clear button
  $("#pc-datepicker-3, #pc-datepicker-3_validate").datepicker({
    format: "yyyy-mm-dd",
    todayBtn: "linked",
    clearBtn: true,
    todayHighlight: true,
    templates: arrows,
  });

  // enable clear button for modal demo
  $("#pc-datepicker-3_modal").datepicker({
    format: "yyyy-mm-dd",
    todayBtn: "linked",
    clearBtn: true,
    todayHighlight: true,
    templates: arrows,
  });

  // orientation
  $("#pc-datepicker-4_1").datepicker({
    format: "yyyy-mm-dd",
    orientation: "top left",
    todayHighlight: true,
    templates: arrows,
  });

  $("#pc-datepicker-4_2").datepicker({
    format: "yyyy-mm-dd",
    orientation: "top right",
    todayHighlight: true,
    templates: arrows,
  });

  $("#pc-datepicker-4_3").datepicker({
    format: "yyyy-mm-dd",
    orientation: "bottom left",
    todayHighlight: true,
    templates: arrows,
  });

  $("#pc-datepicker-4_4").datepicker({
    format: "yyyy-mm-dd",
    orientation: "bottom right",
    todayHighlight: true,
    templates: arrows,
  });

  // range picker
  $("#pc-datepicker-5").datepicker({
    format: "yyyy-mm-dd",
    todayHighlight: true,
    templates: arrows,
  });

  // inline picker
  $("#pc-datepicker-6").datepicker({
    format: "yyyy-mm-dd",
    todayHighlight: true,
    templates: arrows,
  });

  $(".pc-selectpicker").selectpicker();
  $(function () {});

  $("select#inv_item").change(function () {
    var selected = $(this).children("option:selected");
    var item = selected.val();
    var price = selected.data("price");
    var cgst = selected.data("cgst");
    var sgst = selected.data("sgst");
    var igst = selected.data("igst");
    var cess = selected.data("cess");

    if (item == "undefined" || item == "") {
      $("#inv_sgst").val("0");
      $("#inv_cgst").val("0");
      $("#inv_igst").val("0");
      $("#inv_cess").val("0");
      $("#inv_price").val("0");
      $("#inv_qty").val("0");
      $("#inv_total").val(0);
    } else {
      var qty = $("#inv_qty").val();

      $("#inv_sgst").val(sgst);
      $("#inv_cgst").val(cgst);
      $("#inv_igst").val(igst);
      $("#inv_cess").val(cess);
      $("#inv_price").val(price);

      if (qty == "") {
        // $('#inv_qty').val('0');
        $("#inv_total").val(0);
      } else {
        $("#inv_total").val(qty * price);
      }
    }
  });

  $("#inv_qty, #inv_price").on("blur", function () {
    inv_item_total();
  });
});

function inv_item_total() {
  var price = $("#inv_price").val();
  var qty = $("#inv_qty").val();
  if (price == "" && qty == "") {
    $("#inv_total").val(0);
  } else {
    $("#inv_total").val(qty * price);
  }
}

$(document).ready(function () {
  var increement = 1;
  $(document).ready(function () {
    $("#btn_add").click(function () {
      increement++;
      $("#dynamic_field").append(
        '<div class="row" id="row' +
          increement +
          '">' +
          '<div class="form-row">' +
          '<div class="form-group col-md-3">' +
          '<label for="certi" class="col-form-label">Certi</label>' +
          '<input type="number" name="data[certi][]" class="form-control" id="certi">' +
          "</div>" +
          '<div class="form-group col-md-3">' +
          '<label for="from" class="col-form-label">From</label>' +
          '<input type="number" name="data[from][]" class="form-control" id="from">' +
          "</div>" +
          '<div class="form-group col-md-3">' +
          '<label for="to" class="col-form-label">To</label>' +
          '<input type="number" name="data[to][]" class="form-control" id="to">' +
          "</div>" +
          '<div class="form-group col-md-2">' +
          '<label for="status" class="col-form-label">Status</label>' +
          '<select id="" class="form-control" name="data[status][]">' +
          '<option value="1">Active</option><option value="2">Inactive</option>' +
          '<option value="3"> Delete </option>' +
          "</select>" +
          "</div>" +
          '<div class="form-group col-md-1">' +
          '<label for="to" class="col-form-label">Remove</label>' +
          '<button type="button" name="remove" id="' +
          increement +
          '" class="btn btn-sm btn-danger btn_remove">X</button>' +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>",
      );
    });

    $("#inward_range_update_btn").click(function () {
      increement++;
      $("#dynamic_field").append(
        '<div id="row' +
          increement +
          '">' +
          '<div class="form-row">' +
          '<div class="form-group col-md-3">' +
          '<label for="certi" class="col-form-label">Certi</label>' +
          '<input type="number" name="data[certi][]" class="form-control" id="certi">' +
          "</div>" +
          '<div class="form-group col-md-3">' +
          '<label for="from" class="col-form-label">From</label>' +
          '<input type="number" name="data[from][]" class="form-control" id="from">' +
          "</div>" +
          '<div class="form-group col-md-3">' +
          '<label for="to" class="col-form-label">To</label>' +
          '<input type="number" name="data[to][]" class="form-control" id="to">' +
          "</div>" +
          '<div class="form-group col-md-2">' +
          '<label for="status" class="col-form-label">Status</label>' +
          '<select id="" class="form-control" name="data[status][]">' +
          '<option value="1">Active</option><option value="2">Inactive</option>' +
          '<option value="3"> Delete </option>' +
          "</select>" +
          "</div>" +
          '<div class="form-group pt-4 col-md-1">' +
          '<div class="align-middle"><label for="to" class="col-form-label mt-3">Remove</label>' +
          '<button type="button" name="remove" id="' +
          increement +
          '" class="btn ml-2 btn-sm btn-danger btn_remove">X</button></div>' +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>",
      );
    });

    $(document).on("click", ".btn_remove", function () {
      var button_id = $(this).attr("id");
      $("#row" + button_id + "").remove();
    });
  });
});

function determineToastStyles(message) {
  let backgroundColor = "";
  let textColor = "";
  let type = "";
  if (message.includes("inserted") && message.includes("skipped")) {
    backgroundColor = "orange";
    textColor = "black";
    type = "warning";
  } else if (message.includes("inserted")) {
    backgroundColor = "green";
    textColor = "white";
    type = "success";
  } else if (message.includes("skipped")) {
    backgroundColor = "yellow";
    textColor = "black";
    type = "info";
  } else {
    backgroundColor = "red";
    textColor = "white";
    type = "error";
  }

  return { backgroundColor, textColor, type };
}
function getTimeStamp() {
  var currentDate = new Date();
  var formattedDate =
    currentDate.getFullYear() +
    "-" +
    ("0" + (currentDate.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + currentDate.getDate()).slice(-2) +
    "_" +
    ("0" + currentDate.getHours()).slice(-2) +
    "-" +
    ("0" + currentDate.getMinutes()).slice(-2) +
    "-" +
    ("0" + currentDate.getSeconds()).slice(-2);
  return formattedDate;
}
