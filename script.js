document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    const toggleMenu = () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', navLinks.classList.contains('active'));
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Close menu on ESC key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Smooth Scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100; // Adjust for fixed header height
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update URL hash without jumping
                history.pushState(null, null, this.href);
            }
        });
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const form = e.target;
            const submitBtn = form.querySelector('button');
            const responseDiv = document.getElementById('responseMessage');
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<div class="spinner"></div> Sending...';
            
            try {
                const formData = new FormData(form);
                
                // Add CSRF token validation
                const csrfToken = document.querySelector('[name="csrf_token"]').value;
                formData.append('csrf_token', csrfToken);

                const response = await fetch('https://manas.eu.org/CodeGenX/contact.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(formData),
                    redirect: 'error' // Prevent redirects
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                
                responseDiv.textContent = result.message;
                responseDiv.className = result.success ? 'success-message' : 'error-message';
                
                if (result.success) {
                    form.reset();
                    // Add animation for success message
                    responseDiv.style.animation = 'slideIn 0.3s ease-out';
                    setTimeout(() => {
                        responseDiv.style.animation = '';
                    }, 3000);
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                responseDiv.textContent = 'An error occurred. Please try again later.';
                responseDiv.className = 'error-message';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message';
            }
        });
    }

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach((section) => {
        observer.observe(section);
    });
});
