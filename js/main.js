document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const menuBtn = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const menuIcon = menuBtn.querySelector('i');

    function toggleMenu() {
        mobileMenu.classList.toggle('active');
        
        // Swap icon between list and X
        if (mobileMenu.classList.contains('active')) {
            menuIcon.classList.remove('ph-list');
            menuIcon.classList.add('ph-x');
        } else {
            menuIcon.classList.remove('ph-x');
            menuIcon.classList.add('ph-list');
        }
    }

    menuBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });

    // --- Scroll Reveal Animations (Optional Enhancement) ---
    // A simple Intersection Observer to fade elements in as they scroll into view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animateElements = document.querySelectorAll('.portal-card, .curriculum-text, .glass-card, .stat-item, .cta-container');
    
    // Set initial state for elements
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
    
    // Stagger animation for grid items based on index if desired
    const portalCards = document.querySelectorAll('.portal-card');
    portalCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // --- Hero Carousel Animation ---
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 6000); // Change image every 6 seconds to allow for 1.5s fade
    }

    // --- Authentication UI Handling ---
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (tabLogin && tabRegister) {
        tabLogin.addEventListener('click', () => {
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
            loginForm.style.display = 'flex';
            registerForm.style.display = 'none';
        });

        tabRegister.addEventListener('click', () => {
            tabRegister.classList.add('active');
            tabLogin.classList.remove('active');
            registerForm.style.display = 'flex';
            loginForm.style.display = 'none';
        });
    }

    // --- API Authentication Logic ---
    const authMessage = document.getElementById('authMessage');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = loginForm.querySelector('button[type="submit"]');
            btn.innerHTML = 'Connecting... <i class="ph-bold ph-spinner ph-spin"></i>';
            btn.disabled = true;

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                
                if (res.ok) {
                    authMessage.innerHTML = '<strong>Success!</strong> Logging you in...';
                    authMessage.className = 'form-message success';
                    // Store token typically here: localStorage.setItem('token', data.token);
                    setTimeout(() => alert('Welcome ' + data.user.name + '! Redirecting to dashboard...'), 1000);
                } else {
                    authMessage.textContent = data.error || 'Login failed.';
                    authMessage.className = 'form-message error';
                }
            } catch (err) {
                authMessage.textContent = 'Server connection error.';
                authMessage.className = 'form-message error';
            } finally {
                btn.disabled = false;
                btn.innerHTML = 'Access Portal <i class="ph-bold ph-sign-in"></i>';
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = registerForm.querySelector('button[type="submit"]');
            btn.innerHTML = 'Creating... <i class="ph-bold ph-spinner ph-spin"></i>';
            btn.disabled = true;
            
            const messageEl = document.getElementById('registerMessage') || authMessage;

            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const role = document.getElementById('regRole') ? document.getElementById('regRole').value : 'teacher';
            const password = document.getElementById('regPassword').value;

            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, role, password })
                });
                const data = await res.json();
                
                if (res.ok) {
                    messageEl.innerHTML = '<strong>Account Created!</strong> You can now log in.';
                    messageEl.className = 'form-message success';
                    setTimeout(() => {
                        messageEl.textContent = '';
                        tabLogin.click();
                    }, 2500);
                } else {
                    messageEl.textContent = data.error || 'Registration failed.';
                    messageEl.className = 'form-message error';
                }
            } catch (err) {
                messageEl.textContent = 'Server connection error.';
                messageEl.className = 'form-message error';
            } finally {
                btn.disabled = false;
                btn.innerHTML = 'Register Account <i class="ph-bold ph-user-plus"></i>';
            }
        });
    }

    // --- Privacy-Compliant Analytics & Cookie Consent ---
    const cookieBanner = document.getElementById('cookieConsent');
    const acceptBtn = document.getElementById('acceptCookies');
    const declineBtn = document.getElementById('declineCookies');

    // Check if consent was already given
    const consentStatus = localStorage.getItem('somoBloom_cookie_consent');

    if (!consentStatus && cookieBanner) {
        // Show banner after short delay
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    } else if (consentStatus === 'accepted') {
        initializeAnalytics();
    }

    if (acceptBtn && declineBtn && cookieBanner) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('somoBloom_cookie_consent', 'accepted');
            cookieBanner.classList.remove('show');
            setTimeout(() => { cookieBanner.style.display = 'none'; }, 400); // Wait for transition
            initializeAnalytics();
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem('somoBloom_cookie_consent', 'declined');
            cookieBanner.classList.remove('show');
            setTimeout(() => { cookieBanner.style.display = 'none'; }, 400); // Wait for transition
            console.log('User declined analytics tracking.');
        });
    }

    function initializeAnalytics() {
        // Mock Google Analytics Initialization with Privacy Flags
        console.group('Privacy-Compliant Analytics Initialized');
        console.log('Script loaded.');
        console.log('IP Anonymization: ACTIVE (anonymize_ip: true)');
        console.log('DNT Signals: Respected');
        console.log('Tracking user interactions...');
        console.groupEnd();
    }

    // --- Mock Login Behavior ---
    const loginBtns = document.querySelectorAll('.mock-login-btn');
    loginBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Authentication Required:\n\nThis landing page requires integration with your institution\'s somoBloom core backend database to process student/staff logins. Please connect the backend API.');
        });
    });
});
