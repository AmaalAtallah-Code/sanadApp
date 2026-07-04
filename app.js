// ==================== قاعدة بيانات افتراضية (يتم استبدالها إذا وُجد data.js) ====================
if (typeof SANAD_OFFLINE_DATABASE === 'undefined') {
    window.SANAD_OFFLINE_DATABASE = {
        water: [
            { id: 1, region: "النصر", location: "محطة مياه النصر", type: "مياه شرب محلاة", available: 3000, capacity: 5000, status: "متاح", phone: "0599000001", hours: "08:00 ص - 04:00 م" },
            { id: 2, region: "الشيخ رضوان", location: "نقطة مياه الشيخ رضوان", type: "مياه شرب محلاة", available: 1200, capacity: 4000, status: "منخفض", phone: "0599000002", hours: "09:00 ص - 03:00 م" }
        ],
        power: [
            { id: 1, region: "الرمال", location: "نقطة شحن الرمال", available_ports: 3, total_ports: 10, status: "متاح", phone: "0599000003", hours: "24 ساعة" }
        ],
        maintenance: [
            { id: 1, region: "التفاح", location: "مركز صيانة التفاح", type: "أجهزة كهربائية وهواتف", technicians: 2, status: "متاح", phone: "0599000004", hours: "10:00 ص - 06:00 م" }
        ],
        aid: [
            { id: 1, region: "الزيتون", location: "نقطة توزيع الزيتون", type: "طرود غذائية", distributor: "الهلال الأحمر", remaining_qty: 40, total_qty: 100, status: "متاح", phone: "0599000005", hours: "09:00 ص - 01:00 م" }
        ]
    };
}

// تحويل اسم الفئة "repair" (المستخدم بالواجهة) إلى "maintenance" (المستخدم بقاعدة البيانات)
function normalizeCategory(cat) {
    return cat === 'repair' ? 'maintenance' : cat;
}

let activeSearchCategory = 'all';
let pendingAccountType = 'citizen';
let currentlyOpenService = null;

// ==================== 1. شاشة البداية والتنقل التمهيدي ====================
window.addEventListener('DOMContentLoaded', () => {
    updateNetworkStatus();
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    setTimeout(() => {
        hideOverlay('splash-screen');
        showOverlay('onboarding-screen');
    }, 1200);
});

function updateNetworkStatus() {
    const badge = document.getElementById('network-status');
    if (!badge) return;
    const textEl = badge.querySelector('.status-text');
    const iconEl = badge.querySelector('.status-icon');
    if (navigator.onLine) {
        badge.classList.remove('offline');
        badge.classList.add('online');
        if (textEl) textEl.innerText = 'متصل بالإنترنت';
        if (iconEl) iconEl.innerText = '📶';
    } else {
        badge.classList.remove('online');
        badge.classList.add('offline');
        if (textEl) textEl.innerText = 'وضع العمل بدون إنترنت';
        if (iconEl) iconEl.innerText = '📶❌';
    }
}

function hideOverlay(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
}
function showOverlay(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'flex';
}

// ==================== 2. التبويبات التمهيدية (Onboarding) ====================
function nextStep(stepNumber) {
    document.querySelectorAll('.onboarding-step').forEach(step => step.style.display = 'none');
    document.querySelectorAll('.onboarding-screen .dot, .indicators .dot').forEach(dot => dot.classList.remove('active'));

    const targetStep = document.getElementById(`step-${stepNumber}`);
    if (targetStep) {
        targetStep.style.display = 'block';
        const dots = targetStep.querySelectorAll('.dot');
        if (dots[stepNumber - 1]) dots[stepNumber - 1].classList.add('active');
        else {
            const allDots = targetStep.parentElement.querySelectorAll('.dot');
            if (allDots[stepNumber - 1]) allDots[stepNumber - 1].classList.add('active');
        }
    }
}

function endOnboarding() {
    hideOverlay('onboarding-screen');
    showOverlay('auth-choice-screen');
}

// ==================== 3. اختيار نوع الحساب / تسجيل الدخول / إنشاء حساب ====================
function handleUserTypeChoice() {
    const selected = document.querySelector('input[name="user_type"]:checked');
    pendingAccountType = selected ? selected.value : 'citizen';
    hideOverlay('auth-choice-screen');
    showOverlay('register-screen');
}

