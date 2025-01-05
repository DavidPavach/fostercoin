//For the submenus
const balanceMenuIcon = document.querySelector("#balanceMenuIcon")
balanceMenuIcon.addEventListener("click", function (e) {
  document.querySelector("#balanceMenu").classList.toggle("hidden")
})

const withdrawMenuIcon = document.querySelector("#withdrawMenuIcon")
withdrawMenuIcon.addEventListener("click", function (e) {
  document.querySelector("#withdrawMenu").classList.toggle("hidden")
})

//For the eye icons
const eyeIcons = document.querySelectorAll(".eyeIcon");
const numbers = document.querySelectorAll(".number");
const numbers1 = document.querySelectorAll(".number1");

eyeIcons.forEach((eyeIcon, index) => {
  eyeIcon.addEventListener("click", function () {
    const number = numbers[index];
    const number1 = numbers1[index];

    if (number.classList.contains("asterisks")) {
      const originalText = number1.textContent;
      number.textContent = originalText;
      number.classList.remove("asterisks");
      number.classList.add("noasterisks");
      eyeIcon.src = "../Images/eye.svg";
    } else if (number.classList.contains("noasterisks")) {
      const originalText = number.textContent.trim();
      const numberOfAsterisks = originalText.substring(2).length + 1;
      const showAsterisks = "*".repeat(numberOfAsterisks);
      number.classList.remove("noasterisks");
      number.classList.add("asterisks");
      number.textContent = showAsterisks;
      eyeIcon.src = "../Images/eye-slash.svg";
    }
  });
});
