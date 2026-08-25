const bannerHTML = `
    <div class="mt-12 mb-8 bg-slate-900 rounded-xl p-10 flex justify-between items-center text-white shadow-2xl relative overflow-hidden group max-w-[95%] mx-auto">
        <div class="absolute -right-20 -top-20 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition duration-500"></div>
        <div class="absolute -left-20 -bottom-20 w-64 h-64 bg-pink-600 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition duration-500"></div>
        <div class="relative z-10">
            <h3 class="text-3xl font-black mb-3">Tired of managing spreadsheets?</h3>
            <p class="text-slate-300 text-lg">Discover Influencers, Manage Campaigns, and Automate Reports seamlessly.</p>
        </div>
        <a href="#" class="relative z-10 bg-white text-slate-900 px-10 py-4 rounded-xl font-bold text-lg hover:scale-105 transition shadow-lg">Explore Kolify.one</a>
    </div>
`;

// หารูปร่างที่มี id นี้ แล้วเอา HTML ยัดเข้าไป
document.addEventListener("DOMContentLoaded", function() {
    const bannerContainer = document.getElementById("kolify-cta-banner");
    if(bannerContainer) {
        bannerContainer.innerHTML = bannerHTML;
    }
});
