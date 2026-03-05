// src/types/leave.ts
// Types shared across leave / wfh module

export type LeaveType = 'leave' | 'wfh';

export interface LeaveRequest {
  _id: string;
  type: LeaveType;
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: string;
  approvedBy?: any;
}
