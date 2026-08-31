"use strict";

/* Set Current Year */
document.addEventListener("DOMContentLoaded", function() {
  const yearElement = document.getElementById("currentYear");
  if(yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});

/* Open Booking Modal with Selected Service */
window.openBooking = function(serviceName) {
  const modal = document.getElementById("bookingModal");
  const serviceSelect = document.getElementById("quickService");
  
  if (!modal) return;

  if (serviceSelect && serviceName) {
    let found = false;
    for (let i = 0; i < serviceSelect.options.length; i++) {
      if (serviceSelect.options[i].value === serviceName) {
        serviceSelect.selectedIndex = i;
        found = true;
        break;
      }
    }
    if (!found) {
      serviceSelect.selectedIndex = 0;
    }
  }

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
};

/* Close Booking Modal */
window.closeBooking = function() {
  const modal = document.getElementById("bookingModal");
  if (!modal) return;

  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
};

/* Close on Escape key */
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    closeBooking();
  }
});

/* WhatsApp Direct Booking Handler */
window.submitQuickBooking = function(event) {
  event.preventDefault();

  const name = document.getElementById("quickName")?.value.trim();
  const phone = document.getElementById("quickPhone")?.value.trim();
  const service = document.getElementById("quickService")?.value;
  const address = document.getElementById("quickAddress")?.value.trim();
  const extraMessage = document.getElementById("quickMessage")?.value.trim();
  const status = document.getElementById("quickBookingStatus");

  if (!name || !phone || !service || !address) {
    if (status) status.textContent = "कृपया सभी जरूरी जानकारी भरें।";
    return;
  }

  if (!/^[0-9]{10}$/.test(phone)) {
    if (status) status.textContent = "कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें।";
    return;
  }

  const whatsappText = 
    "नमस्ते Anil Carpenter,\n\n" +
    "मुझे कारपेंटर सर्विस बुक करनी है।\n\n" +
    "👤 नाम: " + name + "\n" +
    "📞 मोबाइल: " + phone + "\n" +
    "🛠️ सर्विस: " + service + "\n" +
    "📍 पता: " + address + 
    (extraMessage ? "\n📝 काम का विवरण: " + extraMessage : "");

  const whatsappURL = "https://wa.me/918341188318?text=" + encodeURIComponent(whatsappText);

  if (status) status.textContent = "WhatsApp खोला जा रहा है...";

  window.open(whatsappURL, "_blank");

  setTimeout(function() {
    closeBooking();
    if (status) status.textContent = "";
  }, 1000);
};

/* Only allow numbers in Phone input */
document.addEventListener("input", function(e) {
  if (e.target.matches('input[type="tel"]')) {
    e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
  }
});

