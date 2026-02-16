# SPFx 1.22 Leave Request CRUD Web Part (Heft)

This project provides a SharePoint Framework (SPFx) **1.22** client-side web part using **Heft** tooling.
It demonstrates CRUD operations for a SharePoint list named **Leave Requests**.

## Features

- Create leave request
- Read/list leave requests
- Update leave request
- Delete leave request
- Configurable list title from web part property pane

## SharePoint list schema

Create a list (default: `Leave Requests`) with these columns:

- `Title` (Single line of text)
- `StartDate` (Date only)
- `EndDate` (Date only)
- `Reason` (Multiple lines of text)
- `Status` (Single line of text)

## Files of interest

- `src/webparts/leaveRequest/LeaveRequestWebPart.ts`: web part entry and property pane
- `src/webparts/leaveRequest/components/LeaveRequest.tsx`: React UI + CRUD handlers
- `src/webparts/leaveRequest/services/LeaveRequestService.ts`: SharePoint REST API integration

## Run locally

```bash
npm install
npm run build
npm run serve
```

Then open the SharePoint workbench and add the **LeaveRequest** web part.

## Notes

- This sample uses `SPHttpClient` and SharePoint REST APIs.
- In production, you can add validation (date ranges, business rules), pagination, and role-based approval workflow.
