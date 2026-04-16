import type { ITransport } from './transport.interface';
import type { TransportRequest, TransportResponse } from '@/types';

interface RestTransportConfig {
  baseUrl: string;
  chatEndpoint: string;
}

export class RestTransport implements ITransport {
  private readonly config: RestTransportConfig;

  constructor(config: RestTransportConfig) {
    this.config = config;
  }

  async send(request: TransportRequest): Promise<TransportResponse> {
    const url = `${this.config.baseUrl}${this.config.chatEndpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (request.sessionToken) {
      headers['Authorization'] = `Bearer ${request.sessionToken}`;
    }

    const body = JSON.stringify({
      message: request.message,
      ...(request.conversationId ? { conversation_id: request.conversationId } : {}),
    });

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(`Transport error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as { content?: string; conversation_id?: string };

    return {
      content: data.content ?? '',
      conversationId: data.conversation_id,
      partial: false,
    };
  }
}
