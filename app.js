// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '60px';
        navLinks.style.right = '0';
        navLinks.style.background = 'white';
        navLinks.style.width = '100%';
        navLinks.style.padding = '20px';
        navLinks.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
    });

    // Smooth Scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        });
    });

    // Stats Counter Animation
    function animateStats() {
        const stats = document.querySelectorAll('.stat-number');

        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCount = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target.toLocaleString();
                }
            };

            updateCount();
        });
    }

    // Trigger stats animation when section is visible
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    // Form submission (demo)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will contact you soon.');
            this.reset();
        });
    }

    // Impact Calculator
    const treeCountInput = document.getElementById('treeCount');
    const calculateBtn = document.getElementById('calculateBtn');
    const co2Result = document.getElementById('co2Result');
    const waterResult = document.getElementById('waterResult');
    const oxygenResult = document.getElementById('oxygenResult');

    // Tree impact calculations (per tree per year)
    const CO2_PER_TREE = 22; // kg of CO2 absorbed per year
    const WATER_PER_TREE = 1000; // gallons of water saved per year
    const OXYGEN_PER_TREE = 118; // kg of oxygen produced per year

    calculateBtn.addEventListener('click', calculateImpact);
    treeCountInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateImpact();
        }
    });

    function calculateImpact() {
        const treeCount = parseInt(treeCountInput.value);

        if (!treeCount || treeCount <= 0) {
            alert('Please enter a valid number of trees');
            return;
        }

        // Calculate impact
        const co2 = treeCount * CO2_PER_TREE;
        const water = treeCount * WATER_PER_TREE;
        const oxygen = treeCount * OXYGEN_PER_TREE;

        // Update results immediately
        co2Result.textContent = co2.toLocaleString();
        waterResult.textContent = water.toLocaleString();
        oxygenResult.textContent = oxygen.toLocaleString();
    }

    console.log('JavaScript loaded successfully!');
});