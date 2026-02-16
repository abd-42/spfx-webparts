import * as React from 'react';
import { ILeaveRequest, ILeaveRequestDraft } from './ILeaveRequest';
import { ILeaveRequestProps } from './ILeaveRequestProps';

const emptyDraft: ILeaveRequestDraft = {
  Title: '',
  StartDate: '',
  EndDate: '',
  Reason: ''
};

export const LeaveRequest: React.FC<ILeaveRequestProps> = ({ service }) => {
  const [requests, setRequests] = React.useState<ILeaveRequest[]>([]);
  const [draft, setDraft] = React.useState<ILeaveRequestDraft>(emptyDraft);
  const [editingId, setEditingId] = React.useState<number | undefined>(undefined);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

  const loadRequests = React.useCallback(async (): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const data = await service.getAll();
      setRequests(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [service]);

  React.useEffect(() => {
    loadRequests().catch(() => undefined);
  }, [loadRequests]);

  const onChange = (field: keyof ILeaveRequestDraft) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      setDraft((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const resetForm = (): void => {
    setDraft(emptyDraft);
    setEditingId(undefined);
  };

  const save = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setError('');

    try {
      if (editingId) {
        await service.update(editingId, draft);
      } else {
        await service.create(draft);
      }
      await loadRequests();
      resetForm();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const edit = (item: ILeaveRequest): void => {
    setEditingId(item.Id);
    setDraft({
      Title: item.Title,
      StartDate: item.StartDate,
      EndDate: item.EndDate,
      Reason: item.Reason
    });
  };

  const remove = async (id?: number): Promise<void> => {
    if (!id) {
      return;
    }

    try {
      await service.delete(id);
      await loadRequests();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <section>
      <h2>Leave Requests</h2>
      <form onSubmit={save}>
        <div>
          <label htmlFor="leave-title">Title</label>
          <input id="leave-title" value={draft.Title} onChange={onChange('Title')} required />
        </div>
        <div>
          <label htmlFor="leave-start">Start date</label>
          <input id="leave-start" type="date" value={draft.StartDate} onChange={onChange('StartDate')} required />
        </div>
        <div>
          <label htmlFor="leave-end">End date</label>
          <input id="leave-end" type="date" value={draft.EndDate} onChange={onChange('EndDate')} required />
        </div>
        <div>
          <label htmlFor="leave-reason">Reason</label>
          <textarea id="leave-reason" value={draft.Reason} onChange={onChange('Reason')} required />
        </div>
        <button type="submit">{editingId ? 'Update request' : 'Submit request'}</button>
        {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.Id}>
              <td>{request.Title}</td>
              <td>{request.StartDate}</td>
              <td>{request.EndDate}</td>
              <td>{request.Reason}</td>
              <td>{request.Status ?? 'Pending'}</td>
              <td>
                <button onClick={() => edit(request)}>Edit</button>
                <button onClick={() => remove(request.Id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default LeaveRequest;
