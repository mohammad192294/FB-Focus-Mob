/* -----------------------------------------------------------
   FB V7.0 FINAL: The Container Killer
   Target: m.facebook.com & www.facebook.com
----------------------------------------------------------- */

/* ১. সাদা বক্স ও নেভিগেশন ক্লিনআপ */
div[data-sigil="m-navbar-item"]:has(a[href*="video"]),
div[data-sigil="m-navbar-item"]:has(a[href*="watch"]),
div[data-sigil="m-navbar-item"]:has(a[href*="reel"]),
li:has(a[href*="watch"]),
li:has(a[aria-label="Video"]),
a[href*="/watch/"],
a[href*="/reel/"] {
    display: none !important;
}

/* ২. স্টোরিজ (Stories) সেকশন রিমুভাল */
div[data-sigil="m-stories-tray-root"],
div[data-sigil="m-stories-tray"],
section[aria-label="Stories"],
div#m_news_feed_stream > div:first-child:has(div[aria-label="Story"]),
div._55wo:has(div[aria-label="Create story"]),
div._55wo:has(div[aria-label="Add to Story"]) {
    display: none !important;
    height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
}

/* ৩. ফিড ভিডিও কার্ড রিমুভাল (আসল কাজ এখানে) */
/* Channel 24 বা অন্য ভিডিওর পুরো কার্ড (_55wo) গায়েব হবে */
div._55wo:has(video),
div._55wo:has(div[data-sigil="inlineVideo"]),
div._55wo:has(div[data-store*="videoID"]),
div._55wo:has(i[data-sigil="play-button"]),
/* রিলস বা শর্টস লিঙ্ক থাকলেও কার্ড গায়েব */
div._55wo:has(a[href*="/reel/"]),
div._55wo:has(a[href*="/shorts/"]),
/* ডেস্কটপ বা অন্য ভিউ-এর জন্য */
div[role="article"]:has(video),
div[data-pagelet^="FeedUnit"]:has(video) {
    display: none !important;
    /* নিশ্চিত করার জন্য হাইট জিরো করা হলো */
    height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    opacity: 0 !important;
    pointer-events: none !important;
}

/* ৪. এক্সট্রা সেফটি (যদি কিছু লোড হয়েও যায়) */
video, iframe[src*="facebook"] {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
}
