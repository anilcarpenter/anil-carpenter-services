/* ==========================================
   ANIL CARPENTER WEBSITE
   script.js
========================================== */

// ===============================
// Mobile Menu
// ===============================

const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");

if (menuBtn && menu) {

menuBtn.addEventListener("click", function () {

menu.classList.toggle("active");

menuBtn.classList.toggle("active");

});

}

// ===============================
// Close Menu After Click
// ===============================

const navLinks = document.querySelectorAll(".menu a");

navLinks.forEach(function(link){

link.addEventListener("click", function(){

if(menu){

menu.classList.remove("active");

}

if(menuBtn){

menuBtn.classList.remove("active");

}

});

});

// ===============================
// Back To Top Button
// ===============================

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", function(){

if(!backToTop) return;

if(window.scrollY > 300){

backToTop.style.display = "flex";

}else{

backToTop.style.display = "none";

}

});

if(backToTop){

backToTop.addEventListener("click", function(){

window.scrollTo({

top:0,

behavior:"smooth"

});

});

}

// ===============================
// Active Menu
// ===============================

const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll(".menu a").forEach(function(link){

const href = link.getAttribute("href");

if(href === currentPage){

link.classList.add("active");

}

});
// ===============================
// Sticky Header
// ===============================

const header = document.querySelector(".header");

window.addEventListener("scroll", function () {

if (!header) return;

if (window.scrollY > 50) {

header.classList.add("sticky");

} else {

header.classList.remove("sticky");

}

});

// ===============================
// FAQ Accordion
// ===============================

const accordionItems = document.querySelectorAll(".accordion-item");

accordionItems.forEach(function (item) {

const button = item.querySelector(".accordion-header");

if (!button) return;

button.addEventListener("click", function () {

accordionItems.forEach(function (otherItem) {

if (otherItem !== item) {

otherItem.classList.remove("active");

}

});

item.classList.toggle("active");

});

});

// ===============================
// Contact Form Validation
// ===============================

const contactForm = document.getElementById("contactForm");

if (contactForm) {

contactForm.addEventListener("submit", function (e) {

const name = document.getElementById("name");

const phone = document.getElementById("phone");

const message = document.getElementById("message");

if (!name || !phone || !message) return;

if (name.value.trim() === "") {

alert("कृपया अपना नाम दर्ज करें।");

name.focus();

e.preventDefault();

return;

}

if (!/^[0-9]{10}$/.test(phone.value.trim())) {

alert("कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें।");

phone.focus();

e.preventDefault();

return;

}

if (message.value.trim().length < 10) {

alert("कृपया अपना संदेश कम से कम 10 अक्षरों में लिखें।");

message.focus();

e.preventDefault();

}

});

}

// ===============================
// Reveal Elements on Scroll
// ===============================

const revealElements = document.querySelectorAll(

".service-card, .blog-card, .review-card, .why-card, .stat-box"

);

const revealObserver = new IntersectionObserver(function(entries){

entries.forEach(function(entry){

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

},{

threshold:0.15

});

revealElements.forEach(function(item){

revealObserver.observe(item);

});

// ===============================
// Current Year
// ===============================

const year = document.getElementById("year");

if(year){

year.textContent = new Date().getFullYear();

}

// ===============================
// Disable Empty Links
// ===============================

document.querySelectorAll('a[href="#"]').forEach(function(link){

link.addEventListener("click",function(e){

e.preventDefault();

});

});

// ===============================
// Console Message
// ===============================

console.log("Anil Carpenter Website Loaded Successfully");

// ===============================
// End of Script
// ===============================
