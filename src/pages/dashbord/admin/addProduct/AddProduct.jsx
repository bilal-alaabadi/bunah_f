// ========================= src/pages/admin/products/addProduct/AddProduct.jsx (نهائي) =========================
import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import TextInput from './TextInput';
import SelectInput from './SelectInput';
import UploadImage from './UploadImage';
import { useAddProductMutation } from '../../../../redux/features/products/productsApi';
import { useNavigate } from 'react-router-dom';

const categories = [
  { label: 'أختر منتج', value: '' },
  { label: 'المحامص السعودية', value: 'المحامص السعودية' },
  { label: 'المحامص العمانية', value: 'المحامص العمانية' },
  { label: 'أدوات قهوة', value: 'أدوات قهوة' },
  { label: 'شاي', value: 'شاي' },
];

const WEIGHTS = [
  { label: '١٥٠ جرام', value: 150 },
  { label: '٢٠٠ جرام', value: 200 },
  { label: '٢٥٠ جرام', value: 250 },
];

const ROAST_CATEGORIES = ['المحامص العمانية', 'المحامص السعودية'];

const AddProduct = () => {
  const { user } = useSelector((state) => state.auth);

  const [product, setProduct] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    oldPrice: '',
    inStock: true,
    size: '',
    weightGrams: null,
    stockQty: '' // ← الكمية المتوفرة (إضافة جديدة)
  });

  const [image, setImage] = useState([]);
  const [addProduct, { isLoading }] = useAddProductMutation();
  const navigate = useNavigate();

  const isRoastCategory = useMemo(
    () => ROAST_CATEGORIES.includes(product.category),
    [product.category]
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'ended' && type === 'checkbox') {
      setProduct((prev) => ({ ...prev, inStock: !checked }));
      return;
    }

    if (name === 'category') {
      setProduct((prev) => ({
        ...prev,
        category: value,
        weightGrams: ROAST_CATEGORIES.includes(value) ? prev.weightGrams : null,
      }));
      return;
    }

    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const required = {
      'أسم المنتج': product.name,
      'صنف المنتج': product.category,
      'السعر': product.price,
      'الوصف': product.description,
      'الصور': image.length > 0,
      'الكمية المتوفرة': product.stockQty !== '' // يجب تعبئة الكمية
    };

    if (isRoastCategory) {
      required['الوزن (جرام)'] = !!product.weightGrams;
    }

    if (product.category === 'حناء بودر') {
      required['حجم الحناء'] = product.size;
    }

    const missing = Object.entries(required)
      .filter(([, v]) => !v)
      .map(([k]) => k);

    if (missing.length) {
      alert(`الرجاء ملء الحقول التالية: ${missing.join('، ')}`);
      return;
    }

    try {
      await addProduct({
        ...product,
        // الاسم يُرسل خام بدون وزن — السيرفر هو من يلصق الوزن مرة واحدة
        name: product.name,
        image,
        author: user?._id,
        weightGrams: isRoastCategory ? Number(product.weightGrams) : null,
        stockQty: Number(product.stockQty) // ← إرسال الكمية رقمًا
      }).unwrap();

      alert('تمت أضافة المنتج بنجاح');
      setProduct({
        name: '',
        category: '',
        price: '',
        description: '',
        oldPrice: '',
        inStock: true,
        size: '',
        weightGrams: null,
        stockQty: ''
      });
      setImage([]);
      navigate('/shop');
    } catch (err) {
      console.error('Failed to submit product', err);
      alert('حدث خطأ أثناء إضافة المنتج');
    }
  };

  return (
    <div className="container mx-auto mt-8" dir="rtl">
      <h2 className="text-2xl font-bold mb-6">أضافة منتج جديد</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="أسم المنتج"
          name="name"
          placeholder="أكتب أسم المنتج"
          value={product.name}
          onChange={handleChange}
        />

        <SelectInput
          label="صنف المنتج"
          name="category"
          value={product.category}
          onChange={handleChange}
          options={categories}
        />

        {isRoastCategory && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اختر الوزن
            </label>
            <div className="flex flex-wrap gap-3">
              {WEIGHTS.map((w) => (
                <label
                  key={w.value}
                  className={`cursor-pointer border rounded-lg px-3 py-2 ${
                    Number(product.weightGrams) === w.value
                      ? 'border-amber-600'
                      : 'border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="weightGrams"
                    value={w.value}
                    checked={Number(product.weightGrams) === w.value}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {w.label}
                </label>
              ))}
            </div>
          </div>
        )}

        {product.category === 'حناء بودر' && (
          <TextInput
            label="حجم الحناء (مثال: ٥٠٠ جرام)"
            name="size"
            placeholder="أدخل الحجم"
            value={product.size}
            onChange={handleChange}
          />
        )}

        <TextInput
          label="السعر القديم (اختياري)"
          name="oldPrice"
          type="number"
          placeholder="100"
          value={product.oldPrice}
          onChange={handleChange}
        />

        <TextInput
          label="السعر"
          name="price"
          type="number"
          placeholder="50"
          value={product.price}
          onChange={handleChange}
        />

        {/* الكمية المتوفرة */}
        <TextInput
          label="الكمية المتوفرة"
          name="stockQty"
          type="number"
          placeholder="0"
          min="0"
          value={product.stockQty}
          onChange={handleChange}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="ended"
            name="ended"
            checked={!product.inStock}
            onChange={handleChange}
          />
          <label htmlFor="ended">هل انتهى المنتج؟</label>
        </div>

        <UploadImage
          name="image"
          id="image"
          uploaded={image}
          setImage={setImage}
        />

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            وصف المنتج
          </label>
          <textarea
            name="description"
            id="description"
            className="add-product-InputCSS"
            value={product.description}
            placeholder="اكتب وصف المنتج"
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div>
          <button type="submit" className="add-product-btn" disabled={isLoading}>
            {isLoading ? 'جاري الإضافة...' : 'أضف منتج'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
