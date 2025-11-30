/* 
   Author: AI Assistant for Mohammad
   Goal: Aggressive removal of Videos/Reels/Shorts without breaking layout or causing white screens.
   Method: Uses CSS hiding + JS DOM Watching. Prevents React crashes by avoiding node removal where possible.
*/

(() => {
    // 1. CSS INJECTION: এটা সবথেকে দ্রুত কাজ করে। পেজ লোড হওয়ার আগেই স্টাইল অ্যাপ্লাই করে।
    // আমরা height: 0 করে দিচ্ছি যাতে সাদা জায়গা (gap) না থাকে।
    const style = document.createElement('style');
    style.innerHTML = `
        /* Hide Video Elements directly */
        video, 
        .x1lliihq, /* Common video container class on FB */
        div[data-pagelet*="Video"],
        div[aria-label*="Reels" i],
        div[aria-label*="Stories" i],
        a[href*="/reel/"],
        a[href*="/watch/"],
        div[data-pagelet="Stories"],
        div[id^="hyperfeed_story_id_"] div[data-sigil="inlineVideo"],
        .is_video {
            display: none !important;
            height: 0 !important;
            min-height: 0 !important;
            opacity: 0 !important;
            pointer-events: none !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        /* Hide specific Mobile (m.facebook) video containers */
        div[data-sigil="m-video-play-button"],
        div[data-store*="videoID"],
        i[data-sigil="play-button"] {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    // 2. THE CLEANER FUNCTION (JavaScript Logic)
    // এটা খুঁজে বের করে এবং Parent Container-এর হাইট ঠিক করে।
    function cleanInterface() {
        try {
            // Selectors for things we want to kill
            const targets = [
                'video',
                'div[aria-label="Reels"]',
                'div[aria-label="Reels and short videos"]',
                'div[aria-label="Stories"]',
                'a[href^="/watch"]',
                'a[href^="/reel"]',
                'div[data-pagelet="ReelsTray"]',
                'iframe[src*="youtube"]',
                'iframe[src*="vimeo"]'
            ];

            targets.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    // Safety check: Don't remove if it's already hidden
                    if (el.style.display === 'none') return;

                    // ACTION: Hide the element
                    el.style.display = 'none';
                    el.style.height = '0px';

                    // EXTRA: Check Parent for cleanup (To remove white gaps)
                    // আমরা খুব সাবধানে প্যারেন্ট চেক করব। যদি প্যারেন্ট শুধু ভিডিওর জন্যই থাকে, তবে হাইড করব।
                    // কিন্তু প্যারেন্ট যদি 'article' (পোস্ট) হয়, তবে সেটা কাটব না।
                    
                    let parent = el.parentElement;
                    let safetyCounter = 0;
                    
                    while (parent && safetyCounter < 4) {
                        // যদি প্যারেন্টটি ভিডিও সেকশন হয় (Feed না)
                        const role = parent.getAttribute('role');
                        const ariaLabel = parent.getAttribute('aria-label') || '';
                        
                        if (
                            ariaLabel.toLowerCase().includes('reel') || 
                            ariaLabel.toLowerCase().includes('video') ||
                            parent.id.includes('watch_feed')
                        ) {
                            parent.style.display = 'none';
                            parent.style.margin = '0';
                            parent.style.padding = '0';
                        }
                        
                        parent = parent.parentElement;
                        safetyCounter++;
                    }
                });
            });

            // Specific Fix for "Watch" Tab in Navigation Bar (Mobile & Desktop)
            const navLinks = document.querySelectorAll('a');
            navLinks.forEach(a => {
                const href = a.getAttribute('href');
                if (href && (href.includes('/watch') || href.includes('/reels'))) {
                    // Hide the navigation icon/link but keep the layout
                    const liParent = a.closest('li') || a.closest('div[role="button"]');
                    if (liParent) {
                        liParent.style.display = 'none';
                    } else {
                        a.style.display = 'none';
                    }
                }
            });

        } catch (e) {
            // Silent catch to prevent console spam
        }
    }

    // 3. MUTATION OBSERVER (Dynamic Loading Handler)
    // স্ক্রল করলে যখন নতুন পোস্ট আসে, তখন এটি কাজ করে।
    const observer = new MutationObserver((mutations) => {
        // Performance optimization: Don't run on every single pixel change, throttle slightly if needed
        // But for "aggressive" blocking, direct call is fine.
        requestAnimationFrame(cleanInterface);
    });

    // Start Observing
    try {
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false // We only care if nodes are added
        });
        
        // Initial clean run
        cleanInterface();
        
        // Periodic cleanup fallback (every 2 seconds) just in case Observer misses something deep
        setInterval(cleanInterface, 2000);
        
    } catch (err) {
        console.log("FB Cleaner: Observer failed to start.");
    }

    console.log("FB Cleaner: Active and Aggressive.");
})();
