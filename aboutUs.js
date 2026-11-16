const navContainer = document.getElementById('navLinksContainer');
const navLinks = document.querySelectorAll('.nav-link');
const hoverPill = document.getElementById('hoverPill');
const activeUnderline = document.getElementById('activeUnderline');

function moveUnderline(targetLink) {
  if (!targetLink) return;
  const pad = 18;
  activeUnderline.style.width = `${targetLink.offsetWidth - pad * 2}px`;
  activeUnderline.style.transform = `translateX(${targetLink.parentElement.offsetLeft + pad}px)`;
}

function moveHoverPill(targetLink) {
  hoverPill.style.width = `${targetLink.offsetWidth}px`;
  hoverPill.style.transform = `translate(${targetLink.parentElement.offsetLeft}px, -50%)`;
  hoverPill.style.opacity = '1';
}

function initActiveState() {
  const currentActive = document.querySelector('.nav-link.active');
  if (currentActive) moveUnderline(currentActive);
}

window.addEventListener('load', initActiveState);
window.addEventListener('resize', initActiveState);

navLinks.forEach(link => {
  link.addEventListener('mouseenter', () => moveHoverPill(link));
});

navContainer.addEventListener('mouseleave', () => {
  hoverPill.style.opacity = '0';
});


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
  if (tab === 'signin') {
    tabIndicator.style.transform = 'translateX(0%)';
    signinForm.classList.add('active');
    signupForm.classList.remove('active');
  } else {
    tabIndicator.style.transform = 'translateX(100%)';
    signupForm.classList.add('active');
    signinForm.classList.remove('active');
  }
}

function updateNavbarAuth() {
  const savedUser = JSON.parse(localStorage.getItem('wq_current_user'));
  if (savedUser) {
    const firstName = savedUser.name.split(' ');
    navAuth.innerHTML = `
      <button type="button" class="btn-profile" id="profileMenuBtn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
        <span>${firstName}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div class="profile-dropdown" id="profileDropdown">
        <a href="profile.html">View Profile</a>
        <button type="button" class="logout-btn" id="logoutBtn">Log Out</button>
      </div>
    `;
  } else {
    navAuth.innerHTML = `<button type="button" class="btn-signin" id="openModalBtn">Sign In</button>`;
  }
}

document.addEventListener('click', (e) => {
  if (e.target.closest('#openModalBtn')) {
    e.preventDefault();
    switchTab('signin');
    modalOverlay.classList.add('open');
    return;
  }

  if (e.target.closest('#closeModalBtn') || e.target === modalOverlay) {
    modalOverlay.classList.remove('open');
    return;
  }

  const tabTarget = e.target.closest('.tab-btn')?.dataset.tab || e.target.closest('[data-switch]')?.dataset.switch;
  if (tabTarget) {
    e.preventDefault();
    switchTab(tabTarget);
    return;
  }

  if (e.target.closest('#profileMenuBtn')) {
    document.getElementById('profileDropdown')?.classList.toggle('open');
    return;
  }

  if (e.target.closest('#logoutBtn')) {
    localStorage.removeItem('wq_current_user');
    updateNavbarAuth();
    showToast('Signed out successfully');
    return;
  }

  const dropdown = document.getElementById('profileDropdown');
  if (dropdown && !e.target.closest('#navAuth')) {
    dropdown.classList.remove('open');
  }
});


const eyeOpen = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
const eyeClosed = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';

document.querySelectorAll('.toggle-pw').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);
    const hidden = input.type === 'password';
    input.type = hidden ? 'text' : 'password';
    btn.innerHTML = hidden ? eyeClosed : eyeOpen;
  });
});


signupForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim().toLowerCase();
  const password = document.getElementById('signupPassword').value;
  const confirm = document.getElementById('signupConfirm').value;

  if (password !== confirm) {
    showToast('Passwords do not match!', true);
    return;
  }

  const users = JSON.parse(localStorage.getItem('wq_users_db')) || [];
  if (users.some(u => u.email === email)) {
    showToast('Email already registered.', true);
    return;
  }

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

  if (!match) {
    showToast('Invalid email or password.', true);
    return;
  }

  localStorage.setItem('wq_current_user', JSON.stringify(match));
  updateNavbarAuth();
  signinForm.reset();
  modalOverlay.classList.remove('open');
  showToast(`Welcome back, ${match.name}!`);
});

function socialLogin(provider) {
  const user = { name: `${provider} User`, email: `user@${provider.toLowerCase()}.com` };
  localStorage.setItem('wq_current_user', JSON.stringify(user));
  updateNavbarAuth();
  modalOverlay.classList.remove('open');
  showToast(`Signed in with ${provider}!`);
}

document.getElementById('forgotPwLink')?.addEventListener('click', () => {
  showToast('Password reset link sent if email exists.');
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), idx * 70);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

document.getElementById('subscribeForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('subEmail');
  if (input.value.trim()) {
    showToast('Subscribed to WakeyQuakey seismic alerts!');
    input.value = '';
  }
});

updateNavbarAuth();

