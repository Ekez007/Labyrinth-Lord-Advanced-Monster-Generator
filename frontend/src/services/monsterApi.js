import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Configure axios defaults
axios.defaults.timeout = 15000;
axios.defaults.headers.common['Content-Type'] = 'application/json';

class MonsterAPI {
  // Monster Generation
  static async generateMonsters(request) {
    try {
      const response = await axios.post(`${API}/monsters/generate`, request);
      return response.data;
    } catch (error) {
      console.error('Error generating monsters:', error);
      throw new Error(error.response?.data?.detail || 'Failed to generate monsters');
    }
  }

  static async generateMonstersSimple(filters) {
    try {
      const response = await axios.post(`${API}/monsters/generate-simple`, filters);
      return response.data;
    } catch (error) {
      console.error('Error generating monsters (simple):', error);
      throw new Error(error.response?.data?.detail || 'Failed to generate monsters');
    }
  }

  // Monster Management
  static async saveMonster(monster, libraryId = null) {
    try {
      const response = await axios.post(`${API}/monsters/save`, {
        monster,
        libraryId
      });
      return response.data;
    } catch (error) {
      console.error('Error saving monster:', error);
      throw new Error(error.response?.data?.detail || 'Failed to save monster');
    }
  }

  static async getMyCollection() {
    try {
      const response = await axios.get(`${API}/monsters/my-collection`);
      return response.data;
    } catch (error) {
      console.error('Error fetching collection:', error);
      throw new Error(error.response?.data?.detail || 'Failed to fetch collection');
    }
  }

  static async deleteSavedMonster(monsterId) {
    try {
      const response = await axios.delete(`${API}/monsters/saved/${monsterId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting monster:', error);
      throw new Error(error.response?.data?.detail || 'Failed to delete monster');
    }
  }

  // Libraries
  static async getLibraries() {
    try {
      const response = await axios.get(`${API}/monsters/libraries`);
      return response.data;
    } catch (error) {
      console.error('Error fetching libraries:', error);
      throw new Error(error.response?.data?.detail || 'Failed to fetch libraries');
    }
  }

  // Sharing
  static async shareMonster(monsterId, shareType = 'link', expiresIn = 7) {
    try {
      const response = await axios.post(`${API}/monsters/share`, {
        monsterId,
        shareType,
        expiresIn
      });
      return response.data;
    } catch (error) {
      console.error('Error sharing monster:', error);
      throw new Error(error.response?.data?.detail || 'Failed to create share link');
    }
  }

  static async getSharedMonster(shareId) {
    try {
      const response = await axios.get(`${API}/monsters/shared/${shareId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching shared monster:', error);
      throw new Error(error.response?.data?.detail || 'Failed to fetch shared monster');
    }
  }

  // Statistics
  static async getStats() {
    try {
      const response = await axios.get(`${API}/monsters/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      return { totalGenerated: 0, totalSaved: 0, totalShared: 0 };
    }
  }

  // Utility
  static async testConnection() {
    try {
      const response = await axios.get(`${API}/`);
      return response.data;
    } catch (error) {
      console.error('API connection test failed:', error);
      throw new Error('Cannot connect to API');
    }
  }
}

export default MonsterAPI;