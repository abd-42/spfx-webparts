import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ILeaveRequest, ILeaveRequestDraft } from '../components/ILeaveRequest';

export class LeaveRequestService {
  constructor(
    private readonly context: WebPartContext,
    private readonly listTitle: string
  ) {}

  private get listEndpoint(): string {
    return `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getByTitle('${this.listTitle}')`;
  }

  public async getAll(): Promise<ILeaveRequest[]> {
    const response: SPHttpClientResponse = await this.context.spHttpClient.get(
      `${this.listEndpoint}/items?$select=Id,Title,StartDate,EndDate,Reason,Status&$orderby=Id desc`,
      SPHttpClient.configurations.v1
    );

    this.ensureOk(response, 'Unable to load leave requests.');

    const json: { value: ILeaveRequest[] } = await response.json();
    return json.value;
  }

  public async create(request: ILeaveRequestDraft): Promise<void> {
    const response: SPHttpClientResponse = await this.context.spHttpClient.post(
      `${this.listEndpoint}/items`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'accept': 'application/json;odata=nometadata',
          'content-type': 'application/json;odata=nometadata'
        },
        body: JSON.stringify({ ...request, Status: 'Pending' })
      }
    );

    this.ensureOk(response, 'Unable to create leave request.');
  }

  public async update(id: number, request: ILeaveRequestDraft): Promise<void> {
    const response: SPHttpClientResponse = await this.context.spHttpClient.post(
      `${this.listEndpoint}/items(${id})`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'accept': 'application/json;odata=nometadata',
          'content-type': 'application/json;odata=nometadata',
          'if-match': '*',
          'x-http-method': 'MERGE'
        },
        body: JSON.stringify(request)
      }
    );

    this.ensureOk(response, 'Unable to update leave request.');
  }

  public async delete(id: number): Promise<void> {
    const response: SPHttpClientResponse = await this.context.spHttpClient.post(
      `${this.listEndpoint}/items(${id})`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'if-match': '*',
          'x-http-method': 'DELETE'
        }
      }
    );

    this.ensureOk(response, 'Unable to delete leave request.');
  }

  private ensureOk(response: SPHttpClientResponse, errorMessage: string): void {
    if (!response.ok) {
      throw new Error(`${errorMessage} (${response.status}: ${response.statusText})`);
    }
  }
}
