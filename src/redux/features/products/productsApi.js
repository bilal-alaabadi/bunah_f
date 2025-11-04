// ========================= src/redux/features/products/productsApi.js (نهائي) =========================
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/baseURL";

const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/products`,
    credentials: "include",
  }),
  tagTypes: ["Product", "ProductList"],
  endpoints: (builder) => ({

    // جلب جميع المنتجات مع الفلاتر (الفئة + المحمصة + السعر + البحث + الترتيب + الترقيم)
    fetchAllProducts: builder.query({
      query: ({
        category,
        roasterName,           // 👈 مهم لفلترة المحامص
        minPrice,
        maxPrice,
        search,
        sort = "createdAt:desc",
        page = 1,
        limit = 10,
      }) => {
        const params = {
          page: String(page),
          limit: String(limit),
          sort,
        };

        // الفئة
        if (category && category !== "الكل" && category !== "all") {
          params.category = category;
        }

        // المحمصة — فقط إذا أرسلت وليست "الكل"
        if (roasterName && roasterName !== "الكل" && roasterName !== "all") {
          params.roasterName = roasterName;
        }

        // السعر
        if (minPrice !== undefined && minPrice !== null && minPrice !== "") {
          params.minPrice = String(minPrice);
        }
        if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") {
          params.maxPrice = String(maxPrice);
        }

        // البحث (اختياري — إذا كان لديك راوتر يدعمه)
        if (search && search.trim()) {
          params.search = search.trim();
        }

        const queryParams = new URLSearchParams(params).toString();
        return `/?${queryParams}`;
      },
      transformResponse: (response) => ({
        products: response.products,
        totalPages: response.totalPages,
        totalProducts: response.totalProducts,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ _id }) => ({ type: "Product", id: _id })),
              "ProductList",
            ]
          : ["ProductList"],
    }),

    // جلب منتج واحد بالتفصيل
    fetchProductById: builder.query({
      query: (id) => `/product/${id}`,
      transformResponse: (response) => {
        if (!response?.product) {
          throw new Error("المنتج غير موجود");
        }
        const { product } = response;
        return {
          _id: product._id,
          name: product.name,
          category: product.category,
          size: product.size || "",
          price: product.price,
          oldPrice: product.oldPrice || "",
          description: product.description,
          image: Array.isArray(product.image) ? product.image : [product.image],
          author: product.author,
          weightGrams: product.weightGrams ?? null,
          roasterName: product.roasterName ?? "",
          inStock: product.inStock,
        };
      },
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // منتجات مرتبطة (إن كان الراوتر موجود)
    fetchRelatedProducts: builder.query({
      query: (id) => `/related/${id}`,
      providesTags: (result, error, id) => [
        { type: "Product", id },
        "ProductList",
      ],
    }),

    // إضافة منتج جديد
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/create-product",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["ProductList"],
    }),

    // تحديث المنتج
    updateProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: `/update-product/${id}`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        "ProductList",
      ],
    }),

    // حذف المنتج
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Product", id },
        "ProductList",
      ],
    }),

    // بحث (اختياري حسب راوتر السيرفر لديك)
    searchProducts: builder.query({
      query: (searchTerm) => `/search?q=${encodeURIComponent(searchTerm)}`,
      transformResponse: (response) =>
        response.map((product) => ({
          ...product,
          images: Array.isArray(product.image) ? product.image : [product.image],
        })),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Product", id: _id })),
              "ProductList",
            ]
          : ["ProductList"],
    }),

    // الأكثر مبيعاً (إن كان الراوتر موجود)
    fetchBestSellingProducts: builder.query({
      query: (limit = 4) => `/best-selling?limit=${limit}`,
      providesTags: ["ProductList"],
    }),
  }),
});

export const {
  useFetchAllProductsQuery,
  useLazyFetchAllProductsQuery,
  useFetchProductByIdQuery,
  useLazyFetchProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useFetchRelatedProductsQuery,
  useSearchProductsQuery,
  useLazySearchProductsQuery,
  useFetchBestSellingProductsQuery,
} = productsApi;

export default productsApi;
