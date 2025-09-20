// src/pages/About.jsx
import React from "react";
// يمكنك استبدال الصورة لاحقًا
import brandImg from "../assets/ChatGPT Image Sep 20, 2025, 01_33_32 PM.png";

const About = () => {
  return (
    <div dir="rtl" className="bg-white text-gray-800">
      {/* Hero / Intro */}
      <section className="max-w-6xl mx-auto py-16 px-4 md:px-8">
        <div className="flex flex-col md:flex-row-reverse items-center gap-10">
          {/* الصورة */}
          <div className="md:w-1/2">
            <img
              src={brandImg}
              alt="بنّة | شغف القهوة"
              className="w-full max-w-md mx-auto rounded-2xl "
            />
          </div>

          {/* النص */}
          <div className="md:w-1/2">
            <h2 className="text-4xl font-extrabold text-[#751e26] mb-3">
              بنّة
            </h2>
            <p className="text-xl font-medium text-[#751e26] mb-6">
              شغفنا بالقهوة يقودنا لاختيار أجود المحاصيل من عدة محامص عالمية.
            </p>

            <p className="text-lg leading-8 mb-4">
              نُقدّم لك بنًا مُحمّصًا بعناية وتجارب مذاق متنوّعة تُلبّي ذائقة كل
              عاشق قهوة. نختار المحاصيل بدقّة من مزارع معروفة بالاستدامة
              والشفافية، ونعمل مع محامص مرموقة لضمان نكهة مُتّزنة وهوية واضحة في
              كل فنجان.
            </p>

            <p className="leading-8 mb-4">
              في <span className="font-semibold text-[#751e26]">بنّة</span> نؤمن
              بأن القهوة رحلة تبدأ من الحقل ولا تنتهي عند الفنجان. لذلك نهتم
              بدرجات التحميص المختلفة، وتوفیر خيارات طحن تناسب طرق التحضير
              المتنوعة، لتجربة قهوة ممتعة ومتكرّرة كل يوم.
            </p>

            <div className="mt-6 p-6 rounded-2xl border border-gray-200 bg-gray-50">
              <h3 className="text-2xl font-semibold text-[#751e26] mb-3">
                رؤيتنا
              </h3>
              <ul className="space-y-2 list-disc pr-5">
                <li>اختيار محاصيل مختصّة ذات شفافية في المصدر والتجفيف.</li>
                <li>تحميص مدروس يُبرز الملامح الحسية لكل منشأ.</li>
                <li>تجارب تذوّق تُناسب المبتدئ والخبير على حد سواء.</li>
              </ul>
            </div>

            <p className="mt-8 text-lg font-medium text-[#751e26]">
              بنّة… لكل ذائقة قصّة قهوة تستحق أن تُروى.
            </p>
          </div>
        </div>

        {/* أقسام العلامة */}
        <div className="mt-16">
          <h3 className="text-2xl md:text-3xl font-bold text-[#751e26] mb-6">
            ماذا نقدّم؟
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="rounded-2xl border border-gray-200 p-5 hover:shadow-md transition">
              <h4 className="font-semibold text-[#751e26] mb-2">
                المحامص السعودية
              </h4>
              <p className="text-sm leading-6 text-gray-700">
                تشكيلة مختارة من محامص متخصصة بذائقة جزيرة العرب، بنكهة جريئة
                ومتوازنة.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-5 hover:shadow-md transition">
              <h4 className="font-semibold text-[#751e26] mb-2">
                المحامص العُمانية
              </h4>
              <p className="text-sm leading-6 text-gray-700">
                تحميص بلمسة محلية يراعي تنوّع طرق التحضير في عُمان وذائقة
                عشّاق القهوة.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-5 hover:shadow-md transition">
              <h4 className="font-semibold text-[#751e26] mb-2">أدوات قهوة</h4>
              <p className="text-sm leading-6 text-gray-700">
                أدوات دقيقة للتحضير: في60، كيمكس، موكا، مكابس وغيره—مع إرشادات
                الطحن المناسبة.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-5 hover:shadow-md transition">
              <h4 className="font-semibold text-[#751e26] mb-2">شاي</h4>
              <p className="text-sm leading-6 text-gray-700">
                مختارات شاي مُوازية لتجربتك اليومية—نقاء المذاق وتوازن العطر.
              </p>
            </div>
          </div>
        </div>

        {/* ميزات سريعة */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-5 text-center">
            <div className="text-sm text-gray-600 mb-1">مستويات التحميص</div>
            <div className="text-lg font-semibold text-[#751e26]">
              فاتح · متوسط · داكن
            </div>
          </div>
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-5 text-center">
            <div className="text-sm text-gray-600 mb-1">طرق التحضير</div>
            <div className="text-lg font-semibold text-[#751e26]">
              في60 · كيمكس · إسبرسو · موكا
            </div>
          </div>
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-5 text-center">
            <div className="text-sm text-gray-600 mb-1">الطحن</div>
            <div className="text-lg font-semibold text-[#751e26]">
              حسب الطلب لكل طريقة
            </div>
          </div>
        </div>

        {/* ختام */}
        <div className="text-center mt-16">
          <p className="text-xl font-semibold text-[#751e26]">
            فنجانك القادم يبدأ من بنّة.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
