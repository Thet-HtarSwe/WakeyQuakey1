
const navContainer = document.getElementById('navLinksContainer');
const navLinks = document.querySelectorAll('.nav-link');
const hoverPill = document.getElementById('hoverPill');
const activeUnderline = document.getElementById('activeUnderline');

function moveUnderline(link) {
  if (!link || !activeUnderline) return;
  const pad = 18;
  activeUnderline.style.width = `${link.offsetWidth - pad * 2}px`;
  activeUnderline.style.transform = `translateX(${link.parentElement.offsetLeft + pad}px)`;
}

function moveHoverPill(link) {
  if (!link || !hoverPill) return;
  hoverPill.style.width = `${link.offsetWidth}px`;
  hoverPill.style.transform = `translate(${link.parentElement.offsetLeft}px, -50%)`;
  hoverPill.style.opacity = '1';
}

function initActiveState() {
  const current = document.querySelector('.nav-link.active');
  if (current) moveUnderline(current);
}

window.addEventListener('load', initActiveState);
window.addEventListener('resize', initActiveState);
navLinks.forEach(link => link.addEventListener('mouseenter', () => moveHoverPill(link)));
navContainer?.addEventListener('mouseleave', () => { hoverPill.style.opacity = '0'; });

const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
let toastTimer;
function showToast(msg, isError = false) {
  toastMessage.textContent = msg;
  toast.classList.toggle('error', isError);
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

const modalOverlay = document.getElementById('authModalOverlay');
const navAuth = document.getElementById('navAuth');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabIndicator = document.getElementById('tabIndicator');
const signinForm = document.getElementById('signinForm');
const signupForm = document.getElementById('signupForm');

function switchTab(tab) {
  tabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
  tabIndicator.style.transform = tab === 'signin' ? 'translateX(0%)' : 'translateX(100%)';
  signinForm?.classList.toggle('active', tab === 'signin');
  signupForm?.classList.toggle('active', tab === 'signup');
}
function updateNavbarAuth() {
  const user = JSON.parse(localStorage.getItem('wq_current_user'));
  if (user) {
    const firstName = user.name.split(' ');
    navAuth.innerHTML = `<button type="button" class="btn-profile" id="profileMenuBtn"><span>${firstName}</span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button><div class="profile-dropdown" id="profileDropdown"><a href="profile.html">View Profile</a><button type="button" class="logout-btn" id="logoutBtn">Log Out</button></div>`;
  } else {
    navAuth.innerHTML = `<button type="button" class="btn-signin" id="openModalBtn">Sign In</button>`;
  }
}

document.addEventListener('click', (e) => {
  if (e.target.closest('#openModalBtn')) { switchTab('signin'); modalOverlay.classList.add('open'); return; }
  if (e.target.closest('#closeModalBtn') || e.target === modalOverlay) { modalOverlay.classList.remove('open'); return; }
  const tabTarget = e.target.closest('.tab-btn')?.dataset.tab || e.target.closest('[data-switch]')?.dataset.switch;
  if (tabTarget) { switchTab(tabTarget); return; }
  const toggleBtn = e.target.closest('.toggle-pw');
  if (toggleBtn) { const inp = document.getElementById(toggleBtn.dataset.target); if (inp) inp.type = inp.type === 'password' ? 'text' : 'password'; return; }
  if (e.target.closest('#profileMenuBtn')) { document.getElementById('profileDropdown')?.classList.toggle('open'); return; }
  if (e.target.closest('#logoutBtn')) { localStorage.removeItem('wq_current_user'); updateNavbarAuth(); showToast('Signed out successfully'); return; }
  const dropdown = document.getElementById('profileDropdown');
  if (dropdown && !e.target.closest('#navAuth')) dropdown.classList.remove('open');
});

signupForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim().toLowerCase();
  const password = document.getElementById('signupPassword').value;
  if (password !== document.getElementById('signupConfirm').value) { showToast('Passwords do not match!', true); return; }
  const users = JSON.parse(localStorage.getItem('wq_users_db')) || [];
  if (users.some(u => u.email === email)) { showToast('Email already registered.', true); return; }
  users.push({ name, email, password });
  localStorage.setItem('wq_users_db', JSON.stringify(users));
  document.getElementById('loginEmail').value = email;
  signupForm.reset();
  switchTab('signin');
  showToast('Account created! Please sign in.');
});

signinForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  const users = JSON.parse(localStorage.getItem('wq_users_db')) || [];
  const match = users.find(u => u.email === email && u.password === password);
  if (!match) { showToast('Invalid email or password.', true); return; }
  localStorage.setItem('wq_current_user', JSON.stringify(match));
  updateNavbarAuth();
  signinForm.reset();
  modalOverlay.classList.remove('open');
  showToast(`Welcome back, ${match.name}!`);
});

window.socialLogin = (provider) => {
  localStorage.setItem('wq_current_user', JSON.stringify({ name: `${provider} User`, email: `user@${provider.toLowerCase()}.com` }));
  updateNavbarAuth();
  modalOverlay.classList.remove('open');
  showToast(`Signed in with ${provider}!`);
};

const faqData = [
  { keywords: ["who are you", "your name", "tecton", "introduce yourself"], answer: "Hello! I'm Tecton, WakeyQuakey's friendly digital mascot. I'm here to help you understand earthquakes, explore safety information, and improve your disaster preparedness!" },
  { keywords: ["what is an earthquake", "define earthquake", "earthquake meaning"], answer: "An earthquake is the sudden shaking of the Earth's surface caused by the release of energy within the Earth's crust. This energy travels through the ground as seismic waves." },
  { keywords: ["cause", "causes", "why earthquake", "how earthquake happen"], answer: "Earthquakes mainly occur when tectonic plates move and rocks suddenly slip along faults. This releases stored energy that travels through the Earth as seismic waves." },
  { keywords: ["tectonic plate", "tectonic plates", "plate movement"], answer: "Tectonic plates are large sections of the Earth's outer layer. They move slowly over time. Their interactions, including colliding, separating, and sliding past each other, can cause earthquakes." },
  { keywords: ["fault", "fault line", "faults"], answer: "A fault is a fracture or zone of fractures in the Earth's crust where rocks can move relative to each other. Sudden movement along a fault can generate an earthquake." },
  { keywords: ["magnitude", "richter", "earthquake strength", "how strong"], answer: "Magnitude measures the size of an earthquake based on the energy released at its source. The Moment Magnitude Scale (Mw) is commonly used by scientists to describe earthquake magnitude." },
  { keywords: ["focus", "hypocenter"], answer: "The focus, also called the hypocenter, is the location inside the Earth where an earthquake begins. Seismic energy spreads outward from this point." },
  { keywords: ["epicenter", "epicentre"], answer: "The epicenter is the point on the Earth's surface directly above an earthquake's focus. Areas closer to the epicenter may experience stronger shaking, although local conditions also matter." },
  { keywords: ["seismic wave", "seismic waves", "p wave", "s wave"], answer: "Seismic waves are vibrations that carry earthquake energy through the Earth. The main types include P-waves, S-waves, and surface waves." },
  { keywords: ["prepare", "preparation", "before earthquake", "before an earthquake"], answer: "Prepare before an earthquake by securing heavy furniture, identifying safe places, preparing an emergency kit, planning family communication, and learning Drop, Cover, and Hold On." },
  { keywords: ["emergency kit", "survival kit", "emergency supplies"], answer: "An emergency kit should include drinking water, non-perishable food, a first-aid kit, a flashlight, batteries, essential medicines, a whistle, and important contact information." },
  { keywords: ["drop cover", "hold on", "during earthquake", "earthquake indoors"], answer: "If you are indoors during an earthquake, Drop, Cover, and Hold On. Get onto your hands and knees, protect your head and neck, take cover under sturdy furniture if possible, and hold on until the shaking stops." },
  { keywords: ["outdoors", "outside during earthquake"], answer: "If you are outdoors during an earthquake, move to an open area away from buildings, trees, streetlights, and power lines. Stay there until the shaking stops." },
  { keywords: ["car", "driving", "vehicle"], answer: "If you are driving during an earthquake, pull over safely away from buildings, bridges, trees, and power lines. Stay inside the vehicle until the shaking stops." },
  { keywords: ["aftershock", "aftershocks"], answer: "An aftershock is a smaller earthquake that occurs after a larger earthquake in the same general area. Aftershocks can happen repeatedly, so remain cautious and follow official safety instructions." },
  { keywords: ["after earthquake", "after it stops", "after shaking"], answer: "After an earthquake, check yourself and others for injuries, expect aftershocks, avoid damaged buildings, check for hazards, and listen to official emergency updates." },
  { keywords: ["tsunami", "sea wave", "ocean wave"], answer: "A tsunami is a series of powerful ocean waves that can be generated by underwater earthquakes, landslides, or volcanic activity. After strong or long coastal shaking, move to higher ground or inland and follow official evacuation instructions." },
  { keywords: ["predict", "prediction", "predictable"], answer: "Scientists cannot currently predict the exact time, location, and magnitude of an earthquake. However, they can study seismic activity, identify active faults, and assess earthquake hazards." },
  { keywords: ["damage", "consequence", "effects", "impact"], answer: "Earthquakes can cause structural damage, ground shaking, landslides, fires, infrastructure disruption, and sometimes tsunamis. Their impacts depend on magnitude, depth, location, and building conditions." },
  { keywords: ["safe place", "safest place"], answer: "During an earthquake, choose a location away from windows and heavy objects that could fall. If indoors, take cover under sturdy furniture and protect your head and neck." },
  { keywords: ["tecton plates", "tecton mascot"], answer: "I'm Tecton! My mission is to make earthquake science and preparedness easier to understand. Ask me about earthquake causes, safety measures, aftershocks, and more!" },
  { keywords: ["myanmar", "burma"], answer: "Myanmar is exposed to earthquake hazards because it lies near active tectonic plate boundaries, including the Sagaing Fault. Understanding local risks and preparing in advance can help communities improve their safety." },
  { keywords: ["hello", "hi", "hey", "greetings"], answer: "Hello there! Welcome to WakeyQuakey. I'm Tecton, and I'm ready to answer your earthquake-related questions. What would you like to explore?" },
  { keywords: ["thank you", "thanks"], answer: "You're welcome! Remember, knowledge is today, preparedness is tomorrow. Keep learning with WakeyQuakey!" }
];

