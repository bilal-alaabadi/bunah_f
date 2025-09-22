// Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CartModal from '../pages/shop/CartModal';
import avatarImg from "../assets/avatar.png";
import { useLogoutUserMutation } from '../redux/features/auth/authApi';
import { logout } from '../redux/features/auth/authSlice';
import log from "../assets/Bunnah_logo_no_bg.png";
import { setCountry } from '../redux/features/cart/cartSlice';

const Navbar = () => {
  const { products, country } = useSelector((state) => state.cart);
  const itemsCount = useSelector((state) =>
    (state.cart.products || []).reduce((t, p) => t + Number(p?.quantity || 0), 0)
  );

  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleCartToggle = () => setIsCartOpen(!isCartOpen);
  const handleDropDownToggle = () => setIsDropDownOpen(!isDropDownOpen);
  const handleMobileMenuToggle = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleCountryChange = (e) => dispatch(setCountry(e.target.value));

  const adminMenus = [
    { label: "لوحة التحكم", path: "/dashboard/admin" },
    { label: "إدارة العناصر", path: "/dashboard/manage-products" },
    { label: "جميع الطلبات", path: "/dashboard/manage-orders" },
    { label: "إضافة منتج", path: "/dashboard/add-product" },
  ];
  const userMenus = [{ label: "لوحة التحكم", path: "/dashboard" }];
  const dropdownMenus = user?.role === 'admin' ? adminMenus : userMenus;

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      navigate('/');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <>
      <div aria-hidden className={`w-full ${isScrolled ? 'h-20 md:h-24' : 'h-24 md:h-32'}`} />

      <header
        className={[
          "fixed top-0 left-0 right-0 z-50 bg-white shadow-sm transition-all duration-300",
          isScrolled ? "py-2" : "pt-6"
        ].join(" ")}
      >
        <div className="mx-auto px-4">
          {/* Mobile Navbar */}
          <div className={[
              "md:hidden flex items-center justify-between transition-all duration-300",
              isScrolled ? "h-14 mb-0 pb-3 pt-2" : "h-16 mb-1 pb-5 pt-3"
            ].join(" ")}
          >
            <button
              onClick={handleMobileMenuToggle}
              className="text-[#751e26] text-2xl"
            >
              <i className="ri-menu-line"></i>
            </button>

            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link to="/">
                <img
                  src={log}
                  alt="الشعار"
                  className={[
                    "object-contain transition-[height,transform] duration-300 will-change-transform",
                    isScrolled ? "h-20 scale-95" : "h-24"
                  ].join(" ")}
                />
              </Link>
            </div>

            <div className="flex items-center gap-4" dir="rtl">
              {user ? (
                <div className="relative">
                  <img
                    onClick={handleDropDownToggle}
                    src={user?.profileImage || avatarImg}
                    alt="صورة المستخدم"
                    className={[
                      "rounded-full cursor-pointer border-2 border-gray-200 transition-all duration-300",
                      isScrolled ? "w-9 h-9" : "w-10 h-10"
                    ].join(" ")}
                  />
                  {isDropDownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <ul className="py-2">
                        {dropdownMenus.map((menu, idx) => (
                          <li key={idx}>
                            <Link
                              to={menu.path}
                              onClick={() => setIsDropDownOpen(false)}
                              className="block px-4 py-3 text-lg text-[#751e26]"
                            >
                              {menu.label}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-right px-4 py-3 text-lg text-[#751e26]"
                          >
                            تسجيل الخروج
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="text-[#751e26] text-2xl">
                  <i className="ri-user-line"></i>
                </Link>
              )}

              <button
                onClick={handleCartToggle}
                className="relative text-[#751e26] text-2xl"
              >
                <i className="ri-shopping-bag-line"></i>
                {itemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#42a0ec] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Navbar */}
          <div className={[
              "hidden md:flex items-center justify-between transition-all duration-300",
              isScrolled ? "h-16 pb-3" : "h-20 pb-5"
            ].join(" ")}
          >
            <div className="flex items-center gap-6">
              <select
                value={country}
                onChange={handleCountryChange}
                className="p-2 border rounded-md bg-white text-[#751e26]"
              >
                <option value="عمان">عمان (ر.ع.)</option>
                <option value="دول الخليج">دول الخليج (د.إ)</option>
              </select>

              <button
                onClick={handleCartToggle}
                className="relative text-[#751e26]"
              >
                <i className="ri-shopping-bag-line"></i>
                {itemsCount > 0 && (
                  <span className={[
                      "absolute -top-2 -right-2 bg-[#42a0ec] text-white rounded-full flex items-center justify-center",
                      isScrolled ? "text-xs w-5 h-5" : "text-sm w-6 h-6"
                    ].join(" ")}
                  >
                    {itemsCount}
                  </span>
                )}
              </button>
            </div>

            <div className="flex-grow flex justify-center">
              <Link to="/">
                <img
                  src={log}
                  alt="الشعار"
                  className={[
                    "object-contain transition-[height,transform] duration-300 will-change-transform",
                    isScrolled ? "h-24 scale-95" : "h-32"
                  ].join(" ")}
                />
              </Link>
            </div>

            <div className="flex items-center gap-4" dir="rtl">
              {user ? (
                <div className="relative">
                  <img
                    onClick={handleDropDownToggle}
                    src={user?.profileImage || avatarImg}
                    alt="صورة المستخدم"
                    className={[
                      "rounded-full cursor-pointer border-2 border-gray-200 transition-all duration-300",
                      isScrolled ? "w-10 h-10" : "w-12 h-12"
                    ].join(" ")}
                  />
                  {isDropDownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <ul className="py-2">
                        {(user?.role === 'admin' ? adminMenus : userMenus).map((menu, idx) => (
                          <li key={idx}>
                            <Link
                              to={menu.path}
                              onClick={() => setIsDropDownOpen(false)}
                              className="block px-4 py-3 text-lg text-[#751e26]"
                            >
                              {menu.label}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-right px-4 py-3 text-lg text-[#751e26]"
                          >
                            تسجيل الخروج
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="text-[#751e26] text-3xl">
                  <i className="ri-user-line"></i>
                </Link>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex justify-center border-t border-gray-200 py-3 mt-1">
            <div className="flex gap-10">
              <Link to="/shop" className="text-[#751e26] font-bold text-xl">
                المنتجات
              </Link>
              <Link to="/" className="text-[#751e26] font-bold text-xl">
                الصفحة الرئيسية
              </Link>
              <Link to="/about" className="text-[#751e26] font-bold text-xl">
                من نحن
              </Link>
            </div>
          </nav>
        </div>

        {/* Mobile Sliding Menu */}
        <div className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl transition-transform duration-300 ${isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="px-6 py-6 flex flex-col items-center gap-4">
              <button
                onClick={handleMobileMenuToggle}
                className="absolute top-4 left-4 text-gray-500 text-2xl"
              >
                <i className="ri-close-line"></i>
              </button>

              <div className="w-full">
                <label htmlFor="countrySelectMobile" className="block text-sm text-[#751e26] mb-2 text-right">
                  اختر الدولة لعرض الأسعار:
                </label>
                <select
                  id="countrySelectMobile"
                  value={country}
                  onChange={handleCountryChange}
                  className="w-full p-3 text-lg border-2 border-gray-300 text-[#751e26] rounded-lg bg-white"
                >
                  <option value="عمان">عمان 🇴🇲 (ر.ع.)</option>
                  <option value="دول الخليج">دول الخليج (د.إ)</option>
                </select>
              </div>

              <Link to="/shop" onClick={handleMobileMenuToggle} className="w-full text-center py-4 px-6 font-medium text-xl text-[#751e26]">
                المنتجات
              </Link>
              <Link to="/" onClick={handleMobileMenuToggle} className="w-full text-center py-4 px-6 font-medium text-xl text-[#751e26]">
                الصفحة الرئيسية
              </Link>
              <Link to="/about" onClick={handleMobileMenuToggle} className="w-full text-center py-4 px-6 font-medium text-xl text-[#751e26]">
                من نحن
              </Link>
            </div>
          </div>
        </div>

        {/* Cart Modal */}
        {isCartOpen && (
          <CartModal
            products={products}
            isOpen={isCartOpen}
            onClose={handleCartToggle}
          />
        )}
      </header>
    </>
  );
};

export default Navbar;
