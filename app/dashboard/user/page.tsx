'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Star,
  MessageSquare,
  Bookmark,
  Bell,
  Settings,
  ExternalLink,
  Trash2,
  CheckCircle2,
  Globe2,
  LogOut,
  AlertCircle,
  Lock,
  ArrowRight,
  PenSquare,
} from 'lucide-react';
import StarRating from '@/components/StarRating';
import { COUNTRIES } from '@/lib/countries';
import { Review, InAppNotification, UserAccount } from '@/types';

export default function UserDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'reviews' | 'saved' | 'notifications' | 'settings'>('reviews');

  // Auth & profile state
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [countryCode, setCountryCode] = useState('US');
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Reviews state
  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [reviewActionMsg, setReviewActionMsg] = useState<string | null>(null);

  // Notifications state
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);

  // Saved companies state (stored in local persistence)
  const [savedCompanies, setSavedCompanies] = useState([
    { id: '1', name: 'Pacific Heritage Coffee Co.', slug: 'pacific-heritage-coffee-co', rating: 4.9, reviews: 1240 },
    { id: '2', name: 'Vanguard Solar & Battery Solutions', slug: 'vanguard-solar-battery-solutions', rating: 4.4, reviews: 186 },
  ]);

  // Load user data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const meRes = await fetch('/api/auth/me');
        const meData = await meRes.json();

        if (meData.authenticated && meData.user) {
          setCurrentUser(meData.user);
          setDisplayName(meData.user.displayName || '');
          setAvatarUrl(meData.user.avatarUrl || '');
          setCountryCode(meData.user.countryCode || 'US');

          // Load user's reviews
          const revRes = await fetch(`/api/reviews?userId=${meData.user.id}`);
          if (revRes.ok) {
            const revData = await revRes.json();
            setMyReviews(revData);
          }

          // Load notifications
          const notifRes = await fetch('/api/notifications');
          if (notifRes.ok) {
            const notifData = await notifRes.json();
            setNotifications(notifData.notifications || []);
          }
        } else {
          // Fallback demo user info if unauthenticated
          setDisplayName('Alex Morris');
          setCountryCode('US');
        }
      } catch (err) {
        console.error('Failed to load user dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(null);
    setProfileError(null);

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, avatarUrl, countryCode }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setProfileError(data.error || 'Failed to update profile.');
      } else {
        setProfileSuccess('Profile updated successfully.');
        if (currentUser) {
          setCurrentUser({ ...currentUser, displayName, avatarUrl, countryCode });
        }
      }
    } catch {
      setProfileError('Failed to communicate with server.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(null);
    setPasswordError(null);

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    try {
      const res = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setPasswordError(data.error || 'Failed to update password.');
      } else {
        setPasswordSuccess('Password updated successfully.');
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch {
      setPasswordError('A network error occurred.');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const res = await fetch(`/api/reviews?id=${reviewId}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setReviewActionMsg(data.error || 'Failed to delete review.');
      } else {
        setMyReviews((prev) => prev.filter((r) => r.id !== reviewId));
        setReviewActionMsg('Review removed successfully.');
        setDeleteConfirmId(null);
      }
    } catch {
      setReviewActionMsg('Failed to delete review.');
    }
  };

  const handleMarkAllNotifications = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // Non-fatal
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch {
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-slate-500">
        Loading dashboard profile...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner & Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-navy-900 text-teal-400 font-black text-2xl flex items-center justify-center shrink-0 shadow-xs border border-navy-800">
            {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-navy-950">
                {currentUser?.displayName || displayName}
              </h1>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200 uppercase tracking-wider">
                {currentUser?.role || 'Verified Reviewer'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Member since {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : '2026'} · {myReviews.length} reviews posted
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/write-review"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5"
          >
            <PenSquare className="w-4 h-4" />
            <span>Write a Review</span>
          </Link>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2.5 border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-300 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'reviews'
              ? 'bg-navy-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>My Reviews ({myReviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'notifications'
              ? 'bg-navy-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
          {notifications.filter((n) => !n.isRead).length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'saved'
              ? 'bg-navy-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Companies ({savedCompanies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-navy-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Account Settings</span>
        </button>
      </div>

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {reviewActionMsg && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between">
              <span>{reviewActionMsg}</span>
              <button onClick={() => setReviewActionMsg(null)} className="text-blue-500 hover:text-blue-800">
                Dismiss
              </button>
            </div>
          )}

          {myReviews.length > 0 ? (
            <div className="space-y-4">
              {myReviews.map((r) => (
                <div key={r.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <Link
                        href={`/company/${r.companySlug}`}
                        className="text-base font-bold text-navy-950 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                      >
                        <span>{r.companyName}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </Link>
                      <span className="text-[11px] text-slate-400">
                        Submitted on {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <StarRating rating={r.rating} size="sm" />
                      {deleteConfirmId === r.id ? (
                        <div className="flex items-center gap-2 bg-rose-50 p-1.5 rounded-lg border border-rose-200">
                          <span className="text-[11px] font-bold text-rose-800">Confirm delete?</span>
                          <button
                            onClick={() => handleDeleteReview(r.id)}
                            className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px]"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(r.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition-colors"
                          title="Delete review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold text-sm text-slate-900">{r.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{r.content}</p>
                  </div>

                  {r.reply && (
                    <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                      <span className="font-bold text-xs text-blue-900 block">
                        Official Response from {r.reply.responderName} ({r.reply.responderRole})
                      </span>
                      <p className="text-xs text-slate-700 italic">{r.reply.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-xs">
              <Star className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="font-bold text-base text-navy-950">No Reviews Posted Yet</h3>
                <p className="text-xs text-slate-500">
                  Share your experience with any company or website to help consumers worldwide make informed decisions.
                </p>
              </div>
              <Link
                href="/write-review"
                className="inline-block px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl"
              >
                Write Your First Review
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-navy-950">In-App Notifications</h2>
              <p className="text-xs text-slate-500">Updates regarding review responses, moderation alerts, and claims</p>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllNotifications}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 rounded-2xl border transition-colors ${
                    n.isRead ? 'bg-white border-slate-100' : 'bg-blue-50/50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="font-bold text-xs text-navy-950 block">{n.title}</span>
                      <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                      <span className="text-[10px] text-slate-400 block pt-1">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {n.link && (
                      <Link
                        href={n.link}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-400 text-blue-600 text-xs font-bold rounded-lg shrink-0 transition-colors"
                      >
                        View
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400">
              No notifications at this time.
            </div>
          )}
        </div>
      )}

      {/* Saved Companies Tab */}
      {activeTab === 'saved' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-navy-950">Bookmarked Companies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedCompanies.map((c) => (
              <div key={c.id} className="p-4 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <Link href={`/company/${c.slug}`} className="font-bold text-xs text-navy-950 hover:text-blue-600">
                    {c.name}
                  </Link>
                  <span className="text-[11px] text-slate-400 block">
                    Rating {c.rating} ★ ({c.reviews} reviews)
                  </span>
                </div>
                <Link
                  href={`/company/${c.slug}`}
                  className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-50"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Details */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-navy-950">Profile Information</h2>

            {profileSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-navy-950 mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-navy-950 mb-1">Email Address</label>
                <input
                  type="email"
                  value={currentUser?.email || ''}
                  disabled
                  className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Email is locked to your account verification credentials.
                </span>
              </div>

              <div>
                <label className="block font-bold text-navy-950 mb-1">Country</label>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flagEmoji} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
              >
                Save Profile
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-navy-950">Security & Password</h2>

            {passwordSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-navy-950 mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-navy-950 mb-1">New Password (min 8 chars)</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
