 // Add some basic interactivity for demonstrations
 document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                // Account for sticky header on mobile
                const offset = window.innerWidth <= 768 ? 80 : 100;
                const elementPosition = targetElement.offsetTop - offset;
                window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add interactive effects to flex items (touch and mouse)
    document.querySelectorAll('.flex-item').forEach(item => {
        // Mouse events for desktop
        item.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) { // Only on desktop
                this.style.transform = 'scale(1.05)';
                this.style.transition = 'transform 0.2s ease';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) { // Only on desktop
                this.style.transform = 'scale(1)';
            }
        });

        // Touch events for mobile
        item.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
            this.style.transition = 'transform 0.1s ease';
        });

        item.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Mobile navigation collapse/expand functionality
    addMobileNavigationSupport();

    // Improve table scrolling on mobile
    improveMobileTableExperience();

    // Add viewport resize handler for responsive adjustments
    window.addEventListener('resize', handleViewportResize);
});

// Print functionality
function printLesson() {
    // Add a print note at the beginning
    const printNote = document.createElement('div');
    printNote.className = 'print-note';
    printNote.innerHTML = `
        <strong>📚 Flexbox Comprehensive Guide - Print Version</strong><br>
        This document contains all flexbox properties, examples, and reference materials for offline study.<br>
        Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
    `;
    
    // Insert the note at the beginning of main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertBefore(printNote, mainContent.firstChild);
    }

    // Show a brief message before printing
    const printBtn = document.getElementById('printBtn');
    const originalText = printBtn.innerHTML;
    printBtn.innerHTML = '🖨️ Preparing...';
    printBtn.disabled = true;

    // Small delay to ensure styles are applied
    setTimeout(() => {
        try {
            // Open print dialog
            window.print();
        } catch (error) {
            console.error('Print failed:', error);
            alert('Print failed. Please try using Ctrl+P or Cmd+P manually.');
        } finally {
            // Restore button and remove print note
            setTimeout(() => {
                printBtn.innerHTML = originalText;
                printBtn.disabled = false;
                
                // Remove the print note
                if (printNote && printNote.parentNode) {
                    printNote.parentNode.removeChild(printNote);
                }
            }, 1000);
        }
    }, 100);
}

// Add keyboard shortcut for printing (Ctrl+P / Cmd+P)
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        printLesson();
    }
});

