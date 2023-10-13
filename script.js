const fileUpload = document.getElementById("fileupload");
const submitButton = document.querySelector(".submit-button");
const submitButtonOverlay = document.querySelector(".submit-button-overlay");

fileUpload.addEventListener("change", () => {
  if (fileUpload.value) {
    submitButton.disabled = false;
    submitButton.classList.add("choose-file-true");
    fileUpload.classList.add("choose-file-true");
    submitButtonOverlay.style.display = "none";
  } else {
    submitButton.disabled = true;
    submitButton.classList.remove("choose-file-true");
    fileUpload.classList.remove("choose-file-true");
    submitButtonOverlay.style.display = "block";
  }
});
