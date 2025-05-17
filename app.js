// Generate scattered rotating "FLAME" texts in background
const flameTextBg = document.querySelector('.flames-text-background');
const flameWord = 'FLAME';
const flameCount = 20; // number of scattered texts

for (let i = 0; i < flameCount; i++) {
  const span = document.createElement('span');
  span.className = 'flames-text';
  span.textContent = flameWord;
  
  // Random position within viewport
  span.style.top = `${Math.random() * 100}vh`;
  span.style.left = `${Math.random() * 100}vw`;
  
  // Random animation delay so they don't rotate in sync
  span.style.animationDelay = `${Math.random() * 8}s, ${Math.random() * 4}s`;
  
  // Random font size between 16px and 40px for variety
  span.style.fontSize = `${16 + Math.random() * 24}px`;
  
  flameTextBg.appendChild(span);
}

// Toggle between login and signup forms
const toggleLink = document.getElementById('toggle-link');
const formTitle = document.getElementById('form-title');
const authForm = document.getElementById('auth-form');
const submitBtn = document.getElementById('submit-btn');

let isLogin = true;

toggleLink.addEventListener('click', e => {
  e.preventDefault();
  isLogin = !isLogin;

  if (isLogin) {
    formTitle.textContent = 'Login';
    submitBtn.textContent = 'Log In';
    toggleLink.textContent = "Don't have an account? Sign Up";

    // Remove confirm password if exists
    const confirmPassInput = document.getElementById('confirm-password');
    if (confirmPassInput) confirmPassInput.remove();
  } else {
    formTitle.textContent = 'Sign Up';
    submitBtn.textContent = 'Sign Up';
    toggleLink.textContent = 'Already have an account? Log In';

    // Add confirm password input
    if (!document.getElementById('confirm-password')) {
      const confirmPassInput = document.createElement('input');
      confirmPassInput.type = 'password';
      confirmPassInput.id = 'confirm-password';
      confirmPassInput.placeholder = 'Confirm Password';
      confirmPassInput.required = true;
      authForm.insertBefore(confirmPassInput, submitBtn);
    }
  }
});

// Example form submission handler (does nothing real here)
authForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = authForm.email.value.trim();
  const password = authForm.password.value.trim();

  if (!email || !password) {
    alert('Please fill all fields!');
    return;
  }

  if (!isLogin) {
    const confirmPass = authForm['confirm-password'].value.trim();
    if (password !== confirmPass) {
      alert('Passwords do not match!');
      return;
    }
  }

  alert(`${isLogin ? 'Logging in' : 'Signing up'} with email: ${email}`);
});


document.querySelectorAll('.flames-text').forEach(flame => {
  // Random duration between 6s and 12s
  const duration = (Math.random() * 6 + 6).toFixed(2);
  // Random delay between 0 and duration
  const delay = (Math.random() * duration).toFixed(2);
  // Random direction: normal or reverse
  const direction = Math.random() > 0.5 ? 'normal' : 'reverse';

  flame.style.animationDuration = `${duration}s`;
  flame.style.animationDelay = `-${delay}s`; // negative delay to start at a random point in animation
  flame.style.animationDirection = direction;
});
