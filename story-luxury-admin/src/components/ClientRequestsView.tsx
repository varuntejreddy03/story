import { Mail, MessageSquare, Phone } from 'lucide-react';
import { ContactRequest } from '../types';

interface ClientRequestsViewProps {
  requests: ContactRequest[];
  onUpdateStatus: (id: string, status: ContactRequest['status']) => void;
}

const statusStyles: Record<ContactRequest['status'], string> = {
  new: 'bg-neutral-950 text-white',
  reviewing: 'bg-neutral-200 text-neutral-900',
  closed: 'bg-white text-neutral-500 border border-neutral-200'
};

export default function ClientRequestsView({ requests, onUpdateStatus }: ClientRequestsViewProps) {
  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Client Requests</h2>
          <p className="mt-1 text-sm text-neutral-500">Saved submissions from the storefront Write To Us form.</p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
          {requests.length} total requests
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="border border-dashed border-neutral-300 bg-white p-10 text-center">
          <MessageSquare className="mx-auto text-neutral-400" size={24} strokeWidth={1.4} />
          <p className="mt-4 text-sm font-semibold text-neutral-900">No client requests yet</p>
          <p className="mt-2 text-xs text-neutral-500">New Write To Us submissions will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {requests.map((request) => (
            <article key={request.id} className="border border-neutral-200 bg-white p-5 shadow-xs">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-widest ${statusStyles[request.status]}`}>
                      {request.status}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                      {request.topic}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-neutral-950">{request.name}</h3>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs text-neutral-500">
                    <span className="inline-flex items-center gap-1.5"><Mail size={13} />{request.email}</span>
                    {request.phone && <span className="inline-flex items-center gap-1.5"><Phone size={13} />{request.phone}</span>}
                    <span>{request.createdAt ? new Date(request.createdAt).toLocaleString('en-IN') : 'New request'}</span>
                  </div>
                </div>

                <select
                  value={request.status}
                  onChange={(event) => onUpdateStatus(request.id, event.target.value as ContactRequest['status'])}
                  className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold outline-hidden focus:border-neutral-950"
                >
                  <option value="new">New</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <p className="mt-5 whitespace-pre-wrap border-t border-neutral-100 pt-4 text-sm leading-6 text-neutral-700">
                {request.message}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
