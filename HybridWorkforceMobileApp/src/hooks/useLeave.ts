// src/hooks/useLeave.ts

import { useState, useCallback } from 'react';
import {
  applyLeave,
  getMyLeaves,
  LeavePayload,
} from '../services/leaveService';
import { LeaveRequest } from '../types/leave';

interface UseLeaveReturn {
  leaves: LeaveRequest[];
  loading: boolean;
  error: string | null;
  submitLeave: (payload: LeavePayload) => Promise<LeaveRequest>;
  fetchLeaves: () => Promise<void>;
}

export function useLeave(): UseLeaveReturn {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyLeaves();
      setLeaves(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load leaves');
    } finally {
      setLoading(false);
    }
  }, []);

  const submitLeave = useCallback(async (payload: LeavePayload) => {
    setLoading(true);
    setError(null);
    try {
      const newReq = await applyLeave(payload);
      // prepend the newly created request to the list
      setLeaves((prev) => [newReq, ...prev]);
      return newReq;
    } catch (err: any) {
      const msg = err.message || 'Error submitting leave';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { leaves, loading, error, submitLeave, fetchLeaves };
}
