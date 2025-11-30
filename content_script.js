/* 
   Mobile FB Cleaner v5.1 (Final Fix)
   Goal: Remove Gaps, Stories & Videos without Crashing
*/

// ১. সেইফ লজিক: পেজ তৈরি না হওয়া পর্যন্ত অপেক্ষা করবে
function waitForBody() {
    if (!document.body) {
        // বডি না পাওয়া গেলে ৫০ মিলি-সেকেন্ড পর আবার চেষ্টা করো
        setTimeout(waitForBody, 50);
        return;
    }
    // বডি পাওয়া গেছে, এখন কাজ শুরু
    startCleaning();
}

// ২. মেইন ক্লিনিং ইঞ্জিন
function cleanNow() {
    try {
        // --- A. NAVBAR GAPS REMOVAL (সাদা বক্স ফিক্স) ---
        // ভিডিও বা ওয়াচ লিংক আছে এমন আইটেমগুলো ধরো
        const badNavItems = document.querySelectorAll('a[href*="/watch"], a[href*="/video"], a[href*="/reel"], a[aria-label="Video"], a[aria-label="Watch"]');
        
        badNavItems.forEach(link => {
            // আইকনের ৩ লেভেল উপরের প্যারেন্ট (বক্স) খুঁজে বের করে হাইড করো
            let parent = link.parentElement;
            let safety = 0;
            while (parent && safety < 5) {
                // m.facebook এর নেভিগেশন আইটেম চেনার উপায়
                if (
                    parent.getAttribute('data-sigil') === 'm-navbar-item' || 
                    parent.tagName === 'LI' ||
                    parent.classList.contains('col') 
                ) {
                    parent.style.display = 'none';
                    parent.style.setProperty('display', 'none', 'important');
                    parent.style.margin = '0';
                    parent.style.padding = '0';
                    break;
                }
                parent = parent.parentElement;
                safety++;
            }
        });

        // --- B. STORIES TRAY REMOVAL (স্টোরি ফিক্স) ---
        // সরাসরি স্টোরি কন্টেইনার টার্গেট
        const storyTrays = document.querySelectorAll('div[data-sigil="m-stories-tray-root"], div[data-sigil="m-stories-tray"], section[aria-label="Stories"]');
        storyTrays.forEach(tray => {
            tray.style.display = 'none';
            tray.style.setProperty('display', 'none', 'important');
        });

        // যদি "Create story" লেখা কোনো বাটন থাকে, তার পুরো সেকশন হাইড করো
        const allDivs = document.getElementsByTagName('div');
        for (let div of allDivs) {
            // টেক্সট চেক (খুব দ্রুত)
            if (div.textContent === 'Create story' || div.textContent === 'Add to Story') {
                const container = div.closest('div._55wo') || div.closest('div[data-sigil="story-div"]');
                if (container) {
                    container.style.display = 'none';
                    container.style.setProperty('display', 'none', 'important');
                }
            }
        }

        // --- C. FEED VIDEO REMOVAL (ভিডিও পোস্ট ফিক্স) ---
        const videos = document.querySelectorAll('video, div[data-sigil="inlineVideo"], i[data-sigil="play-button"], div[data-store*="videoID"]');
        videos.forEach(vid => {
            // ভিডিওর মেইন কার্ড (_55wo) খুঁজে বের করে হাইড করো
            const card = vid.closest('div._55wo') || vid.closest('article');
            if (card) {
                card.style.display = 'none';
                card.style.setProperty('display', 'none', 'important');
            }
        });

    } catch (e) {
        // কোনো এরর হলে ইগনোর করো, যাতে স্ক্রিপ্ট না থামে
    }
}

// ৩. স্টার্ট ফাংশন (অবজারভার সহ)
function startCleaning() {
    // একবার ক্লিন করো
    cleanNow();

    // এরপর পেজের যেকোনো পরিবর্তনের দিকে নজর রাখো (স্ক্রল করলে)
    const observer = new MutationObserver((mutations) => {
        cleanNow();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // ডবল চেকের জন্য প্রতি ১ সেকেন্ড পর পর চালাও
    setInterval(cleanNow, 1000);
    console.log("FB Cleaner Active: No Videos, No Gaps.");
}

// ৪. রান করো
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitForBody);
} else {
    waitForBody();
}
