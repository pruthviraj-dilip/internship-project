// Smooth scroll to home section for logo click
function scrollToHome(event) {
    event.preventDefault();
    const homeSection = document.getElementById('home');
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const scrollPosition = homeSection.offsetTop - navbarHeight;

    window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
    });
}

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

    /* ========================================
       STATISTICS SECTION
       ======================================== */
    (function() {
        const statisticsSection = document.getElementById('statistics');
        if (!statisticsSection) return;

        // ========================================
        // IMPACT CALCULATOR
        // ========================================
        (function() {
            const calcSection = document.getElementById('impact-calculator-section');
            if (!calcSection) return;

            // Constants
            const CO2_PER_TREE = 22;
            const WATER_PER_TREE = 1500;
            const OXYGEN_PER_TREE = 118;
            const ANIMATION_DURATION = 500;

            // DOM Elements
            const treeInput = document.getElementById('calc-tree-input');
            const decreaseBtn = document.getElementById('calc-decrease-btn');
            const increaseBtn = document.getElementById('calc-increase-btn');
            const presetButtons = document.querySelectorAll('#impact-calculator-section .preset-btn');
            const treeRingsSvg = document.getElementById('calc-tree-rings-svg');

            // Result elements
            const co2Value = document.getElementById('calc-co2-value');
            const waterValue = document.getElementById('calc-water-value');
            const oxygenValue = document.getElementById('calc-oxygen-value');
            const oxygenCaption = document.getElementById('calc-oxygen-caption');

            // Mobile stat elements
            const mobileCo2 = document.getElementById('mobile-calc-co2');
            const mobileWater = document.getElementById('mobile-calc-water');
            const mobileOxygen = document.getElementById('mobile-calc-oxygen');

            // Track previous values for smooth animation
            let previousValues = { co2: 0, water: 0, oxygen: 0 };
            let currentDisplayedValues = { co2: 0, water: 0, oxygen: 0 };
            let animationFrame = null;

            // ========================================
            // CRITICAL: Number animation function that tracks previous values
            // ========================================
            function animateNumber(el, from, to, duration) {
                const start = performance.now();

                function tick(now) {
                    const progress = Math.min(1, (now - start) / duration);
                    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                    const currentValue = from + (to - from) * eased;
                    el.textContent = Math.round(currentValue).toLocaleString('en-IN');
                    if (progress < 1) {
                        animationFrame = requestAnimationFrame(tick);
                    }
                }
                requestAnimationFrame(tick);
            }

            function calculateValues(trees) {
                return {
                    co2: trees * CO2_PER_TREE,
                    water: trees * WATER_PER_TREE,
                    oxygen: trees * OXYGEN_PER_TREE
                };
            }

            function updateDisplay(trees, animate = true) {
                const values = calculateValues(trees);

                // Update mobile stats (no animation)
                mobileCo2.textContent = `${values.co2.toLocaleString('en-IN')} kg`;
                mobileWater.textContent = `${values.water.toLocaleString('en-IN')} L`;
                mobileOxygen.textContent = `${values.oxygen.toLocaleString('en-IN')} kg`;

                if (animate) {
                    // Animate from previous displayed values
                    animateNumber(co2Value, currentDisplayedValues.co2, values.co2, ANIMATION_DURATION);
                    animateNumber(waterValue, currentDisplayedValues.water, values.water, ANIMATION_DURATION);
                    animateNumber(oxygenValue, currentDisplayedValues.oxygen, values.oxygen, ANIMATION_DURATION);

                    // Update stored previous values after animation starts
                    previousValues = { ...currentDisplayedValues };
                } else {
                    // No animation - just set values directly
                    co2Value.textContent = values.co2.toLocaleString('en-IN');
                    waterValue.textContent = values.water.toLocaleString('en-IN');
                    oxygenValue.textContent = values.oxygen.toLocaleString('en-IN');
                }

                // Update stored current values
                currentDisplayedValues = { ...values };

                // Update oxygen caption with person count
                const peopleCount = Math.round(values.oxygen / 118);
                const personText = peopleCount === 1 ? 'person' : 'people';
                oxygenCaption.textContent = `Oxygen released, roughly enough for ${peopleCount} ${personText}/yr`;
            }

            function drawTreeRings(trees) {
                const svgNS = "http://www.w3.org/2000/svg";
                const centerX = 175;
                const centerY = 175;
                const outerRadius = 140;
                const innerRadius = 30;

                treeRingsSvg.innerHTML = '';

                // Background circle
                const bgCircle = document.createElementNS(svgNS, 'circle');
                bgCircle.setAttribute('cx', centerX);
                bgCircle.setAttribute('cy', centerY);
                bgCircle.setAttribute('r', outerRadius);
                bgCircle.setAttribute('fill', '#E8F5E9');
                treeRingsSvg.appendChild(bgCircle);

                // Ring count (logarithmic scale as specified)
                const ringCount = Math.min(9, Math.max(2, Math.round(2 + Math.log10(trees + 1) * 2.4)));
                const ringStep = (outerRadius - innerRadius) / ringCount;

                for (let i = 0; i < ringCount; i++) {
                    const radius = outerRadius - (i * ringStep);
                    const ring = document.createElementNS(svgNS, 'circle');
                    ring.setAttribute('cx', centerX);
                    ring.setAttribute('cy', centerY);
                    ring.setAttribute('r', radius);
                    ring.setAttribute('fill', 'none');
                    ring.setAttribute('stroke', '#2E7D32');
                    ring.setAttribute('stroke-width', '2');
                    ring.setAttribute('opacity', '0.6');
                    treeRingsSvg.appendChild(ring);
                }

                // Center circle
                const centerCircle = document.createElementNS(svgNS, 'circle');
                centerCircle.setAttribute('cx', centerX);
                centerCircle.setAttribute('cy', centerY);
                centerCircle.setAttribute('r', innerRadius);
                centerCircle.setAttribute('fill', '#1B5E20');
                treeRingsSvg.appendChild(centerCircle);

                // Center text
                const centerText = document.createElementNS(svgNS, 'text');
                centerText.setAttribute('x', centerX);
                centerText.setAttribute('y', centerY + 5);
                centerText.setAttribute('text-anchor', 'middle');
                centerText.setAttribute('fill', '#fff');
                centerText.setAttribute('font-size', '14');
                centerText.setAttribute('font-weight', '700');
                centerText.textContent = trees >= 1000 ? `${(trees/1000).toFixed(1)}k` : trees;
                treeRingsSvg.appendChild(centerText);

                // Leader lines using trigonometry on fixed outer radius
                // Angles: 250° (CO2 - top), 355° (Water - right), 110° (Oxygen - bottom)
                const angles = [
                    250 * (Math.PI / 180),  // CO2 - pointing up
                    355 * (Math.PI / 180), // Water - pointing right
                    110 * (Math.PI / 180)  // Oxygen - pointing down
                ];

                angles.forEach(angle => {
                    const x1 = centerX + outerRadius * Math.cos(angle);
                    const y1 = centerY + outerRadius * Math.sin(angle);
                    const x2 = centerX + (outerRadius + 20) * Math.cos(angle);
                    const y2 = centerY + (outerRadius + 20) * Math.sin(angle);

                    const line = document.createElementNS(svgNS, 'line');
                    line.setAttribute('x1', x1);
                    line.setAttribute('y1', y1);
                    line.setAttribute('x2', x2);
                    line.setAttribute('y2', y2);
                    line.setAttribute('stroke', '#2E7D32');
                    line.setAttribute('stroke-width', '2');
                    line.setAttribute('stroke-dasharray', '5, 5');
                    line.setAttribute('opacity', '0.6');
                    treeRingsSvg.appendChild(line);
                });
            }

            function updatePresetButtons(trees) {
                presetButtons.forEach(btn => {
                    const value = parseInt(btn.dataset.value);
                    btn.classList.toggle('active', value === trees);
                });
            }

            function updateCalculator(trees) {
                updateDisplay(trees, true);
                drawTreeRings(trees);
                updatePresetButtons(trees);
            }

            // Initialize
            function init() {
                const initialTrees = parseInt(treeInput.value) || 1;
                updateDisplay(initialTrees, false); // No animation on initial load
                drawTreeRings(initialTrees);
                updatePresetButtons(initialTrees);

                // Event listeners
                decreaseBtn.addEventListener('click', () => {
                    let currentValue = parseInt(treeInput.value) || 1;
                    let newValue = Math.max(1, Math.min(10000, currentValue - 1));
                    treeInput.value = newValue;
                    updateCalculator(newValue);
                });

                increaseBtn.addEventListener('click', () => {
                    let currentValue = parseInt(treeInput.value) || 1;
                    let newValue = Math.max(1, Math.min(10000, currentValue + 1));
                    treeInput.value = newValue;
                    updateCalculator(newValue);
                });

                treeInput.addEventListener('input', () => {
                    let value = parseInt(treeInput.value) || 1;
                    value = Math.max(1, Math.min(10000, value));
                    treeInput.value = value;
                    updateCalculator(value);
                });

                treeInput.addEventListener('change', () => {
                    let value = parseInt(treeInput.value) || 1;
                    value = Math.max(1, Math.min(10000, value));
                    treeInput.value = value;
                    updateCalculator(value);
                });

                presetButtons.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const value = parseInt(btn.dataset.value);
                        treeInput.value = value;
                        updateCalculator(value);
                    });
                });
            }

            init();
        })();

        // ========================================
        // SECTION 3: BAR RACE CHART
        // (formerly Section 1, now Section 3 after Impact Calculator)
        // ========================================
        (function() {
            const container = document.getElementById('bar-race-container');
            const playBtn = document.getElementById('bar-race-play');
            if (!container) return;

            // Placeholder data - REPLACE with real NGO record later
            const treeData = [
                { year: 2021, trees: 800 },
                { year: 2022, trees: 2200 },
                { year: 2023, trees: 4100 },
                { year: 2024, trees: 7600 },
                { year: 2025, trees: 12500 },
                { year: 2026, trees: 19000 }
            ];

            const maxTrees = Math.max(...treeData.map(d => d.trees));

            // Create bar elements
            treeData.forEach((data, index) => {
                const row = document.createElement('div');
                row.className = 'bar-race-row';
                row.innerHTML = `
                    <span class="bar-year">${data.year}</span>
                    <div class="bar-track">
                        <div class="bar-fill" data-index="${index}" data-target="${data.trees}">
                            <span class="bar-value">0</span>
                        </div>
                    </div>
                `;
                container.appendChild(row);
            });

            // Animation function
            function animateBars() {
                const bars = container.querySelectorAll('.bar-fill');
                const duration = 2000;
                const startTime = performance.now();

                bars.forEach(bar => {
                    const target = parseInt(bar.dataset.target);
                    const valueSpan = bar.querySelector('.bar-value');
                    const index = parseInt(bar.dataset.index);

                    function updateBar(currentTime) {
                        const elapsed = currentTime - startTime - (index * 300); // Stagger animation
                        if (elapsed < 0) {
                            requestAnimationFrame(updateBar);
                            return;
                        }

                        const progress = Math.min(elapsed / duration, 1);
                        const currentValue = Math.floor(progress * target);
                        const widthPercent = (currentValue / maxTrees) * 100;

                        bar.style.width = widthPercent + '%';
                        valueSpan.textContent = currentValue.toLocaleString();

                        if (progress < 1) {
                            requestAnimationFrame(updateBar);
                        } else {
                            valueSpan.textContent = target.toLocaleString();
                        }
                    }

                    requestAnimationFrame(updateBar);
                });
            }

            // Play button click
            if (playBtn) {
                playBtn.addEventListener('click', animateBars);
            }

            // Scroll-triggered animation
            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateBars();
                        statsObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            statsObserver.observe(container);
        })();

        // ========================================
        // SECTION 4: DONUT CHART
        // ========================================
        (function() {
            const canvas = document.getElementById('species-donut-chart');
            if (!canvas) return;

            // Placeholder data - REPLACE with real species data later
            const speciesData = {
                labels: ['Neem', 'Mango', 'Tulsi', 'Banyan', 'Other'],
                values: [34, 28, 18, 12, 8]
            };

            const colors = ['#2E7D32', '#4CAF50', '#FF9800', '#2196F3', '#9C27B0'];

            const ctx = canvas.getContext('2d');
            const chart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: speciesData.labels,
                    datasets: [{
                        data: speciesData.values,
                        backgroundColor: colors,
                        borderWidth: 0,
                        hoverOffset: 15
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    cutout: '60%',
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.label + ': ' + context.raw + '%';
                                }
                            }
                        }
                    }
                }
            });

            // Custom legend
            const legendContainer = document.getElementById('species-legend');
            if (legendContainer) {
                speciesData.labels.forEach((label, index) => {
                    const item = document.createElement('div');
                    item.className = 'legend-item';
                    item.innerHTML = `
                        <span class="legend-color" style="background: ${colors[index]}"></span>
                        <span class="legend-label">${label}</span>
                        <span class="legend-value">${speciesData.values[index]}%</span>
                    `;
                    legendContainer.appendChild(item);
                });
            }
        })();

        // ========================================
        // SECTION 5: BEFORE/AFTER SLIDER
        // ========================================
        (function() {
            const slider = document.getElementById('comparison-slider');
            const after = document.getElementById('comparison-after');
            const divider = document.getElementById('comparison-divider');

            if (!slider || !after || !divider) return;

            let isDragging = false;

            function updateSlider(x) {
                const rect = slider.getBoundingClientRect();
                let percentage = ((x - rect.left) / rect.width) * 100;
                percentage = Math.max(0, Math.min(100, percentage));

                after.style.width = percentage + '%';
                divider.style.left = percentage + '%';
            }

            // Mouse events
            divider.addEventListener('mousedown', (e) => {
                isDragging = true;
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    updateSlider(e.clientX);
                }
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });

            // Touch events for mobile
            divider.addEventListener('touchstart', (e) => {
                isDragging = true;
                e.preventDefault();
            });

            document.addEventListener('touchmove', (e) => {
                if (isDragging && e.touches[0]) {
                    updateSlider(e.touches[0].clientX);
                }
            });

            document.addEventListener('touchend', () => {
                isDragging = false;
            });

            // Click anywhere on slider to jump
            slider.addEventListener('click', (e) => {
                if (e.target === divider || divider.contains(e.target)) return;
                updateSlider(e.clientX);
            });
        })();

        // ========================================
        // SECTION 6: MILESTONE TIMELINE
        // ========================================
        (function() {
            const timeline = document.getElementById('milestone-timeline');
            if (!timeline) return;

            // Placeholder milestone data - REPLACE with real NGO History later
            const milestones = [
                { year: 2019, description: 'NGO Founded' },
                { year: 2021, description: '1000th tree' },
                { year: 2023, description: 'First District wide drive' },
                { year: 2025, description: '10000th tree planted' },
                { year: 2026, description: 'This website launches' }
            ];

            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'milestone-items';

            milestones.forEach((milestone, index) => {
                const item = document.createElement('div');
                item.className = 'milestone-item';
                item.innerHTML = `
                    <div class="milestone-dot"></div>
                    <div class="milestone-content">
                        <span class="milestone-year">${milestone.year}</span>
                        <span class="milestone-description">${milestone.description}</span>
                    </div>
                `;
                itemsContainer.appendChild(item);
            });

            timeline.appendChild(itemsContainer);
        })();

    })();

    /* ============================================
       History Section - Vintage Map Parallax Effect
       ============================================ */
    (function initHistoryParallax() {
        const historySection = document.querySelector('.history');
        const parallaxMap = document.querySelector('.parallax-map');

        if (!historySection || !parallaxMap) {
            console.log('History parallax elements not found');
            return;
        }

        // Check if user has replaced the placeholder
        if (parallaxMap.src.includes('YOUR_VINTAGE_MAP_IMAGE_URL_HERE')) {
            console.log('📍 Please replace the placeholder image URL in index.html for the vintage map background');
            parallaxMap.style.display = 'none';
            return;
        }

        let ticking = false;
        const parallaxIntensity = 0.3; // 30% of scroll speed - subtle effect
        const mobileParallaxIntensity = 0.15; // Reduced for mobile

        // Check if mobile device
        const isMobile = window.innerWidth <= 768;
        const intensity = isMobile ? mobileParallaxIntensity : parallaxIntensity;

        function updateParallax() {
            const sectionRect = historySection.getBoundingClientRect();
            const sectionTop = sectionRect.top;
            const sectionHeight = sectionRect.height;

            // Only animate when section is in viewport
            if (sectionTop < window.innerHeight && sectionTop > -sectionHeight) {
                // Calculate scroll offset relative to section position
                const scrollProgress = -sectionTop * intensity;

                // Apply transform with smooth easing
                parallaxMap.style.transform = `translateY(${scrollProgress}px)`;
            }

            ticking = false;
        }

        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }

        // Use passive listener for better performance
        window.addEventListener('scroll', onScroll, { passive: true });

        // Initial position
        updateParallax();

        console.log('✨ Vintage map parallax effect initialized');
    })();

    /* ========================================
       ABOUT PAGE - INITIATIVES MODAL
       ======================================== */
    (function initInitiativesModal() {
        const modal = document.getElementById('activity-modal');
        if (!modal) return;

        // Activity data with descriptions
        const activityData = {
            'yoga': {
                title: 'Morning Yoga at Oxygen Park',
                description: '5:30–7:00 AM daily, open to all residents, held right among the trees the community planted.',
                icon: 'fa-spa'
            },
            'tree-library': {
                title: 'Tree Academy (Tree Library)',
                description: 'Open every weekend for local students, covering 40+ native species. Free entry for school groups.',
                icon: 'fa-book-open'
            },
            'solar': {
                title: 'Solar Panels',
                description: 'Huge solar panels installed for the parks in sustainability.',
                icon: 'fa-solar-panel'
            },
            'drawing': {
                title: 'Drawing & Environmental Competitions',
                description: 'Drawing competitions and environmental-awareness contests for students, encouraging young people to engage creatively with nature.',
                icon: 'fa-palette'
            },
            'plantation': {
                title: 'Plantation Drives',
                description: 'A tree for a birthday. A tree for a wedding anniversary. And for families who\'ve lost someone, a tree planted by their children in remembrance. Alongside regular awareness drives throughout the year.',
                icon: 'fa-seedling'
            },
            'nursery': {
                title: 'Nursery',
                description: 'Small plants ready to be taken home.',
                icon: 'fa-leaf'
            },
            'gym': {
                title: 'Open Gym',
                description: 'Gym equipment for children and aged people to exercise.',
                icon: 'fa-dumbbell'
            },
            'festival': {
                title: 'Festival Celebrations',
                description: 'Celebrating Diwali, Holi and other festivals with locals.',
                icon: 'fa-party-horn'
            },
            'water': {
                title: 'Clean Drinking Water',
                description: 'Drinking water installed with the help of locals, without any government fund or CSR fund.',
                icon: 'fa-droplet'
            }
        };

        const modalOverlay = modal.querySelector('.modal-overlay');
        const modalClose = modal.querySelector('.modal-close');
        const modalIcon = modal.querySelector('.modal-icon i');
        const modalTitle = modal.querySelector('.modal-title');
        const modalDescription = modal.querySelector('.modal-description');
        const activityCircles = document.querySelectorAll('.activity-circle');

        // Open modal on circle click
        activityCircles.forEach(circle => {
            circle.addEventListener('click', () => {
                const activity = circle.dataset.activity;
                const data = activityData[activity];

                if (data) {
                    modalIcon.className = `fas ${data.icon}`;
                    modalTitle.textContent = data.title;
                    modalDescription.textContent = data.description;
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        // Close modal functions
        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        modalClose.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', closeModal);

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        console.log('✨ Initiatives modal initialized');
    })();

    /* ========================================
       LIGHTBOX - Photo Gallery Full Screen
       ======================================== */
    (function initLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxClose = document.getElementById('lightbox-close');
        const lightboxPrev = document.getElementById('lightbox-prev');
        const lightboxNext = document.getElementById('lightbox-next');
        const photoItems = document.querySelectorAll('.photo-item img');

        if (!lightbox || photoItems.length === 0) return;

        let currentIndex = 0;
        const totalPhotos = photoItems.length;

        // Open lightbox when clicking a photo
        photoItems.forEach((img, index) => {
            img.addEventListener('click', () => {
                currentIndex = index;
                openLightbox(img.src);
            });
        });

        function openLightbox(src) {
            lightboxImg.src = src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Enable scrolling
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + totalPhotos) % totalPhotos;
            lightboxImg.src = photoItems[currentIndex].src;
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % totalPhotos;
            lightboxImg.src = photoItems[currentIndex].src;
        }

        // Close button click
        lightboxClose.addEventListener('click', closeLightbox);

        // Navigation buttons
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrev();
        });

        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showNext();
        });

        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        });

        console.log('✨ Lightbox initialized');
    })();

    /* ========================================
       CONTACT PAGE - Chip Toggle Functionality
       ======================================== */
    (function initContactChips() {
        const chips = document.querySelectorAll('.chip');

        if (chips.length === 0) return;

        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                const isSelected = chip.dataset.selected === 'true';
                chip.dataset.selected = !isSelected;
                chip.classList.toggle('selected', !isSelected);
            });
        });

        console.log('✨ Contact page chips initialized');
    })();

    /* ========================================
       CONTACT PAGE - Volunteer Form Submission
       ======================================== */
    (function initVolunteerForm() {
        const form = document.getElementById('volunteer-form');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form inputs
            const inputs = form.querySelectorAll('.form-input');
            const name = inputs[0].value;
            const email = inputs[1].value;
            const phone = inputs[2].value;

            // Get selected chips
            const selectedChips = [];
            document.querySelectorAll('.chip.selected').forEach(chip => {
                selectedChips.push(chip.textContent);
            });

            // Simple validation
            if (selectedChips.length === 0) {
                alert('Please select at least one area of interest.');
                return;
            }

            // Log the data (in production, you would send this to a server)
            console.log('Volunteer Registration:', {
                name: name,
                email: email,
                phone: phone,
                interests: selectedChips
            });

            // Show success message
            alert('Thank you for registering as a volunteer! We will contact you soon.');

            // Reset form
            form.reset();
            document.querySelectorAll('.chip.selected').forEach(chip => {
                chip.dataset.selected = 'false';
                chip.classList.remove('selected');
            });
        });

        console.log('✨ Volunteer form initialized');
    })();

    console.log('JavaScript loaded successfully!');
});