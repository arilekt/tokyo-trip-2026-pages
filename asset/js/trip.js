/* =============================================
   Tokyo Trip 2026 - Trip Page JavaScript
   Toggle/Collapse/Copy Functions
   ============================================= */

// =============================================
// Toggle Section (Level 1 - Day)
// =============================================
function toggleSection(element) {
    const section = element.closest('.day-section');
    const body = section.querySelector('.section-body');
    const chevron = section.querySelector('.section-chevron');

    if (body && chevron) {
        body.classList.toggle('hidden');
        chevron.classList.toggle('expanded');
    }
}

// =============================================
// Toggle Card (Level 2)
// =============================================
function toggleCard(element) {
    // Check if it's a rec-card
    const recCard = element.closest('.rec-card');
    if (recCard) {
        const detail = recCard.querySelector('.rec-card-detail');
        const chevron = recCard.querySelector('.rec-card-chevron');

        if (detail && chevron) {
            if (detail.classList.contains('hidden')) {
                detail.classList.remove('hidden');
                chevron.classList.add('expanded');
            } else {
                detail.classList.add('hidden');
                chevron.classList.remove('expanded');
            }
        }
        return;
    }

    // Otherwise, handle normal cards
    const card = element.closest('.card, .recommendations');
    const body = card.querySelector('.card-body, .rec-body');
    const chevron = card.querySelector('.chevron');

    if (body.classList.contains('hidden')) {
        body.classList.remove('hidden');
        chevron.classList.add('expanded');
    } else {
        body.classList.add('hidden');
        chevron.classList.remove('expanded');
    }
}

// =============================================
// Toggle Subsection (Level 3+)
// =============================================
function toggleSubsection(element) {
    const subsection = element.closest('.subsection');
    const body = subsection.querySelector('.subsection-body');
    const chevron = subsection.querySelector('.subsection-chevron');

    if (body && chevron) {
        body.classList.toggle('hidden');
        chevron.classList.toggle('expanded');
    }
}

// =============================================
// Expand/Collapse All
// =============================================
function expandAll() {
    // Expand all sections
    document.querySelectorAll('.section-body.hidden').forEach(el => {
        el.classList.remove('hidden');
    });
    document.querySelectorAll('.section-chevron').forEach(el => {
        el.classList.add('expanded');
    });

    // Expand all cards
    document.querySelectorAll('.card-body.hidden').forEach(el => {
        el.classList.remove('hidden');
    });
    document.querySelectorAll('.chevron').forEach(el => {
        el.classList.add('expanded');
    });

    // Expand all subsections
    document.querySelectorAll('.subsection-body.hidden').forEach(el => {
        el.classList.remove('hidden');
    });
    document.querySelectorAll('.subsection-chevron').forEach(el => {
        el.classList.add('expanded');
    });
}

function collapseAll() {
    // Collapse all sections
    document.querySelectorAll('.section-body').forEach(el => {
        el.classList.add('hidden');
    });
    document.querySelectorAll('.section-chevron').forEach(el => {
        el.classList.remove('expanded');
    });

    // Collapse all cards
    document.querySelectorAll('.card-body').forEach(el => {
        el.classList.add('hidden');
    });
    document.querySelectorAll('.chevron').forEach(el => {
        el.classList.remove('expanded');
    });

    // Collapse all subsections
    document.querySelectorAll('.subsection-body').forEach(el => {
        el.classList.add('hidden');
    });
    document.querySelectorAll('.subsection-chevron').forEach(el => {
        el.classList.remove('expanded');
    });
}

// =============================================
// Scroll to Day
// =============================================
function scrollToDay(dayNumber) {
    const daySections = document.querySelectorAll('.day-section');
    if (daySections[dayNumber - 1]) {
        const section = daySections[dayNumber - 1];

        // Expand the section first
        const body = section.querySelector('.section-body');
        const chevron = section.querySelector('.section-chevron');
        if (body && body.classList.contains('hidden')) {
            body.classList.remove('hidden');
            chevron.classList.add('expanded');
        }

        // Scroll to section
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// =============================================
// Initialize Trip Page
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + E = Expand All
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            expandAll();
        }
        // Ctrl/Cmd + C = Collapse All (when not in input)
        if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
            e.preventDefault();
            collapseAll();
        }
        // Number keys 1-8 = Go to Day
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
            const num = parseInt(e.key);
            if (num >= 1 && num <= 8) {
                scrollToDay(num);
            }
        }
    });
});
