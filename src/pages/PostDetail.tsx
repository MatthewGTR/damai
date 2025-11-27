import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, Clock, ArrowLeft, Share2, Home } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { SEOHead } from '../components/SEOHead';

interface Update {
  id: string;
  content: string;
  media_url: string | null;
  media_type: 'image' | 'video' | null;
  created_at: string;
}

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Update | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost(id);
    }
  }, [id]);

  const fetchPost = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('updates')
        .select('*')
        .eq('id', postId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        navigate('/');
        return;
      }

      setPost(data);
    } catch (err) {
      console.error('Error fetching post:', err);
      navigate('/');
    } finally {
      setLoading(false);
    }
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

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pusat Jagaan Warga Tua Damai - Update',
          text: post?.content || 'Check out this update',
          url: url,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          copyToClipboard(url);
        }
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const postPreview = post.content ? post.content.slice(0, 160) : 'View this update from Pusat Jagaan Warga Tua Damai';

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={`Update - Pusat Jagaan Warga Tua Damai`}
        description={postPreview}
        keywords="pusat jagaan warga tua damai, elderly care updates, community news, nursing home updates"
        ogImage={post.media_url || 'https://pusatjagaanwargatuadamai.com/image.png'}
        breadcrumbs={[
          { name: 'Home', item: 'https://pusatjagaanwargatuadamai.com' },
          { name: 'Updates', item: `https://pusatjagaanwargatuadamai.com/post/${post.id}` }
        ]}
      />

      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </button>
              <Link to="/" className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" />
                </div>
                <span className="font-bold text-base sm:text-lg md:text-xl text-gray-900 hidden sm:inline">
                  Pusat Jagaan Warga Tua Damai
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm sm:text-base font-semibold rounded-full hover:from-red-600 hover:to-rose-700 transition-all shadow-md hover:shadow-lg"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>

              <Link
                to="/"
                className="p-2 sm:p-2.5 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Home"
              >
                <Home className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {showCopied && (
        <div className="fixed top-24 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          Link copied to clipboard!
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <article className="bg-gray-50 rounded-2xl border-2 border-gray-200 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-base sm:text-lg text-gray-900">Pusat Jagaan Warga Tua Damai</div>
              <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                <Clock className="w-4 h-4 flex-shrink-0" />
                {formatDate(post.created_at)}
              </div>
            </div>
          </div>

          {post.content && (
            <div className="mb-6">
              <p className="text-gray-900 whitespace-pre-wrap leading-relaxed text-base sm:text-lg">
                {post.content}
              </p>
            </div>
          )}

          {post.media_url && (
            <div className="rounded-xl overflow-hidden border-2 border-gray-300 shadow-lg">
              {post.media_type === 'video' ? (
                <video
                  src={post.media_url}
                  controls
                  className="w-full"
                />
              ) : (
                <img
                  src={post.media_url}
                  alt="Update"
                  className="w-full"
                />
              )}
            </div>
          )}
        </article>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-red-600 hover:text-red-700 font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to All Updates
          </Link>
        </div>
      </main>
    </div>
  );
}
