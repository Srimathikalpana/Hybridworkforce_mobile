import api from './api';
import { UserRole } from './authService';

export type DashboardStats = Record<string, any>;

export interface EmployeeDashboardResponse {
  stats: {
    pendingLeaveCount: number;
    totalLeaveRequests: number;
    loginTime: string | null;
    workMode: 'wfh' | 'office';
    status: string;
  };
  recentLeaveRequests: any[];
  recentBroadcasts: any[];
}

export interface ManagerDashboardResponse {
  stats: {
    teamSize: number;
    pendingApprovals: number;
    teamOnlineCount: number;
    loginTime: string | null;
    workMode: 'wfh' | 'office';
    status: string;
  };
  teamMembers: any[];
  pendingLeaveRequests: any[];
}

export interface HRDashboardResponse {
  stats: {
    totalUsers: number;
    activeUsers: number;
    pendingApprovals: number;
    loginTime: string | null;
    workMode: 'wfh' | 'office';
    status: string;
  };
  pendingLeaveRequests: any[];
  recentUsers: any[];
}

export interface SystemDashboardResponse {
  stats: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    pendingApprovals: number;
    totalLeaveRequests: number;
    totalBroadcasts: number;
  };
  usersByRole: any[];
  pendingLeaveRequests: any[];
}

export async function getDashboard(role: UserRole) {
  switch (role) {
    case 'MANAGER': {
      const { data } = await api.get<ManagerDashboardResponse>('/dashboard/manager');
      return data;
    }
    case 'HR_ADMIN': {
      const { data } = await api.get<HRDashboardResponse>('/dashboard/hr');
      return data;
    }
    case 'SYS_ADMIN': {
      const { data } = await api.get<SystemDashboardResponse>('/dashboard/system');
      return data;
    }
    case 'EMPLOYEE':
    default: {
      const { data } = await api.get<EmployeeDashboardResponse>('/dashboard/employee');
      return data;
    }
  }
}

