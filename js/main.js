/* ============================================================
   LONE STAR IRON DOORS — main.js

   TABLE OF CONTENTS
   -----------------
   1. Door Tab Switching
   2. Mobile Navigation
   3. Sticky Nav on Scroll
   4. Scroll Animations (IntersectionObserver)
   5. Contact Form Submission
   6. Utility: Active Nav Link Highlighting
============================================================ */


/* ============================================================
   1. DOOR TAB SWITCHING
   Toggles between Single and Double door panels
============================================================ */
function showDoorTab(type, clickedBtn) {
  // Hide all panels
  document.querySelectorAll('.door-panel').forEach(panel => {
    panel.classList.remove('active');
  });

  // Remove active from all tab buttons
  document.querySelectorAll('.door-tab').forEach(tab => {
    tab.classList.remove('active');
  });

  // Show the selected panel and mark button active
  document.getElementById('panel-' + type).classList.add('active');
  clickedBtn.classList.add('active');
}


/* ============================================================
   2. MOBILE NAVIGATION
   Toggles the hamburger menu open/closed
============================================================ */
function toggleMenu() {
  const navLinks = document.querySelector('.nav-links');
  const isOpen = navLinks.style.display === 'flex';

  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
}

function openMenu() {
  const navLinks = document.querySelector('.nav-links');
  Object.assign(navLinks.style, {
    display:      'flex',
    flexDirection:'column',
    position:     'fixed',
    top:          '72px',
    left:         '0',
    right:        '0',
    background:   'rgba(26,23,20,0.98)',
    padding:      '24px 32px',
    gap:          '20px',
    borderBottom: '1px solid rgba(201,169,110,0.2)',
    zIndex:       '99',
  });
}

function closeMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.style.display = 'none';
}

// Close menu when any nav link is clicked (smooth scroll to section)
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 900) {
      closeMenu();
    }
  });
});

// Close menu if window is resized to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) {
    const navLinks = document.querySelector('.nav-links');
    navLinks.removeAttribute('style'); // restore CSS control
  }
});


/* ============================================================
   3. STICKY NAV ON SCROLL
   Shrinks the nav height when user scrolls down
============================================================ */
const mainNav = document.getElementById('main-nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    mainNav.style.height = '60px';
  } else {
    mainNav.style.height = '72px';
  }
});


/* ============================================================
   4. SCROLL ANIMATIONS
   Fades elements up as they enter the viewport
============================================================ */
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger each element slightly for a cascade effect
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  }
);

// Observe all fade-up elements
document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));


/* ============================================================
   5. CONTACT FORM SUBMISSION
   
   HOW TO SWITCH PROVIDERS:
   - Formspree:  replace the fetch URL with your Formspree endpoint
   - Netlify:    add `netlify` attribute to <form> tag and remove this JS
   - Google Sheets: replace fetch URL with your Apps Script web app URL
============================================================ */
async function submitForm() {
  // --- Collect values ---
  const fields = {
    fname:    document.getElementById('fname').value.trim(),
    lname:    document.getElementById('lname').value.trim(),
    email:    document.getElementById('email').value.trim(),
    phone:    document.getElementById('phone').value.trim(),
    doortype: document.getElementById('doortype').value,
    design:   document.getElementById('design').value,
    message:  document.getElementById('message').value.trim(),
  };

  // --- Basic validation ---
  if (!fields.fname || !fields.email) {
    showFormMessage('error', 'Please fill in at least your name and email.');
    return;
  }
  if (!isValidEmail(fields.email)) {
    showFormMessage('error', 'Please enter a valid email address.');
    return;
  }

  // --- Show loading state ---
  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  try {
    // ----------------------------------------------------------------
    // OPTION A: Formspree (replace URL below with your endpoint)
    // ----------------------------------------------------------------
    const response = await fetch('https://formspree.io/f/xwvwrekv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(fields),
    });

    if (response.ok) {
      showFormMessage('success', `Thank you, ${fields.fname}! We'll be in touch soon.`);
      clearForm();
    } else {
      throw new Error('Server error');
    }

    // ----------------------------------------------------------------
    // OPTION B: Google Sheets (uncomment and replace URL below)
    // ----------------------------------------------------------------
    // const response = await fetch('https://script.google.com/YOUR_SCRIPT_URL', {
    //   method: 'POST',
    //   body: JSON.stringify(fields),
    // });
    // if (response.ok) {
    //   showFormMessage('success', `Thank you, ${fields.fname}! We'll be in touch soon.`);
    //   clearForm();
    // } else {
    //   throw new Error('Server error');
    // }

  } catch (err) {
    showFormMessage('error', 'Something went wrong. Please call us at (512) 770-7558.');
    console.error('Form error:', err);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send Inquiry →';
  }
}

// Helper: Validate email format
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Helper: Show a success or error message below the form
function showFormMessage(type, text) {
  // Remove any existing message
  const existing = document.getElementById('form-message');
  if (existing) existing.remove();

  const msg = document.createElement('p');
  msg.id = 'form-message';
  msg.textContent = text;
  msg.style.cssText = `
    margin-top: 16px;
    font-size: 13px;
    font-weight: 300;
    padding: 12px 16px;
    border-left: 3px solid ${type === 'success' ? '#c9a96e' : '#c0392b'};
    background: ${type === 'success' ? 'rgba(201,169,110,0.08)' : 'rgba(192,57,43,0.08)'};
    color: ${type === 'success' ? '#5a524a' : '#c0392b'};
  `;

  document.getElementById('submitBtn').after(msg);

  // Auto-remove after 6 seconds
  setTimeout(() => msg.remove(), 6000);
}

// Helper: Clear form fields after successful submission
function clearForm() {
  ['fname', 'lname', 'email', 'phone', 'message'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('doortype').value = '';
  document.getElementById('design').value = '';
}


/* ============================================================
   6. ACTIVE NAV LINK HIGHLIGHTING
   Highlights the nav link of the section currently in view
============================================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';  // reset all
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--gold)';
          }
        });
      }
    });
  },
  {
    threshold: 0.4,
  }
);

sections.forEach(section => sectionObserver.observe(section));
