// LocalStorage Key Name
var LOCAL_STORAGE_KEY = 'anil_partners_data';
var CURRENT_USER_KEY = 'anil_current_partner';

// डिफ़ॉल्ट डेटा - रियल और एसईओ-ऑप्टिमाइज़्ड लोकेशंस के साथ
var DEFAULT_PARTNERS = [
  {
    name: "अनिल प्रजापति (Anil Carpenter)",
    phone: "8341188318",
    pin: "1234",
    location: "दुलहीपार, संत कबीर नगर (Dulahipar, Sant Kabir Nagar)",
    category: "फर्नीचर व मॉड्यूलर किचन स्पेशलिस्ट",
    exp: "8",
    status: "Available (काम के लिए उपलब्ध)"
  },
  {
    name: "किशोर सुतार (Aditya Furniture)",
    phone: "9158000000",
    pin: "1234",
    location: "शिरोल, कोल्हापुर, महाराष्ट्र (Shirol, Kolhapur)",
    category: "कारपेंटर व इंटीरियर ठेकेदार",
    exp: "12",
    status: "Available (काम के लिए उपलब्ध)"
  }
];

// Page Load Event
document.addEventListener("DOMContentLoaded", function() {
  initData();
  checkLoginState();
  renderPublicDirectory();
  injectModalHTML();
});

/* Quick Booking */
function openBooking(service) {
  var modal = document.getElementById("bookingModal");
  var serviceInput = document.getElementById("quickService");

  if (serviceInput && service) {
    var found = Array.prototype.some.call(serviceInput.options, function(option) {
      if (option.value === service) {
        serviceInput.value = service;
        return true;
      }
      return false;
    });

    if (!found) {
      serviceInput.value = "";
    }
  }

  if (modal) {
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("active");
    document.body.classList.add("modal-open");
  }
}

function closeBooking() {
  var modal = document.getElementById("bookingModal");

  if (modal) {
    modal.setAttribute("aria-hidden", "true");
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
  }
}

function submitQuickBooking(e) {
  if (e) e.preventDefault();

  var nameEl = document.getElementById("quickName");
  var phoneEl = document.getElementById("quickPhone");
  var serviceEl = document.getElementById("quickService");
  var addressEl = document.getElementById("quickAddress");
  var messageEl = document.getElementById("quickMessage");
  var statusEl = document.getElementById("quickBookingStatus");

  if (!nameEl || !phoneEl || !serviceEl || !addressEl) return;

  var name = nameEl.value.trim();
  var phone = phoneEl.value.trim().replace(/\D/g, '');
  var service = serviceEl.value;
  var address = addressEl.value.trim();
  var message = messageEl ? messageEl.value.trim() : "";

  if (!/^[0-9]{10}$/.test(phone)) {
    if (statusEl) {
      statusEl.innerHTML = "<span style='color:red;font-weight:bold;'>कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें।</span>";
    }
    return;
  }

  var waText =
    "नमस्ते Anil Carpenter जी,%0A%0A" +
    "मुझे Carpenter Service चाहिए।%0A" +
    "सर्विस: " + encodeURIComponent(service) + "%0A" +
    "नाम: " + encodeURIComponent(name) + "%0A" +
    "मोबाइल: " + encodeURIComponent(phone) + "%0A" +
    "पता: " + encodeURIComponent(address) + "%0A" +
    (message ? "काम की जानकारी: " + encodeURIComponent(message) : "");

  if (statusEl) {
    statusEl.innerHTML = "<span style='color:green;font-weight:bold;'>WhatsApp खोला जा रहा है...</span>";
  }

  window.open(
    "https://wa.me/918341188318?text=" + waText,
    "_blank",
    "noopener"
  );
}

// स्टोरेज इनिशियलाइज़ेशन
function initData() {
  var existingData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!existingData) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_PARTNERS));
  }
}

// Check Login State
function checkLoginState() {
  var currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
  var authSection = document.getElementById("authSection");
  var dashboardSection = document.getElementById("dashboardSection");

  if (currentUser) {
    if (authSection) authSection.style.display = "none";
    if (dashboardSection) dashboardSection.style.display = "block";
    loadPartnerProfileData(currentUser);
  } else {
    if (authSection) authSection.style.display = "block";
    if (dashboardSection) dashboardSection.style.display = "none";
  }
}

