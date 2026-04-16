import type { Message, AgentState, AgentStatus } from '@/types';
import type { ITransport } from '@/transports/transport.interface';
import type { AuthService } from './auth.service';
import { normalizeAgentMessage, buildUserMessage } from '@/messages/normalizer';

type StateListener = (state: AgentState) => void;
type MessageListener = (message: Message) => void;

export class ChatService {
  private readonly transport: ITransport;
  private readonly auth: AuthService;
  private conversationId: string | undefined;
  private readonly stateListeners: Set<StateListener> = new Set();
  private readonly messageListeners: Set<MessageListener> = new Set();

  constructor(transport: ITransport, auth: AuthService) {
    this.transport = transport;
    this.auth = auth;
  }

  async sendMessage(text: string): Promise<Message> {
    const userMessage = buildUserMessage(text);
    this.notifyMessage(userMessage);
    this.notifyState('typing');

    try {
      const response = await this.transport.send({
        message: text,
        sessionToken: this.auth.getToken() ?? undefined,
        conversationId: this.conversationId,
      });

      this.conversationId = response.conversationId ?? this.conversationId;
      const agentMessage = normalizeAgentMessage(response.content);
      this.notifyState('idle');
      this.notifyMessage(agentMessage);
      return agentMessage;
    } catch (err) {
      this.notifyState('error', err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }

  onStateChange(listener: StateListener): () => void {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  onMessage(listener: MessageListener): () => void {
    this.messageListeners.add(listener);
    return () => this.messageListeners.delete(listener);
  }

  private notifyState(status: AgentStatus, message?: string): void {
    const state: AgentState = { status, ...(message ? { message } : {}) };
    this.stateListeners.forEach((l) => l(state));
  }

  private notifyMessage(message: Message): void {
    this.messageListeners.forEach((l) => l(message));
  }
}
