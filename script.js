// LocalStorage Key Name
var LOCAL_STORAGE_KEY = 'anil_partners_data';
var CURRENT_USER_KEY = 'anil_current_partner';

// डिफॉल्ट डेटा - अगर कोई पार्टनर न हो तो आपका प्रोफाइल हमेशा दिखे
var DEFAULT_PARTNERS = [
  {
    name: "अनिल प्रजापति (Anil Carpenter)",
    phone: "8341188318",
    pin: "1234",
    location: "वडोदरा (Vadodara / Baroda)",
    category: "जनरल हैंड-टूल वर्कर (Helper/Skilled)",
    exp: "8",
    status: "Available (काम के लिए उपलब्ध)"
  }
];

// Page Load Event
document.addEventListener("DOMContentLoaded", function() {
  initData();
  checkLoginState();
  renderPublicDirectory();
});

// स्टोरेज में अगर कुछ न हो तो डिफ़ॉल्ट प्रोफाइल सेट करें
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

// प्रोफाइल डेटा लोड करें और कॉल/व्हाट्सऐप लिंक सेट करें
function loadPartnerProfileData(partner) {
  var rawPhone = (partner.phone || '').replace(/\D/g, '');

  if (document.getElementById('dispName')) document.getElementById('dispName').innerText = partner.name || 'Anil Carpenter';
  if (document.getElementById('dispCategory')) document.getElementById('dispCategory').innerText = partner.category || 'फर्नीचर कारपेंटर';
  if (document.getElementById('dispExp')) document.getElementById('dispExp').innerText = partner.exp || '0';
  if (document.getElementById('dispPhoneDisplay')) document.getElementById('dispPhoneDisplay').innerText = rawPhone;
  if (document.getElementById('dispStatus')) document.getElementById('dispStatus').innerText = partner.status || 'Available (काम के लिए उपलब्ध)';
  if (document.getElementById('dispAvatar')) document.getElementById('dispAvatar').innerText = (partner.name || 'A').charAt(0).toUpperCase();
  
  var locationText = partner.location || 'वडोदरा (Vadodara / Baroda)';
  if (document.getElementById('dispLocTag')) document.getElementById('dispLocTag').innerText = '📍 ' + locationText;

  // 🔴 CALL & WHATSAPP FUNCTIONALITY FIX
  var callBtn = document.getElementById('pubCallBtn');
  var waBtn = document.getElementById('pubWaBtn');

  if (callBtn) {
    callBtn.href = "tel:" + rawPhone;
  }

  if (waBtn) {
    var waMsg = encodeURIComponent("नमस्ते " + partner.name + " जी, मुझे आपकी अनिल कारपेंटर नेटवर्क प्रोफाइल से आपका नंबर मिला है। मुझे काम के सिलसिले में बात करनी है।");
    waBtn.href = "https://api.whatsapp.com/send?phone=91" + rawPhone + "&text=" + waMsg;
  }

  // Edit form initial values
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
    if (msg) msg.innerHTML = "<span style='color:green; font-weight:bold;'>लॉगिन सफल! लोडिंग...</span>";
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
    if (msg) msg.innerHTML = "<span style='color:red; font-weight:bold;'>यह मोबाइल नंबर पहले से रजिस्टर्ड है! कृपया लॉगिन करें।</span>";
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

  if (msg) msg.innerHTML = "<span style='color:green; font-weight:bold;'>रजिस्ट्रेशन सफल! आपकी प्रोफाइल अब पब्लिक है...</span>";
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

  var exp = document.getElementById("editExp").value.trim();
  var location = document.getElementById("editLocation").value;
  var category = document.getElementById("editCategory").value;
  var status = document.getElementById("editStatus").value;
  var newPin = document.getElementById("editPin").value.trim();

  currentUser.exp = exp;
  currentUser.location = location;
  currentUser.category = category;
  currentUser.status = status;
  if (newPin && newPin.length === 4) {
    currentUser.pin = newPin;
  }

  var partners = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
  var idx = partners.findIndex(function(p) { return p.phone.replace(/\D/g, '') === currentUser.phone.replace(/\D/g, ''); });
  if (idx !== -1) {
    partners[idx] = currentUser;
  } else {
    partners.push(currentUser);
  }
  
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(partners));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

  var saveMsg = document.getElementById("saveMsg");
  if (saveMsg) saveMsg.innerHTML = "<span style='color:green; font-weight:bold;'>✅ प्रोफाइल अपडेट हो गई और लाइव है!</span>";

  loadPartnerProfileData(currentUser);
  renderPublicDirectory();

  setTimeout(function() {
    if (saveMsg) saveMsg.innerHTML = "";
  }, 2500);
}

// Handle Logout
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

  if (user) {
    alert("आपका PIN है: " + user.pin);
  } else {
    alert("यह नंबर रजिस्टर्ड नहीं है।");
  }
}

// Render All Public Registered Workers with working Call & WhatsApp buttons
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

  filtered.forEach(function(w) {
    var rawPhone = (w.phone || '').replace(/\D/g, '');
    var waMsg = encodeURIComponent("नमस्ते " + w.name + " जी, मुझे अनिल कारपेंटर नेटवर्क प्रोफाइल से आपका नंबर मिला है। मुझे काम के सिलसिले में बात करनी है।");
    var waLink = "https://api.whatsapp.com/send?phone=91" + rawPhone + "&text=" + waMsg;
    var callLink = "tel:" + rawPhone;

    var card = document.createElement('div');
    card.className = 'worker-public-card';
    card.innerHTML = 
      '<h3 style="margin:0 0 4px 0; color:#0f172a;">' + w.name + '</h3>' +
      '<span class="location-tag" style="margin:4px 0 8px 0; display:inline-block;">📍 ' + (w.location || 'वडोदरा / बड़ौदा') + '</span>' +
      '<p style="font-size:13px; color:#475569; margin:4px 0;"><strong>' + w.category + '</strong></p>' +
      '<p style="font-size:12px; color:#64748b; margin:0 0 12px 0;">अनुभव: ' + w.exp + ' वर्ष | स्टेटस: ' + (w.status || 'Available') + '</p>' +
      '<div class="btn-action-group">' +
        '<a href="' + callLink + '" class="btn-call">📞 कॉल करें</a>' +
        '<a href="' + waLink + '" target="_blank" class="btn-wa">💬 WhatsApp</a>' +
      '</div>';
    listContainer.appendChild(card);
  });
}