// प्रोफाइल डेटा लोड करें
function loadPartnerProfileData(partner) {
  var rawPhone = (partner.phone || '').replace(/\D/g, '');

  if (document.getElementById('dispName')) document.getElementById('dispName').innerText = partner.name || 'Anil Carpenter';
  if (document.getElementById('dispCategory')) document.getElementById('dispCategory').innerText = partner.category || 'फर्नीचर कारपेंटर';
  if (document.getElementById('dispExp')) document.getElementById('dispExp').innerText = partner.exp || '0';
  if (document.getElementById('dispPhoneDisplay')) document.getElementById('dispPhoneDisplay').innerText = rawPhone;
  if (document.getElementById('dispStatus')) document.getElementById('dispStatus').innerText = partner.status || 'Available (काम के लिए उपलब्ध)';
  if (document.getElementById('dispAvatar')) document.getElementById('dispAvatar').innerText = (partner.name || 'A').charAt(0).toUpperCase();
  
  var locationText = partner.location || 'संत कबीर नगर (Sant Kabir Nagar)';
  if (document.getElementById('dispLocTag')) document.getElementById('dispLocTag').innerText = '📍 ' + locationText;

  var callBtn = document.getElementById('pubCallBtn');
  var waBtn = document.getElementById('pubWaBtn');

  if (callBtn) callBtn.href = "tel:" + rawPhone;
  if (waBtn) {
    var waMsg = encodeURIComponent("नमस्ते " + partner.name + " जी, मुझे आपकी अनिल कारपेंटर नेटवर्क प्रोफाइल से आपका नंबर मिला है। मुझे काम के सिलसिले में बात करनी है।");
    waBtn.href = "https://api.whatsapp.com/send?phone=91" + rawPhone + "&text=" + waMsg;
  }

  if (document.getElementById('editPhone')) document.getElementById('editPhone').value = rawPhone;
  if (document.getElementById('editExp')) document.getElementById('editExp').value = partner.exp || '';
  if (document.getElementById('editCategory')) document.getElementById('editCategory').value = partner.category || '';
  if (document.getElementById('editStatus')) document.getElementById('editStatus').value = partner.status || 'Available (काम के लिए उपलब्ध)';
  if (document.getElementById('editLocation')) document.getElementById('editLocation').value = locationText;
}

// Handle Login
function handlePortalLogin(e) {
  e.preventDefault();
  var phone = document.getElementById("portPhone").value.trim().replace(/\D/g, '');
  var pin = document.getElementById("portPin").value.trim();
  var msg = document.getElementById("portalMsg");

  var partners = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
  var user = partners.find(function(p) { return p.phone.replace(/\D/g, '') === phone && p.pin === pin; });

  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    if (msg) msg.innerHTML = "<span style='color:green; font-weight:bold;'>लॉगिन सफल!</span>";
    setTimeout(function() {
      if (msg) msg.innerHTML = "";
      checkLoginState();
      renderPublicDirectory();
    }, 500);
  } else {
    if (msg) msg.innerHTML = "<span style='color:red; font-weight:bold;'>गलत मोबाइल नंबर या PIN!</span>";
  }
}

// Handle Register
function handlePortalRegister(e) {
  e.preventDefault();
  var name = document.getElementById("regName").value.trim();
  var phone = document.getElementById("regPhone").value.trim().replace(/\D/g, '');
  var pin = document.getElementById("regPin").value.trim();
  var location = document.getElementById("regLocation").value;
  var category = document.getElementById("regCategory").value;
  var exp = document.getElementById("regExp").value.trim();
  var msg = document.getElementById("portalMsg");

  var partners = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
  var exists = partners.some(function(p) { return p.phone.replace(/\D/g, '') === phone; });

  if (exists) {
    if (msg) msg.innerHTML = "<span style='color:red; font-weight:bold;'>यह नंबर पहले से रजिस्टर्ड है!</span>";
    return;
  }

  var newPartner = {
    name: name,
    phone: phone,
    pin: pin,
    location: location,
    category: category,
    exp: exp,
    status: 'Available (काम के लिए उपलब्ध)'
  };

  partners.push(newPartner);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(partners));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newPartner));

  if (msg) msg.innerHTML = "<span style='color:green; font-weight:bold;'>रजिस्ट्रेशन सफल!</span>";
  setTimeout(function() {
    if (msg) msg.innerHTML = "";
    checkLoginState();
    renderPublicDirectory();
  }, 800);
}

