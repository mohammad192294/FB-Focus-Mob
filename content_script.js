/* 
   PROJECT ZERO: FINAL ENFORCER (v10.0)
   Policy: "Search and Destroy"
   Target: m.facebook.com
*/

// কনফিগারেশন: আমরা কী কী খুঁজছি
const TARGETS = {
    keywords: [
        "Create story", 
        "Add to Story", 
        "Reels", 
        "Shorts", 
        "Suggested for you", 
        "Watch",
        "Live now"
    ],
    selectors: [
        'video',
        'div[data-sigil="inlineVideo"]',
        'i[data-sigil="play-button"]',
        'div[data-store*="videoID"]',
        'a[href*="/watch/"]',
        'a[href*="/reel/"]',
        'div[data-sigil="m-stories-tray-root"]'
    ]
};

// ১. কিলার ফাংশন: এলিমেন্ট পেলেই তার মেইন কন্টেইনার গায়েব
function annihilate(element, type = 'card') {
    if (!element) return;

    // আমরা উপরের দিকে খুঁজতে থাকব যতক্ষণ না মেইন কার্ড পাই
    let parent = element.parentElement;
    let found = false;
    let limit = 0;

    // কার্ড বা নেভিগেশন আইটেম খোঁজা
    while (parent && limit < 8) {
        // A. মেইন কার্ড (_55wo) বা স্টোরি ট্রে
        if (
            parent.classList.contains('_55wo') || 
            parent.classList.contains('story_tray') ||
            parent.getAttribute('data-sigil') === 'story-div' ||
            parent.getAttribute('data-sigil') === 'm-stories-tray-root'
        ) {
            parent.classList.add('fb-zero-hidden'); // CSS ক্লাস দিয়ে হাইড
            parent.style.display = 'none';
            found = true;
            break;
        }
        
        // B. নেভিগেশন আইটেম (সাদা বক্স ফিক্স)
        if (
            parent.getAttribute('data-sigil') === 'm-navbar-item' ||
            parent.tagName === 'LI' ||
            parent.tagName === 'TD' ||
            parent.classList.contains('col')
        ) {
            // যদি এটা ভিডিওর লিংক হয় তবেই হাইড
            if (element.tagName === 'A') {
                parent.classList.add('fb-zero-hidden');
                parent.style.display = 'none';
                found = true;
                break;
            }
        }
        
        parent = parent.parentElement;
        limit++;
    }

    // যদি প্যারেন্ট না পাওয়া যায়, তবে এলিমেন্টটিকেই হাইড করো
    if (!found) {
        element.style.display = 'none';
    }
}

// ২. মেইন স্ক্যানার লজিক
function scanAndDestroy() {
    try {
        // A. সিলেক্টর দিয়ে ডাইরেক্ট ভিডিও/লিংক খোঁজা
        const badElements = document.querySelectorAll(TARGETS.selectors.join(','));
        badElements.forEach(el => annihilate(el));

        // B. টেক্সট দিয়ে স্টোরি বা রিলস সেকশন খোঁজা (চ্যানেল ২৪ বা নিউজ কার্ড)
        // আমরা সব div বা span চেক করব না, শুধু হেডার বা ছোট ব্লক
        const potentialTexts = document.querySelectorAll('div, span, h3, strong');
        for (let i = 0; i < potentialTexts.length; i++) {
            const node = potentialTexts[i];
            
            // অপ্টিমাইজেশন: টেক্সট ছোট হলেই চেক করো
            if (node.innerText && node.innerText.length < 35) {
                // লুপ চালিয়ে কিওয়ার্ড ম্যাচ
                for (let k = 0; k < TARGETS.keywords.length; k++) {
                    if (node.innerText === TARGETS.keywords[k]) {
                        annihilate(node);
                        break; 
                    }
                }
            }
        }
        
        // C. Navbar Fix (Explicit)
        // কখনো কখনো JS লোড হতে দেরি হলে CSS মিস করে, তাই এখানে হার্ডকোড ফিক্স
        const navLinks = document.querySelectorAll('a[href*="/watch"], a[href*="/video"]');
        navLinks.forEach(link => {
            const navItem = link.closest('div[data-sigil="m-navbar-item"]') || link.closest('li');
            if (navItem) navItem.style.display = 'none';
        });

    } catch (e) {
        // যুদ্ধ চলতেই থাকবে, এরর ইগনোর
    }
}

// ৩. লুপ ইঞ্জিন (থেমে থাকবে না)
function startEngine() {
    // তাৎক্ষণিক স্ক্যান
    scanAndDestroy();

    // প্রতি ১০০ মিলি-সেকেন্ডে স্ক্যান (মেশিনগান মোড)
    setInterval(scanAndDestroy, 100);

    // স্ক্রল করলে স্ক্যান
    window.addEventListener('scroll', scanAndDestroy, { passive: true });
    
    // নতুন এলিমেন্ট আসলে স্ক্যান (MutationObserver)
    const observer = new MutationObserver(scanAndDestroy);
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    console.log("FB Project Zero: Full Power Active");
}

// ৪. রান
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startEngine);
} else {
    startEngine();
}
