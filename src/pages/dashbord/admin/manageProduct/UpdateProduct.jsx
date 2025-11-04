// ========================= src/pages/admin/products/updateProduct/UpdateProduct.jsx (نهائي) =========================
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchProductByIdQuery, useUpdateProductMutation } from '../../../../redux/features/products/productsApi';
import { useSelector } from 'react-redux';
import TextInput from '../addProduct/TextInput';
import SelectInput from '../addProduct/SelectInput';
// كمبوننت التعديل (يعرض الحالية + يجمع الجديدة + يتحكم بالإبقاء)
import UploadImage from '../manageProduct/UploadImag';

const categories = [
  { label: 'أختر منتج', value: '' },
  { label: 'المحامص السعودية', value: 'المحامص السعودية' },
  { label: 'المحامص العمانية', value: 'المحامص العمانية' },
  { label: 'أدوات قهوة', value: 'أدوات قهوة' },
  { label: 'شاي', value: 'شاي' },
  { label: 'حناء بودر', value: 'حناء بودر' },
];

const WEIGHTS = [
  { label: '١٥٠ جرام', value: 150 },
  { label: '٢٠٠ جرام', value: 200 },
  { label: '٢٥٠ جرام', value: 250 },
];

const ROAST_CATEGORIES = ['المحامص العمانية', 'المحامص السعودية'];

const ROASTERS = [
  { label: '— بدون تحديد —', value: '' },
  { label: 'محمصة الرياض', value: 'محمصة الرياض' },
  { label: 'محمصة بريهانت', value: 'محمصة بريهانت' },
  { label: 'محمصة اورو', value: 'محمصة اورو' },
  { label: 'محمصة سويل', value: 'محمصة سويل' },
  { label: 'محمصة الفارس الاسود', value: 'محمصة الفارس الاسود' },
  { label: 'محمصة اش', value: 'محمصة اش' },
  { label: 'محمصة ترايسكل', value: 'محمصة ترايسكل' },
  { label: 'محمصة دبليو', value: 'محمصة دبليو' },
  { label: 'محمصة سبعة جرام', value: 'محمصة سبعة جرام' },
  { label: 'محمصة بيت التحميص', value: 'محمصة بيت التحميص' },
  { label: 'محمصة صواع', value: 'محمصة صواع' },
  { label: 'محمصة هاف مليون', value: 'محمصة هاف مليون' },
  { label: 'محمصة عُمق', value: 'محمصة عُمق' },
  { label: 'محمصة 12 كوب', value: 'محمصة 12 كوب' },
  { label: 'محمصة اولالا', value: 'محمصة اولالا' },
  { label: 'محمصة كوف', value: 'محمصة كوف' },
  { label: 'محمصة كفة', value: 'محمصة كفة' },
];