// Save Profile Updates
function handleProfileSave(e) {
  e.preventDefault();
  var currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
  if (!currentUser) return;

  currentUser.exp = document.getElementById("editExp").value.trim();
  currentUser.location = document.getElementById("editLocation").value;
  currentUser.category = document.getElementById("editCategory").value;
  currentUser.status = document.getElementById("editStatus").value;
  var newPin = document.getElementById("editPin").value.trim();
  if (newPin && newPin.length === 4) currentUser.pin = newPin;

  var partners = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
  var idx = partners.findIndex(function(p) { return p.phone.replace(/\D/g, '') === currentUser.phone.replace(/\D/g, ''); });
  if (idx !== -1) partners[idx] = currentUser;
  else partners.push(currentUser);
  
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(partners));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

  var saveMsg = document.getElementById("saveMsg");
  if (saveMsg) saveMsg.innerHTML = "<span style='color:green; font-weight:bold;'>✅ प्रोफाइल अपडेट हो गई!</span>";

  loadPartnerProfileData(currentUser);
  renderPublicDirectory();

  setTimeout(function() { if (saveMsg) saveMsg.innerHTML = ""; }, 2000);
}

// Handle Logout

/* Homepage compatibility handlers */
function handlePartnerLogin(e) {
  e.preventDefault();

  var phoneEl = document.getElementById("loginPhone");
  var msg = document.getElementById("partnerMessage");
  if (!phoneEl) return;

  var phone = phoneEl.value.trim().replace(/\D/g, '');
  var partners = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");

  var user = partners.find(function(p) {
    return p.phone && p.phone.replace(/\D/g, '') === phone;
  });

  if (!user) {
    if (msg) {
      msg.innerHTML = "<span style='color:red;font-weight:bold;'>यह मोबाइल नंबर रजिस्टर्ड नहीं है।</span>";
    }
    return;
  }

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

  var loginBox = document.getElementById("partnerLoginBox");
  var profileBox = document.getElementById("partnerProfileBox");

  if (loginBox) loginBox.style.display = "none";
  if (profileBox) profileBox.style.display = "block";

  var name = document.getElementById("profileDisplayName");
  var displayPhone = document.getElementById("profileDisplayPhone");
  var skill = document.getElementById("editSkill");
  var exp = document.getElementById("editExp");
  var status = document.getElementById("editStatus");

  if (name) name.textContent = user.name || "वर्कर";
  if (displayPhone) displayPhone.textContent = "+91 " + (user.phone || phone);
  if (skill) skill.value = user.category || "";
  if (exp) exp.value = user.exp || "";
  if (status) status.value = user.status || "Available (काम के लिए उपलब्ध)";

  if (msg) {
    msg.innerHTML = "<span style='color:green;font-weight:bold;'>लॉगिन सफल! प्रोफाइल खुल गई।</span>";
  }
}

function handlePartnerRegister(e) {
  e.preventDefault();

  var nameEl = document.getElementById("pName");
  var phoneEl = document.getElementById("pPhone");
  var skillEl = document.getElementById("pSkills");
  var expEl = document.getElementById("pExp");
  var msg = document.getElementById("partnerMessage");

  if (!nameEl || !phoneEl || !skillEl || !expEl) return;

  var name = nameEl.value.trim();
  var phone = phoneEl.value.trim().replace(/\D/g, '');
  var category = skillEl.value;
  var exp = expEl.value.trim();

  if (!/^[0-9]{10}$/.test(phone)) {
    if (msg) {
      msg.innerHTML = "<span style='color:red;font-weight:bold;'>कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें।</span>";
    }
    return;
  }

  var partners = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");

  var exists = partners.some(function(p) {
    return p.phone && p.phone.replace(/\D/g, '') === phone;
  });

  if (exists) {
    if (msg) {
      msg.innerHTML = "<span style='color:red;font-weight:bold;'>यह नंबर पहले से रजिस्टर्ड है।</span>";
    }
    return;
  }

  var newPartner = {
    name: name,
    phone: phone,
    pin: "1234",
    location: "संत कबीर नगर, उत्तर प्रदेश",
    category: category,
    exp: exp,
    status: "Available (काम के लिए उपलब्ध)"
  };

  partners.push(newPartner);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(partners));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newPartner));

  var loginBox = document.getElementById("partnerLoginBox");
  var profileBox = document.getElementById("partnerProfileBox");

  if (loginBox) loginBox.style.display = "none";
  if (profileBox) profileBox.style.display = "block";

  var displayName = document.getElementById("profileDisplayName");
  var displayPhone = document.getElementById("profileDisplayPhone");
  var skill = document.getElementById("editSkill");
  var expInput = document.getElementById("editExp");
  var status = document.getElementById("editStatus");

  if (displayName) displayName.textContent = name;
  if (displayPhone) displayPhone.textContent = "+91 " + phone;
  if (skill) skill.value = category;
  if (expInput) expInput.value = exp;
  if (status) status.value = newPartner.status;

  if (msg) {
    msg.innerHTML = "<span style='color:green;font-weight:bold;'>✅ पार्टनर रजिस्ट्रेशन सफल! प्रोफाइल तैयार है।</span>";
  }
}

