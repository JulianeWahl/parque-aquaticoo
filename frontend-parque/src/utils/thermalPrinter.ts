export interface KitchenTicketData {
  pedidoId: number;
  nomeCliente?: string | null;
  itens: Array<{
    nome: string;
    quantidade: number;
    observacao?: string | null;
  }>;
  metodoPagamento?: string | null;
  statusPagamento?: string;
  createdAt: string;
}

const ESC = 0x1b;
const GS = 0x1d;
const LF = 0x0a;

function encode(text: string): Uint8Array {
  const buf = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i++) {
    buf[i] = text.charCodeAt(i) & 0xff;
  }
  return buf;
}

function concat(...arrays: Uint8Array[]): Uint8Array {
  const total = arrays.reduce((s, a) => s + a.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const a of arrays) {
    out.set(a, offset);
    offset += a.length;
  }
  return out;
}

const byte = (...b: number[]) => new Uint8Array(b);

const CMD = {
  INIT: byte(ESC, 0x40),
  ALIGN_LEFT: byte(ESC, 0x61, 0x00),
  ALIGN_CENTER: byte(ESC, 0x61, 0x01),
  BOLD_ON: byte(ESC, 0x45, 0x01),
  BOLD_OFF: byte(ESC, 0x45, 0x00),
  DOUBLE_SIZE: byte(GS, 0x21, 0x11),
  NORMAL_SIZE: byte(GS, 0x21, 0x00),
  FEED_3: byte(ESC, 0x64, 0x03),
  CUT: byte(GS, 0x56, 0x41, 0x03),
  LF: byte(LF),
};

function buildTicket(data: KitchenTicketData): Uint8Array {
  const SEP = "--------------------------------\n";

  const now = new Date(data.createdAt || Date.now());
  const hora = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dataBR = now.toLocaleDateString("pt-BR");

  const metodoPag = data.metodoPagamento
    ? ((
        {
          PIX: "Pix",
          DINHEIRO: "Dinheiro",
          CREDITO: "Credito",
          DEBITO: "Debito",
        } as Record<string, string>
      )[data.metodoPagamento] ?? data.metodoPagamento)
    : "";

  const parts: Uint8Array[] = [
    CMD.INIT,
    CMD.ALIGN_CENTER,
    CMD.BOLD_ON,
    CMD.DOUBLE_SIZE,
    encode("OLHO D'AGUA\n"),
    CMD.NORMAL_SIZE,
    CMD.BOLD_OFF,
    encode("Parque Aquatico\n"),
    CMD.LF,

    CMD.BOLD_ON,
    CMD.DOUBLE_SIZE,
    encode(`PEDIDO #${data.pedidoId}\n`),
    CMD.NORMAL_SIZE,
    CMD.BOLD_OFF,
    CMD.LF,

    // ── Info ─────────────────────────────────────────────────
    CMD.ALIGN_LEFT,
    encode(SEP),
    encode(`Data: ${dataBR}  Hora: ${hora}\n`),
    ...(data.nomeCliente ? [encode(`Cliente: ${data.nomeCliente}\n`)] : []),
    ...(metodoPag ? [encode(`Pagto:   ${metodoPag}\n`)] : []),
    encode(SEP),

    CMD.BOLD_ON,
    encode("ITENS:\n"),
    CMD.BOLD_OFF,
  ];

  for (const item of data.itens) {
    parts.push(
      CMD.BOLD_ON,
      encode(`${item.quantidade}x ${item.nome}\n`),
      CMD.BOLD_OFF,
    );
    if (item.observacao?.trim()) {
      parts.push(encode(`   OBS: ${item.observacao.trim()}\n`));
    }
  }

  parts.push(
    encode(SEP),
    CMD.ALIGN_CENTER,
    encode("*** COZINHA ***\n"),
    CMD.FEED_3,
    CMD.CUT,
  );

  return concat(...parts);
}

let _device: any | null = null;
let _server: any | null = null;
let _characteristic: any | null = null;

const NORDIC_UART_SERVICE = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const NORDIC_UART_TX = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";

async function getCharacteristic(): Promise<any | null> {
  if (_characteristic && _server?.connected) return _characteristic;

  try {
    const service = await _server!.getPrimaryService(NORDIC_UART_SERVICE);
    _characteristic = await service.getCharacteristic(NORDIC_UART_TX);
    return _characteristic;
  } catch {
    console.warn("[ThermalPrinter] Could not get GATT characteristic.");
    return null;
  }
}

function chunk(data: Uint8Array, size = 20): Uint8Array[] {
  const chunks: Uint8Array[] = [];
  for (let i = 0; i < data.length; i += size) {
    chunks.push(data.slice(i, i + size));
  }
  return chunks;
}

export type PrinterStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "printing"
  | "error";

export async function connectPrinter(): Promise<boolean> {
  if (!(navigator as any).bluetooth) {
    console.error("[ThermalPrinter] Web Bluetooth not available.");
    return false;
  }

  try {
    _device = await (navigator as any).bluetooth.requestDevice({
      filters: [{ services: [NORDIC_UART_SERVICE] }],
    });

    _device.addEventListener("gattserverdisconnected", () => {
      _server = null;
      _characteristic = null;
      console.log("[ThermalPrinter] Disconnected.");
    });

    _server = await _device.gatt!.connect();
    await getCharacteristic(); // pre-fetch
    console.log(`[ThermalPrinter] Connected to: ${_device.name}`);
    return true;
  } catch (err) {
    console.error("[ThermalPrinter] Connection failed:", err);
    _device = null;
    _server = null;
    _characteristic = null;
    return false;
  }
}

export function disconnectPrinter() {
  _device?.gatt?.disconnect();
  _device = null;
  _server = null;
  _characteristic = null;
}

export function isPrinterConnected(): boolean {
  return !!_server?.connected;
}

export async function printKitchenOrder(
  data: KitchenTicketData,
): Promise<boolean> {
  if (!isPrinterConnected()) {
    console.warn("[ThermalPrinter] Not connected — ticket not printed.");
    return false;
  }

  try {
    const characteristic = await getCharacteristic();
    if (!characteristic) return false;

    const bytes = buildTicket(data);
    const chunks = chunk(bytes, 20);

    for (const c of chunks) {
      await characteristic.writeValue(c);
      await new Promise((r) => setTimeout(r, 20));
    }

    console.log(`[ThermalPrinter] Printed order #${data.pedidoId}`);
    return true;
  } catch (err) {
    console.error("[ThermalPrinter] Print error:", err);
    return false;
  }
}
