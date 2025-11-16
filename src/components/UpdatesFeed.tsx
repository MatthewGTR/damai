import { useEffect, useState } from 'react';
import { Heart, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Update {
  id: string;
  content: string;
  media_url: string | null;
  media_type: 'image' | 'video' | null;
  created_at: string;
}

export const UpdatesFeed = () => {
  const [allUpdates, setAllUpdates] = useState<Update[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchUpdates();
  }, []);

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
              </div>

              {update.content && (
                <div className="mb-3 sm:mb-4">
                  <p className="text-gray-900 whitespace-pre-wrap leading-relaxed text-sm sm:text-base md:text-lg">
                    {getTruncatedContent(update.content, update.id).text}
                  </p>
                  {getTruncatedContent(update.content, update.id).needsTruncation && (
                    <button
                      onClick={() => toggleExpanded(update.id)}
                      className="mt-2 inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-medium text-xs sm:text-sm transition-colors"
                    >
                      {expandedPosts.has(update.id) ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          Show More
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {update.media_url && (
                <div className="rounded-lg sm:rounded-xl overflow-hidden border-2 border-gray-300 shadow-md">
                  {update.media_type === 'video' ? (
                    <video
                      src={update.media_url}
                      controls
                      className="w-full max-h-[400px] sm:max-h-[500px] md:max-h-[600px]"
                    />
                  ) : (
                    <img
                      src={update.media_url}
                      alt="Update"
                      className="w-full max-h-[400px] sm:max-h-[500px] md:max-h-[600px] object-cover"
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
    </section>
  );
};