function handleProfileUpdate(e) {
  e.preventDefault();

  var currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null");
  var msg = document.getElementById("partnerMessage");

  if (!currentUser) {
    if (msg) {
      msg.innerHTML = "<span style='color:red;font-weight:bold;'>पहले लॉगिन करें।</span>";
    }
    return;
  }

  var skill = document.getElementById("editSkill");
  var exp = document.getElementById("editExp");
  var status = document.getElementById("editStatus");

  if (skill) currentUser.category = skill.value.trim();
  if (exp) currentUser.exp = exp.value.trim();
  if (status) currentUser.status = status.value;

  var partners = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");

  var idx = partners.findIndex(function(p) {
    return p.phone && currentUser.phone &&
      p.phone.replace(/\D/g, '') === currentUser.phone.replace(/\D/g, '');
  });

  if (idx !== -1) {
    partners[idx] = currentUser;
  } else {
    partners.push(currentUser);
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(partners));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

  var name = document.getElementById("profileDisplayName");
  if (name) name.textContent = currentUser.name || "वर्कर";

  if (msg) {
    msg.innerHTML = "<span style='color:green;font-weight:bold;'>✅ प्रोफाइल अपडेट हो गई!</span>";
  }
}

function handlePartnerLogout() {
  localStorage.removeItem(CURRENT_USER_KEY);

  var loginBox = document.getElementById("partnerLoginBox");
  var profileBox = document.getElementById("partnerProfileBox");
  var msg = document.getElementById("partnerMessage");

  if (loginBox) loginBox.style.display = "block";
  if (profileBox) profileBox.style.display = "none";
  if (msg) msg.innerHTML = "";
}


function handlePortalLogout() {
  localStorage.removeItem(CURRENT_USER_KEY);
  checkLoginState();
  renderPublicDirectory();
}

// Forgot PIN
function handleForgotPassword() {
  var phone = prompt("अपना 10 अंकों का रजिस्टर्ड मोबाइल नंबर दर्ज करें:");
  if (!phone) return;
  phone = phone.replace(/\D/g, '');
  var partners = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
  var user = partners.find(function(p) { return p.phone.replace(/\D/g, '') === phone; });
  if (user) alert("आपका PIN है: " + user.pin);
  else alert("यह नंबर रजिस्टर्ड नहीं है।");
}

// 🟢 CLICKABLE PUBLIC DIRECTORY WITH REAL LOCAL SEO LOCATIONS
function renderPublicDirectory() {
  var listContainer = document.getElementById('publicWorkerList');
  if (!listContainer) return;

  var selectedLoc = document.getElementById('filterLocation') ? document.getElementById('filterLocation').value : 'ALL';
  var partners = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');

  listContainer.innerHTML = '';

  var filtered = partners.filter(function(w) {
    return selectedLoc === 'ALL' || (w.location && w.location.indexOf(selectedLoc) !== -1);
  });

  if (filtered.length === 0) {
    listContainer.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#94a3b8; padding:20px;">इस लोकेशन में अभी कोई वर्कर पार्टनर उपलब्ध नहीं है।</p>';
    return;
  }

  filtered.forEach(function(w, index) {
    var rawPhone = (w.phone || '').replace(/\D/g, '');
    var waMsg = encodeURIComponent("नमस्ते " + w.name + " जी, मुझे अनिल कारपेंटर नेटवर्क प्रोफाइल से आपका नंबर मिला है।");
    var waLink = "https://api.whatsapp.com/send?phone=91" + rawPhone + "&text=" + waMsg;
    var callLink = "tel:" + rawPhone;

    var card = document.createElement('div');
    card.className = 'worker-public-card';
    card.style.cursor = 'pointer';
    card.title = 'पूरी प्रोफाइल देखने के लिए क्लिक करें';
    
    // पूरा कार्ड क्लीकेबल बनाया गया है
    card.innerHTML = 
      '<div onclick="openWorkerModal(' + index + ')">' +
        '<h3 style="margin:0 0 4px 0; color:#2563eb;">' + w.name + ' 🔍</h3>' +
        '<span class="location-tag" style="margin:4px 0 8px 0; display:inline-block;">📍 ' + (w.location || 'संत कबीर नगर') + '</span>' +
        '<p style="font-size:13px; color:#475569; margin:4px 0;"><strong>' + w.category + '</strong></p>' +
        '<p style="font-size:12px; color:#64748b; margin:0 0 12px 0;">अनुभव: ' + w.exp + ' वर्ष | स्टेटस: ' + (w.status || 'Available') + '</p>' +
      '</div>' +
      '<div class="btn-action-group">' +
        '<a href="' + callLink + '" class="btn-call">📞 कॉल करें</a>' +
        '<a href="' + waLink + '" target="_blank" class="btn-wa">💬 WhatsApp</a>' +
      '</div>';
    listContainer.appendChild(card);
  });
}

