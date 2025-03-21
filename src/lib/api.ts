import axios from 'axios';

const API_BASE_URL = 'http://20.244.56.144/test';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export interface User {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  userid: string;
  content: string;
}

export interface Comment {
  id: string;
  postid: string;
  content: string;
}

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get('/users');
    const users = response.data.users;
    return Object.entries(users).map(([id, name]) => ({
      id,
      name: name as string,
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchUserPosts = async (userId: string): Promise<Post[]> => {
  try {
    const response = await api.get(`/users/${userId}/posts`);
    return response.data.posts || [];
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error);
    throw error;
  }
};

export const fetchPostComments = async (postId: string): Promise<Comment[]> => {
  try {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data.comments || [];
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    throw error;
  }
};