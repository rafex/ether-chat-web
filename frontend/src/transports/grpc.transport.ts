/**
 * gRPC transport stub.
 *
 * gRPC in the browser requires gRPC-web or an HTTP gateway because browsers
 * cannot speak the native gRPC HTTP/2 framing protocol.
 *
 * This file defines the port (interface contract) so a future adapter can
 * implement it without touching the service layer.
 *
 * Steps to implement:
 * 1. Add a gRPC-web client library (e.g. @grpc/grpc-js, improbable-eng/grpc-web).
 * 2. Generate TypeScript stubs from your .proto files.
 * 3. Replace the stub below with the real implementation.
 */

import type { ITransport } from './transport.interface';
import type { TransportRequest, TransportResponse } from '@/types';

export class GrpcTransport implements ITransport {
  send(_request: TransportRequest): Promise<TransportResponse> {
    return Promise.reject(
      new Error('GrpcTransport is not implemented. See grpc.transport.ts for instructions.'),
    );
  }
}
