const questions = [
  { question: "What should you do during an earthquake when you are indoors?", answers: ["Run towards the nearest window", "Drop, Cover, and Hold On", "Use the elevator to exit", "Stand near a bookshelf"], correct: 1 },
  { question: "Which place is generally safest during an earthquake?", answers: ["Near glass windows", "Under a sturdy table", "Beside a heavy cupboard", "On a balcony"], correct: 1 },
  { question: "What should you do if you are outdoors during an earthquake?", answers: ["Run inside a building", "Stand near electric poles", "Move to an open area", "Stand under trees"], correct: 2 },
  { question: "Which item should be included in an emergency kit?", answers: ["Video game console", "Emergency water and first-aid supplies", "Decorative items", "Expensive jewellery"], correct: 1 },
  { question: "What should you do immediately after an earthquake?", answers: ["Check for injuries and hazards", "Use damaged electrical equipment", "Enter damaged buildings", "Ignore official updates"], correct: 0 },
  { question: "Why should heavy furniture be secured?", answers: ["To improve decoration", "To prevent it from falling", "To save electricity", "To make rooms larger"], correct: 1 },
  { question: "What should you do if you are driving during an earthquake?", answers: ["Speed up immediately", "Stop in a safe location", "Drive under a bridge", "Park beside buildings"], correct: 1 },
  { question: "Which natural event can trigger a tsunami?", answers: ["A strong underwater earthquake", "A normal rainfall", "A seasonal breeze", "A cloudy afternoon"], correct: 0 },
  { question: "Why is an emergency communication plan important?", answers: ["To plan entertainment", "To help family members contact each other", "To avoid emergency services", "To predict exact earthquakes"], correct: 1 },
  { question: "What should you do if authorities issue an evacuation warning?", answers: ["Ignore the warning", "Wait until the situation worsens", "Follow official evacuation instructions", "Return to damaged buildings"], correct: 2 }
];
let currentQuestion = 0, score = 0, selectedAnswer = null, answerChecked = false;
const questionNumber = document.getElementById("question-number");
const percentage = document.getElementById("percentage");
const progress = document.getElementById("progress");
const questionText = document.getElementById("question");
const answersContainer = document.getElementById("answers");
const continueBtn = document.getElementById("continue-btn");

function loadQuestion() {
  const q = questions[currentQuestion];
  selectedAnswer = null;
  answerChecked = false;
  questionNumber.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  const percent = Math.round(((currentQuestion + 1) / questions.length) * 100);
  percentage.textContent = percent + "%";
  progress.style.width = percent + "%";
  questionText.textContent = q.question;
  answersContainer.innerHTML = "";

  q.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer";
    const span = document.createElement("span");
    span.textContent = String.fromCharCode(65 + index);
    button.appendChild(span);
    button.appendChild(document.createTextNode(answer));

    button.addEventListener("click", () => {
      if (answerChecked) return;
      document.querySelectorAll(".answer").forEach(btn => btn.classList.remove("selected"));
      button.classList.add("selected");
      selectedAnswer = index;
      continueBtn.disabled = false;
    });
    answersContainer.appendChild(button);
  });

  continueBtn.disabled = true;
  continueBtn.textContent = "Continue";
}

function checkAnswer() {
  const q = questions[currentQuestion];
  const answerButtons = document.querySelectorAll(".answer");
  answerChecked = true;

  answerButtons.forEach((button, index) => {
    button.disabled = true;
    button.classList.remove("selected");
    if (index === q.correct) button.classList.add("correct");
    if (index === selectedAnswer && selectedAnswer !== q.correct) {
      button.classList.add("wrong");
    }
  });

  if (selectedAnswer === q.correct) score++;
  continueBtn.textContent = (currentQuestion === questions.length - 1) ? "See Results" : "Next Question";
}
function showResults() {
  const finalPercentage = Math.round((score / questions.length) * 100);
  localStorage.setItem("wq_quiz_results", JSON.stringify({ score, total: questions.length, percentage: finalPercentage, date: new Date().toLocaleDateString() }));

  questionNumber.textContent = "Quiz Completed!";
  percentage.textContent = finalPercentage + "%";
  progress.style.width = "100%";
  questionText.style.display = "none";

  let feedback = "Keep practising! Review earthquake safety guidelines and try again.";
  if (finalPercentage >= 90) feedback = "Excellent! You have outstanding earthquake safety knowledge.";
  else if (finalPercentage >= 70) feedback = "Great job! You have a strong understanding of preparedness.";
  else if (finalPercentage >= 50) feedback = "Good effort! Keep learning and improving your knowledge.";

  answersContainer.innerHTML = `<div class="result"><h2>Your Results</h2><p>You scored <strong>${score}</strong> out of <strong>${questions.length}</strong> (${finalPercentage}%)!</p><p>${feedback}</p><button id="restart-btn" class="submit-btn" style="margin-top:20px;">Try Again</button></div>`;
  continueBtn.style.display = "none";
  document.getElementById("restart-btn").addEventListener("click", () => {
    currentQuestion = 0; score = 0; questionText.style.display = "block"; continueBtn.style.display = "inline-block"; loadQuestion();
  });
}