// 🟢 MODAL POPUP FOR CLICKABLE WORKER PROFILES
function injectModalHTML() {
  if (document.getElementById('workerModal')) return;
  var modalDiv = document.createElement('div');
  modalDiv.id = 'workerModal';
  modalDiv.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:9999; justify-content:center; align-items:center; padding:20px;';
  modalDiv.innerHTML = `
    <div style="background:#fff; max-width:500px; width:100%; border-radius:16px; padding:25px; position:relative; box-shadow:0 10px 25px rgba(0,0,0,0.2);">
      <button onclick="closeWorkerModal()" style="position:absolute; top:15px; right:15px; background:#f1f5f9; border:none; font-size:18px; width:35px; height:35px; border-radius:50%; cursor:pointer; font-weight:bold;">✕</button>
      <div id="modalBodyContent"></div>
    </div>
  `;
  document.body.appendChild(modalDiv);
}

function openWorkerModal(index) {
  var selectedLoc = document.getElementById('filterLocation') ? document.getElementById('filterLocation').value : 'ALL';
  var partners = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  var filtered = partners.filter(function(w) {
    return selectedLoc === 'ALL' || (w.location && w.location.indexOf(selectedLoc) !== -1);
  });
  var w = filtered[index];
  if (!w) return;

  var rawPhone = (w.phone || '').replace(/\D/g, '');
  var waMsg = encodeURIComponent("नमस्ते " + w.name + " जी, मुझे अनिल कारपेंटर नेटवर्क से आपका नंबर मिला है।");
  
  var content = `
    <div style="text-align:center; margin-bottom:15px;">
      <div style="width:60px; height:60px; background:#eef4ff; color:#2563eb; border-radius:50%; display:grid; place-items:center; font-size:28px; font-weight:bold; margin:0 auto 10px auto;">${w.name.charAt(0)}</div>
      <h2 style="margin:0; color:#0f172a;">${w.name}</h2>
      <p style="color:#2563eb; font-weight:600; margin:4px 0;">📍 ${w.location}</p>
    </div>
    <div style="background:#f8fafc; padding:15px; border-radius:10px; margin-bottom:15px; font-size:14px; color:#334155;">
      <p style="margin:6px 0;"><strong>हुनर / कैटेगरी:</strong> ${w.category}</p>
      <p style="margin:6px 0;"><strong>कार्य अनुभव:</strong> ${w.exp} वर्ष</p>
      <p style="margin:6px 0;"><strong>वर्तमान स्टेटस:</strong> ${w.status || 'Available'}</p>
      <p style="margin:6px 0;"><strong>संपर्क नंबर:</strong> ${rawPhone}</p>
    </div>
    <div style="display:flex; gap:10px;">
      <a href="tel:${rawPhone}" class="btn-call" style="flex:1; text-align:center; text-decoration:none; padding:12px; border-radius:8px; font-weight:bold; background:#2563eb; color:white;">📞 सीधे कॉल करें</a>
      <a href="https://api.whatsapp.com/send?phone=91${rawPhone}&text=${waMsg}" target="_blank" class="btn-wa" style="flex:1; text-align:center; text-decoration:none; padding:12px; border-radius:8px; font-weight:bold; background:#25D366; color:white;">💬 WhatsApp मैसेज</a>
    </div>
  `;
  document.getElementById('modalBodyContent').innerHTML = content;
  document.getElementById('workerModal').style.display = 'flex';
}

function closeWorkerModal() {
  var modal = document.getElementById('workerModal');
  if (modal) modal.style.display = 'none';
}

// Mobile Menu Toggle
function toggleMenu() {
  var menu = document.querySelector('.links') || document.querySelector('.main-menu') || document.querySelector('.nav-links');
  if (menu) menu.classList.toggle('active');
}



