export interface ILeaveRequest {
  Id?: number;
  Title: string;
  StartDate: string;
  EndDate: string;
  Reason: string;
  Status?: string;
}

export interface ILeaveRequestDraft {
  Title: string;
  StartDate: string;
  EndDate: string;
  Reason: string;
}
