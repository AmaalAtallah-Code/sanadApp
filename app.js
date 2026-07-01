// تسجيل الـ Service Worker لتمكين العمل بدون إنترنت (PWA)
// تسجيل الـ Service Worker بطريقة محمية لمنع توقف التطبيق
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(() => console.log('Service Worker Registered Successfully'))
        .catch(err => console.log('Service Worker missing, moving forward safely...', err));
}


// البيانات الحقيقية المدمجة من ملفات CSV الأربعة وتصميم الفيجما
const servicesData = [
    // 1. ملف المصنف (المياه)
    {
        id: 1,
        name: "محطة مياه النصر",
        category: "water",
        type: "مياه شرب محلاة",
        status: "available",
        statusText: "متاح حالياً",
        region: "حي النصر، المنطقة الشرقية",
        landmark: "بجوار مدرسة النصر الإعدادية",
        workingHours: "08:00 ص - 04:00 م",
        icon: "💧"
    },
    // 2. ملف المصنف (شحن الهواتف)
    {
        id: 2,
        name: "نقطة الأمل للطاقة الشمسية",
        category: "power",
        type: "شحن هواتف وأجهزة",
        status: "available",
        statusText: "متاح حالياً",
        region: "الرمال، شارع الشهداء",
        landmark: "مقابل مخبز اليازجي",
        workingHours: "07:30 ص - 05:00 م",
        icon: "⚡"
    },
    // 3. ملف المصنف (مراكز الصيانة)
    {
        id: 3,
        name: "مركز صيانة الهندسة السريعة",
        category: "maintenance",
        type: "إصلاح هواتف وشاشات",
        status: "busy",
        statusText: "مزدحم جداً",
        region: "شمال غزة، جباليا النزلة",
        landmark: "قرب الدوار الرئيسي",
        workingHours: "09:00 ص - 03:00 م",
        icon: "🛠️"
    },
    // 4. ملف المصنف (المساعدات)
    {
        id: 4,
        name: "تكية الشيخ رضوان الخيرية",
        category: "aid",
        type: "وجبات ومساعدات عينية",
        status: "unavailable",
        statusText: "غير متاح حالياً",
        region: "حي الشيخ رضوان",
        landmark: "قرب سوق الخضار المركزي",
        workingHours: "11:00 ص - 02:00 م",
        icon: "📦"
    }
];
// التحكم في شاشات الترحيب والتعريف
document.addEventListener('DOMContentLoaded', () => {
    // 1. تشغيل شاشة التحميل (Splash) لمدة ثانيتين ثم إظهار التعريفية
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) splash.style.display = 'none';
        
        // التحقق إذا كان المستخدم يفتح التطبيق لأول مرة
        if (!localStorage.getItem('sanad_visited')) {
            document.getElementById('onboarding-screen').style.display = 'flex';
        }
    }, 2000);
});

// الانتقال بين خطوات التعريف
function nextStep(stepNumber) {
    // إخفاء جميع الخطوات
    document.querySelectorAll('.onboarding-step').forEach(step => step.style.display = 'none');
    // إظهار الخطوة المطلوبة
    document.getElementById(`step-2`).style.display = stepNumber === 2 ? 'block' : 'none';
    document.getElementById(`step-3`).style.display = stepNumber === 3 ? 'block' : 'none';
}

// إنهاء العرض الترحيبي والدخول للتطبيق بشكل دائم
function endOnboarding() {
    document.getElementById('onboarding-screen').style.display = 'none';
    localStorage.setItem('sanad_visited', 'true'); // حفظ الزيارة حتى لا تظهر له مرة أخرى
}
// تشغيل شاشة التحميل والترحيب عند فتح التطبيق
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) splash.style.display = 'none';
        
        // إذا كانت هذه المرة الأولى للمستخدم، تظهر له الشاشات التعريفية
        if (!localStorage.getItem('sanad_visited')) {
            document.getElementById('onboarding-screen').style.display = 'flex';
        }
    }, 2000); // تختفي شاشة التحميل تلقائياً بعد ثانيتين
});

// التنقل بين شاشات التعريف الثلاث بالترتيب
function nextStep(stepNumber) {
    // إخفاء كل الخطوات أولاً
    document.getElementById('step-1').style.display = 'none';
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('step-3').style.display = 'none';
    
    // إظهار الخطوة القادمة
    document.getElementById(`step-${stepNumber}`).style.display = 'block';
}

// تعديل دالة إنهاء التعريف لفتح شاشة اختيار نوع الحساب بدلاً من الدخول المباشر
function endOnboarding() {
    document.getElementById('onboarding-screen').style.display = 'none';
    document.getElementById('auth-choice-screen').style.display = 'flex';
}

// معالجة اختيار نوع المستخدم عند الضغط على زر "متابعة"
function handleUserTypeChoice() {
    const selectedType = document.querySelector('input[name="user_type"]:checked').value;
    
    if (selectedType === 'citizen') {
        // إذا كان مواطن عادي، نغلق طبقات الحسابات ليدخل لواجهتك الأساسية القديمة مباشرة
        document.getElementById('auth-choice-screen').style.display = 'none';
    } else {
        // إذا كان مزود خدمة، نفتح له شاشة تسجيل الدخول الخاصة بالمحطات
        document.getElementById('auth-choice-screen').style.display = 'none';
        document.getElementById('login-screen').style.display = 'flex';
    }
}

// دالات التنقل السريع والعودة للخلف المتطابقة مع أزرار واجهات الفيجما
function goToLogin() {
    document.getElementById('auth-choice-screen').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
}

// العودة من شاشة تسجيل الدخول إلى شاشة الاختيار الرئيسية
function backToChoice() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('auth-choice-screen').style.display = 'flex';
}

