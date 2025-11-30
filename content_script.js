/*
  FB Text-Only Enforcer (JS Backup)
  This script handles dynamic content that CSS :has() might miss on older browsers.
*/

const aggressiveCleaner = () => {
    try {
        // 1. Force remove known video containers if CSS missed them
        // We select the 'article' or main card wrapper to ensure no gaps.
        
        // Selectors for elements that MUST DIE
        const badSelectors = [
            'div[data-pagelet="ReelsTray"]',
            'div[aria-label="Reels and short videos"]',
            'a[href*="/watch/"]',
            'a[href*="/reel/"]',
            'div[data-sigil="m-video-play-button"]'
        ];

        badSelectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                // Find the closest major container (Card) and hide it
                // For desktop, feed units are often in data-pagelet="FeedUnit_..."
                const feedUnit = el.closest('div[data-pagelet^="FeedUnit"]') || 
                                 el.closest('div._55wo') || // Mobile container
                                 el.closest('div[role="article"]');
                
                if (feedUnit) {
                    feedUnit.style.display = 'none';
                    feedUnit.style.setProperty('display', 'none', 'important');
                } else {
                    el.style.display = 'none';
                    el.style.setProperty('display', 'none', 'important');
                }
            });
        });

        // 2. Navigation Bar Cleanup (Scanning specifically for Nav items)
        const navLinks = document.querySelectorAll('div[role="navigation"] a, ul li a');
        navLinks.forEach(link => {
            const href = link.getAttribute('href') || '';
            const label = link.getAttribute('aria-label') || '';
            
            if (href.includes('/watch') || href.includes('/reel') || label === 'Video' || label === 'Watch') {
                // Find the list item (li) holding this link
                const listItem = link.closest('li');
                if (listItem) {
                    listItem.style.display = 'none';
                    listItem.style.setProperty('display', 'none', 'important');
                }
            }
        });

    } catch (e) {
        // Ignore errors
    }
};

// Run immediately
aggressiveCleaner();

// Run on Scroll and Mutation
const observer = new MutationObserver((mutations) => {
    // Run aggressive cleaner on any DOM change
    aggressiveCleaner();
});

observer.observe(document.body, { childList: true, subtree: true });

// Extra interval for stubborn elements
setInterval(aggressiveCleaner, 1000);
console.log("FB Ultimate Blocker Running...");
