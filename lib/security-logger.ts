/**
 * Logger de segurança para registrar eventos relacionados à autenticação e acesso
 */

type SecurityEventType = 
  | 'unauthorized_channel_access'
  | 'invalid_channel_format'
  | 'invalid_channel_name'
  | 'user_without_company'
  | 'company_mismatch'
  | 'channel_validation_error'
  | 'successful_auth'
  | 'connection_established'
  | 'connection_closed'
  | 'rate_limit_exceeded';

interface SecurityLogEntry {
  timestamp: string;
  eventType: SecurityEventType;
  details: Record<string, any>;
  userId?: string;
  ip?: string;
}

/**
 * Registra um evento de segurança
 * @param eventType Tipo do evento de segurança
 * @param details Detalhes adicionais do evento
 * @param userId ID do usuário (opcional)
 * @param ip Endereço IP (opcional)
 */
export function logSecurityEvent(
  eventType: SecurityEventType,
  details: Record<string, any>,
  userId?: string,
  ip?: string
): void {
  const logEntry: SecurityLogEntry = {
    timestamp: new Date().toISOString(),
    eventType,
    details,
    userId,
    ip
  };

  // Em produção, isso poderia enviar para um serviço de log externo
  if (process.env.NODE_ENV === 'production') {
    // Implementar integração com serviço de log externo
    // Ex: enviar para CloudWatch, Datadog, etc.
    console.log(`[SECURITY] ${JSON.stringify(logEntry)}`);
  } else {
    // Em desenvolvimento, apenas logar no console
    console.log(`[SECURITY EVENT] ${eventType}:`, details);
  }
}

/**
 * Registra tentativas de acesso não autorizado
 * @param channelName Nome do canal
 * @param userEmail Email do usuário
 * @param ip Endereço IP
 */
export function logUnauthorizedAccess(
  channelName: string,
  userEmail?: string,
  ip?: string
): void {
  logSecurityEvent(
    'unauthorized_channel_access',
    {
      channel: channelName,
      email: userEmail || 'unknown',
      timestamp: new Date().toISOString()
    },
    undefined,
    ip
  );
}

/**
 * Registra autenticação bem-sucedida
 * @param userId ID do usuário
 * @param companyId ID da empresa
 * @param channelName Nome do canal
 */
export function logSuccessfulAuth(
  userId: string,
  companyId: string,
  channelName: string
): void {
  logSecurityEvent(
    'successful_auth',
    {
      userId,
      companyId,
      channel: channelName,
      timestamp: new Date().toISOString()
    },
    userId
  );
}