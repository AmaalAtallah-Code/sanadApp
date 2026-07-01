// 1. تهيئة كمية المخزون الافتراضية من الـ LocalStorage أو تعيين القيمة البدئية (5000 لتر)
let currentStock = parseInt(localStorage.getItem('station_1_stock')) || 5000;

const stockDisplay = document.getElementById('stock-display');
const qrSection = document.getElementById('qr-section');
const qrContainer = document.getElementById('qrcode');

// تحديث الشاشة بالرقم الحالي فور فتح الصفحة
updateStockUI();

// 2. دالة تعديل المخزون (زيادة أو نقصان)
function adjustStock(amount) {
    currentStock += amount;
    
    // منع المخزون من النزول تحت الصفر أو تجاوز السعة القصوى
    if (currentStock < 0) currentStock = 0;
    if (currentStock > 5000) currentStock = 5000;

    // حفظ القيمة الجديدة في ذاكرة المتصفح المحلية
    localStorage.setItem('station_1_stock', currentStock);
    
    // تحديث الواجهة
    updateStockUI();
}

// 3. دالة لتحديث نص كمية المخزون على الشاشة
function updateStockUI() {
    stockDisplay.innerText = `${currentStock.toLocaleString('ar-EG')} لتر`;
    
    // تغيير لون النص كإشارة محاسبية ذكية إذا قارب المخزون على الانتهاء
    if (currentStock <= 1000) {
        stockDisplay.style.color = "#721c24"; // أحمر تحذيري
    } else if (currentStock <= 2500) {
        stockDisplay.style.color = "#856404"; // أصفر للمخزون المتوسط
    } else {
        stockDisplay.style.color = "#e65f2b"; // البرتقالي الأساسي للتطبيق
    }
}

// 4. دالة توليد الـ QR Code بالبيانات المحاسبية المحدثة لتبادلها بدون إنترنت
function generateShareCode() {
    // تفريغ أي كود QR قديم تم توليده
    qrContainer.innerHTML = '';
    
    // تحضير كائن البيانات الخفيف الذي سيتم نقله للهواتف الأخرى
    const dataToShare = {
        stationId: 1,
        stockLeft: currentStock,
        updatedAt: new Date().toISOString()
    };

    // تحويل البيانات لنص مضغوط
    const jsonString = JSON.stringify(dataToShare);

    // إظهار قسم الـ QR في الصفحة
    qrSection.style.display = 'block';

    // استخدام المكتبة الخارجية لبناء الـ QR Code داخل حاوية الـ div
    new QRCode(qrContainer, {
        text: jsonString,
        width: 180,
        height: 180,
        colorDark : "#0d5c63", // لون التركواز الخاص بالهوية البصرية للتطبيق
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}