const sizes = [
  { label: 'اختر الحجم', value: '' },
  { label: '1 كيلو', value: '1 كيلو' },
  { label: '500 جرام', value: '500 جرام' },
];

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const { data: productData, isLoading: isFetching, error: fetchError } = useFetchProductByIdQuery(id);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [product, setProduct] = useState({
    name: '',
    category: '',
    size: '',
    price: '',
    oldPrice: '',
    description: '',
    image: [],
    inStock: true,
    weightGrams: null,
    roasterName: '',
  });

  const isRoastCategory = useMemo(
    () => ROAST_CATEGORIES.includes(product.category),
    [product.category]
  );

  const [showSizeField, setShowSizeField] = useState(false);

  // الصور الجديدة (Files)
  const [newImages, setNewImages] = useState([]);
  // الصور التي سنبقيها من الصور الحالية (روابط)
  const [keepImages, setKeepImages] = useState([]);

  useEffect(() => {
    if (!productData) return;

    const p = productData.product ? productData.product : productData;

    const currentImages = Array.isArray(p?.image)
      ? p.image
      : p?.image
      ? [p.image]
      : [];

    setProduct({
      name: p?.name || '',
      category: p?.category || '',
      size: p?.size || '',
      price: p?.price != null ? String(p.price) : '',
      oldPrice: p?.oldPrice != null ? String(p.oldPrice) : '',
      description: p?.description || '',
      image: currentImages,
      inStock: typeof p?.inStock === 'boolean' ? p.inStock : true,
      weightGrams: p?.weightGrams != null ? Number(p.weightGrams) : null,
      roasterName: p?.roasterName || '',
    });

    setKeepImages(currentImages);
    setShowSizeField(p?.category === 'حناء بودر');
  }, [productData]);

  useEffect(() => {
    setShowSizeField(product.category === 'حناء بودر');
  }, [product.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'category') {
      setProduct((prev) => ({
        ...prev,
        category: value,
        weightGrams: ROAST_CATEGORIES.includes(value) ? prev.weightGrams : null,
        roasterName: ROAST_CATEGORIES.includes(value) ? prev.roasterName : '',
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
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('category', product.category);
      formData.append('price', product.price);
      formData.append('oldPrice', product.oldPrice || '');
      formData.append('description', product.description);
      formData.append('size', product.size || '');
      formData.append('author', user?._id || '');
      formData.append('inStock', String(product.inStock));

      if (isRoastCategory) {
        formData.append('weightGrams', String(product.weightGrams));
        formData.append('roasterName', product.roasterName || '');
      } else {
        // ضمان تفريغ هذه القيم في الباك إذا تغيّر الصنف
        formData.append('weightGrams', '');
        formData.append('roasterName', '');
      }

      // الصور التي نُبقيها من القديمة
      formData.append('keepImages', JSON.stringify(keepImages || []));

      // الصور الجديدة
      if (Array.isArray(newImages) && newImages.length > 0) {
        newImages.forEach((file) => formData.append('image', file));
      }

      await updateProduct({ id, body: formData }).unwrap();
      alert('تم تحديث المنتج بنجاح');
      navigate('/dashboard/manage-products');
    } catch (error) {
      alert('حدث خطأ أثناء تحديث المنتج: ' + (error?.data?.message || error?.message || 'خطأ غير معروف'));
    }
  };

  if (isFetching) return <div className="text-center py-8">جاري تحميل بيانات المنتج...</div>;
  if (fetchError) return <div className="text-center py-8 text-red-500">خطأ في تحميل بيانات المنتج</div>;

  return (
    <div className="container mx-auto mt-8 px-4" dir="rtl">
      <h2 className="text-2xl font-bold mb-6 text-right">تحديث المنتج</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="أسم المنتج"
          name="name"
          placeholder="أكتب أسم المنتج"
          value={product.name}
          onChange={handleChange}
          required
        />

        <SelectInput
          label="صنف المنتج"
          name="category"
          value={product.category}
          onChange={handleChange}
          options={categories}
          required
        />

        {isRoastCategory && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اختر الوزن
              </label>
              <div className="flex flex-wrap gap-3">
                {WEIGHTS.map((w) => (
                  <label
                    key={w.value}
                    className={`cursor-pointer border rounded-lg px-3 py-2 ${Number(product.weightGrams) === w.value ? 'border-amber-600' : 'border-gray-300'}`}
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

            <SelectInput
              label="المحمصة (اختياري)"
              name="roasterName"
              value={product.roasterName}
              onChange={handleChange}
              options={ROASTERS}
            />
          </>
        )}

        {showSizeField && (
          <SelectInput
            label="حجم الحناء"
            name="size"
            value={product.size}
            onChange={handleChange}
            options={sizes}
            required={product.category === 'حناء بودر'}
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
          required
        />

        {/* كمبوننت التعديل: يعرض صور حالية + يحذف + يجمع ملفات جديدة */}
        <UploadImage
          name="image"
          id="image"
          initialImages={product.image}
          setImages={setNewImages}
          setKeepImages={setKeepImages}
        />

        <div className="text-right">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            وصف المنتج
          </label>
          <textarea
            name="description"
            id="description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
            value={product.description}
            placeholder="أكتب وصف المنتج"
            onChange={handleChange}
            required
            rows={4}
          />
        </div>

        {/* حالة التوفر */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="availability"
              value="available"
              checked={product.inStock === true}
              onChange={() => setProduct((prev) => ({ ...prev, inStock: true }))}
            />
            <span>المنتج متوفر</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="availability"
              value="ended"
              checked={product.inStock === false}
              onChange={() => setProduct((prev) => ({ ...prev, inStock: false }))}
            />
            <span>انتهى المنتج</span>
          </label>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isUpdating}
          >
            {isUpdating ? 'جاري التحديث...' : 'حفظ التغييرات'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
