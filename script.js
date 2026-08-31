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

/* WORKER PARTNER SYSTEM (Local Storage Based) */

// Register Partner
window.handlePartnerRegister = function(e) {
  e.preventDefault();
  const name = document.getElementById("pName")?.value.trim();
  const phone = document.getElementById("pPhone")?.value.trim();
  const skill = document.getElementById("pSkills")?.value;
  const exp = document.getElementById("pExp")?.value;
  const msg = document.getElementById("partnerMessage");

  if(!name || !phone || !skill || !exp) return;

  const partnerData = {
    name: name,
    phone: phone,
    skill: skill,
    exp: exp,
    status: "Available (काम के लिए उपलब्ध)"
  };

  localStorage.setItem("worker_" + phone, JSON.stringify(partnerData));
  
  if(msg) msg.textContent = "✅ आपका रजिस्ट्रेशन हो गया है! अब लॉगिन करें।";
  document.getElementById("partnerRegisterForm").reset();
};

// Login Partner
window.handlePartnerLogin = function(e) {
  e.preventDefault();
  const phone = document.getElementById("loginPhone")?.value.trim();
  const msg = document.getElementById("partnerMessage");

  const data = localStorage.getItem("worker_" + phone);
  if(!data) {
    if(msg) msg.textContent = "❌ इस नंबर से कोई प्रोफाइल नहीं मिली। कृपया पहले साइन-अप करें।";
    return;
  }

  const partner = JSON.parse(data);
  localStorage.setItem("current_worker", phone);
  renderPartnerProfile(partner);
  if(msg) msg.textContent = "";
};

// Render Profile to Dashboard
function renderPartnerProfile(partner) {
  document.getElementById("partnerLoginBox").style.display = "none";
  document.getElementById("partnerProfileBox").style.display = "block";

  document.getElementById("profileDisplayName").textContent = partner.name;
  document.getElementById("profileDisplayPhone").textContent = "+91 " + partner.phone;
  document.getElementById("editSkill").value = partner.skill;
  document.getElementById("editExp").value = partner.exp;
  document.getElementById("editStatus").value = partner.status || "Available (काम के लिए उपलब्ध)";
}

// Update Profile
window.handleProfileUpdate = function(e) {
  e.preventDefault();
  const phone = localStorage.getItem("current_worker");
  const msg = document.getElementById("partnerMessage");

  if(!phone) return;

  const data = JSON.parse(localStorage.getItem("worker_" + phone));
  data.skill = document.getElementById("editSkill").value.trim();
  data.exp = document.getElementById("editExp").value;
  data.status = document.getElementById("editStatus").value;

  localStorage.setItem("worker_" + phone, JSON.stringify(data));
  if(msg) msg.textContent = "✅ आपकी प्रोफाइल अपडेट हो गई है!";
};

// Logout Partner
window.handlePartnerLogout = function() {
  localStorage.removeItem("current_worker");
  document.getElementById("partnerLoginBox").style.display = "block";
  document.getElementById("partnerProfileBox").style.display = "none";
  const msg = document.getElementById("partnerMessage");
  if(msg) msg.textContent = "आप लॉगआउट हो चुके हैं।";
};

// Auto check login on page load
document.addEventListener("DOMContentLoaded", function() {
  const activePhone = localStorage.getItem("current_worker");
  if(activePhone) {
    const data = localStorage.getItem("worker_" + activePhone);
    if(data) renderPartnerProfile(JSON.parse(data));
  }
});
/* SEPARATE PARTNER PORTAL LOGIC */

