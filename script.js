document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
});

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    document.getElementById('contactForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button');
        const responseDiv = document.getElementById('responseMessage');
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending...';
        
        try {
            const response = await fetch('https://manas.eu.org/CodeGenX/contact.php', {
                method: 'POST',
                body: new FormData(form)
            });
            
            const result = await response.json();
            
            responseDiv.textContent = result.message;
            responseDiv.className = result.success ? 'success-message' : 'error-message';
            
            if (result.success) form.reset();
            
        } catch (error) {
            responseDiv.textContent = 'An error occurred. Please try again.';
            responseDiv.className = 'error-message';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Message';
        }
    });