// Mobile navigation support functions
function addMobileNavigationSupport() {
    // Add mobile menu toggle functionality
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            // Toggle the active state of the hamburger button
            this.classList.toggle('active');
            
            // Toggle the visibility of the navigation menu
            if (navLinks.classList.contains('mobile-visible')) {
                navLinks.classList.remove('mobile-visible');
                navLinks.classList.add('mobile-hidden');
                // Update aria-expanded for accessibility
                this.setAttribute('aria-expanded', 'false');
            } else {
                navLinks.classList.remove('mobile-hidden');
                navLinks.classList.add('mobile-visible');
                // Update aria-expanded for accessibility
                this.setAttribute('aria-expanded', 'true');
            }
        });

        // Close mobile menu when clicking on a navigation link
        const navLinksAll = navLinks.querySelectorAll('a');
        navLinksAll.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 767) {
                    navLinks.classList.remove('mobile-visible');
                    navLinks.classList.add('mobile-hidden');
                    mobileMenuToggle.classList.remove('active');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Close mobile menu when clicking outside of it
        document.addEventListener('click', function(event) {
            if (window.innerWidth <= 767) {
                const isClickInsideNav = navLinks.contains(event.target);
                const isClickOnToggle = mobileMenuToggle.contains(event.target);
                
                if (!isClickInsideNav && !isClickOnToggle && navLinks.classList.contains('mobile-visible')) {
                    navLinks.classList.remove('mobile-visible');
                    navLinks.classList.add('mobile-hidden');
                    mobileMenuToggle.classList.remove('active');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });

        // Initialize proper state based on viewport
        initializeMobileMenuState();

        // Close mobile menu when pressing Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navLinks.classList.contains('mobile-visible')) {
                navLinks.classList.remove('mobile-visible');
                navLinks.classList.add('mobile-hidden');
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                mobileMenuToggle.focus(); // Return focus to the toggle button
            }
        });
    }
    
    // Add swipe gestures for navigation between sections on mobile
    if ('ontouchstart' in window) {
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        document.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipeGesture();
        });
        
        function handleSwipeGesture() {
            const swipeThreshold = 100;
            const swipeDistance = touchEndX - touchStartX;
            
            if (Math.abs(swipeDistance) > swipeThreshold) {
                const sections = document.querySelectorAll('.section');
                const currentSection = getCurrentVisibleSection(sections);
                
                if (currentSection !== null) {
                    if (swipeDistance > 0 && currentSection > 0) {
                        // Swipe right - go to previous section
                        sections[currentSection - 1].scrollIntoView({ behavior: 'smooth' });
                    } else if (swipeDistance < 0 && currentSection < sections.length - 1) {
                        // Swipe left - go to next section
                        sections[currentSection + 1].scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        }
        
        function getCurrentVisibleSection(sections) {
            const viewportHeight = window.innerHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            for (let i = 0; i < sections.length; i++) {
                const sectionTop = sections[i].offsetTop;
                const sectionBottom = sectionTop + sections[i].offsetHeight;
                
                if (scrollTop >= sectionTop - viewportHeight / 2 && scrollTop < sectionBottom - viewportHeight / 2) {
                    return i;
                }
            }
            return null;
        }
    }
}

// Improve mobile table experience
function improveMobileTableExperience() {
    const tables = document.querySelectorAll('.properties-table');
    
    tables.forEach(table => {
        // Add scroll hint for mobile tables
        if (window.innerWidth <= 768) {
            const scrollHint = document.createElement('div');
            scrollHint.className = 'mobile-table-hint';
            scrollHint.innerHTML = '← Scroll horizontally to see all columns →';
            scrollHint.style.cssText = `
                text-align: center;
                font-size: 0.8rem;
                color: #666;
                padding: 0.5rem;
                background: #f9f9f9;
                border: 1px dashed #ccc;
                margin-bottom: 0.5rem;
                border-radius: 4px;
            `;
            
            table.parentNode.insertBefore(scrollHint, table);
        }
        
        // Add smooth scrolling for table content
        table.addEventListener('touchstart', function() {
            this.style.scrollBehavior = 'smooth';
        });
    });
}

// Initialize mobile menu state based on viewport
function initializeMobileMenuState() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuToggle && navLinks) {
        if (window.innerWidth <= 767) {
            // Mobile: hide navigation by default, show hamburger
            navLinks.classList.remove('mobile-visible');
            navLinks.classList.add('mobile-hidden');
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        } else {
            // Desktop: show navigation, hide hamburger, reset any mobile classes
            navLinks.classList.remove('mobile-hidden', 'mobile-visible');
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    }
}

// Handle viewport resize for responsive adjustments
function handleViewportResize() {
    // Debounce resize events
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(function() {
        // Re-apply mobile table hints if viewport changes
        const existingHints = document.querySelectorAll('.mobile-table-hint');
        existingHints.forEach(hint => hint.remove());
        
        if (window.innerWidth <= 768) {
            improveMobileTableExperience();
        }
        
        // Update mobile menu state based on new viewport size
        initializeMobileMenuState();
        
        // Update any cached viewport-dependent calculations
        updateFlexItemInteractions();
    }, 250);
}

// Update flex item interactions based on viewport
function updateFlexItemInteractions() {
    document.querySelectorAll('.flex-item').forEach(item => {
        // Reset any transforms when switching between desktop/mobile
        item.style.transform = 'scale(1)';
    });
}

// Add orientation change support
window.addEventListener('orientationchange', function() {
    // Small delay to account for viewport changes
    setTimeout(function() {
        handleViewportResize();
        
        // Scroll to maintain current section visibility
        const currentSection = document.querySelector('.section:nth-child(1)');
        if (currentSection) {
            const rect = currentSection.getBoundingClientRect();
            if (rect.top < -100 || rect.top > window.innerHeight) {
                currentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, 500);
});