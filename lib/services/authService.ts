import { apiClient } from '../api/apiClient';
import { API_ENDPOINTS } from '../api/endpoints';

export const authService = {
  async login(payload: { email: string; password: string }) {
    return apiClient.post(API_ENDPOINTS.LOGIN, payload);
  },

  async register(payload: { name: string; email: string; phone?: string; password: string; role?: string }) {
    return apiClient.post(API_ENDPOINTS.REGISTER, { ...payload, role: payload.role || 'tenant' });
  },

  async sendOtp(contact: string, type: 'email' | 'phone', sendWhatsApp: boolean = true) {
    return apiClient.post(API_ENDPOINTS.SEND_OTP, { contact, type, sendWhatsApp });
  },

  async verifyOtp(contact: string, otp: string, role: string = 'tenant') {
    return apiClient.post(API_ENDPOINTS.VERIFY_OTP, { contact, otp, role });
  },

  async getMe() {
    return apiClient.get(API_ENDPOINTS.ME);
  },

  async updateProfile(data: any) {
    return apiClient.put(API_ENDPOINTS.UPDATE_PROFILE, data);
  },
};
