/* 
   FB v13.0: CONTAINER DESTROYER
   Focus: Remove the entire post card if it contains video.
*/

function removeVideoContent() {
    try {
        // ১. টার্গেট: ভিডিও, রিলস, এবং প্লে বাটন
        // আমরা খুঁজছি ভিডিও এলিমেন্ট অথবা ভিডিওর কোনো চিহ্ন
        const videoSignals = document.querySelectorAll(`
            video, 
            div[data-sigil="inlineVideo"], 
            i[data-sigil="play-button"], 
            div[data-store*="videoID"],
            a[href*="/reel/"],
            a[href*="/watch/"]
        `);

        videoSignals.forEach(signal => {
            // ২. সিগনাল পেলে তার মেইন কার্ড (_55wo) খুঁজে বের করো
            // _55wo হলো m.facebook এর প্রতিটি পোস্টের মেইন ক্লাস
            const card = signal.closest('div._55wo') || signal.closest('article') || signal.closest('div[data-sigil="story-div"]');

            if (card) {
                // ৩. পজ বা মিউট করার দরকার নেই, সরাসরি গায়েব করে দাও
                // ডিসপ্লে নান করলে কার্ডটি অদৃশ্য হবে এবং জায়গা দখল করবে না
                card.style.display = 'none';
                card.style.setProperty('display', 'none', 'important');
                
                // মেমরি ক্লিয়ার করার জন্য ভেতরের HTML মুছে ফেলি (যাতে ব্যাকগ্রাউন্ডে ভিডিও না চলে)
                card.innerHTML = ''; 
            }
        });

        // ৪. নেভিগেশন বার ক্লিনআপ (ভিডিও আইকন)
        const navLinks = document.querySelectorAll('a[href*="/watch"], a[href*="/video"], a[href*="/reel"]');
        navLinks.forEach(link => {
            const navItem = link.closest('div[data-sigil="m-navbar-item"]') || link.closest('li') || link.closest('td');
            if (navItem) {
                navItem.style.display = 'none';
            }
        });

        // ৫. স্টোরিজ ক্লিনআপ
        const stories = document.querySelectorAll('div[data-sigil="m-stories-tray-root"], div[data-sigil="m-stories-tray"]');
        stories.forEach(s => s.style.display = 'none');

    } catch (e) {
        // সাইলেন্টলি কাজ চালিয়ে যাও
    }
}

// ==========================================
// 실행 (Execution)
// ==========================================

// পেজ লোড হওয়ার সাথে সাথে একবার ক্লিন করো
removeVideoContent();

// স্ক্রল করার সময় বারবার চেক করো (খুব দ্রুত)
// এটি ভিডিও স্ক্রিনে আসার আগেই ধরে ফেলবে
setInterval(removeVideoContent, 100);

// স্ক্রল ইভেন্টেও নজর রাখো
window.addEventListener('scroll', removeVideoContent, { passive: true });

console.log("FB v13: Video Containers Removed.");
