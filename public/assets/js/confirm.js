document
  .getElementById("confirmClickActionElementId")
  .addEventListener("click", function (e) {
    if (!confirm("Are you sure?")) {
      e.preventDefault(); 
    }
  });
