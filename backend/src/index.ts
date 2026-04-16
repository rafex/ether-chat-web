import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for demo
const sessions = new Map<string, { userId: string }>();
const conversations = new Map<string, { messages: Array<{ role: string; content: string }> }>();

// Mock users
const MOCK_USERS = {
  demo: 'password123',
  user: 'user123',
};

// ─── Auth Endpoints ───────────────────────────────────────────────────────

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Missing username or password' });
    return;
  }

  const validPassword = MOCK_USERS[username as keyof typeof MOCK_USERS];
  if (!validPassword || validPassword !== password) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  // Generate a mock token
  const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
  sessions.set(token, { userId: username });

  res.json({ token });
});

// ─── Chat Endpoints ───────────────────────────────────────────────────────

app.post('/api/chat/message', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid authorization' });
    return;
  }

  const token = authHeader.slice(7);
  const session = sessions.get(token);
  if (!session) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  const { message, conversation_id } = req.body;
  if (!message) {
    res.status(400).json({ error: 'Missing message' });
    return;
  }

  // Get or create conversation
  const convId = conversation_id || `conv_${Date.now()}`;
  if (!conversations.has(convId)) {
    conversations.set(convId, { messages: [] });
  }

  const conversation = conversations.get(convId)!;
  conversation.messages.push({ role: 'user', content: message });

  // Generate mock response with tinker blocks
  const response = generateMockResponse(message);
  conversation.messages.push({ role: 'assistant', content: response });

  res.json({
    content: response,
    conversation_id: convId,
  });
});

// ─── Health Check ───────────────────────────────────────────────────────

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Mock Response Generator ────────────────────────────────────────────

function generateMockResponse(userMessage: string): string {
  const responses = [
    `Entendido. Procesando: "${userMessage.slice(0, 30)}..."

This is a visible response from the mock backend.

<tinker>
Internal reasoning:
- User asked about: ${userMessage.slice(0, 20)}
- Processing time: ${Math.random() * 100 | 0}ms
- Model: gpt-4-mock
</tinker>

¿Hay algo más que deseas saber?`,

    `Respuesta mock para: "${userMessage}"

El backend está funcionando correctamente. Este mensaje incluye un bloque tinker que puedes expandir o contraer según la configuración.

<tinker>
Debug info:
- Timestamp: ${new Date().toISOString()}
- Message length: ${userMessage.length}
- Mock mode: enabled
</tinker>

¿Te gustaría intentar otro mensaje?`,

    `¡Hola! Recibí tu mensaje: "${userMessage}"

Este es el backend mock de ether-chat-web. Funciona en memoria y es perfecto para desarrollo local.

<tinker>
Technical details:
- Backend: Node.js + Express
- Storage: In-memory (no persistence)
- Auth: Mock tokens
- Endpoint: POST /api/chat/message
</tinker>

El frontend debe estar en http://localhost:5173`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

// ─── Error Handling ───────────────────────────────────────────────────────

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// ─── Start Server ─────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🚀 Mock backend running at http://localhost:${PORT}`);
  console.log(`\n📝 Default credentials:`);
  console.log(`   Username: demo`);
  console.log(`   Password: password123`);
  console.log(`\n   (Also: user / user123)\n`);
});
