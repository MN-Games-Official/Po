type LogMeta = Record<string, unknown> | Error | undefined;

function formatMeta(meta: LogMeta) {
  if (!meta) {
    return "";
  }

  if (meta instanceof Error) {
    return ` ${meta.name}: ${meta.message}`;
  }

  try {
    return ` ${JSON.stringify(meta)}`;
  } catch {
    return " [unserializable-meta]";
  }
}

export const logger = {
  info(message: string, meta?: LogMeta) {
    console.log(`[INFO] ${message}${formatMeta(meta)}`);
  },
  warn(message: string, meta?: LogMeta) {
    console.warn(`[WARN] ${message}${formatMeta(meta)}`);
  },
  error(message: string, meta?: LogMeta) {
    console.error(`[ERROR] ${message}${formatMeta(meta)}`);
  },
};