function goToLogin() {
    hideOverlay('auth-choice-screen');
    showOverlay('login-screen');
}

function backToChoice() {
    hideOverlay('login-screen');
    showOverlay('auth-choice-screen');
}

function goToRegister() {
    hideOverlay('login-screen');
    showOverlay('register-screen');
}

function backToLogin() {
    hideOverlay('register-screen');
    showOverlay('login-screen');
}

function handleLoginSubmit() {
    const email = document.getElementById('login-email')?.value.trim();
    const pass = document.getElementById('login-pass')?.value.trim();
    if (!email || !pass) {
        alert('الرجاء إدخال البريد الإلكتروني وكلمة المرور.');
        return;
    }
    hideOverlay('login-screen');
    enterMainApp();
}

function handleRegisterSubmit() {
    hideOverlay('register-screen');
    enterMainApp();
}

// ==================== 4. الدخول إلى التطبيق الرئيسي ====================
function enterMainApp() {
    const searchSection = document.querySelector('.search-section');
    const categoriesGrid = document.querySelector('.categories-grid');
    if (searchSection) searchSection.style.display = 'none';
    if (categoriesGrid) categoriesGrid.style.display = 'none';

    const mainApp = document.getElementById('main-app-container');
    if (mainApp) mainApp.style.display = 'block';

    switchView('home');
}

// ==================== 5. التنقل بين شاشات التطبيق الرئيسي ====================
function switchView(viewName) {
    const viewId = 'view-' + viewName;
    document.querySelectorAll('.app-view').forEach(view => view.style.display = 'none');

    const target = document.getElementById(viewId);
    if (target) {
        target.style.display = 'block';
    } else {
        console.error('لا توجد شاشة بالـ id: ' + viewId);
    }

    document.querySelectorAll('.nav-tab-item').forEach(tab => tab.classList.remove('active'));
    const navTab = document.getElementById('tab-' + viewName);
    if (navTab) navTab.classList.add('active');

    if (viewName === 'search') {
        executeOfflineSearch();
    }
}

// ==================== 6. الدخول للبحث من الكروت المباشرة (قبل الدخول للتطبيق) ====================
function filterService(cat) {
    enterMainApp();
    switchView('search');
    setActiveFilterTab(normalizeCategory(cat) === 'maintenance' ? 'repair' : cat);
}

function filterServicesByCategory(cat) {
    switchView('search');
    setActiveFilterTab(cat);
}

function setActiveFilterTab(cat) {
    activeSearchCategory = normalizeCategory(cat);
    document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.filter-tab').forEach(tab => {
        if (tab.getAttribute('onclick') && tab.getAttribute('onclick').includes(`'${cat}'`)) {
            tab.classList.add('active');
        }
    });
    executeOfflineSearch();
}

function filterByTab(cat, btnElement) {
    activeSearchCategory = normalizeCategory(cat);
    document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');
    executeOfflineSearch();
}

function handleSearchFiltering() {
    executeOfflineSearch();
}

