 // Add some basic interactivity for demonstrations
 document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                // Account for sticky header height on different screen sizes
                let offset;
                if (window.innerWidth <= 480) {
                    offset = 60; // Compact header on small mobile
                } else if (window.innerWidth <= 767) {
                    offset = 80; // Medium mobile with compact title
                } else {
                    offset = 100; // Desktop with full header
                }
                
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
            scrollHint.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                    <span style="font-size: 1.2rem;">👈</span>
                    <strong>Swipe to scroll table</strong>
                    <span style="font-size: 1.2rem;">👉</span>
                </div>
                <div style="font-size: 0.75rem; opacity: 0.8;">Drag horizontally to see all columns</div>
            `;
            scrollHint.style.cssText = `
                text-align: center;
                font-size: 0.8rem;
                color: #555;
                padding: 0.75rem;
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                border: 1px solid #dee2e6;
                margin-bottom: 0.75rem;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            `;
            
            table.parentNode.insertBefore(scrollHint, table);
            
            // Add visual scroll indicators to the table
            const tableWrapper = document.createElement('div');
            tableWrapper.className = 'table-wrapper-mobile';
            tableWrapper.style.cssText = `
                position: relative;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            `;
            
            // Add left shadow indicator
            const leftShadow = document.createElement('div');
            leftShadow.className = 'table-scroll-shadow left';
            leftShadow.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 10px;
                height: 100%;
                background: linear-gradient(to right, rgba(0,0,0,0.1), transparent);
                pointer-events: none;
                z-index: 2;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            // Add right shadow indicator
            const rightShadow = document.createElement('div');
            rightShadow.className = 'table-scroll-shadow right';
            rightShadow.style.cssText = `
                position: absolute;
                top: 0;
                right: 0;
                width: 10px;
                height: 100%;
                background: linear-gradient(to left, rgba(0,0,0,0.1), transparent);
                pointer-events: none;
                z-index: 2;
                opacity: 1;
                transition: opacity 0.3s ease;
            `;
            
            // Wrap the table
            table.parentNode.insertBefore(tableWrapper, table);
            tableWrapper.appendChild(leftShadow);
            tableWrapper.appendChild(rightShadow);
            tableWrapper.appendChild(table);
            
            // Update shadow visibility based on scroll position
            table.addEventListener('scroll', function() {
                const scrollLeft = this.scrollLeft;
                const scrollWidth = this.scrollWidth;
                const clientWidth = this.clientWidth;
                
                // Show/hide left shadow
                leftShadow.style.opacity = scrollLeft > 0 ? '1' : '0';
                
                // Show/hide right shadow
                rightShadow.style.opacity = scrollLeft < (scrollWidth - clientWidth - 1) ? '1' : '0';
            });
        }
        
        // Add smooth scrolling for table content
        table.addEventListener('touchstart', function() {
            this.style.scrollBehavior = 'smooth';
        });
        
        // Improve touch scrolling momentum on iOS
        table.style.webkitOverflowScrolling = 'touch';
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
        const existingWrappers = document.querySelectorAll('.table-wrapper-mobile');
        
        // Clean up existing mobile table enhancements
        existingHints.forEach(hint => hint.remove());
        existingWrappers.forEach(wrapper => {
            const table = wrapper.querySelector('.properties-table');
            if (table) {
                // Move table back to its original parent
                wrapper.parentNode.insertBefore(table, wrapper);
                wrapper.remove();
            }
        });
        
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