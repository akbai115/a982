// ALONFILES — Minimal Interaction Script
// No autoplay, no loud motion, only subtle enhancements

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = document.querySelector('.top-bar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 40;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for timeline entries
    // Timeline Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.animation = `fadeInUp 0.6s ease forwards ${entry.target.dataset.delay || '0s'}`;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.timeline-entry').forEach((entry, index) => {
        entry.dataset.delay = `${index * 0.1}s`;
        observer.observe(entry);
    });

    // General Scroll Reveal Observer
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    });

    document.querySelectorAll('.reveal').forEach(element => {
        revealObserver.observe(element);
    });

    // Matrix Code Rain Effect
    const initMatrixRain = () => {
        const bg = document.createElement('div');
        bg.id = 'matrix-bg';
        document.body.prepend(bg);

        const columns = Math.floor(window.innerWidth / 15);
        const density = 0.05; // Very low density (only ~5% of possible columns)

        // Allowed characters (Katana + numbers + standard matrix-y glyphs)
        const chars = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ1234567890:・.=*+-<>';

        for (let i = 0; i < columns; i++) {
            // Only spawn in corners (first 15% and last 15% of screen width)
            if (i < columns * 0.15 || i > columns * 0.85) {
                if (Math.random() < density) {
                    const col = document.createElement('div');
                    col.className = 'matrix-column';

                    // Randomize string length
                    let len = Math.floor(Math.random() * 20) + 10;
                    let str = '';
                    for (let j = 0; j < len; j++) {
                        str += chars.charAt(Math.floor(Math.random() * chars.length)) + '<br>';
                    }
                    col.innerHTML = str;

                    // Random positioning and timing
                    col.style.left = (i * 15) + 'px';

                    const duration = Math.random() * 40 + 80; // Slow: 80-120s
                    col.style.animationDuration = duration + 's';

                    const delay = Math.random() * -100; // Start at random offsets
                    col.style.animationDelay = delay + 's';

                    bg.appendChild(col);
                }
            }
        }
    };

    // Initialize Matrix Rain
    initMatrixRain();

    // Update timestamp to current date
    const updateTimestamp = () => {
        const timestampElement = document.querySelector('.footer-timestamp');
        if (timestampElement) {
            const now = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = now.toLocaleDateString('en-US', options);
            timestampElement.textContent = `Last updated: ${formattedDate}`;
        }
    };

    updateTimestamp();

    // Subtle fade-in for hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }

    // Add active state to navigation based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinksArray = Array.from(document.querySelectorAll('.nav-link'));

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinksArray.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${current}`) {
                link.style.color = 'var(--color-accent)';
            }
        });
    });
});

// Prevent any accidental animations or transitions on page load
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
