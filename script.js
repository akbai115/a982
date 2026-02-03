// ALONFILES — Minimal Interaction Script
// No autoplay, no loud motion, only subtle enhancements

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for navigation links
    // Unified Link Handler with Transitions
    const handleNavigation = (e) => {
        const link = e.currentTarget;
        const href = link.getAttribute('href');
        const target = link.getAttribute('target');

        // Ignore external links or empty links
        if (!href || href === '#' || target === '_blank' || href.startsWith('mailto:') || href.startsWith('tel:')) {
            return;
        }

        e.preventDefault();

        const overlay = document.querySelector('.screen-transition-overlay');

        // Start Transition
        if (overlay) {
            overlay.classList.remove('exit');
            overlay.classList.add('active');
        }

        setTimeout(() => {
            if (href.startsWith('#')) {
                // Internal Anchor Scroll
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const navHeight = document.querySelector('.top-bar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight - 40;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'auto' // Instant jump while hidden
                    });

                    // End Transition
                    setTimeout(() => {
                        if (overlay) {
                            overlay.classList.remove('active');
                            overlay.classList.add('exit');
                        }
                    }, 100);
                }
            } else {
                // Page Navigation
                window.location.href = href;
                // Note: The new page will load, so we don't need to manually remove the class 
                // UNLESS strictly SPA, but here we are navigating to new HTML files.
                // However, for immediate feedback if the load is fast or cached:
            }
        }, 400); // Match CSS transition duration
    };

    // Attach to all relevant links
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Handle "Back" navigation for transition reveal
    window.addEventListener('pageshow', (event) => {
        const overlay = document.querySelector('.screen-transition-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            overlay.classList.add('exit');
        }
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

    // Matrix Rain Removed for PUMPFILES Dossier Aesthetic
    // const initMatrixRain = () => { ... };

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
    // Typewriter Effect
    // Guard against multiple executions (e.g. double script loading)
    if (window.typewriterInitialized) return;
    window.typewriterInitialized = true;

    const typeWriterElements = document.querySelectorAll('.typewriter-text');

    function typeWriter(element, speed = 25) {
        // Clone the element to read its structure and content without modifying the live DOM yet
        const clone = element.cloneNode(true);
        // Clear the element
        element.innerHTML = '';
        element.style.visibility = 'visible'; // Reveal container

        let currentNodeIndex = 0;
        let charIndex = 0;
        const nodes = Array.from(clone.childNodes);

        function typeNode() {
            if (currentNodeIndex >= nodes.length) {
                // Done typing
                element.classList.remove('typing-active');
                return;
            }

            const node = nodes[currentNodeIndex];

            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                if (charIndex < text.length) {
                    // Safe append using TextNode to avoid innerHTML re-parsing issues
                    const char = text.charAt(charIndex);
                    if (element.lastChild && element.lastChild.nodeType === Node.TEXT_NODE) {
                        element.lastChild.nodeValue += char;
                    } else {
                        element.appendChild(document.createTextNode(char));
                    }

                    charIndex++;
                    setTimeout(typeNode, speed);
                } else {
                    currentNodeIndex++;
                    charIndex = 0;
                    setTimeout(typeNode, speed);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Construct the element in the live DOM
                const newElement = document.createElement(node.tagName);
                Array.from(node.attributes).forEach(attr => {
                    newElement.setAttribute(attr.name, attr.value);
                });

                element.appendChild(newElement);

                // Recurse
                typeWriterRecursive(newElement, node, speed, () => {
                    currentNodeIndex++;
                    charIndex = 0;
                    setTimeout(typeNode, speed);
                });
            } else {
                currentNodeIndex++;
                typeNode();
            }
        }

        // Start typing
        element.classList.add('typing-active');
        typeNode();
    }

    // Recursive helper
    function typeWriterRecursive(targetElement, sourceNode, speed, callback) {
        const childNodes = Array.from(sourceNode.childNodes);
        let childIndex = 0;
        let charIndex = 0;

        function typeChild() {
            if (childIndex >= childNodes.length) {
                if (callback) callback();
                return;
            }

            const node = childNodes[childIndex];

            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                if (charIndex < text.length) {
                    const char = text.charAt(charIndex);

                    if (targetElement.lastChild && targetElement.lastChild.nodeType === Node.TEXT_NODE) {
                        targetElement.lastChild.nodeValue += char;
                    } else {
                        targetElement.appendChild(document.createTextNode(char));
                    }

                    charIndex++;
                    setTimeout(typeChild, speed);
                } else {
                    childIndex++;
                    charIndex = 0;
                    setTimeout(typeChild, speed);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const newElement = document.createElement(node.tagName);
                Array.from(node.attributes).forEach(attr => {
                    newElement.setAttribute(attr.name, attr.value);
                });
                targetElement.appendChild(newElement);

                typeWriterRecursive(newElement, node, speed, () => {
                    childIndex++;
                    setTimeout(typeChild, speed);
                });
            } else {
                childIndex++;
                typeChild();
            }
        }

        typeChild();
    }

    // Observe and Trigger
    const typeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                // Double-check global dataset state
                if (!el.dataset.typed) {
                    el.dataset.typed = "true";
                    setTimeout(() => {
                        typeWriter(el, 15);
                    }, 200);
                }
                typeObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    typeWriterElements.forEach(el => {
        el.style.visibility = 'hidden';
        typeObserver.observe(el);
    });
});

// Prevent any accidental animations or transitions on page load
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
