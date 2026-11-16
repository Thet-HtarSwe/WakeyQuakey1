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
      if (tab === 'signin') {
        tabIndicator.style.transform = 'translateX(0%)';
        signinForm?.classList.add('active');
        signupForm?.classList.remove('active');
      } else {
        tabIndicator.style.transform = 'translateX(100%)';
        signupForm?.classList.add('active');
        signinForm?.classList.remove('active');
      }
    }

    function updateNavbarAuth() {
      const user = JSON.parse(localStorage.getItem('wq_current_user'));
      if (user) {
        const firstName = user.name.split(' ')[0];
        navAuth.innerHTML = `
          <button type="button" class="btn-profile" id="profileMenuBtn">
            <span>${firstName}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <div class="profile-dropdown" id="profileDropdown">
            <a href="profile.html">View Profile</a>
            <button type="button" class="logout-btn" id="logoutBtn">Log Out</button>
          </div>`;
      } else {
        navAuth.innerHTML = `<button type="button" class="btn-signin" id="openModalBtn">Sign In</button>`;
      }
    }

    document.addEventListener('click', (e) => {
      if (e.target.closest('#openModalBtn')) { switchTab('signin'); modalOverlay.classList.add('open'); return; }
      if (e.target.closest('#closeModalBtn') || e.target === modalOverlay) { modalOverlay.classList.remove('open'); return; }
      const tabTarget = e.target.closest('.tab-btn')?.dataset.tab || e.target.closest('[data-switch]')?.dataset.switch;
      if (tabTarget) { switchTab(tabTarget); return; }
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
      const confirm = document.getElementById('signupConfirm').value;
      if (password !== confirm) { showToast('Passwords do not match!', true); return; }
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

    function socialLogin(provider) {
      const user = { name: `${provider} User`, email: `user@${provider.toLowerCase()}.com` };
      localStorage.setItem('wq_current_user', JSON.stringify(user));
      updateNavbarAuth();
      modalOverlay.classList.remove('open');
      showToast(`Signed in with ${provider}!`);
    }

   
    document.getElementById('subscribeForm')?.addEventListener('submit', (e) => { e.preventDefault(); showToast('Subscribed to seismic alerts!'); e.target.reset(); });

    updateNavbarAuth();