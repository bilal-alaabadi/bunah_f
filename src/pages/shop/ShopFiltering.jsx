// ========================= ShopFiltering.jsx (نهائي - عرض أفقي للديسكتوب) =========================
import React from 'react';

const ShopFiltering = ({ filters, filtersState, setFiltersState, clearFilters, isRoastCategory }) => {
  const handleCategoryChange = (e) => {
    const nextCategory = e.target.value;
    setFiltersState((prev) => ({
      ...prev,
      category: nextCategory,
      // عند الدخول/الخروج من فئات المحامص نعيد المحمصة إلى "الكل"
      roasterName: 'الكل',
    }));
  };

  const handleRoasterChange = (name) => {
    setFiltersState((prev) => ({
      ...prev,
      roasterName: name,
    }));
  };

  return (
    <div className="space-y-5 flex-shrink-0" dir="rtl">
      <h3 className="text-xl font-semibold text-[#751e26]">الفلاتر</h3>

      {/* الفئات فقط */}
      <div className="flex flex-col space-y-2">
        <h4 className="font-medium text-lg">الفئة</h4>
        <hr />
        <div className="space-y-2 md:space-y-1">
          {filters.categories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-2 cursor-pointer select-none"
              title={category}
            >
              <input
                type="radio"
                name="category"
                value={category}
                checked={filtersState.category === category}
                onChange={handleCategoryChange}
                className="h-4 w-4 accent-[#751e26]"
              />
              <span className="leading-5">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* فلتر المحامص — يظهر فقط عند اختيار فئة المحامص */}
      {isRoastCategory && (
        <div className="space-y-2">
          <h4 className="font-medium text-lg">المحمصة</h4>
          <hr />

          {/* هاتف: شريط تمرير أفقي (بدون تغيير) */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 md:hidden">
            {filters.roasters.map((r) => {
              const active = filtersState.roasterName === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoasterChange(r)}
                  className={`whitespace-nowrap px-3 py-2 rounded-md border transition-colors ${
                    active
                      ? 'bg-[#751e26] text-white border-[#751e26]'
                      : 'bg-white text-[#751e26] border-[#751e26] hover:text-white'
                  }`}
                  aria-pressed={active}
                >
                  {r}
                </button>
              );
            })}
          </div>

          {/* ديسكتوب: صف أفقي مع التفاف (wrap) — عرضية */}
          <div className="hidden md:flex md:flex-wrap md:gap-2 md:py-2">
            {filters.roasters.map((r) => {
              const active = filtersState.roasterName === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoasterChange(r)}
                  className={[
                    'px-3 py-2 rounded-md border text-sm transition-colors',
                    active
                      ? 'bg-[#751e26] text-white border-[#751e26]'
                      : 'bg-white text-[#751e26] border-[#751e26] hover:text-white',
                  ].join(' ')}
                  aria-pressed={active}
                  title={r}
                >
                  {r}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-gray-500">اختر "الكل" لعرض جميع المحامص.</p>
        </div>
      )}

      {/* مسح الفلاتر */}
      <button
        onClick={clearFilters}
        className="bg-[#751e26] py-1.5 px-4 text-white rounded w-full md:w-auto"
      >
        مسح كل الفلاتر
      </button>
    </div>
  );
};

export default ShopFiltering;