window.handlePortalRegister = function(e) {
  e.preventDefault();
  const name = document.getElementById("regName")?.value.trim();
  const phone = document.getElementById("regPhone")?.value.trim();
  const pin = document.getElementById("regPin")?.value.trim();
  const category = document.getElementById("regCategory")?.value;
  const exp = document.getElementById("regExp")?.value;
  const msg = document.getElementById("portalMsg");

  if(!name || !phone || !pin || !category || !exp) return;

  if(pin.length !== 4) {
    if(msg) msg.textContent = "❌ PIN सिर्फ 4 अंकों का होना चाहिए।";
    return;
  }

  const partnerData = {
    name: name,
    phone: phone,
    pin: pin,
    category: category,
    exp: exp,
    status: "Available (काम के लिए उपलब्ध)"
  };

  localStorage.setItem("worker_" + phone, JSON.stringify(partnerData));
  localStorage.setItem("current_worker", phone);
  
  alert("✅ आपका पार्टनर अकाउंट बन गया है!");
  loadPortalDashboard(partnerData);
};

window.handlePortalLogin = function(e) {
  e.preventDefault();
  const phone = document.getElementById("portPhone")?.value.trim();
  const pin = document.getElementById("portPin")?.value.trim();
  const msg = document.getElementById("portalMsg");

  const data = localStorage.getItem("worker_" + phone);
  if(!data) {
    if(msg) msg.textContent = "❌ यह नंबर रजिस्टर्ड नहीं है। दाहिने तरफ फॉर्म भरकर रजिस्ट्रेशन करें।";
    return;
  }

  const partner = JSON.parse(data);
  if(partner.pin && partner.pin !== pin) {
    if(msg) msg.textContent = "❌ गलत PIN!";
    return;
  }

  localStorage.setItem("current_worker", phone);
  loadPortalDashboard(partner);
};

function loadPortalDashboard(partner) {
  document.getElementById("authSection").style.display = "none";
  document.getElementById("dashboardSection").style.display = "block";

  document.getElementById("dispName").textContent = partner.name;
  document.getElementById("dispCategory").textContent = partner.category || "Skilled Worker";
  document.getElementById("dispAvatar").textContent = partner.name.charAt(0).toUpperCase();

  const statusEl = document.getElementById("dispStatus");
  statusEl.textContent = partner.status || "Available (काम के लिए उपलब्ध)";
  if(partner.status && partner.status.includes("Busy")) {
    statusEl.className = "status-badge status-busy";
  } else {
    statusEl.className = "status-badge status-available";
  }

  document.getElementById("editPhone").value = partner.phone;
  document.getElementById("editExp").value = partner.exp;
  document.getElementById("editCategory").value = partner.category;
  document.getElementById("editStatus").value = partner.status || "Available (काम के लिए उपलब्ध)";
}

window.handleProfileSave = function(e) {
  e.preventDefault();
  const phone = localStorage.getItem("current_worker");
  const msg = document.getElementById("saveMsg");
  if(!phone) return;

  const data = JSON.parse(localStorage.getItem("worker_" + phone));
  data.exp = document.getElementById("editExp").value;
  data.category = document.getElementById("editCategory").value;
  data.status = document.getElementById("editStatus").value;

  const newPin = document.getElementById("editPin").value.trim();
  if(newPin && newPin.length === 4) {
    data.pin = newPin;
  }

  localStorage.setItem("worker_" + phone, JSON.stringify(data));
  if(msg) msg.textContent = "✅ आपकी प्रोफाइल सफलतापूर्वक अपडेट हो गई!";
  
  loadPortalDashboard(data);
};

window.handlePortalLogout = function() {
  localStorage.removeItem("current_worker");
  document.getElementById("authSection").style.display = "block";
  document.getElementById("dashboardSection").style.display = "none";
};

// Check login status on page load
document.addEventListener("DOMContentLoaded", function() {
  const activePhone = localStorage.getItem("current_worker");
  if(activePhone && document.getElementById("dashboardSection")) {
    const data = localStorage.getItem("worker_" + activePhone);
    if(data) loadPortalDashboard(JSON.parse(data));
  }
});
/* Mobile Menu Toggle */
function toggleMenu() {
  const menu = document.querySelector('.main-menu');
  if(menu) {
    menu.classList.toggle('active');
  }
}

