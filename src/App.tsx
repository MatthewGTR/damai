import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Phone, Mail, MapPin, Building2, AlertTriangle, Clock, HandHeart, LogIn, LayoutDashboard, X, Landmark, ChevronLeft, ChevronRight, Home, Image as ImageIcon } from 'lucide-react';
import { UpdatesFeed } from './components/UpdatesFeed';
import { supabase } from './lib/supabase';

interface GalleryImage {
  id: string;
  image_url: string;
  caption: string;
}

function App() {
  const navigate = useNavigate();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);
  const [enlargedImageSrc, setEnlargedImageSrc] = useState('');
  const [enlargedImageIndex, setEnlargedImageIndex] = useState(-1);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    setIsAdminLoggedIn(!!adminData);
    fetchGalleryImages();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isImageEnlarged) return;

      if (e.key === 'Escape') {
        setIsImageEnlarged(false);
      } else if (e.key === 'ArrowLeft' && enlargedImageIndex >= 0 && galleryImages.length > 0) {
        const newIndex = enlargedImageIndex === 0 ? galleryImages.length - 1 : enlargedImageIndex - 1;
        setEnlargedImageIndex(newIndex);
        setEnlargedImageSrc(galleryImages[newIndex].image_url);
      } else if (e.key === 'ArrowRight' && enlargedImageIndex >= 0 && galleryImages.length > 0) {
        const newIndex = enlargedImageIndex === galleryImages.length - 1 ? 0 : enlargedImageIndex + 1;
        setEnlargedImageIndex(newIndex);
        setEnlargedImageSrc(galleryImages[newIndex].image_url);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isImageEnlarged, enlargedImageIndex, galleryImages]);

  const fetchGalleryImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('id, image_url, caption')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setGalleryImages(data || []);
    } catch (err) {
      console.error('Error fetching gallery images:', err);
    }
  };

  const handlePrevImage = () => {
    setCurrentGalleryIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentGalleryIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const handleEnlargeGalleryImage = () => {
    if (galleryImages.length > 0) {
      setEnlargedImageSrc(galleryImages[currentGalleryIndex].image_url);
      setEnlargedImageIndex(currentGalleryIndex);
      setIsImageEnlarged(true);
    }
  };

  const handleEnlargeImage = (src: string, index: number = -1) => {
    setEnlargedImageSrc(src);
    setEnlargedImageIndex(index);
    setIsImageEnlarged(true);
  };

  const handleEnlargedPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (enlargedImageIndex >= 0 && galleryImages.length > 0) {
      const newIndex = enlargedImageIndex === 0 ? galleryImages.length - 1 : enlargedImageIndex - 1;
      setEnlargedImageIndex(newIndex);
      setEnlargedImageSrc(galleryImages[newIndex].image_url);
    }
  };

  const handleEnlargedNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (enlargedImageIndex >= 0 && galleryImages.length > 0) {
      const newIndex = enlargedImageIndex === galleryImages.length - 1 ? 0 : enlargedImageIndex + 1;
      setEnlargedImageIndex(newIndex);
      setEnlargedImageSrc(galleryImages[newIndex].image_url);
    }
  };

  return (
    <div className="min-h-screen bg-white">
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
              className="flex items-center gap-2 px-4 py-2 text-red-600 border-b-2 border-red-600 whitespace-nowrap"
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
              onClick={() => navigate('/contact')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 border-b-2 border-transparent hover:border-red-600 transition-all whitespace-nowrap"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm sm:text-base">Contact | 联系我们</span>
            </button>
          </div>
        </div>
      </nav>

      <section
        className="relative bg-gray-900 text-white overflow-hidden cursor-pointer"
        onClick={() => handleEnlargeImage('/1111.jpg')}
      >
        <div className="absolute inset-0">
          <img
            src="/1111.jpg"
            alt="Our residents at Pusat Jagaan Warga Tua Damai"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 md:py-48">
        </div>
      </section>

      {isImageEnlarged && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsImageEnlarged(false)}
        >
          <button
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-gray-300 transition-colors z-10"
            onClick={() => setIsImageEnlarged(false)}
            aria-label="Close"
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          {enlargedImageIndex >= 0 && galleryImages.length > 1 && (
            <>
              <button
                onClick={handleEnlargedPrev}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </button>

              <button
                onClick={handleEnlargedNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </button>

              <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full z-10">
                <div className="text-white text-xs sm:text-sm font-medium">
                  {enlargedImageIndex + 1} / {galleryImages.length}
                </div>
              </div>
            </>
          )}

          <img
            src={enlargedImageSrc}
            alt="Enlarged view"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <section className="py-16 bg-gradient-to-br from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-red-600">
              <p className="text-base sm:text-xl md:text-2xl font-medium mb-6 sm:mb-8 leading-relaxed text-gray-800 text-center">
                "Tender Loving Care For All Geriatric, Paederics, Medical Surgical Cases, Bedsore & After Stroke and Etc."
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
                <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-4 sm:p-5 border border-red-100 shadow-md">
                  <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-1 sm:mb-2">111</div>
                  <div className="text-sm sm:text-base font-semibold text-gray-700">Residents</div>
                  <div className="text-xs sm:text-sm text-gray-600">残障&老人家</div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-4 sm:p-5 border border-red-100 shadow-md">
                  <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-1 sm:mb-2">12</div>
                  <div className="text-sm sm:text-base font-semibold text-gray-700">Staff Members</div>
                  <div className="text-xs sm:text-sm text-gray-600">员工</div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-4 sm:p-5 border border-red-100 shadow-md">
                  <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-1 sm:mb-2">24</div>
                  <div className="text-sm sm:text-base font-semibold text-gray-700">Hours</div>
                  <div className="text-xs sm:text-sm text-gray-600">小时</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <UpdatesFeed />

      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">How to Support Us | 如何支持我们</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600">Every contribution helps us provide better care | 每一份贡献都能帮助我们提供更好的照顾</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border-2 border-emerald-200 max-w-2xl mx-auto mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <Landmark className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-700" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Banking Information | 银行信息</h3>
            </div>
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm space-y-3 sm:space-y-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 sm:mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">Bank Name | 银行名称</div>
                  <div className="text-base sm:text-lg font-bold text-gray-900">Hong Leong Bank</div>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 sm:mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">Account Name | 账户名称</div>
                  <div className="text-base sm:text-lg font-bold text-gray-900">PUSAT JAGAAN WARGA TUA DAMAI</div>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 sm:mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">Account Number | 银行户口号码</div>
                  <div className="text-xl sm:text-2xl font-bold text-emerald-700 font-mono tracking-wider">36600012351</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border-l-4 border-red-600 rounded-lg p-4 sm:p-6 shadow-md">
            <div className="flex items-start gap-3 sm:gap-4">
              <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-red-900 mb-2 sm:mb-3">Security Notice | 安全提示</h3>
                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-red-800">
                  <p className="font-semibold">✓ ONLY the contact information above is official</p>
                  <p className="font-semibold">✓ 仅以上联系方式是官方的</p>
                  <p>Any other contact claiming to represent us may be fraudulent. Please verify before making donations.</p>
                  <p>任何其他声称代表我们的联系方式可能是诈骗。请在捐款前核实。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 sm:mb-12">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">About Our Mission</h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                中心成立的目标是希望帮助更多无家可归的老人家，让他们可以有一个安乐窝居住。同时也提供食物给公公婆婆们让他们有三餐温饱，快乐度过他们的余生。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center border border-gray-700">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-600 text-white mb-2 sm:mb-3">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 sm:mb-2">Compassionate Care</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Providing loving care and support for elderly and disabled individuals</p>
              </div>
              <div className="bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center border border-gray-700">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-600 text-white mb-2 sm:mb-3">
                  <HandHeart className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 sm:mb-2">Daily Necessities</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Ensuring three meals daily and comfortable living conditions</p>
              </div>
              <div className="bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center border border-gray-700">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-600 text-white mb-2 sm:mb-3">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 sm:mb-2">24/7 Support</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Round-the-clock care and medical attention for all residents</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 sm:pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-gray-800 rounded-lg p-3 sm:p-4 md:p-6 border border-gray-700">
                <div className="flex items-start gap-2 sm:gap-3">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-500 flex-shrink-0 mt-0.5 sm:mt-1" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-full whitespace-nowrap">H/Q</span>
                      <span className="text-xs sm:text-sm md:text-base font-bold text-white">Headquarters | 总部</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                      No. 24, Jalan Damai Perdana 2/6F,<br />
                      Bandar Damai Perdana, Cheras,<br />
                      56000 Kuala Lumpur, Malaysia
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 sm:p-4 md:p-6 border border-gray-700">
                <div className="flex items-start gap-2 sm:gap-3">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-500 flex-shrink-0 mt-0.5 sm:mt-1" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-full whitespace-nowrap">Location 1</span>
                      <span className="text-xs sm:text-sm md:text-base font-bold text-white">地址1</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                      No. 30, Jalan Damai Perdana 2/6B,<br />
                      Bandar Damai Perdana, Cheras,<br />
                      56000 Kuala Lumpur, Malaysia
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 sm:p-4 md:p-6 border border-gray-700">
                <div className="flex items-start gap-2 sm:gap-3">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-500 flex-shrink-0 mt-0.5 sm:mt-1" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-full whitespace-nowrap">Location 2</span>
                      <span className="text-xs sm:text-sm md:text-base font-bold text-white">地址2</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                      No. 16, Jalan Damai Perdana 2/6B,<br />
                      Bandar Damai Perdana, Cheras,<br />
                      56000 Kuala Lumpur, Malaysia
                    </p>
                  </div>
                </div>
              </div>
            </div>

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

export default App;