// الانتقال من تسجيل الدخول إلى إنشاء حساب جديد
function goToRegister() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('register-screen').style.display = 'flex';
}

// العودة من شاشة إنشاء الحساب إلى شاشة تسجيل الدخول
function backToLogin() {
    document.getElementById('register-screen').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
}

// 1. تحديث دالة تسجيل الدخول الناجح لمزود الخدمة لفتح التطبيق الأساسي
function handleLoginSubmit() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-app-container').style.display = 'block'; 
    switchView('home');
}

// 2. عند إتمام إنشاء حساب جديد والضغط على الزر
function handleRegisterSubmit() {
    alert('تم إنشاء حساب مزود الخدمة بنجاح! يمكنك الآن تسجيل الدخول.');
    backToLogin();
}

// 3. آلية التبديل الذكي بين الواجهات الخمسة الأساسية وتحديث الأزرار النشطة (Tabs)
function switchView(viewName) {
    // إخفاء جميع الواجهات المضافة حديثاً أولاً
    document.querySelectorAll('.app-view').forEach(view => {
        view.style.display = 'none';
    });
    
    // إظهار الواجهة المطلوبة فقط
    document.getElementById(`view-${viewName}`).style.display = 'block';
    
    // تحديث حالة الأزرار النشطة في شريط التنقل السفلي ليطابق الفيجما
    document.querySelectorAll('.nav-tab-item').forEach(tab => {
        tab.classList.remove('active');
    });
    const activeTab = document.getElementById(`tab-${viewName}`);
    if (activeTab) activeTab.classList.add('active');

    // إذا تم فتح واجهة البحث، نقوم برمي البيانات المستخرجة من الـ CSV تلقائياً
    if (viewName === 'search') {
        renderSearchResults(servicesData);
    }
}

// 4. دالة عرض وتوليد عناصر قائمة البيانات الحقيقية من المصفوفة المستخرجة من الـ CSV
function renderSearchResults(dataArray) {
    const listContainer = document.getElementById('search-results-list');
    const countBox = document.getElementById('results-count');
    
    listContainer.innerHTML = '';
    countBox.innerText = dataArray.length;

    if (dataArray.length === 0) {
        listContainer.innerHTML = '<p style="text-align:center; color:#94a3b8; margin-top:20px;">لا توجد خدمات تطابق بحثك حالياً.</p>';
        return;
    }

    dataArray.forEach(item => {
        const card = document.createElement('div');
        card.className = 'result-card-figma';
        card.onclick = () => showServiceDetails(item);
        
        card.innerHTML = `
            <div class="result-main-info">
                <div style="font-size:24px; background:#f8fafc; padding:10px; border-radius:12px;">${item.icon || '📍'}</div>
                <div>
                    <h4 style="margin:0 0 4px 0; color:#061527; font-weight:bold; font-size:14px;">${item.name}</h4>
                    <p style="margin:0; font-size:11px; color:#64748b;">${item.region || 'غزة'}</p>
                </div>
            </div>
            <span class="badge-status-open">متاح</span>
        `;
        listContainer.appendChild(card);
    });
}

// 5. الفلترة السريعة عبر النقر على تصنيفات وأيقونات الصفحة الرئيسية
function filterServicesByCategory(categoryName) {
    switchView('search');
    const filtered = servicesData.filter(item => item.category === categoryName);
    renderSearchResults(filtered);
}

// 6. عرض شاشة التفاصيل الكاملة وتحديث نصوصها عند النقر على أي بطاقة خدمة
function showServiceDetails(item) {
    switchView('details');
    document.getElementById('detail-name').innerText = item.name;
    document.getElementById('detail-type').innerText = item.type || 'خدمة طوارئ معتمدة';
    document.getElementById('detail-location').innerText = `${item.region} ${item.landmark ? '- ' + item.landmark : ''}`;
    document.getElementById('detail-hours').innerText = item.workingHours || 'متاح على مدار الساعة';
    document.getElementById('detail-large-icon').innerText = item.icon || '📍';
}

// 7. معالجة البحث النصي الحي الفوري (Real-time Search) في واجهة البحث
function handleSearchFiltering() {
    const query = document.getElementById('main-search-input').value.toLowerCase();
    const filtered = servicesData.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.region.toLowerCase().includes(query)
    );
    renderSearchResults(filtered);
}

// 8. ميزة تمكين مزودي الخدمة من إضافة بيانات جديدة ديناميكياً إلى التطبيق
function handleAddNewService() {
    const name = document.getElementById('new-service-name').value;
    const category = document.getElementById('new-service-category').value;
    const location = document.getElementById('new-service-location').value;
    const hours = document.getElementById('new-service-hours').value;

    const newObj = {
        id: servicesData.length + 1,
        name: name,
        category: category,
        region: location,
        workingHours: hours,
        icon: category === 'water' ? '💧' : category === 'power' ? '⚡' : category === 'repair' ? '🔧' : '🤝'
    };

    servicesData.unshift(newObj); // إضافتها في مقدمة المصفوفة لتعرض أولاً
    alert('تمت إضافة خدمتك الجديدة إلى المنصة بنجاح وسيتم تصفحها فوراً!');
    switchView('search');
}
// دالة تشغيل تضمن ظهور شاشات الترحيب والتعريف دائماً أثناء التطوير
function initSplash() {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.display = 'none'; // إخفاء شاشة التحميل الداكنة بعد ثانية ونصف
        }
        
        // جعل شاشات التعريف تظهر دائماً بدون شروط الـ LocalStorage
        const onboarding = document.getElementById('onboarding-screen');
        if (onboarding) {
            onboarding.style.display = 'flex';
        }
    }, 1500); 
}

// تشغيل الدالة فوراً عند قراءة بنية الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSplash);
} else {
    initSplash();
}