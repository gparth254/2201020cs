import { useState, useEffect } from 'react';
import { User2 } from 'lucide-react';
import { fetchUsers, fetchUserPosts, type User } from '../lib/api';

interface UserWithPosts extends User {
  postCount: number;
}

export default function TopUsers() {
  const [users, setUsers] = useState<UserWithPosts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const allUsers = await fetchUsers();
        
        // Fetch post counts for each user
        const usersWithPosts = await Promise.all(
          allUsers.map(async (user) => {
            const posts = await fetchUserPosts(user.id);
            return {
              ...user,
              postCount: posts.length,
            };
          })
        );

        // Sort by post count and take top 5
        const topUsers = usersWithPosts
          .sort((a, b) => b.postCount - a.postCount)
          .slice(0, 5);

        setUsers(topUsers);
      } catch (err) {
        setError('Failed to load users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Top 5 Users by Post Count</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                <User2 className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.postCount} posts</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}