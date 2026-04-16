import type { TransportRequest, TransportResponse } from '@/types';

export interface ITransport {
  send(request: TransportRequest): Promise<TransportResponse>;
}
