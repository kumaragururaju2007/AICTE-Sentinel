/**
 * AICTE Sentinel - API Client Service
 * Team Valora | Smart India Hackathon 2026
 *
 * Centralized API client connecting React frontend to the FastAPI + PostgreSQL backend.
 * Provides JWT auth token attachment, robust fallback, and type-safe methods.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  getToken() {
    return localStorage.getItem('sentinel_jwt_token') || sessionStorage.getItem('sentinel_jwt_token');
  }

  setToken(token, remember = true) {
    if (remember) {
      localStorage.setItem('sentinel_jwt_token', token);
    } else {
      sessionStorage.setItem('sentinel_jwt_token', token);
    }
  }

  clearToken() {
    localStorage.removeItem('sentinel_jwt_token');
    sessionStorage.removeItem('sentinel_jwt_token');
    localStorage.removeItem('sentinel_refresh_token');
    sessionStorage.removeItem('sentinel_refresh_token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorData = null;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { detail: response.statusText };
        }
        const error = new Error(errorData.detail || `Request failed with status ${response.status}`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      return await response.json();
    } catch (err) {
      console.warn(`[API] Call to ${endpoint} failed:`, err.message);
      throw err;
    }
  }

  // ── Authentication ──
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.access_token) {
      this.setToken(data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('sentinel_refresh_token', data.refresh_token);
      }
    }
    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async registerInstitution(formData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  // ── Applications ──
  async getMyApplications() {
    return this.request('/applications');
  }

  async getApplication(id) {
    return this.request(`/applications/${id}`);
  }

  async submitApplication(data) {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async submitDeficiencyResponse(id, notes, documentIds = []) {
    return this.request(`/applications/${id}/deficiency-response`, {
      method: 'POST',
      body: JSON.stringify({
        response_notes: notes,
        document_ids: documentIds,
      }),
    });
  }

  // ── Officer Portal ──
  async getOfficerApplications(stage = null) {
    const query = stage ? `?stage=${encodeURIComponent(stage)}` : '';
    return this.request(`/officer/applications${query}`);
  }

  async getOfficerApplicationDetail(id) {
    return this.request(`/officer/applications/${id}`);
  }

  async addOfficerComment(applicationId, comment) {
    return this.request(`/officer/applications/${applicationId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    });
  }

  async verifyDocument(documentId, result, remarks = '') {
    return this.request(`/officer/documents/${documentId}/verify`, {
      method: 'POST',
      body: JSON.stringify({
        verification_result: result,
        remarks,
      }),
    });
  }

  async forwardApplicationStage(applicationId, newStage, remarks) {
    return this.request(`/officer/applications/${applicationId}/transition`, {
      method: 'POST',
      body: JSON.stringify({
        new_stage: newStage,
        remarks,
      }),
    });
  }

  async submitOfficerRecommendation(applicationId, decision, justification) {
    return this.request(`/officer/applications/${applicationId}/recommendation`, {
      method: 'POST',
      body: JSON.stringify({
        decision,
        justification,
      }),
    });
  }

  async getOfficerWorkload() {
    return this.request('/officer/workload');
  }

  async getOfficerDeadlines() {
    return this.request('/officer/deadlines');
  }

  // ── Admin Portal ──
  async getAdminDashboard() {
    return this.request('/admin/dashboard');
  }

  async getAdminUsers(role = null) {
    const query = role ? `?role=${encodeURIComponent(role)}` : '';
    return this.request(`/admin/users${query}`);
  }

  async createAdminUser(userData) {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getAdminInstitutions() {
    return this.request('/admin/institutions');
  }

  async getAuditLogs(limit = 50, action = null) {
    let query = `?limit=${limit}`;
    if (action) query += `&action=${encodeURIComponent(action)}`;
    return this.request(`/admin/audit-logs${query}`);
  }

  // ── Obligations & SLA Management ──
  async getMyObligations() {
    return this.request('/obligations/my');
  }

  async getSLALadder() {
    return this.request('/obligations/sla-ladder');
  }

  async updateSLAStage(id, updateData) {
    return this.request(`/obligations/sla-ladder/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async triggerObligationScan() {
    return this.request('/obligations/scan', {
      method: 'POST',
    });
  }

  // ── Notifications ──
  async getMyNotifications() {
    return this.request('/notifications');
  }

  async markNotificationRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  async markAllNotificationsRead() {
    return this.request('/notifications/mark-all-read', {
      method: 'PATCH',
    });
  }

  async broadcastNotification(title, message, targetRole = 'ALL', priority = 'HIGH') {
    return this.request('/notifications/broadcast', {
      method: 'POST',
      body: JSON.stringify({
        title,
        message,
        target_role: targetRole,
        priority,
      }),
    });
  }

  // ── Analytics ──
  async getAnalyticsOverview() {
    return this.request('/analytics/overview');
  }

  async getProgramDistribution() {
    return this.request('/analytics/program-distribution');
  }

  async getMonthlyTrends() {
    return this.request('/analytics/trends');
  }

  async getRegionalPendency() {
    return this.request('/analytics/regional-pendency');
  }

  // ── AI & Predictive Intelligence ──
  async queryRAG(query) {
    return this.request('/ai/rag-query', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }

  async predictDelayRisk(applicationId) {
    return this.request(`/ai/predict-delay/${applicationId}`);
  }
}

export const api = new ApiClient();
export default api;

