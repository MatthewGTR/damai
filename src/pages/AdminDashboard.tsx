import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, LogOut, Image as ImageIcon, Send, Video, Trash2, X, Home, Edit2, Save, Key, Images } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Admin {
  id: string;
  username: string;
  name: string;
}

interface Update {
  id: string;
  content: string;
  media_url: string | null;
  media_type: 'image' | 'video' | null;
  created_at: string;
  admin_id: string;
}

interface GalleryImage {
  id: string;
  image_url: string;
  caption: string;
  display_order: number;
  created_at: string;
}

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [newPost, setNewPost] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editMediaFile, setEditMediaFile] = useState<File | null>(null);
  const [editMediaPreview, setEditMediaPreview] = useState<string | null>(null);
  const [editMediaType, setEditMediaType] = useState<'image' | 'video' | null>(null);
  const [updating, setUpdating] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'updates' | 'gallery'>('updates');
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [newGalleryImage, setNewGalleryImage] = useState<File | null>(null);
  const [newGalleryPreview, setNewGalleryPreview] = useState<string | null>(null);
  const [galleryCaption, setGalleryCaption] = useState('');
  const [uploadingGallery, setUploadingGallery] = useState(false);

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (!adminData) {
      navigate('/admin/login');
      return;
    }
    setAdmin(JSON.parse(adminData));
    fetchUpdates();
    fetchGalleryImages();
  }, [navigate]);

  const fetchUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from('updates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUpdates(data || []);
    } catch (err) {
      console.error('Error fetching updates:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGalleryImages = async () => {
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gallery-images`;
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch gallery images');

      const data = await response.json();
      setGalleryImages(data || []);
    } catch (err) {
      console.error('Error fetching gallery images:', err);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  const handleGalleryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewGalleryImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewGalleryPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadGalleryImage = async () => {
    if (!newGalleryImage || !admin) return;

    setUploadingGallery(true);

    try {
      const fileExt = newGalleryImage.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const uploadUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/images/${filePath}`;

      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': newGalleryImage.type,
        },
        body: newGalleryImage,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const publicUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/${filePath}`;

      const maxOrder = galleryImages.length > 0
        ? Math.max(...galleryImages.map(img => img.display_order))
        : 0;

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gallery-images`;
      const insertResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: publicUrl,
          caption: galleryCaption.trim(),
          display_order: maxOrder + 1,
          created_by: admin.id
        }),
      });

      if (!insertResponse.ok) {
        const errorData = await insertResponse.json();
        throw new Error(errorData.error || 'Failed to save image');
      }

      setNewGalleryImage(null);
      setNewGalleryPreview(null);
      setGalleryCaption('');
      await fetchGalleryImages();
      alert('Image uploaded successfully!');
    } catch (err: any) {
      console.error('Error uploading gallery image:', err);
      alert(`Failed to upload image: ${err.message || 'Please try again.'}`);
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleDeleteGalleryImage = async (id: string, imageUrl: string) => {
    if (!confirm('Delete this gallery image?')) return;

    try {
      const pathMatch = imageUrl.match(/gallery\/[^?]+/);
      if (pathMatch) {
        const deleteUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/images/${pathMatch[0]}`;

        await fetch(deleteUrl, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        });
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gallery-images?id=${id}`;
      const deleteResponse = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      if (!deleteResponse.ok) {
        const errorData = await deleteResponse.json();
        throw new Error(errorData.error || 'Failed to delete image');
      }

      setGalleryImages(galleryImages.filter(img => img.id !== id));
      alert('Image deleted successfully!');
    } catch (err) {
      console.error('Error deleting gallery image:', err);
      alert('Failed to delete image. Please try again.');
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    setChangingPassword(true);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-posts/change-password`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          admin_id: admin?.id,
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to change password');
      }

      alert('Password changed successfully');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      setMediaType(type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
  };

  const handlePost = async () => {
    if (!newPost.trim() && !mediaFile) return;
    if (!admin) return;

    setPosting(true);

    try {
      let mediaUrl = null;

      if (mediaFile) {
        const fileExt = mediaFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `updates/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, mediaFile, {
            contentType: mediaFile.type,
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        mediaUrl = publicUrl;
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-posts/create`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          admin_id: admin.id,
          content: newPost.trim(),
          media_url: mediaUrl,
          media_type: mediaType,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to post update');
      }

      setNewPost('');
      setMediaFile(null);
      setMediaPreview(null);
      setMediaType(null);
      await fetchUpdates();
    } catch (err) {
      console.error('Error posting update:', err);
      alert('Failed to post update. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  const handleEdit = (update: Update) => {
    setEditingId(update.id);
    setEditContent(update.content);
    setEditMediaPreview(update.media_url);
    setEditMediaType(update.media_type);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
    setEditMediaFile(null);
    setEditMediaPreview(null);
    setEditMediaType(null);
  };

  const handleEditMediaChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      setEditMediaFile(file);
      setEditMediaType(type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveEditMedia = () => {
    setEditMediaFile(null);
    setEditMediaPreview(null);
    setEditMediaType(null);
  };

  const handleUpdate = async (id: string, oldMediaUrl: string | null) => {
    if (!editContent.trim() && !editMediaPreview) return;
    if (!admin) return;

    setUpdating(true);

    try {
      let mediaUrl = editMediaPreview;

      if (editMediaFile) {
        if (oldMediaUrl) {
          const pathMatch = oldMediaUrl.match(/updates\/[^?]+/);
          if (pathMatch) {
            await supabase.storage.from('images').remove([pathMatch[0]]);
          }
        }

        const fileExt = editMediaFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `updates/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, editMediaFile, {
            contentType: editMediaFile.type,
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        mediaUrl = publicUrl;
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-posts/update`;
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          id,
          content: editContent.trim(),
          media_url: mediaUrl,
          media_type: editMediaType,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update post');
      }

      handleCancelEdit();
      await fetchUpdates();
    } catch (err) {
      console.error('Error updating post:', err);
      alert('Failed to update post. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string, mediaUrl: string | null) => {
    if (!confirm('Delete this post?')) return;

    try {
      if (mediaUrl) {
        const pathMatch = mediaUrl.match(/updates\/[^?]+/);
        if (pathMatch) {
          await supabase.storage.from('images').remove([pathMatch[0]]);
        }
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-posts`;
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete post');
      }

      setUpdates(updates.filter((u) => u.id !== id));
    } catch (err) {
      console.error('Error deleting update:', err);
      alert('Failed to delete post. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <div>
                <div className="font-bold text-gray-900">{admin.name}</div>
                <div className="text-xs text-gray-600">@{admin.username}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="text-sm font-medium">Homepage</span>
              </button>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Key className="w-4 h-4" />
                <span className="text-sm font-medium">Change Password</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('updates')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'updates'
                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-red-300'
            }`}
          >
            <Send className="w-4 h-4" />
            Updates Feed
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'gallery'
                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-red-300'
            }`}
          >
            <Images className="w-4 h-4" />
            Gallery Management
          </button>
        </div>

        {activeTab === 'updates' && (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">{admin.name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's happening? Share updates with your community..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none text-gray-900"
                rows={3}
              />

              {mediaPreview && (
                <div className="mt-4 relative rounded-xl overflow-hidden border-2 border-gray-200">
                  {mediaType === 'image' ? (
                    <img src={mediaPreview} alt="Preview" className="w-full max-h-96 object-cover" />
                  ) : (
                    <video src={mediaPreview} controls className="w-full max-h-96" />
                  )}
                  <button
                    onClick={handleRemoveMedia}
                    className="absolute top-2 right-2 p-2 bg-gray-900 bg-opacity-75 hover:bg-opacity-90 text-white rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                    <ImageIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleMediaChange(e, 'image')}
                      className="hidden"
                    />
                  </label>
                  <label className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                    <Video className="w-5 h-5" />
                    <span className="text-sm font-medium">Video</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleMediaChange(e, 'video')}
                      className="hidden"
                    />
                  </label>
                </div>
                <button
                  onClick={handlePost}
                  disabled={posting || (!newPost.trim() && !mediaFile)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-rose-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {posting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {updates.map((update) => (
            <div key={update.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                    <span className="text-white font-bold">{admin.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{admin.name}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(update.created_at).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {editingId === update.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(update.id, update.media_url)}
                        disabled={updating}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={updating}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(update)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(update.id, update.media_url)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {editingId === update.id ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-gray-900 mb-4"
                    rows={3}
                  />

                  {editMediaPreview && (
                    <div className="mb-4 relative rounded-xl overflow-hidden border-2 border-gray-200">
                      {editMediaType === 'video' ? (
                        <video src={editMediaPreview} controls className="w-full max-h-96" />
                      ) : (
                        <img src={editMediaPreview} alt="Preview" className="w-full max-h-96 object-cover" />
                      )}
                      <button
                        onClick={handleRemoveEditMedia}
                        className="absolute top-2 right-2 p-2 bg-gray-900 bg-opacity-75 hover:bg-opacity-90 text-white rounded-full transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                      <ImageIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleEditMediaChange(e, 'image')}
                        className="hidden"
                      />
                    </label>
                    <label className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                      <Video className="w-5 h-5" />
                      <span className="text-sm font-medium">Video</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleEditMediaChange(e, 'video')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <>
                  {update.content && (
                    <p className="text-gray-900 mb-4 whitespace-pre-wrap leading-relaxed">
                      {update.content}
                    </p>
                  )}

                  {update.media_url && (
                    <div className="rounded-xl overflow-hidden border border-gray-200">
                      {update.media_type === 'video' ? (
                        <video
                          src={update.media_url}
                          controls
                          className="w-full max-h-[500px]"
                        />
                      ) : (
                        <img
                          src={update.media_url}
                          alt="Post"
                          className="w-full max-h-[500px] object-cover"
                        />
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          {updates.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Heart className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600">Share your first update with the community</p>
            </div>
          )}
        </div>
          </>
        )}

        {activeTab === 'gallery' && (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Upload New Gallery Image</h3>

              <div className="space-y-4">
                {newGalleryPreview && (
                  <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
                    <img src={newGalleryPreview} alt="Preview" className="w-full max-h-96 object-cover" />
                    <button
                      onClick={() => {
                        setNewGalleryImage(null);
                        setNewGalleryPreview(null);
                      }}
                      className="absolute top-2 right-2 p-2 bg-gray-900 bg-opacity-75 hover:bg-opacity-90 text-white rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Caption (Optional)
                  </label>
                  <input
                    type="text"
                    value={galleryCaption}
                    onChange={(e) => setGalleryCaption(e.target.value)}
                    placeholder="Add a caption for this image..."
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer">
                    <ImageIcon className="w-5 h-5 text-gray-700" />
                    <span className="text-sm font-medium text-gray-700">Choose Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleGalleryImageChange}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={handleUploadGalleryImage}
                    disabled={uploadingGallery || !newGalleryImage}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-rose-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ImageIcon className="w-4 h-4" />
                    {uploadingGallery ? 'Uploading...' : 'Upload to Gallery'}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Current Gallery Images</h3>

              {galleryImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.image_url}
                        alt={image.caption || 'Gallery image'}
                        className="w-full aspect-video object-cover rounded-lg border-2 border-gray-200"
                      />
                      {image.caption && (
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{image.caption}</p>
                      )}
                      <button
                        onClick={() => handleDeleteGalleryImage(image.id, image.image_url)}
                        className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Images className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No gallery images yet</h3>
                  <p className="text-gray-600">Upload your first image to the gallery</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Key className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
              </div>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError('');
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Confirm new password"
                />
              </div>

              {passwordError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {passwordError}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordError('');
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  disabled={changingPassword}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={changingPassword}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {changingPassword ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
