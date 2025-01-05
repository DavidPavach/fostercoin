function togglePasswordVisibility(inputId) {
  const passwordInput = document.getElementById(inputId);
  const icon = document.getElementById(`${inputId}-icon`);

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    icon.className = "ph-duotone ph-eye-closed";
  } else {
    passwordInput.type = "password";
    icon.className = "ph-duotone ph-eye";
  }
}

document.getElementById("myForm").addEventListener("submit", function (event) {
  const submitButton = event.target.querySelector('button[type="submit"]');

  // Disable the button
  submitButton.disabled = true;
  submitButton.innerText = "Submitting...⏳"
  submitButton.classList.remove("bg-primaryBlue", "hover:bg-darkBlue")
  submitButton.classList.add("cursor-not-allowed", "bg-gray-400");
});