continueBtn.addEventListener("click", () => {
  if (!answerChecked) { checkAnswer(); return; }
  currentQuestion++;
  if (currentQuestion < questions.length) loadQuestion();
  else showResults();
});

const navContainer = document.getElementById("navLinksContainer"), hoverPill = document.getElementById("hoverPill");
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("mouseenter", () => { if (!hoverPill) return; hoverPill.style.width = `${link.offsetWidth}px`; hoverPill.style.transform = `translate(${link.parentElement.offsetLeft}px, -50%)`; hoverPill.style.opacity = "1"; });
});
navContainer?.addEventListener("mouseleave", () => { if (hoverPill) hoverPill.style.opacity = "0"; });

const toast = document.getElementById("toast"), toastMessage = document.getElementById("toastMessage");
let toastTimer;
function showToast(msg, isError = false) { toastMessage.textContent = msg; toast.classList.toggle("error", isError); toast.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 3200); }

const modalOverlay = document.getElementById("authModalOverlay"), navAuth = document.getElementById("navAuth"), tabBtns = document.querySelectorAll(".tab-btn"), tabIndicator = document.getElementById("tabIndicator"), signinForm = document.getElementById("signinForm"), signupForm = document.getElementById("signupForm");
function switchTab(tab) { tabBtns.forEach(b => b.classList.toggle("active", b.dataset.tab === tab)); tabIndicator.style.transform = tab === "signin" ? "translateX(0%)" : "translateX(100%)"; signinForm?.classList.toggle("active", tab === "signin"); signupForm?.classList.toggle("active", tab === "signup"); }
function updateNavbarAuth() { const user = JSON.parse(localStorage.getItem("wq_current_user")); navAuth.innerHTML = user ? `<button type="button" class="btn-profile" id="profileMenuBtn"><span>${user.name.split(" ")}</span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg></button><div class="profile-dropdown" id="profileDropdown"><a href="profile.html">View Profile</a><button type="button" class="logout-btn" id="logoutBtn">Log Out</button></div>` : `<button type="button" class="btn-signin" id="openModalBtn">Sign In</button>`; }

document.addEventListener("click", (e) => {
  if (e.target.closest("#openModalBtn")) { switchTab("signin"); modalOverlay.classList.add("open"); return; }
  if (e.target.closest("#closeModalBtn") || e.target === modalOverlay) { modalOverlay.classList.remove("open"); return; }
  const tabTarget = e.target.closest(".tab-btn")?.dataset.tab || e.target.closest("[data-switch]")?.dataset.switch;
  if (tabTarget) { switchTab(tabTarget); return; }
  const toggleBtn = e.target.closest(".toggle-pw");
  if (toggleBtn) { const inp = document.getElementById(toggleBtn.dataset.target); if (inp) inp.type = inp.type === "password" ? "text" : "password"; return; }
  if (e.target.closest("#profileMenuBtn")) { document.getElementById("profileDropdown")?.classList.toggle("open"); return; }
  if (e.target.closest("#logoutBtn")) { localStorage.removeItem("wq_current_user"); updateNavbarAuth(); showToast("Signed out successfully"); return; }
  if (!e.target.closest("#navAuth")) document.getElementById("profileDropdown")?.classList.remove("open");
});

signupForm?.addEventListener("submit", (e) => { e.preventDefault(); const name = document.getElementById("signupName").value.trim(), email = document.getElementById("signupEmail").value.trim().toLowerCase(), password = document.getElementById("signupPassword").value; if (password !== document.getElementById("signupConfirm").value) { showToast("Passwords do not match!", true); return; } const users = JSON.parse(localStorage.getItem("wq_users_db")) || []; if (users.some(u => u.email === email)) { showToast("Email already registered.", true); return; } users.push({ name, email, password }); localStorage.setItem("wq_users_db", JSON.stringify(users)); document.getElementById("loginEmail").value = email; signupForm.reset(); switchTab("signin"); showToast("Account created! Please sign in."); });
signinForm?.addEventListener("submit", (e) => { e.preventDefault(); const email = document.getElementById("loginEmail").value.trim().toLowerCase(), password = document.getElementById("loginPassword").value; const users = JSON.parse(localStorage.getItem("wq_users_db")) || []; const match = users.find(u => u.email === email && u.password === password); if (!match) { showToast("Invalid email or password.", true); return; } localStorage.setItem("wq_current_user", JSON.stringify(match)); updateNavbarAuth(); signinForm.reset(); modalOverlay.classList.remove("open"); showToast(`Welcome back, ${match.name}!`); });
window.socialLogin = (provider) => { localStorage.setItem("wq_current_user", JSON.stringify({ name: `${provider} User`, email: `user@${provider.toLowerCase()}.com` })); updateNavbarAuth(); modalOverlay.classList.remove("open"); showToast(`Signed in with ${provider}!`); };
document.getElementById("subscribe-form")?.addEventListener("submit", (e) => { e.preventDefault(); showToast("Thank you for subscribing!"); e.target.reset(); });
updateNavbarAuth(); loadQuestion();
