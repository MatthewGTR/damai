import { useNavigate } from 'react-router-dom';
import { Heart, LogIn, LayoutDashboard, Home, Image as ImageIcon, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SEOHead } from '../components/SEOHead';

export function AboutUs() {
  const navigate = useNavigate();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    setIsAdminLoggedIn(!!adminData);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="About Us - Pusat Jagaan Warga Tua Damai | FAQs & Information"
        description="Learn about Pusat Jagaan Warga Tua Damai - established since 2000, caring for 111 elderly residents with 12 dedicated staff. Monthly expenses, locations, and how we help homeless seniors in Malaysia."
        keywords="about pusat jagaan, elderly care malaysia, nursing home information, old folk home cheras, senior care faqs, nursing home expenses, elderly care center malaysia, 乐善社老人残障中心"
        breadcrumbs={[
          { name: 'Home', item: 'https://pusatjagaanwargatuadamai.com' },
          { name: 'About Us', item: 'https://pusatjagaanwargatuadamai.com/about' }
        ]}
      />
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-gray-900 text-sm sm:text-lg leading-tight truncate">Pusat Jagaan Warga Tua Damai</div>
                <div className="text-xs sm:text-sm text-gray-600 truncate">乐善社老人残障中心 (002483925-H)</div>
              </div>
            </div>
            {isAdminLoggedIn ? (
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm sm:text-base font-semibold rounded-full hover:from-red-600 hover:to-rose-700 transition-all shadow-md hover:shadow-lg flex-shrink-0 ml-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
            ) : (
              <a
                href="/admin/login"
                className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm sm:text-base font-semibold rounded-full hover:from-red-600 hover:to-rose-700 transition-all shadow-md hover:shadow-lg flex-shrink-0 ml-2"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Admin Login</span>
              </a>
            )}
          </div>

          <div className="flex gap-2 pb-4 overflow-x-auto">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 border-b-2 border-transparent hover:border-red-600 transition-all whitespace-nowrap"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm sm:text-base">Home | 主页</span>
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 text-red-600 border-b-2 border-red-600 whitespace-nowrap"
            >
              <Heart className="w-4 h-4" />
              <span className="text-sm sm:text-base">About Us | 关于我们</span>
            </button>
            <button
              onClick={() => navigate('/gallery')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 border-b-2 border-transparent hover:border-red-600 transition-all whitespace-nowrap"
            >
              <ImageIcon className="w-4 h-4" />
              <span className="text-sm sm:text-base">Gallery | 图库</span>
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 border-b-2 border-transparent hover:border-red-600 transition-all whitespace-nowrap"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm sm:text-base">Contact | 联系我们</span>
            </button>
          </div>
        </div>
      </nav>

      <section className="py-12 sm:py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">About Us | 关于我们</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600">Frequently Asked Questions | 常见问题</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border-l-4 border-red-600">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">1）When was the center established? | 中心是在几时成立的？</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Established on <span className="font-semibold text-red-600">18th February 2000</span> - celebrating 25 years of service. We operate three care homes in the same area.
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-2">
                <span className="font-semibold text-red-600">18-2-2000年</span>成立了25年，同一区有三间老人院。
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border-l-4 border-red-600">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">2）How many members are in the center? | 中心里有多少位成员？</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                <span className="font-semibold">Pusat Jagaan Warga Tua Damai</span> is a non-profit organization (NGO). Currently, we care for <span className="font-semibold text-red-600">111 elderly residents</span> with a dedicated team of <span className="font-semibold text-red-600">12 staff members</span>.
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-2">
                乐善社老人残障中心是非政府盈利组织（NGO），目前有<span className="font-semibold text-red-600">111位公公婆婆们</span>及<span className="font-semibold text-red-600">12位员工</span>。
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border-l-4 border-red-600">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">3）What are the center's goals? | 中心成立的目标？</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Our mission is to help homeless elderly individuals by providing them with a safe and comfortable home. We ensure they receive three nutritious meals daily and live their remaining years with dignity and happiness.
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-2">
                乐善社成立的目标是希望帮助更多无家可归的老人家，让他们可以有一个安乐窝居住。同时也提供食物给公公婆婆们让他们有三餐温饱，快乐度过他们的余生。
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border-l-4 border-red-600">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">4）What are the monthly expenses? | 中心的每个月的花费？</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Our monthly operational expenses total <span className="font-semibold text-red-600 text-lg sm:text-xl">RM 105,935.00</span>
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-2 mb-4">
                中心每个月开支为<span className="font-semibold text-red-600 text-lg sm:text-xl">RM 105,935.00</span>
              </p>
              <div className="mt-4 bg-gray-50 rounded-lg p-3 sm:p-4">
                <img
                  src="/WhatsApp Image 2025-11-04 at 17.26.42.jpeg"
                  alt="Detailed monthly expenses breakdown chart showing RM 105,935 operational costs for Pusat Jagaan Warga Tua Damai elderly care center"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border-l-4 border-red-600">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">5）What are the center addresses? | 中心地址？</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
                We have three homes in the same area where our residents live separately:
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
                我们同一区有三间，公公婆婆们都分开住。
              </p>
              <div className="space-y-3 ml-0 sm:ml-4">
                <div className="bg-red-50 rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm font-semibold text-red-600 mb-1">Location 1 | 地址1:</p>
                  <p className="text-xs sm:text-sm text-gray-700">No. 24, Jalan Damai Perdana 2/6F, Bandar Damai Perdana, Cheras 56000</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm font-semibold text-red-600 mb-1">Location 2 | 地址2:</p>
                  <p className="text-xs sm:text-sm text-gray-700">No. 30, Jalan Damai Perdana 2/6B, Bandar Damai Perdana, Cheras 56000</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm font-semibold text-red-600 mb-1">Location 3 | 地址3:</p>
                  <p className="text-xs sm:text-sm text-gray-700">No. 16, Jalan Damai Perdana 2/6B, Bandar Damai Perdana, Cheras 56000</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border-l-4 border-red-600">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">6）Age range and ethnic groups? | 中心年龄&宗族？</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Our residents range from <span className="font-semibold text-red-600">40 to 97 years old</span>. We care for three major ethnic groups and persons with disabilities (OKU).
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-2">
                <span className="font-semibold text-red-600">40到97岁</span>，中心有三大宗族及残障人士（OKU）。
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border-l-4 border-red-600">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">7）What items does the center need? | 中心需要的物品？</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-red-600 mb-1">Daily Food Needs | 每日需要的食品:</p>
                  <p className="text-xs sm:text-sm text-gray-700">Vegetables, boneless fish, chicken | 菜、没骨的鱼、鸡肉</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-red-600 mb-1">Daily Supplies | 每日需要的日常用品:</p>
                  <p className="text-xs sm:text-sm text-gray-700">Adult diapers Size M / L / XL | 成年纸尿片Size M-L-XL</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-red-600 mb-1">Medical Supplies | 每日需要的物品:</p>
                  <p className="text-xs sm:text-sm text-gray-700">Ensure Gold / Glucerna adult milk formula | 成年奶粉Ensure Gold/Glucerna</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border-l-4 border-red-600">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">8）Are the premises rented or owned? | 老人院中心-租/属于自己？</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                All three homes in our area are rented. Monthly rental total: <span className="font-semibold text-red-600 text-lg">RM 6,700</span>
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-2">
                我们同一区三间老人院都是租的，每个月租金为<span className="font-semibold text-red-600 text-lg">RM 6,700</span>。
              </p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border-l-4 border-red-600">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">9）Registration details? | 老人院中心注册？</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-red-600 mb-1">Center Names | 中心名字:</p>
                  <p className="text-xs sm:text-sm text-gray-700">• 乐善社老人残障中心</p>
                  <p className="text-xs sm:text-sm text-gray-700">• Pusat Jagaan Warga Tua Damai</p>
                  <p className="text-xs sm:text-sm text-gray-700">• Bandar Damai Home Care</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-800 pt-6 sm:pt-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-600 flex items-center justify-center">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" />
                </div>
                <div className="text-left">
                  <div className="text-sm sm:text-base font-bold text-white">Pusat Jagaan Warga Tua Damai</div>
                  <div className="text-xs sm:text-sm text-gray-400">乐善社老人残障中心</div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mb-2 px-4">
                Non-profit organisation (002483925-H) dedicated to elderly and disabled care in Malaysia
              </p>
              <p className="text-xs text-gray-500">
                &copy; 2025 Pusat Jagaan Warga Tua Damai. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
