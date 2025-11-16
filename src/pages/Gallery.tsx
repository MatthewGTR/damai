import { useNavigate } from 'react-router-dom';
import { Heart, LogIn, LayoutDashboard, Home, Image as ImageIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SEOHead } from '../components/SEOHead';

interface GalleryImage {
  id: string;
  image_url: string;
  caption: string;
}

export function Gallery() {
  const navigate = useNavigate();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);
  const [enlargedImageSrc, setEnlargedImageSrc] = useState('');
  const [enlargedImageIndex, setEnlargedImageIndex] = useState(-1);

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    setIsAdminLoggedIn(!!adminData);
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching gallery images:', error);
      return;
    }

    if (data) {
      setGalleryImages(data);
    }
  };

  const handlePrevImage = () => {
    setCurrentGalleryIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentGalleryIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleEnlargeGalleryImage = () => {
    if (galleryImages.length > 0) {
      setEnlargedImageSrc(galleryImages[currentGalleryIndex].image_url);
      setEnlargedImageIndex(currentGalleryIndex);
      setIsImageEnlarged(true);
    }
  };

  const handleCloseEnlarged = () => {
    setIsImageEnlarged(false);
    setEnlargedImageSrc('');
    setEnlargedImageIndex(-1);
  };

  const handleEnlargedPrev = () => {
    const newIndex = enlargedImageIndex === 0 ? galleryImages.length - 1 : enlargedImageIndex - 1;
    setEnlargedImageIndex(newIndex);
    setEnlargedImageSrc(galleryImages[newIndex].image_url);
  };

  const handleEnlargedNext = () => {
    const newIndex = enlargedImageIndex === galleryImages.length - 1 ? 0 : enlargedImageIndex + 1;
    setEnlargedImageIndex(newIndex);
    setEnlargedImageSrc(galleryImages[newIndex].image_url);
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Gallery - Pusat Jagaan Warga Tua Damai | Photos & Memories"
        description="View photos of our elderly residents, care facilities, and daily activities at Pusat Jagaan Warga Tua Damai. See how we provide compassionate care for 111 seniors in Kuala Lumpur."
        keywords="elderly care photos, nursing home gallery, old folk home pictures, senior care images, pusat jagaan gallery, elderly care malaysia photos, 乐善社老人残障中心图库"
        breadcrumbs={[
          { name: 'Home', item: 'https://pusatjagaanwargatuadamai.com' },
          { name: 'Gallery', item: 'https://pusatjagaanwargatuadamai.com/gallery' }
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
              className="flex items-center gap-2 px-4 py-2 text-red-600 border-b-2 border-red-600 whitespace-nowrap"
            >
              <ImageIcon className="w-4 h-4" />
              <span className="text-sm sm:text-base">Gallery | 图库</span>
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 border-b-2 border-transparent hover:border-red-600 transition-all whitespace-nowrap"
            >
              <Heart className="w-4 h-4" />
              <span className="text-sm sm:text-base">Contact | 联系我们</span>
            </button>
          </div>
        </div>
      </nav>

      {isImageEnlarged && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={handleCloseEnlarged}
        >
          <button
            onClick={handleCloseEnlarged}
            className="absolute top-4 right-4 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEnlargedPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>

          <div className="max-w-5xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={enlargedImageSrc}
              alt="Enlarged view"
              className="w-full h-full object-contain"
            />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEnlargedNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
        </div>
      )}

      <section className="py-12 sm:py-16 bg-gradient-to-br from-gray-50 to-white min-h-[calc(100vh-200px)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Our Gallery | 图库</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600">See more about our activities and community | 查看更多活动照片</p>
          </div>

          {galleryImages.length > 0 ? (
            <div className="relative max-w-4xl mx-auto">
              <div className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl bg-gray-100 group">
                <img
                  src={galleryImages[currentGalleryIndex].image_url}
                  alt={galleryImages[currentGalleryIndex].caption || `Gallery image ${currentGalleryIndex + 1}`}
                  className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105"
                  onClick={handleEnlargeGalleryImage}
                />

                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 backdrop-blur-sm"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
                </button>

                <button
                  onClick={handleNextImage}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 backdrop-blur-sm"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
                </button>

                <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {galleryImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentGalleryIndex(index);
                        }}
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                          index === currentGalleryIndex
                            ? 'bg-white w-4 sm:w-6'
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {galleryImages[currentGalleryIndex].caption && (
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 bg-black/70 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg">
                    <p className="text-white text-xs sm:text-sm text-center">{galleryImages[currentGalleryIndex].caption}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No gallery images yet | 暂无图库图片</p>
            </div>
          )}
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
