"use client"
import { create } from 'zustand';

export const useBenposeStore = create((set) => ({
  formData: null,
  setFormData: (data) => set({ formData: data }),
}));
