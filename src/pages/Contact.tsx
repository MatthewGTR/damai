import { useNavigate } from 'react-router-dom';
import { Heart, LogIn, LayoutDashboard, Home, Phone, Mail, MapPin, Building2, AlertTriangle, Clock, HandHeart, Landmark, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SEOHead } from '../components/SEOHead';

export function Contact() {
  const navigate = useNavigate();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    setIsAdminLoggedIn(!!adminData);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Contact Us - Pusat Jagaan Warga Tua Damai | Get in Touch"
        description="Contact Pusat Jagaan Warga Tua Damai elderly care center. Find our addresses in Cheras, Kuala Lumpur, banking details for donations, and how to support our mission of caring for seniors."
        keywords="contact pusat jagaan, elderly care contact, nursing home address, old folk home location, donate elderly care, cheras nursing home contact, support elderly malaysia, 乐善社老人残障中心联系"
        breadcrumbs={[
          { name: 'Home', item: 'https://your-domain.com' },
          { name: 'Contact', item: 'https://your-domain.com/contact' }
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
              onClick={() => navigate('/about')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 border-b-2 border-transparent hover:border-red-600 transition-all whitespace-nowrap"
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
              className="flex items-center gap-2 px-4 py-2 text-red-600 border-b-2 border-red-600 whitespace-nowrap"
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Contact Us | 联系我们</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600">Get in touch with us | 与我们取得联系</p>
          </div>

          <div className="max-w-5xl mx-auto">
            <a
              href="https://wa.me/60193441168"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-xl mb-8 sm:mb-12"
            >
              <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-600 flex items-center justify-center">
                  <Phone className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="text-center">
                  <div className="text-sm sm:text-base font-semibold text-gray-700">WhatsApp / Primary Contact</div>
                  <div className="text-sm text-gray-600">主要联系号码</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">019-344 1168</div>
                <div className="text-base sm:text-lg text-gray-700">Mr. Steven (乐善社管理人)</div>
              </div>
            </a>

            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border-l-4 border-red-600 mb-8 sm:mb-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Our Locations | 我们的地址</h3>
                  <div className="space-y-4">
                    <div className="bg-red-50 rounded-lg p-4">
                      <p className="text-xs sm:text-sm font-semibold text-red-600 mb-2">Location 1 | 地址1:</p>
                      <p className="text-sm sm:text-base text-gray-700">
                        No. 24, Jalan Damai Perdana 2/6F,<br />
                        Bandar Damai Perdana,<br />
                        Cheras 56000
                      </p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                      <p className="text-xs sm:text-sm font-semibold text-red-600 mb-2">Location 2 | 地址2:</p>
                      <p className="text-sm sm:text-base text-gray-700">
                        No. 30, Jalan Damai Perdana 2/6B,<br />
                        Bandar Damai Perdana,<br />
                        Cheras 56000
                      </p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                      <p className="text-xs sm:text-sm font-semibold text-red-600 mb-2">Location 3 | 地址3:</p>
                      <p className="text-sm sm:text-base text-gray-700">
                        No. 16, Jalan Damai Perdana 2/6B,<br />
                        Bandar Damai Perdana,<br />
                        Cheras 56000
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-red-100">
              <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Ways to Support Us | 支持我们的方式</h3>
                <p className="text-sm sm:text-base text-gray-600">Every contribution helps us provide better care | 每一份贡献都能帮助我们提供更好的照顾</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <Landmark className="w-5 h-5 text-red-600" />
                    </div>
                    <h4 className="font-bold text-gray-900">Banking Information | 银行信息</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700"><span className="font-semibold">Bank Name | 银行名称:</span> Hong Leong Bank</p>
                    <p className="text-gray-700"><span className="font-semibold">Account Name | 账户名称:</span> PUSAT JAGAAN WARGA TUA DAMAI</p>
                    <p className="text-gray-700"><span className="font-semibold">Account Number | 银行户口号码:</span> 36600012351</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <HandHeart className="w-5 h-5 text-red-600" />
                    </div>
                    <h4 className="font-bold text-gray-900">Item Donations | 物品捐赠</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Food items | 食品</li>
                    <li>• Adult diapers | 成人纸尿片</li>
                    <li>• Milk powder | 奶粉</li>
                    <li>• Medical supplies | 医疗用品</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-red-600" />
                    </div>
                    <h4 className="font-bold text-gray-900">Volunteer | 志愿服务</h4>
                  </div>
                  <p className="text-sm text-gray-700">
                    Contact us to learn about volunteer opportunities and how you can help | 联系我们了解志愿服务机会
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <h4 className="font-bold text-gray-900">Monthly Expenses | 每月开支</h4>
                  </div>
                  <p className="text-sm text-gray-700">
                    Monthly expenses: <span className="font-bold text-red-600">RM 105,935</span><br />
                    Monthly rental: <span className="font-bold text-red-600">RM 6,700</span>
                  </p>
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
