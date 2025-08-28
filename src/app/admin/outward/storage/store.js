"use client"
import {create} from 'zustand';

export const useOutwardStore = create((set) => ({
  payload: null,
  setPayload: (data) => set({ payload: data }),
}));