// ==================== 7. محرك البحث والفلترة الأساسي ====================
function executeOfflineSearch() {
    const container = document.getElementById('search-results-list');
    const inputField = document.getElementById('main-search-input');
    const countLabel = document.getElementById('results-count');

    if (!container) return;

    const inputVal = inputField ? inputField.value.trim() : "";
    let matches = [];

    const categories = activeSearchCategory === 'all'
        ? ['water', 'power', 'maintenance', 'aid']
        : [normalizeCategory(activeSearchCategory)];

    categories.forEach(cat => {
        const dataList = window.SANAD_OFFLINE_DATABASE[cat] || [];
        dataList.forEach(item => {
            const regionStr = item.region || "";
            const locationStr = item.location || "";
            const typeStr = item.type || "";

            const matchesText = regionStr.includes(inputVal) || locationStr.includes(inputVal) || typeStr.includes(inputVal);
            if (!matchesText && inputVal !== "") return;

            let catIcon = "💧";
            let titleText = item.location;
            let subInfoText = "";

            if (cat === 'water') {
                catIcon = "💧";
                titleText = `نقطة مياه ${item.region}`;
                subInfoText = `المتبقي: ${item.available ?? '--'} لتر من أصل ${item.capacity ?? '--'} لتر`;
            } else if (cat === 'power') {
                catIcon = "⚡";
                titleText = item.location;
                subInfoText = `المنافذ الشاغرة: ${item.available_ports ?? '--'} من أصل ${item.total_ports ?? '--'}`;
            } else if (cat === 'maintenance') {
                catIcon = "🔧";
                titleText = `مركز صيانة ${item.region}`;
                subInfoText = `طاقم العمل المتواجد: ${item.technicians ?? '--'} فنيين`;
            } else if (cat === 'aid') {
                catIcon = "📦";
                titleText = item.location;
                subInfoText = `النوع الموزع: ${item.type ?? '--'} | الجهة: ${item.distributor ?? '--'}`;
            }

            const cardHTML = `
                <div class="service-card-item" style="width:100%; cursor:pointer;" onclick="openServiceDetails('${cat}', ${item.id})">
                    <div class="service-icon-wrap">${catIcon}</div>
                    <span style="display:block; font-weight:bold;">${titleText}</span>
                    <span style="display:block; font-size:11px; color:#64748b; margin-top:4px;">📍 ${locationStr}</span>
                    <span style="display:block; font-size:11px; color:#64748b;">${subInfoText}</span>
                </div>
            `;
            matches.push(cardHTML);
        });
    });

    if (countLabel) countLabel.innerText = matches.length;
    container.innerHTML = matches.length
        ? matches.join('')
        : `<p style="text-align:center; padding:30px; color:#a0aec0;">لا توجد نتائج.</p>`;
}

// ==================== 8. عرض تفاصيل خدمة معينة ====================
function openServiceDetails(category, id) {
    const item = (window.SANAD_OFFLINE_DATABASE[category] || []).find(x => x.id === id);
    if (!item) return;

    currentlyOpenService = { category, id };

    const iconsByCat = { water: '💧', power: '⚡', maintenance: '🔧', aid: '📦' };
    const titleEl = document.getElementById('detail-name');
    const typeEl = document.getElementById('detail-type');
    const locationEl = document.getElementById('detail-location');
    const hoursEl = document.getElementById('detail-hours');
    const iconEl = document.getElementById('detail-large-icon');
    const statusEl = document.getElementById('detail-status-badge');
    const headerTitleEl = document.getElementById('detail-header-title');

    if (titleEl) titleEl.innerText = item.location || item.type || 'تفاصيل الخدمة';
    if (typeEl) typeEl.innerText = item.type || '';
    if (locationEl) locationEl.innerText = `${item.location || ''}${item.region ? ' - ' + item.region : ''}`;
    if (hoursEl) hoursEl.innerText = item.hours || 'غير محدد';
    if (iconEl) iconEl.innerText = iconsByCat[category] || '📍';
    if (statusEl) statusEl.innerText = item.status || 'متاح حالياً';
    if (headerTitleEl) headerTitleEl.innerText = 'تفاصيل الخدمة';

    switchView('details');
}

// ==================== 9. الملف الشخصي وإضافة خدمة جديدة ====================
function handleAddNewService() {
    const name = document.getElementById('new-service-name')?.value.trim();
    const category = normalizeCategory(document.getElementById('new-service-category')?.value);
    const location = document.getElementById('new-service-location')?.value.trim();
    const hours = document.getElementById('new-service-hours')?.value.trim();

    if (!name || !location || !hours) {
        alert('الرجاء تعبئة جميع الحقول المطلوبة.');
        return;
    }

    if (!window.SANAD_OFFLINE_DATABASE[category]) window.SANAD_OFFLINE_DATABASE[category] = [];

    const newId = window.SANAD_OFFLINE_DATABASE[category].length
        ? Math.max(...window.SANAD_OFFLINE_DATABASE[category].map(x => x.id)) + 1
        : 1;

    window.SANAD_OFFLINE_DATABASE[category].push({
        id: newId,
        region: location,
        location: name,
        type: name,
        status: 'متاح',
        hours: hours
    });

    alert('تمت إضافة الخدمة بنجاح ✅');
    switchView('profile');
}
