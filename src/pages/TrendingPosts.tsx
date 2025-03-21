import { useState, useEffect } from 'react';
import { MessageSquare, Heart } from 'lucide-react';
import { fetchUsers, fetchUserPosts, type Post, type User } from '../lib/api';

interface EnhancedPost extends Post {
  author: User;
  commentCount: number;
}

export default function TrendingPosts() {
  const [posts, setPosts] = useState<EnhancedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        // First get all users
        const users = await fetchUsers();
        const usersMap = new Map(users.map(user => [user.id, user]));

        // Get posts for each user
        const allPosts: EnhancedPost[] = [];
        for (const user of users) {
          const userPosts = await fetchUserPosts(user.id);
          allPosts.push(
            ...userPosts.map(post => ({
              ...post,
              author: usersMap.get(post.userid)!,
              commentCount: Math.floor(Math.random() * 100), // Simulated comment count
            }))
          );
        }

        // Sort by simulated comment count
        setPosts(allPosts.sort((a, b) => b.commentCount - a.commentCount).slice(0, 10));
      } catch (err) {
        setError('Failed to load trending posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Trending Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-medium">
                    {post.author.name[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{post.author.name}</p>
                  <p className="text-sm text-gray-500">Post #{post.id}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{post.content}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>{Math.floor(Math.random() * 50)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.commentCount}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}