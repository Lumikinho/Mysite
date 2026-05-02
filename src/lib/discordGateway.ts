type DiscordStatus = "online" | "idle" | "dnd" | "offline";

type GatewayHello = { op: 10; d: { heartbeat_interval: number } };
type GatewayDispatch = { op: 0; t: string; s: number; d: any };
type GatewayHeartbeatAck = { op: 11; d: null };

type GatewayMessage = GatewayHello | GatewayDispatch | GatewayHeartbeatAck | { op: number; d: any; t?: string; s?: number };

const GATEWAY_URL = "wss://gateway.discord.gg/?v=10&encoding=json";

const INTENTS =
  (1 << 0) | // GUILDS
  (1 << 1) | // GUILD_MEMBERS
  (1 << 8); // GUILD_PRESENCES (privileged)

function asStatus(input: any): DiscordStatus {
  if (input === "online" || input === "idle" || input === "dnd") return input;
  return "offline";
}

class DiscordGateway {
  private ws: WebSocket | null = null;
  private token: string;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private lastSeq: number | null = null;
  private ready = false;
  private connecting: Promise<void> | null = null;
  private presenceByUserId = new Map<string, DiscordStatus>();

  constructor(token: string) {
    this.token = token;
  }

  isReady() {
    return this.ready;
  }

  getStatus(userId: string): DiscordStatus | null {
    return this.presenceByUserId.get(userId) ?? null;
  }

  async connect() {
    if (this.ready) return;
    if (this.connecting) return this.connecting;

    this.connecting = new Promise<void>((resolve, reject) => {
      try {
        this.ws = new WebSocket(GATEWAY_URL);

        this.ws.onopen = () => {
          // wait for HELLO before identify
        };

        this.ws.onerror = (ev) => {
          this.cleanup();
          reject(new Error("Discord Gateway connection error"));
        };

        this.ws.onclose = () => {
          this.cleanup();
          this.ready = false;
          this.connecting = null;
        };

        this.ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(String(event.data)) as GatewayMessage;

            if (typeof msg.s === "number") this.lastSeq = msg.s;

            if (msg.op === 10) {
              const hello = msg as GatewayHello;
              this.startHeartbeat(hello.d.heartbeat_interval);

              this.send({
                op: 2,
                d: {
                  token: this.token,
                  intents: INTENTS,
                  properties: {
                    os: "windows",
                    browser: "astro",
                    device: "astro",
                  },
                },
              });
              return;
            }

            if (msg.op === 11) return;

            if (msg.op === 0) {
              const dispatch = msg as GatewayDispatch;
              if (dispatch.t === "READY") {
                this.ready = true;
                resolve();
                return;
              }

              if (dispatch.t === "PRESENCE_UPDATE") {
                const userId = dispatch.d?.user?.id;
                const status = asStatus(dispatch.d?.status);
                if (typeof userId === "string") this.presenceByUserId.set(userId, status);
                return;
              }

              if (dispatch.t === "GUILD_MEMBERS_CHUNK") {
                const presences = dispatch.d?.presences;
                if (Array.isArray(presences)) {
                  for (const p of presences) {
                    const uid = p?.user?.id;
                    if (typeof uid === "string") this.presenceByUserId.set(uid, asStatus(p?.status));
                  }
                }
                return;
              }
            }
          } catch {
            // ignore malformed messages
          }
        };
      } catch (e) {
        this.cleanup();
        reject(e instanceof Error ? e : new Error("Failed to connect to gateway"));
      }
    }).finally(() => {
      this.connecting = null;
    });

    return this.connecting;
  }

  requestMemberPresence(guildId: string, userId: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.send({
      op: 8,
      d: {
        guild_id: guildId,
        user_ids: [userId],
        limit: 0,
        presences: true,
      },
    });
  }

  private startHeartbeat(intervalMs: number) {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = setInterval(() => {
      this.send({ op: 1, d: this.lastSeq });
    }, intervalMs);
  }

  private send(payload: any) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify(payload));
  }

  private cleanup() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = null;
    this.ws = null;
    this.ready = false;
  }
}

declare global {
  // eslint-disable-next-line no-var
  var __discordGateway: DiscordGateway | undefined;
}

export function getDiscordGateway(token: string) {
  if (!globalThis.__discordGateway) {
    globalThis.__discordGateway = new DiscordGateway(token);
  }
  return globalThis.__discordGateway;
}

