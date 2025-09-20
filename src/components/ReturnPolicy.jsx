// src/pages/ReturnPolicy.jsx
import React from "react";

const ReturnPolicy = () => {
  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm">
        
        {/* العنوان الرئيسي */}
        <h1 className="text-2xl md:text-3xl font-bold text-center text-[#751e26] mb-6">
          سياسة الاسترجاع – بُنة
        </h1>

        {/* النص الرئيسي */}
        <div className="space-y-6 text-right text-gray-700 leading-relaxed text-lg">
          <p>
            حرصنا الأول هو رضاك واستمتاعك بفنجان قهوة مميز.  
          </p>

          <ul className="list-disc pr-5 space-y-3">
            <li>
              البن منتج طازج وغذائي، لذلك لا يمكن استرجاع العبوات المفتوحة أو المستخدمة.
            </li>
            <li>
              إذا وصلك المنتج تالف أو مختلف عن طلبك، بلغنا خلال{" "}
              <span className="font-semibold text-[#751e26]">3 أيام من الاستلام</span>{" "}
              وسنبدله لك أو نرجع المبلغ.
            </li>
            <li>
              كل ما عليك هو التواصل معنا عبر{" "}
              <span className="font-semibold">[وسيلة التواصل]</span>{" "}
              وسنخدمك بأسرع وقت.
            </li>
          </ul>

          <p className="text-center text-xl font-semibold text-[#751e26] mt-8">
            معنا، ثقتك في كل فنجان ☕
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
