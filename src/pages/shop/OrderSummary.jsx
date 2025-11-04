// ========================= src/components/Cart/OrderSummary.jsx =========================
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../../redux/features/cart/cartSlice';

const OrderSummary = ({ onClose }) => {
  const dispatch = useDispatch();
  const { products = [], totalPrice = 0 } = useSelector((s) => s.cart);

  const currency = 'ر.ع.';
  const shippingOMR = 2;
  const grandTotal = Number(totalPrice) + shippingOMR;

  // رقم واتساب (بدون +)
  const waNumber = '96897531116';

  // تجهيز النص المرسل في الرسالة
  const lines = products.map((p) => `- ${p.name} × ${p.quantity}`).join('\n');

  const message =
`مرحباً، أود إكمال طلبي من موقعكم.
المنتجات:
${lines || '- (لا توجد منتجات)'}
--------------------------
الإجمالي الفرعي: ${totalPrice.toFixed(2)} ${currency}
الشحن: ${shippingOMR.toFixed(2)} ${currency}
المجموع الكلي: ${grandTotal.toFixed(2)} ${currency}
--------------------------
الاسم:
الولاية:
العنوان التفصيلي:
رقم الهاتف:
ملاحظات:`;

  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="text-sm text-gray-800" dir="rtl">
      {/* المجاميع */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">الإجمالي الفرعي</span>
          <span className="font-medium">{totalPrice.toFixed(2)} {currency}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">الشحن</span>
          <span className="font-medium">{shippingOMR.toFixed(2)} {currency}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="font-bold text-base">المجموع</span>
          <span className="font-extrabold text-base">{grandTotal.toFixed(2)} {currency}</span>
        </div>
      </div>

      {/* الأزرار */}
      <div className="mt-3 space-y-2">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className={`block w-full text-center rounded-md py-2.5 text-sm font-medium transition-colors ${
            products.length === 0
              ? 'bg-gray-300 text-white pointer-events-none cursor-not-allowed'
              : 'bg-[#751e26] text-white hover:bg-[#6a1a26]'
          }`}
        >
          المتابعة للدفع عبر واتساب
        </a>

        <button
          onClick={() => dispatch(clearCart())}
          className="w-full rounded-md border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          مسح السلة
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
