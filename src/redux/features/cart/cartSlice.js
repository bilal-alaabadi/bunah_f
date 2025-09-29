import { createSlice } from "@reduxjs/toolkit";

/* ------------------------ أدوات تخزين الحالة محليًا ------------------------ */
// افتراضيات السلة
const DEFAULTS = {
  products: [],
  selectedItems: 0,
  totalPrice: 0,   // بالعملة الأساسية (ر.ع.)
  shippingFee: 2,  // بالعملة الأساسية
  country: "عمان",
  giftCard: null,  // { from, to, phone, note }
};

// استعادة الحالة من localStorage إن وجدت
const loadState = () => {
  try {
    const raw = localStorage.getItem("cartState");
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULTS, ...parsed };
  } catch {
    return { ...DEFAULTS };
  }
};

// حفظ الحالة
const saveState = (state) => {
  try {
    localStorage.setItem("cartState", JSON.stringify(state));
  } catch (err) {
    console.error("Failed to save cart state:", err);
  }
};

/* ------------------------ دوال مساعدة للحسابات ------------------------ */
const trim = (v) => (v ?? "").toString().trim();
const hasGiftValues = (gc) =>
  !!(gc && (trim(gc.from) || trim(gc.to) || trim(gc.phone) || trim(gc.note)));

const makeLineKey = (p) => {
  const id = p?._id || p?.productId || "";
  const m = p?.measurements ? JSON.stringify(p.measurements) : "{}";

  let gift = "{}";
  if (hasGiftValues(p?.giftCard)) {
    const norm = {
      from: trim(p.giftCard.from),
      to: trim(p.giftCard.to),
      phone: trim(p.giftCard.phone),
      note: trim(p.giftCard.note),
    };
    gift = JSON.stringify(norm);
  }

  return `${id}::${m}::${gift}`;
};

// حساب إجمالي السطر بعد خصم الأزواج
const lineTotalBase = (product) => {
  const unit = Number(product.price || 0);
  const qty = Number(product.quantity || 0);
  const isShayla =
    product.category === "الشيلات فرنسية" ||
    product.category === "الشيلات سادة";
  const pairs = isShayla ? Math.floor(qty / 2) : 0;
  const pairDiscount = pairs * 1;
  const subtotal = unit * qty;
  return Math.max(0, subtotal - pairDiscount);
};

// مجاميع
export const setSelectedItems = (state) =>
  state.products.reduce((total, product) => total + Number(product.quantity || 0), 0);

export const setTotalPrice = (state) =>
  state.products.reduce((total, product) => total + lineTotalBase(product), 0);

/* ------------------------ الحالة الابتدائية ------------------------ */
const initialState = loadState();

/* ------------------------ الـ Slice ------------------------ */
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // إضافة عنصر
    addToCart: (state, action) => {
      const payload = action.payload;
      const _id = payload._id || payload.productId;
      const quantityToAdd = Math.max(1, Number(payload.quantity || 1));
      const stockQty = Number(payload.stockQty ?? Infinity); // الكمية المتاحة
      const lineKey = makeLineKey(payload);

      const existing = state.products.find(
        (p) => p._id === _id && makeLineKey(p) === lineKey
      );

      if (existing) {
        const newQty = Math.min(existing.quantity + quantityToAdd, stockQty);
        existing.quantity = newQty;
      } else {
        state.products.push({
          ...payload,
          _id,
          quantity: Math.min(quantityToAdd, stockQty),
        });
      }

      state.selectedItems = setSelectedItems(state);
      state.totalPrice = setTotalPrice(state);
      saveState(state);
    },

    // تحديث الكمية
    updateQuantity: (state, action) => {
      const { id, type, lineKey } = action.payload;
      const product = state.products.find((p) => {
        if (lineKey) return makeLineKey(p) === lineKey;
        return p._id === id;
      });

      if (product) {
        const stockQty = Number(product.stockQty ?? Infinity);

        if (type === "increment") {
          if (product.quantity < stockQty) {
            product.quantity += 1;
          }
        } else if (type === "decrement" && product.quantity > 1) {
          product.quantity -= 1;
        }
      }

      state.selectedItems = setSelectedItems(state);
      state.totalPrice = setTotalPrice(state);
      saveState(state);
    },

    // إزالة عنصر
    removeFromCart: (state, action) => {
      let id, lineKey;
      if (typeof action.payload === "string") {
        id = action.payload;
      } else {
        id = action.payload?.id;
        lineKey = action.payload?.lineKey;
      }

      state.products = state.products.filter((p) => {
        if (lineKey) return makeLineKey(p) !== lineKey;
        return p._id !== id;
      });

      state.selectedItems = setSelectedItems(state);
      state.totalPrice = setTotalPrice(state);
      saveState(state);
    },

    // تفريغ السلة
    clearCart: (state) => {
      state.products = [];
      state.selectedItems = 0;
      state.totalPrice = 0;
      state.giftCard = null;
      saveState(state);
    },

    // تغيير الدولة (يضبط الشحن)
    setCountry: (state, action) => {
      state.country = action.payload;
      if (action.payload === "الإمارات") {
        state.shippingFee = 4;
      } else if (action.payload === "دول الخليج") {
        state.shippingFee = 5;
      } else {
        state.shippingFee = 2;
      }
      saveState(state);
    },

    // تحميل حالة مخصّصة
    loadCart: (state, action) => {
      const merged = { ...DEFAULTS, ...(action.payload || {}) };
      saveState(merged);
      return merged;
    },

    // بطاقة الهدية
    setGiftCard: (state, action) => {
      const { from = "", to = "", phone = "", note = "" } = action.payload || {};
      const allEmpty = [from, to, phone, note].every((v) => !String(v || "").trim());
      state.giftCard = allEmpty ? null : { from, to, phone, note };
      saveState(state);
    },

    clearGiftCard: (state) => {
      state.giftCard = null;
      saveState(state);
    },
  },
});

/* ------------------------ التصدير ------------------------ */
export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  setCountry,
  loadCart,
  setGiftCard,
  clearGiftCard,
} = cartSlice.actions;

export default cartSlice.reducer;
