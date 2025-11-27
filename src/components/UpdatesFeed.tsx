import { useEffect, useState } from 'react';
import { Heart, Clock, ChevronDown, ChevronUp, X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Update {
  id: string;
  content: string;
  media_url: string | null;
  media_type: 'image' | 'video' | null;
  created_at: string;
}

export const UpdatesFeed = () => {
  const navigate = useNavigate();
  const [allUpdates, setAllUpdates] = useState<Update[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [enlargedMedia, setEnlargedMedia] = useState<{ url: string; type: 'image' | 'video'; index: number } | null>(null);

  useEffect(() => {
    fetchUpdates();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!enlargedMedia) return;

      if (e.key === 'Escape') {
        setEnlargedMedia(null);
      } else if (e.key === 'ArrowLeft') {
        navigateMedia('prev');
      } else if (e.key === 'ArrowRight') {
        navigateMedia('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enlargedMedia, allUpdates]);

  const fetchUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from('updates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllUpdates(data || []);
    } catch (err) {
      console.error('Error fetching updates:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const toggleExpanded = (id: string) => {
    setExpandedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getTruncatedContent = (content: string, id: string) => {
    const isExpanded = expandedPosts.has(id);
    const characterLimit = 200;

    if (content.length <= characterLimit) {
      return { text: content, needsTruncation: false };
    }

    if (isExpanded) {
      return { text: content, needsTruncation: true };
    }

    return {
      text: content.slice(0, characterLimit) + '...',
      needsTruncation: true
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleMediaClick = (update: Update, index: number) => {
    if (update.media_url && update.media_type) {
      setEnlargedMedia({
        url: update.media_url,
        type: update.media_type,
        index: index
      });
    }
  };

  const getCurrentUpdate = () => {
    if (!enlargedMedia) return null;
    const visibleUpdates = allUpdates.slice(0, visibleCount);
    const mediaUpdates = visibleUpdates.filter(u => u.media_url && u.media_type);
    return mediaUpdates[enlargedMedia.index];
  };

  const navigateMedia = (direction: 'prev' | 'next') => {
    if (!enlargedMedia) return;

    const visibleUpdates = allUpdates.slice(0, visibleCount);
    const mediaUpdates = visibleUpdates.filter(u => u.media_url && u.media_type);
    const currentIndex = enlargedMedia.index;

    let newIndex: number;
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? mediaUpdates.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === mediaUpdates.length - 1 ? 0 : currentIndex + 1;
    }

    const nextUpdate = mediaUpdates[newIndex];
    if (nextUpdate && nextUpdate.media_url && nextUpdate.media_type) {
      setEnlargedMedia({
        url: nextUpdate.media_url,
        type: nextUpdate.media_type,
        index: newIndex
      });
    }
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-12 sm:py-20">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-red-600 border-t-transparent"></div>
          </div>
        </div>
      </section>
    );
  }

  if (allUpdates.length === 0) {
    return null;
  }

  const visibleUpdates = allUpdates.slice(0, visibleCount);
  const hasMore = visibleCount < allUpdates.length;

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-red-500 to-rose-600 mb-3 sm:mb-4">
            <Heart className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="currentColor" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">Latest Updates</h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            Stay connected with our community and recent happenings
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {visibleUpdates.map((update) => (
            <div
              key={update.id}
              className="bg-gray-50 rounded-xl sm:rounded-2xl border-2 border-gray-200 p-4 sm:p-6 hover:border-red-300 transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm sm:text-base text-gray-900 truncate">Pusat Jagaan Warga Tua Damai</div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    {formatDate(update.created_at)}
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/post/${update.id}`)}
                  className="p-2 hover:bg-white rounded-lg transition-colors group"
                  title="View full post"
                >
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-hover:text-red-600 transition-colors" />
                </button>
              </div>

              {update.content && (
                <div className="mb-3 sm:mb-4">
                  <p
                    className="text-gray-900 whitespace-pre-wrap leading-relaxed text-sm sm:text-base md:text-lg cursor-pointer hover:text-gray-700 transition-colors"
                    onClick={() => navigate(`/post/${update.id}`)}
                  >
                    {getTruncatedContent(update.content, update.id).text}
                  </p>
                  {getTruncatedContent(update.content, update.id).needsTruncation && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/post/${update.id}`);
                      }}
                      className="mt-2 inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-medium text-xs sm:text-sm transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Read Full Post
                    </button>
                  )}
                </div>
              )}

              {update.media_url && (
                <div
                  className="rounded-lg sm:rounded-xl overflow-hidden border-2 border-gray-300 shadow-md cursor-pointer hover:border-red-400 transition-colors"
                  onClick={() => navigate(`/post/${update.id}`)}
                >
                  {update.media_type === 'video' ? (
                    <video
                      src={update.media_url}
                      controls
                      className="w-full max-h-[400px] sm:max-h-[500px] md:max-h-[600px]"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <img
                      src={update.media_url}
                      alt="Update image - click to view full post"
                      className="w-full max-h-[400px] sm:max-h-[500px] md:max-h-[600px] object-cover hover:opacity-95 transition-opacity"
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="mt-6 sm:mt-8 text-center">
            <button
              onClick={loadMore}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm sm:text-base font-semibold rounded-full hover:from-red-600 hover:to-rose-700 transition-all shadow-md hover:shadow-lg"
            >
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
              View More Updates
            </button>
          </div>
        )}
      </div>

      {enlargedMedia && (() => {
        const currentUpdate = getCurrentUpdate();
        return (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setEnlargedMedia(null)}
          >
            <button
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-gray-300 transition-colors z-20"
              onClick={() => setEnlargedMedia(null)}
              aria-label="Close"
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6 w-full h-full p-4 lg:p-8">
              <div className="relative flex items-center justify-center flex-1 w-full lg:w-auto h-1/2 lg:h-full">
                {visibleUpdates.filter(u => u.media_url && u.media_type).length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateMedia('prev');
                      }}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
                      aria-label="Previous media"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateMedia('next');
                      }}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110 z-10"
                      aria-label="Next media"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full z-10">
                      <div className="text-white text-xs sm:text-sm font-medium">
                        {enlargedMedia.index + 1} / {visibleUpdates.filter(u => u.media_url && u.media_type).length}
                      </div>
                    </div>
                  </>
                )}

                {enlargedMedia.type === 'video' ? (
                  <video
                    src={enlargedMedia.url}
                    controls
                    className="max-w-full max-h-full"
                    onClick={(e) => e.stopPropagation()}
                    autoPlay
                  />
                ) : (
                  <img
                    src={enlargedMedia.url}
                    alt="Enlarged view"
                    className="max-w-full max-h-full object-contain"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              </div>

              {currentUpdate && currentUpdate.content && (
                <div
                  className="w-full lg:w-96 xl:w-[28rem] h-1/2 lg:h-full bg-white/5 backdrop-blur-md rounded-xl p-4 sm:p-6 overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" />
                    </div>
                    <div>
                      <div className="font-bold text-sm sm:text-base text-white">Pusat Jagaan Warga Tua Damai</div>
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-white/70">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        {formatDate(currentUpdate.created_at)}
                      </div>
                    </div>
                  </div>

                  <div className="text-white/90 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                    {currentUpdate.content}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </section>
  );
};
