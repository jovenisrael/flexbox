 // Add some basic interactivity for demonstrations
 document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Add interactive hover effects to flex items
    document.querySelectorAll('.flex-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
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