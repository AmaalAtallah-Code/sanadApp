// تحديد عناصر الواجهة
const reportForm = document.getElementById('report-form');
const localReportsList = document.getElementById('local-reports-list');

// 1. دالة لعرض البلاغات المخزنة محلياً في الصفحة
function renderLocalReports() {
    localReportsList.innerHTML = '';
    
    // جلب البلاغات من LocalStorage (إذا لم توجد، ننشئ مصفوفة فارغة)
    const reports = JSON.parse(localStorage.getItem('offlineReports')) || [];
    
    if (reports.length === 0) {
        localReportsList.innerHTML = '<p style="color: #999; font-size: 13px; text-align: center; padding: 15px; border: 1px dashed #ccc; border-radius: 8px;">لا توجد بلاغات معلقة حالياً. جميع البيانات محدثة.</p>';
        return;
    }

    // عرض البلاغات المخزنة على شكل بطاقات صغيرة
    reports.forEach((report, index) => {
        let statusText = "متاح";
        if (report.status === 'busy') statusText = "مزدحم جداً";
        if (report.status === 'unavailable') statusText = "غير متاح";

        const reportHTML = `
            <div style="background: #fff; border: 1px solid #ddd; padding: 12px; border-radius: 8px; margin-bottom: 10px; font-size: 13px;">
                <strong>📍 الخدمة رقم: ${report.serviceId}</strong> <br>
                <span>الحالة المبلغ عنها: <span style="font-weight:bold; color:#e65f2b;">${statusText}</span></span> <br>
                ${report.notes ? `<span>ملاحظات: ${report.notes}</span> <br>` : ''}
                <small style="color: #888;">وقت الحفظ: ${new Date(report.timestamp).toLocaleTimeString('ar-EG')}</small>
            </div>
        `;
        localReportsList.insertAdjacentHTML('beforeend', reportHTML);
    });
}

// 2. الاستماع لحدث إرسال النموذج (Submit Form)
reportForm.addEventListener('submit', function(e) {
    e.preventDefault(); // منع إعادة تحميل الصفحة

    // تجميع بيانات البلاغ في كائن (Object)
    const newReport = {
        serviceId: document.getElementById('service-select').value,
        status: document.getElementById('status-select').value,
        notes: document.getElementById('notes-input').value,
        timestamp: new Date().toISOString()
    };

    // جلب البيانات القديمة وإضافة الجديدة إليها
    let currentReports = JSON.parse(localStorage.getItem('offlineReports')) || [];
    currentReports.push(newReport);
    
    // حفظ المصفوفة الجديدة في الـ LocalStorage بعد تحويلها لنص JSON
    localStorage.setItem('offlineReports', JSON.stringify(currentReports));

    // إعادة تعيين الحقول (مسح الكتابة)
    reportForm.reset();

    // إشعار المستخدم بنجاح الحفظ الفوري بدون إنترنت
    alert('تم حفظ بلاغك بنجاح في ذاكرة الهاتف! سيبقى محفوظاً حتى تتوفر شبكة لإرساله تلقائياً.');

    // تحديث القائمة المعروضة فوراً
    renderLocalReports();
});

// 3. تشغيل الدالة لعرض البيانات المخزنة فور فتح الصفحة
document.addEventListener('DOMContentLoaded', () => {
    renderLocalReports();
});