const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBody = document.getElementById('chat-body');
const suggestionButtons = document.querySelectorAll('.suggestion');

function addMessage(message, sender) {
  const wrapper = document.createElement('div');
  wrapper.className = sender === 'bot' ? 'message bot-message' : 'message user-message';
  const content = document.createElement('div');
  content.className = 'message-content';
  content.textContent = message;
  wrapper.appendChild(content);
  chatBody.appendChild(wrapper);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function getBotResponse(userMessage) {
  const message = userMessage.toLowerCase().trim();
  for (const item of faqData) {
    if (item.keywords.some(keyword => message.includes(keyword))) return item.answer;
  }
  return "That's an interesting question! I can currently help with earthquake causes, tectonic plates, magnitude, preparation, emergency kits, aftershocks, tsunamis, and earthquake safety. Try asking me about one of these topics!";
}

function sendMessage(message) {
  const cleaned = message.trim();
  if (!cleaned) return;
  addMessage(cleaned, 'user');
  userInput.value = '';
  const typing = document.createElement('div');
  typing.className = 'message bot-message';
  typing.id = 'typing-indicator';
  typing.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
  chatBody.appendChild(typing);
  chatBody.scrollTop = chatBody.scrollHeight;
  setTimeout(() => {
    document.getElementById('typing-indicator')?.remove();
    addMessage(getBotResponse(cleaned), 'bot');
  }, 700);
}

chatForm?.addEventListener('submit', (e) => { e.preventDefault(); sendMessage(userInput.value); });
suggestionButtons.forEach(btn => btn.addEventListener('click', () => sendMessage(btn.dataset.question)));
document.getElementById('subscribeForm')?.addEventListener('submit', (e) => { e.preventDefault(); showToast('Subscribed to seismic alerts!'); e.target.reset(); });
updateNavbarAuth();
