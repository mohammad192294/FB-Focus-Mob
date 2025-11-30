/*
   VERSION 6.0: THE END GAME (JS ENFORCER)
   Combines "Brute Force" scanning with "React Safety"
*/

// ১. কনফিগারেশন: ভিডিও চেনার শব্দসমূহ
const BLACKLIST_KEYWORDS = [
    "Reels and short videos",
    "Suggested for you", // স্পনসরড ভিডিও
    "Create story",
    "Add to Story",
    "Watch",
    "Shorts"
];

// ২. মেইন ক্লিনিং লজিক
function finalClean() {
    try {
        // --- A. Navbar & Menu Killer (সাদা বক্স রিমুভ) ---
        // লিংকের ওপর ভিত্তি করে প্যারেন্ট খোঁজা
        const videoLinks = document.querySelectorAll('a[href*="/watch"], a[href*="/video"], a[href*="/reel"], a[aria-label="Video"]');
        videoLinks.forEach(link => {
            // ৫ লেভেল উপরে চেক করব
            let parent = link.parentElement;
            let count = 0;
            while (parent && count < 6) {
                // লেআউট আইটেম ধরো (TD, LI, Flex Col)
                const tag = parent.tagName;
                const sigil = parent.getAttribute('data-sigil');
                
                if (sigil === 'm-navbar-item' || tag === 'TD' || tag === 'LI' || parent.classList.contains('col')) {
                    // Hide without removing to prevent crash
                    parent.style.display = 'none';
                    parent.style.setProperty('display', 'none', 'important');
                    parent.style.width = '0px';
                    parent.style.margin = '0px';
                    break;
                }
                parent = parent.parentElement;
                count++;
            }
        });

        // --- B. Story & Reel Section Killer (Text Analysis) ---
        // সব div স্ক্যান করে "Create story" বের করা
        // অপ্টিমাইজেশন: আমরা document.body এর বদলে ছোট ছোট সেকশন ধরব
        const potentialHeaders = document.querySelectorAll('div, span, h3, h4');
        potentialHeaders.forEach(el => {
            // যদি টেক্সট ছোট হয় এবং ব্ল্যাকলিস্টে থাকে
            if (el.innerText && el.innerText.length < 30) {
                if (BLACKLIST_KEYWORDS.some(k => el.innerText.includes(k))) {
                    // এর মেইন কার্ড খুঁজে বের করো
                    const card = el.closest('div._55wo') || // Mobile Card
                                 el.closest('div[data-sigil="m-stories-tray-root"]') || 
                                 el.closest('section');
                    
                    if (card) {
                        card.style.display = 'none';
                        card.style.setProperty('display', 'none', 'important');
                    }
                }
            }
        });

        // --- C. Feed Video Killer (The Heavy Hitter) ---
        // ভিডিও এলিমেন্ট পেলেই তার পুরো খানদান (Post Card) গায়েব
        const mediaElements = document.querySelectorAll('video, div[data-sigil="inlineVideo"], i[data-sigil="play-button"]');
        mediaElements.forEach(media => {
            const card = media.closest('div._55wo') || 
                         media.closest('article') || 
                         media.closest('div[role="article"]');
            
            if (card) {
                card.style.display = 'none';
                card.style.setProperty('display', 'none', 'important');
            }
        });

    } catch (e) {
        // Silent error handling
    }
}

// ৩. হাই-পারফরম্যান্স লুপ (RequestAnimationFrame)
// এটি চ্যাটজিপিটির appendChild হুকের চেয়ে অনেক ফাস্ট এবং নিরাপদ
let isRunning = false;
function loop() {
    if (!isRunning) {
        isRunning = true;
        requestAnimationFrame(() => {
            finalClean();
            isRunning = false;
        });
    }
}

// ৪. স্টার্টআপ
function init() {
    if (!document.body) {
        setTimeout(init, 50); // বডি না আসা পর্যন্ত অপেক্ষা
        return;
    }

    // ১. তাৎক্ষণিক ক্লিন
    finalClean();

    // ২. স্ক্রলে ক্লিন (সবচেয়ে জরুরি)
    window.addEventListener('scroll', loop, { passive: true });

    // ৩. DOM পরিবর্তনে ক্লিন (MutationObserver)
    const observer = new MutationObserver(loop);
    observer.observe(document.body, { childList: true, subtree: true });
    
    // ৪. ব্যাকআপ টাইমার (প্রতি ৫০০ms)
    setInterval(finalClean, 500);

    console.log("FB v6.0 EndGame: Active");
}

// রান
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
