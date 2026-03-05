// src/services/leaveService.ts
// src/services/leaveService.ts
// Real backend service for applying and fetching leaves/WFH requests

import api from './api';
import { LeaveRequest } from '../types/leave.ts';

// payload sent when creating a new leave/wfh request
import { LeaveType } from '../types/leave.ts';
export type { LeaveType };

export interface LeavePayload {
  type: LeaveType;
  fromDate: string;
  toDate: string;
  reason: string;
}

/**
 * Apply for a leave or work-from-home.
 */
export async function applyLeave(
  payload: LeavePayload
): Promise<LeaveRequest> {
  // POST /api/leave
  // server expects type, fromDate, toDate, reason
  const response = await api.post<{ leaveRequest: LeaveRequest }>('/leave', payload);
  return response.data.leaveRequest;
}

/**
 * Get the current user's applied leaves.
 */
export async function getMyLeaves(): Promise<LeaveRequest[]> {
  const response = await api.get<{ leaveRequests: LeaveRequest[] }>('/leave/my');
  return response.data.leaveRequests;
}
