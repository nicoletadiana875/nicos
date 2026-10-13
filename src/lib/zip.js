import { inflateRawSync } from "node:zlib";

const MAX_BYTES = 25 * 1024 * 1024;

/**
 * Estrae il primo file da un archivio ZIP (stored o deflate).
 * Le API GME restituiscono un .zip con un solo .json al suo interno.
 */
export function unzipFirstFile(buffer) {
  let eocd = -1;
  for (let i = buffer.length - 22; i >= Math.max(0, buffer.length - 65557); i--) {
    if (buffer.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("Archivio ZIP non valido");

  const entries = buffer.readUInt16LE(eocd + 10);
  const cdOffset = buffer.readUInt32LE(eocd + 16);
  if (entries < 1 || buffer.readUInt32LE(cdOffset) !== 0x02014b50) {
    throw new Error("Archivio ZIP vuoto o non valido");
  }

  const method = buffer.readUInt16LE(cdOffset + 10);
  const compressedSize = buffer.readUInt32LE(cdOffset + 20);
  const uncompressedSize = buffer.readUInt32LE(cdOffset + 24);
  const nameLength = buffer.readUInt16LE(cdOffset + 28);
  const localOffset = buffer.readUInt32LE(cdOffset + 42);
  const name = buffer.toString("utf8", cdOffset + 46, cdOffset + 46 + nameLength);

  if (uncompressedSize > MAX_BYTES) throw new Error("Archivio troppo grande");
  if (buffer.readUInt32LE(localOffset) !== 0x04034b50) throw new Error("ZIP: intestazione locale non valida");

  const localName = buffer.readUInt16LE(localOffset + 26);
  const localExtra = buffer.readUInt16LE(localOffset + 28);
  const start = localOffset + 30 + localName + localExtra;
  const raw = buffer.subarray(start, start + compressedSize);

  if (method === 0) return { name, data: Buffer.from(raw) };
  if (method === 8) return { name, data: inflateRawSync(raw, { maxOutputLength: MAX_BYTES }) };
  throw new Error(`ZIP: metodo di compressione ${method} non supportato`);
}
