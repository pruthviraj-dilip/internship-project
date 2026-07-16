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
        // SECTION 3: BAR RACE CHART
        // ========================================
        (function() {
            const container = document.getElementById('bar-race-container');
            const playBtn = document.getElementById('bar-race-play');
            if (!container) return;

            // Placeholder data - REPLACE with real NGO record later
            const treeData = [
                { year: 2000, trees: 1000 },
                { year: 2005, trees: 4000 },
                { year: 2010, trees: 8000 },
                { year: 2015, trees: 13000 },
                { year: 2020, trees: 19000 },
                { year: 2026, trees: 25000 }
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
        // SECTION 4: TREE SPECIES GRID
        // ========================================
        (function() {
            const speciesCircles = document.querySelectorAll('.species-circle');
            if (speciesCircles.length === 0) return;

            // Species data with names and placeholder info
            const speciesData = {
                'banyan': { name: 'Banyan', scientific: 'Ficus benghalensis' },
                'mango': { name: 'Mango', scientific: 'Mangifera indica' },
                'neem': { name: 'Neem', scientific: 'Azadirachta indica' },
                'tamarind': { name: 'Tamarind', scientific: 'Tamarindus indica' },
                'jackfruit': { name: 'Jackfruit', scientific: 'Artocarpus heterophyllus' },
                'chickoo': { name: 'Chickoo', scientific: 'Manilkara zapota' },
                'sandalwood': { name: 'Sandalwood', scientific: 'Santalum album' },
                'blackberry': { name: 'Blackberry', scientific: 'Rubus fruticosus' },
                'gulmohar': { name: 'Gulmohar', scientific: 'Delonix regia' },
                'bamboo': { name: 'Bamboo', scientific: 'Bambusa balcooa' },
                'ashoka': { name: 'Ashoka', scientific: 'Saraca asoca' },
                'custard-apple': { name: 'Custard Apple', scientific: 'Annona reticulata' },
                'aavla': { name: 'Aavla', scientific: 'Phyllanthus emblica' },
                'lemon': { name: 'Lemon', scientific: 'Citrus limon' },
                'arjun': { name: 'Arjun', scientific: 'Terminalia arjuna' },
                'palm': { name: 'Palm', scientific: 'Areca catechu' },
                'bottle-brush': { name: 'Bottle Brush', scientific: 'Callistemon viminalis' },
                'african-tulip': { name: 'African Tulip', scientific: 'Spathodea campanulata' }
            };

            // Add click handlers to circles
            speciesCircles.forEach(circle => {
                circle.addEventListener('click', () => {
                    const speciesKey = circle.dataset.species;
                    const species = speciesData[speciesKey];
                    if (species) {
                        openSpeciesLightbox(speciesKey, species);
                    }
                });
            });

            // Create species lightbox content element if not exists
            let speciesLightboxContent = document.getElementById('species-lightbox-content');
            if (!speciesLightboxContent) {
                speciesLightboxContent = document.createElement('div');
                speciesLightboxContent.id = 'species-lightbox-content';
                speciesLightboxContent.className = 'species-lightbox-content';
                document.body.appendChild(speciesLightboxContent);
            }

            function openSpeciesLightbox(key, species) {
                const lightbox = document.getElementById('lightbox');
                const lightboxImg = document.getElementById('lightbox-img');
                const lightboxContent = document.getElementById('species-lightbox-content');

                // Build the species display content
                lightboxContent.innerHTML = `
                    <div class="species-lightbox-image-container">
                        <!-- TODO: insert real photo of ${species.name} tree here -->
                        <div class="species-placeholder">
                            <i class="fas fa-tree"></i>
                            <span>${species.name}</span>
                        </div>
                    </div>
                    <div class="species-lightbox-info">
                        <h3>${species.name}</h3>
                        <p class="scientific-name">${species.scientific}</p>
                    </div>
                `;

                // Hide the img element and show our custom content
                lightboxImg.style.display = 'none';
                lightboxContent.style.display = 'block';

                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            // Override lightbox close to also reset display states
            const originalCloseLightbox = typeof closeLightbox === 'function' ? closeLightbox : null;
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
                { year: 2000, description: 'NGO Founded' },
                { year: 2007, description: 'First State and National Award' },
                { year: 2022, description: 'Launch of Talking Oxygen Park' },
                { year: 2025, description: '25,000 Saplings Planted' },
                { year: 2026, description: 'This Website Launches' }
            ];

            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'milestone-items';

            milestones.forEach((milestone, index) => {
                const item = document.createElement('div');
                // Alternating pattern: odd milestones (1,3,5) have year above/description below
                // even milestones (2,4) have description above/year below
                const isOdd = (index + 1) % 2 === 1;
                item.className = isOdd ? 'milestone-item milestone-odd' : 'milestone-item milestone-even';
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
                description: 'A growing collection of native tree knowledge, built for anyone curious enough to ask a question.',
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
                icon: 'fa-champagne-glasses'
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
            // Reset display states for both gallery images and species content
            lightboxImg.style.display = '';
            const speciesContent = document.getElementById('species-lightbox-content');
            if (speciesContent) {
                speciesContent.style.display = '';
            }
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

// impact-calculator
const CO2_PER_TREE = 22;
  const WATER_PER_TREE = 1500;
  const OXY_PER_TREE = 118;
  const OXY_PER_PERSON = 118;

  const VB_W = 420, VB_H = 340;
  const CX = 210, CY = 170;
  const OUTER_R = 108; // fixed boundary radius -- rings always grow/pack inside this, so leader lines never need to move

  // anchor angles (deg, 0=right/east, 90=down/south, 180=left/west, 270=up/north)
  const ANCHORS = {
    co2:   250,
    water: 355,
    oxy:   110
  };
  const LEADER_LEN = 46; // how far the line extends past the circle edge

  function pointOnCircle(angleDeg, r){
    const rad = angleDeg * Math.PI / 180;
    return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
  }

  function setupLeaders(){
    Object.entries(ANCHORS).forEach(([key, angle]) => {
      const inner = pointOnCircle(angle, OUTER_R);
      const outer = pointOnCircle(angle, OUTER_R + LEADER_LEN);
      const line = document.getElementById('line-' + key);
      line.setAttribute('x1', inner.x);
      line.setAttribute('y1', inner.y);
      line.setAttribute('x2', outer.x);
      line.setAttribute('y2', outer.y);

      const label = document.getElementById('lbl-' + key);
      label.style.left = (outer.x / VB_W * 100) + '%';
      label.style.top = (outer.y / VB_H * 100) + '%';
    });
  }

  const input = document.getElementById('treeInput');
  const svgRings = document.getElementById('rings');
  const outCo2 = document.getElementById('outCo2');
  const outWater = document.getElementById('outWater');
  const outOxy = document.getElementById('outOxy');
  const outPeople = document.getElementById('outPeople');
  const outPersonWord = document.getElementById('outPersonWord');

  const ringColors = ['#1B5E20', '#2E7D32', '#43A047', '#81C784'];

  function fmt(n){ return Math.round(n).toLocaleString('en-IN'); }

  function animateNumber(el, from, to, duration=500){
    const start = performance.now();
    function tick(now){
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(from + (to - from) * eased);
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function drawRings(n){
    svgRings.innerHTML = '';
    const ringCount = Math.min(9, Math.max(2, Math.round(2 + Math.log10(n + 1) * 2.4)));
    for(let i = ringCount; i >= 1; i--){
      const r = (OUTER_R / ringCount) * i;
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', 0);
      circle.setAttribute('cy', 0);
      circle.setAttribute('r', r);
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', ringColors[i % ringColors.length]);
      circle.setAttribute('stroke-width', i === ringCount ? 2 : 1);
      circle.setAttribute('opacity', 0.3 + (0.6 * (i / ringCount)));
      circle.style.transition = 'r 0.5s ease, opacity 0.5s ease';
      svgRings.appendChild(circle);
    }
    const core = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    core.setAttribute('cx', 0);
    core.setAttribute('cy', 0);
    core.setAttribute('r', 5);
    core.setAttribute('fill', '#1B5E20');
    svgRings.appendChild(core);
  }

  let prevCo2 = 0, prevWater = 0, prevOxy = 0, prevPeople = 0;

  function update(){
    let n = parseInt(input.value, 10);
    if(isNaN(n) || n < 1) n = 1;
    input.value = n;

    const co2 = n * CO2_PER_TREE;
    const water = n * WATER_PER_TREE;
    const oxy = n * OXY_PER_TREE;
    const people = oxy / OXY_PER_PERSON;

    animateNumber(outCo2, prevCo2, co2);
    animateNumber(outWater, prevWater, water);
    animateNumber(outOxy, prevOxy, oxy);
    animateNumber(outPeople, prevPeople, people);
    outPersonWord.textContent = Math.round(people) === 1 ? 'person' : 'people';

    prevCo2 = co2; prevWater = water; prevOxy = oxy; prevPeople = people;

    drawRings(n);
  }

  document.getElementById('inc').addEventListener('click', () => {
    input.value = (parseInt(input.value,10) || 0) + 1;
    update();
  });
  document.getElementById('dec').addEventListener('click', () => {
    input.value = Math.max(1, (parseInt(input.value,10) || 1) - 1);
    update();
  });
  input.addEventListener('input', update);
  document.querySelectorAll('.presets button').forEach(btn => {
    btn.addEventListener('click', () => {
      input.value = btn.dataset.val;
      update();
    });
  });

  setupLeaders();
  drawRings(1);
  update();

  // ========================================
  // DIAL A TREE - Step Navigation
  // ========================================
  const dialTreeSteps = [
      {
          title: "Call the number",
          body: "Dial the number listed on this page. Tell us you'd like to plant a tree — no forms, no advance booking required."
      },
      {
          title: "We schedule a visit",
          body: "Our team arranges a convenient time to come to your home or the location you choose."
      },
      {
          title: "Pick your tree",
          body: "Our team arrives and asks which tree or sapling you'd like — a species with personal meaning, or one we recommend for your soil and space."
      },
      {
          title: "We dig the hole",
          body: "Our team prepares the ground at the chosen spot, right at your location."
      },
      {
          title: "The tree is planted",
          body: "Your chosen tree or seed is planted directly into the prepared ground."
      },
      {
          title: "Watering",
          body: "The newly planted tree is watered thoroughly to help it take root."
      },
      {
          title: "Natural fertilizer & pesticide",
          body: "We apply organic fertilizer and pesticide prepared in-house at Nisarg Seva Samiti — no harsh chemicals."
      },
      {
          title: "Ground is closed",
          body: "The soil is closed back over the roots, and your tree is left ready to grow."
      },
      {
          title: "Ready to Call Us",
          body: "Call us on <a href='tel:9822523895' class='phone-link'>9822523895</a>"
      }
  ];

  let currentStep = 1;
  const totalSteps = dialTreeSteps.length;
  let isViewAllMode = false;

  // DOM Elements
  const stepNumber = document.getElementById('step-number');
  const stepTitle = document.getElementById('step-title');
  const stepBody = document.getElementById('step-body');
  const dialTreeSingle = document.getElementById('dial-tree-single');
  const dialTreeAll = document.getElementById('dial-tree-all');
  const stepPills = document.getElementById('step-pills');
  const viewAllBtn = document.getElementById('view-all-btn');
  const backBtn = document.getElementById('back-btn');
  const nextBtn = document.getElementById('next-btn');

  // Render all steps view
  function renderAllSteps() {
      dialTreeAll.innerHTML = dialTreeSteps.map((step, index) => {
          let bodyContent = step.body;
          if (index === 8) {
              bodyContent = "Call us on <a href='tel:9822523895' class='phone-link'>9822523895</a>";
          }
          return `
              <div class="all-step-item">
                  <span class="step-number">${index + 1}</span>
                  <h4 class="step-title">${step.title}</h4>
                  <p class="step-body">${bodyContent}</p>
              </div>
          `;
      }).join('');
  }

  // Update single step view
  function updateStep(stepNum) {
      currentStep = stepNum;
      const step = dialTreeSteps[stepNum - 1];

      stepNumber.textContent = stepNum;
      stepTitle.textContent = step.title;

      if (stepNum === 9) {
          stepBody.innerHTML = "Call us on <a href='tel:9822523895' class='phone-link'>9822523895</a>";
      } else {
          stepBody.textContent = step.body;
      }

      // Update pill states
      document.querySelectorAll('.step-pill').forEach((pill, idx) => {
          pill.classList.toggle('active', idx + 1 === stepNum);
      });

      // Update button visibility
      backBtn.style.display = stepNum === 1 ? 'none' : 'inline-block';

      if (stepNum === totalSteps) {
          nextBtn.textContent = 'Start over';
          nextBtn.classList.add('start-over-btn');
          stepPills.style.display = 'none';
      } else {
          nextBtn.textContent = 'Next';
          nextBtn.classList.remove('start-over-btn');
          stepPills.style.display = 'flex';
      }

      // Hide "View all steps" on steps 2-8
      viewAllBtn.style.display = stepNum === 1 ? 'inline-block' : 'none';
  }

  // Update controls visibility
  function updateControlsVisibility() {
      if (isViewAllMode) {
          stepPills.style.display = 'none';
          viewAllBtn.textContent = 'View step by step';
          backBtn.style.display = 'none';
          nextBtn.style.display = 'none';
      } else {
          updateStep(currentStep);
      }
  }

  // Pill click handlers
  document.querySelectorAll('.step-pill').forEach(pill => {
      pill.addEventListener('click', function() {
          const step = parseInt(this.dataset.step);
          if (!isViewAllMode) {
              updateStep(step);
          }
      });
  });

  // View all toggle
  viewAllBtn.addEventListener('click', function() {
      if (isViewAllMode) {
          // Collapse back to single step view
          isViewAllMode = false;
          dialTreeSingle.style.display = 'block';
          dialTreeAll.style.display = 'none';
          currentStep = 1;
          updateControlsVisibility();
      } else {
          // Expand to show all steps
          isViewAllMode = true;
          dialTreeSingle.style.display = 'none';
          dialTreeAll.style.display = 'flex';
          renderAllSteps();
          updateControlsVisibility();
      }
  });

  // Back button
  backBtn.addEventListener('click', function() {
      if (currentStep > 1) {
          updateStep(currentStep - 1);
      }
  });

  // Next/Start over button
  nextBtn.addEventListener('click', function() {
      if (currentStep === totalSteps) {
          // Start over - reset to step 1
          currentStep = 1;
          isViewAllMode = false;
          dialTreeSingle.style.display = 'block';
          dialTreeAll.style.display = 'none';
          nextBtn.classList.remove('start-over-btn');
          updateStep(1);
      } else {
          updateStep(currentStep + 1);
      }
  });