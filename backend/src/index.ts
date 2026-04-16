import express, { Request, Response } from 'express';
import cors from 'cors';

// ══════════════════════════════════════════════════════════════════════════════
// ⚠️  BACKEND MOCK - SOLO PARA DESARROLLO Y DEMOSTRACIÓN
// ══════════════════════════════════════════════════════════════════════════════
// Este es un backend simulado (mock) que NO debe usarse en producción.
// Su propósito es permitir el desarrollo frontend sin necesidad de un backend real.
// 
// CARACTERÍSTICAS:
// - Autenticación simulada con credenciales predefinidas
// - Almacenamiento en memoria (no persistente)
// - Respuestas de chat predefinidas con bloques <tinker>
// - Sin seguridad real, sin base de datos, sin lógica de negocio real
// 
// ⚠️  ADVERTENCIA: Las credenciales aquí son públicas y solo para desarrollo.
// ══════════════════════════════════════════════════════════════════════════════

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// ─── Configuración del Mock ──────────────────────────────────────────────────

// ⚠️  CREDENCIALES DE DESARROLLO - NO USAR EN PRODUCCIÓN
// Estas credenciales son públicas y solo existen para facilitar el desarrollo.
const MOCK_BACKEND_CONFIG = {
  IS_MOCK: true,
  VERSION: '0.1.0-mock',
  PURPOSE: 'Development and demonstration only',
  WARNING: 'NOT FOR PRODUCTION USE - This is a mock backend with simulated authentication',
};

// Almacenamiento en memoria (no persistente - se pierde al reiniciar)
const sessions = new Map<string, { userId: string }>();
const conversations = new Map<string, { messages: Array<{ role: string; content: string }> }>();

// ⚠️  USUARIOS MOCK - SOLO PARA DESARROLLO
// Credenciales predefinidas para testing. En un backend real, esto vendría de una base de datos.
const MOCK_USERS = {
  // Usuario demo principal
  demo: 'password123',
  // Usuario alternativo
  user: 'user123',
  // NOTA: Estas contraseñas son públicas y conocidas. No representan seguridad real.
};

// ─── Auth Endpoints ───────────────────────────────────────────────────────
// ⚠️  AUTENTICACIÓN SIMULADA - NO ES SEGURA
// Estos endpoints simulan autenticación para desarrollo frontend.

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Missing username or password' });
    return;
  }

  // ⚠️  Verificación contra credenciales mock predefinidas
  // En un backend real, esto consultaría una base de datos con contraseñas hasheadas.
  const validPassword = MOCK_USERS[username as keyof typeof MOCK_USERS];
  if (!validPassword || validPassword !== password) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  // ⚠️  Generación de token mock - NO ES CRIPTOCRÁFICAMENTE SEGURO
  // En un backend real, se usaría JWT firmado o similar.
  const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
  sessions.set(token, { userId: username });

  res.json({ 
    token,
    _mock_note: 'This is a mock token for development only. Not cryptographically secure.'
  });
});

// ─── Chat Endpoints ───────────────────────────────────────────────────────
// ⚠️  CHAT SIMULADO - RESPUESTAS PREDEFINIDAS
// Este endpoint simula un servicio de chat AI con respuestas predefinidas.

app.post('/api/chat/message', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid authorization' });
    return;
  }

  // ⚠️  Verificación mock de token
  // En un backend real, esto validaría un JWT firmado.
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
// ⚠️  GENERADOR DE RESPUESTAS MOCK - NO ES UN MODELO AI REAL
// Esta función genera respuestas predefinidas para simular un servicio de chat AI.

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
  console.log(`\n╔═══════════════════════════════════════════════════════════════════╗`);
  console.log(`║  🚀 MOCK BACKEND - SOLO PARA DESARROLLO                          ║`);
  console.log(`║  ⚠️  NO USAR EN PRODUCCIÓN                                      ║`);
  console.log(`╚═══════════════════════════════════════════════════════════════════╝`);
  console.log(`\n📡 Servidor mock ejecutándose en: http://localhost:${PORT}`);
  console.log(`\n📝 CREDENCIALES DE DESARROLLO (públicas):`);
  console.log(`   ┌─────────────────────┬─────────────────────┐`);
  console.log(`   │ Usuario            │ Contraseña          │`);
  console.log(`   ├─────────────────────┼─────────────────────┤`);
  console.log(`   │ demo               │ password123         │`);
  console.log(`   │ user               │ user123             │`);
  console.log(`   └─────────────────────┴─────────────────────┘`);
  console.log(`\n⚠️  ADVERTENCIA:`);
  console.log(`   • Este es un backend simulado para desarrollo frontend`);
  console.log(`   • Las credenciales son públicas y conocidas`);
  console.log(`   • No hay seguridad real ni almacenamiento persistente`);
  console.log(`   • Las respuestas de chat son predefinidas`);
  console.log(`\n🔗 Endpoints disponibles:`);
  console.log(`   POST /api/auth/login    - Autenticación simulada`);
  console.log(`   POST /api/chat/message  - Chat AI simulado`);
  console.log(`   GET  /health            - Health check`);
  console.log(`\n`);
});
