// ========================= src/pages/shop/SingleProduct.jsx =========================
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchProductByIdQuery } from '../../../redux/features/products/productsApi';
import { addToCart } from '../../../redux/features/cart/cartSlice';

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data, error, isLoading } = useFetchProductByIdQuery(id);
  const { country } = useSelector((state) => state.cart);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cartQty, setCartQty] = useState(1);

  const isAEDCountry = country === 'الإمارات' || country === 'دول الخليج';
  const currency = isAEDCountry ? 'د.إ' : 'ر.ع.';
  const exchangeRate = isAEDCountry ? 9.5 : 1;

  useEffect(() => {
    // عند تغيير المنتج، اضبط عداد الكمية ليبدأ من 1 ولكن لا يتجاوز المتوفر
    if (data?.stockQty >= 1) {
      setCartQty(1);
    } else {
      setCartQty(0);
    }
  }, [data]);

  if (isLoading) return <p>جاري التحميل...</p>;
  if (error) return <p>حدث خطأ أثناء تحميل تفاصيل المنتج.</p>;
  if (!data) return null;

  const unitPrice = (data.price || 0) * exchangeRate;
  const stock = Number(data.stockQty || 0);
  const isOut = stock <= 0;

  const handleAddToCart = () => {
    if (isOut || cartQty < 1) return;
    dispatch(
      addToCart({
        ...data,
        price: data.price,
        quantity: cartQty,
        currency,
        exchangeRate,
      })
    );
  };

  const nextImage = () =>
    setCurrentImageIndex((prev) =>
      prev === data.image.length - 1 ? 0 : prev + 1
    );

  const prevImage = () =>
    setCurrentImageIndex((prev) =>
      prev === 0 ? data.image.length - 1 : prev - 1
    );

  const decQty = () => {
    setCartQty((q) => {
      const next = q - 1;
      if (next < 1) return 1;
      return next;
    });
  };

  const incQty = () => {
    setCartQty((q) => {
      const next = q + 1;
      if (next > stock) return stock;
      return next;
    });
  };

  return (
    <section className="section__container bg-gradient-to-r mt-8" dir="rtl">
      <div className="flex flex-col items-center md:flex-row gap-8">
        {/* الصور */}
        <div className="md:w-1/2 w-full relative">
          {data.image && data.image.length > 0 ? (
            <>
              <div className="overflow-hidden rounded-md">
                <img
                  src={data.image[currentImageIndex]}
                  alt={data.name}
                  className="w-full h-auto"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/500';
                  }}
                />
              </div>

              {data.image.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#751e26] text-white p-2 rounded-full"
                    aria-label="previous-image"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#751e26] text-white p-2 rounded-full"
                    aria-label="next-image"
                  >
                    ›
                  </button>
                </>
              )}
            </>
          ) : (
            <p>لا توجد صور متاحة.</p>
          )}
        </div>

        {/* التفاصيل */}
        <div className="md:w-1/2 w-full">
          <h3 className="text-2xl font-semibold mb-2">{data.name}</h3>

          {/* حالة/كمية المخزون */}
          <div className="mb-3">
            {isOut ? (
              <span className="inline-block text-sm bg-red-100 text-red-700 px-3 py-1 rounded-md">
                غير متوفر حالياً
              </span>
            ) : (
              <span className="inline-block text-sm bg-green-100 text-green-700 px-3 py-1 rounded-md">
                المتوفر بالمخزون: {stock}
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-1">الفئة: {data.category}</p>
          {data.size && <p className="text-gray-600 mb-1">الحجم: {data.size}</p>}
          <p className="text-gray-600 mb-4">{data.description}</p>

          <div className="text-xl text-[#751e26] mb-6">
            السعر: {unitPrice.toFixed(2)} {currency}
          </div>

          {/* عداد الكمية */}
          <div className="mb-6 flex items-center gap-4">
            <button
              type="button"
              onClick={decQty}
              disabled={isOut || cartQty <= 1}
              className={`w-10 h-10 flex items-center justify-center rounded-md ${
                isOut || cartQty <= 1
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-[#751e26] text-white'
              }`}
            >
              -
            </button>

            <div className="min-w-[3rem] text-center font-bold text-lg">
              {cartQty}
            </div>

            <button
              type="button"
              onClick={incQty}
              disabled={isOut || cartQty >= stock}
              className={`w-10 h-10 flex items-center justify-center rounded-md ${
                isOut || cartQty >= stock
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-[#751e26] text-white'
              }`}
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOut || cartQty < 1}
            className={`px-6 py-3 rounded-md hover:opacity-90 ${
              isOut || cartQty < 1
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-[#751e26] text-white'
            }`}
          >
            إضافة إلى السلة
          </button>
        </div>
      </div>
    </section>
  );
};

export default SingleProduct;
