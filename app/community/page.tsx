'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  PlusCircle, 
  Search, 
  Sparkles,
  ChevronRight,
  Flag,
  HelpCircle
} from 'lucide-react';
import { DEMO_COMMUNITY_POSTS } from '@/lib/demoData';
import { CommunityPost } from '@/types';

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>(DEMO_COMMUNITY_POSTS);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Consumer Advice');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const categories = ['All', 'Billing & Contracts', 'Home Renewable Energy', 'Consumer Healthcare', 'Consumer Advice'];

  const filteredPosts = activeCategory === 'All' 
    ? posts 
    : posts.filter((p) => p.category === activeCategory);

  const handleLike = (id: string) => {
    const isLiked = likedPosts[id];
    setLikedPosts({ ...likedPosts, [id]: !isLiked });
    setPosts(posts.map((p) => p.id === id ? { ...p, likesCount: isLiked ? p.likesCount - 1 : p.likesCount + 1 } : p));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const created: CommunityPost = {
      id: `comm-${Date.now()}`,
      title: newTitle,
      content: newContent,
      authorName: 'Alex Bennett',
      authorCountry: 'United States',
      category: newCategory,
      likesCount: 1,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
    };

    setPosts([created, ...posts]);
    setNewTitle('');
    setNewContent('');
    setShowNewPostModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Community Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              WinkBench Community
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-navy-950">
            Consumer Discussions & Advice
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Exchange advice with fellow consumers on buying decisions, service warranties, and consumer rights.
          </p>
        </div>

        <button
          onClick={() => setShowNewPostModal(true)}
          className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors self-start md:self-auto shadow-sm"
        >
          <PlusCircle className="w-4 h-4 text-teal-400" />
          Start a Discussion
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-navy-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Feed: 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          {filteredPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-slate-100 font-bold text-navy-900 flex items-center justify-center text-xs border border-slate-200">
                    {post.authorName.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-navy-950 block">
                      {post.authorName}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {post.authorCountry} · {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {post.category}
                </span>
              </div>

              <div>
                <h2 className="text-base font-bold text-navy-950 hover:text-teal-700 cursor-pointer">
                  {post.title}
                </h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
              </div>

              {/* Interactions footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      likedPosts[post.id] ? 'text-teal-700 font-bold' : 'hover:text-navy-900'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${likedPosts[post.id] ? 'fill-teal-700' : ''}`} />
                    <span>{post.likesCount} Helpful</span>
                  </button>

                  <button className="flex items-center gap-1.5 hover:text-navy-900">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.commentsCount} Comments</span>
                  </button>
                </div>

                <button className="text-slate-400 hover:text-slate-600">
                  <Flag className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Sidebar: Guidelines & Rules */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-sm text-navy-950">Community Guidelines</h3>
            <p className="text-slate-600 leading-relaxed">
              WinkBench discussions are moderated to ensure constructive, truthful dialogue. Respect confidentiality and cite factual details where possible.
            </p>
            <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
              <li>No commercial spam or unauthorized self-promotion</li>
              <li>No personal harassment or doxxing</li>
              <li>State opinions respectfully</li>
            </ul>
            <div className="pt-2 border-t border-slate-100">
              <Link href="/community-guidelines" className="text-teal-700 hover:underline font-semibold">
                Read full Community Guidelines →
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-navy-950">Start a Discussion</h3>
              <button onClick={() => setShowNewPostModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block font-bold text-navy-950 mb-1">Topic Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option>Billing & Contracts</option>
                  <option>Home Renewable Energy</option>
                  <option>Consumer Healthcare</option>
                  <option>Consumer Advice</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-navy-950 mb-1">Discussion Title</label>
                <input
                  type="text"
                  placeholder="What is your question or advice?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-navy-950 mb-1">Details</label>
                <textarea
                  rows={4}
                  placeholder="Share details, contract clauses, experiences, or questions..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-navy-900 text-white font-bold rounded-lg hover:bg-navy-800"
                >
                  Publish Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
