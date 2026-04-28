document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Navbar Scroll Effect
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.add('scrolled'); // keep background simple, actually let's just toggle
            if (window.scrollY === 0) {
                 header.classList.remove('scrolled');
            }
        }
    });

    // Run once on load
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    }

    // 2. Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    mobileMenuToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
        const icon = mobileMenuToggle.querySelector('i');
        if (mobileNav.classList.contains('open')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // 3. Scroll Animations (Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-up-element');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // 4. Counter Animation
    const counters = document.querySelectorAll('.counter');
    let hasAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // ms
                    const step = target / (duration / 16); // 60fps
                    let current = 0;

                    const updateCounter = () => {
                        current += step;
                        if (current < target) {
                            counter.innerText = Math.ceil(current) + (target > 1000 ? 'k' : '');
                             // A bit of formatting for visually large numbers if wanted. 
                             // Wait, target 10000 -> 10k is manual in HTML?
                             if (target === 10000) {
                                  counter.innerText = (Math.ceil(current) / 1000).toFixed(1) + 'k';
                             } else {
                                  counter.innerText = Math.ceil(current);
                             }
                            requestAnimationFrame(updateCounter);
                        } else {
                            if (target === 10000) {
                                counter.innerText = '10k+';
                            } else {
                                counter.innerText = target;
                            }
                        }
                    };
                    updateCounter();
                });
                hasAnimated = true;
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }

    // 5. Course Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.course-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            courseCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    // small animation trigger
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (mobileNav.classList.contains('open')) {
                    mobileMenuToggle.click();
                }

                window.scrollTo({
                    top: targetElement.offsetTop - 130, // offset for fixed header with banner
                    behavior: 'smooth'
                });
            }
        });
    });
    // 7. Course Modal Logic
    const courseModal = document.getElementById('courseModal');
    const closeModalBtn = document.getElementById('closeModal');
    const enrollBtns = document.querySelectorAll('.enroll-btn');

    const courses = {
        web: {
            title: "Web Development",
            icon: '<i class="fa-brands fa-react"></i>',
            duration: "6 Months",
            level: "Advanced",
            desc: "Become a professional full-stack developer. This course takes you from basic HTML to complex applications using the MERN stack.",
            syllabus: ["Advanced HTML5 & CSS3", "Modern JavaScript (ES6+)", "UI/UX with Figma", "React.js Framework", "Node.js & Express", "Database with MongoDB", "State Management", "Final Capstone Project"]
        },
        basic: {
            title: "Basic Computer Course",
            icon: '<i class="fa-solid fa-laptop-code"></i>',
            duration: "3 Months",
            level: "Beginner",
            desc: "The perfect starting point for your digital journey. Learn essential computer skills used in every workplace.",
            syllabus: ["Computer Fundamentals", "Windows OS Training", "MS Office (Word, Excel, PPT)", "Internet & Emailing", "Hindi & English Typing", "Basic Hardware Knowledge", "Cyber Security Basics", "Digital Documentation"]
        },
        tally: {
            title: "Tally with GST",
            icon: '<i class="fa-solid fa-calculator"></i>',
            duration: "4 Months",
            level: "Intermediate",
            desc: "Master the most popular accounting software. Learn industry-standard bookkeeping and taxation practices.",
            syllabus: ["Accounting Principles", "Inventory Management", "GST Implementation", "Tax Deduction at Source (TDS)", "Payroll Management", "Banking & Auditing", "Generating Reports", "Financial Analysis"]
        },
        design: {
            title: "Graphic Designing",
            icon: '<i class="fa-solid fa-pen-nib"></i>',
            duration: "6 Months",
            level: "Intermediate",
            desc: "Unleash your creativity and learn the tools to build stunning visual identities and digital art.",
            syllabus: ["Design Theory & Color", "Adobe Photoshop", "Adobe Illustrator", "Adobe InDesign", "Vector Art Creation", "Branding & Logo Design", "Print Media Design", "Social Media Graphics"]
        },
        excel: {
            title: "Advanced Excel",
            icon: '<i class="fa-solid fa-file-excel"></i>',
            duration: "2 Months",
            level: "Advanced",
            desc: "Go beyond basic spreadsheets. Learn to analyze data and automate business processes like a pro.",
            syllabus: ["Complex Formulas", "Pivot Tables & Charts", "Data Validation", "Lookups (VLOOKUP, XLOOKUP)", "Power Query Basics", "Macros & VBA Intro", "Dashboard Creation", "Financial Modeling"]
        },
        ai: {
            title: "AI & Emerging Tech",
            icon: '<i class="fa-solid fa-robot"></i>',
            duration: "8 Months",
            level: "Advanced",
            desc: "Step into the future of technology. Learn the foundations of AI and how to leverage modern tools.",
            syllabus: ["Python for Data Science", "Machine Learning Intro", "Neural Networks Basics", "Generative AI Tools", "Prompt Engineering", "Natural Language Processing", "AI Project Development", "Cloud Computing Basics"]
        }
    };

    function openModal(courseId) {
        const course = courses[courseId];
        if (!course) return;

        document.getElementById('modalTitle').innerText = course.title;
        document.getElementById('modalIcon').innerHTML = course.icon;
        document.getElementById('modalDuration').innerHTML = `<i class="fa-regular fa-clock"></i> ${course.duration}`;
        document.getElementById('modalLevel').innerText = course.level;
        document.getElementById('modalLevel').className = `level-badge ${course.level.toLowerCase()}`;
        document.getElementById('modalDesc').innerText = course.desc;

        // Syllabus
        const list = document.getElementById('syllabusList');
        list.innerHTML = '';
        course.syllabus.forEach(item => {
            const li = document.createElement('li');
            li.innerText = item;
            list.appendChild(li);
        });

        // WhatsApp Link
        const waMsg = encodeURIComponent(`Hello! I'm interested in the ${course.title} course at Devaashi Institute. Could you please provide more details?`);
        document.getElementById('waButton').href = `https://wa.me/919560427965?text=${waMsg}`;

        // Show Modal
        courseModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    }

    enrollBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const courseId = btn.getAttribute('data-course');
            openModal(courseId);
        });
    });

    closeModalBtn.addEventListener('click', () => {
        courseModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close on click outside
    courseModal.addEventListener('click', (e) => {
        if (e.target === courseModal) {
            closeModalBtn.click();
        }
    });
});
