//Nav Bar
const btn = document.getElementById("menu-btn");
const nav = document.getElementById("menu");

btn.addEventListener("click", () => [
  btn.classList.toggle("open"),
  nav.classList.toggle("flex"),
  nav.classList.toggle("hidden"),
]);

// For The Animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("unhide");
    }
  });
});
const hiddenElements = document.querySelectorAll(".hide");
hiddenElements.forEach((el) => observer.observe(el));

//Testimonial Section
const carousel = document.getElementById("carousel")
const prevBtn = document.querySelector("#prevBtn")
const nextBtn = document.querySelector("#nextBtn")
const slideWidth = carousel.clientWidth;
let currentIndex = 0;

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + 5) % 5;
  updateCarousel();
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % 5;
  updateCarousel();
});

function updateCarousel() {
  const transformValue = -currentIndex * slideWidth;
  carousel.querySelector(".flex").style.transform = `translateX(${transformValue}px)`;
}

//Contact Us Form Submission

const form = document.getElementById('email-form');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('description').value;

  const emailLink = 'mailto:admin@spacexshare-ai.com?subject=' + encodeURIComponent(email) + '&body=' + encodeURIComponent('Name: ' + firstName + lastName + '\n\nMessage: ' + message);

  window.location.href = emailLink;

  // Clear form inputs
  document.getElementById('firstName').value = '';
  document.getElementById('lastName').value = '';
  document.getElementById('email').value = '';
  document.getElementById('description').value = '';


  alert('Email sent!');
});