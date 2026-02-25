/**
 * Thin adapter between Netlify HandlerEvent and the Vercel-shaped req/res
 * objects expected by the existing web/api/**‌ handlers.
 */
import type { HandlerEvent } from "@netlify/functions";

export function createAdapter(event: HandlerEvent) {
  const req = {
    method: event.httpMethod,
    query: (event.queryStringParameters ?? {}) as Record<string, string>,
    headers: event.headers as Record<string, string | string[] | undefined>,
    body: event.body,
  };

  let resolved = false;
  let storedResolve!: (r: NetlifyResponse) => void;

  const responsePromise = new Promise<NetlifyResponse>((resolve) => {
    storedResolve = resolve;
  });

  const responseHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };
  let statusCode = 200;

  const res = {
    setHeader(key: string, value: string) {
      responseHeaders[key] = value;
      return res;
    },
    status(code: number) {
      statusCode = code;
      return res;
    },
    json(data: unknown) {
      if (!resolved) {
        resolved = true;
        storedResolve({
          statusCode,
          headers: responseHeaders,
          body: JSON.stringify(data),
        });
      }
      return {};
    },
  };

  return { req, res, responsePromise, resolve: storedResolve };
}

/** Wrap an async Vercel-style handler for Netlify. */
export async function runHandler(
  handler: (req: any, res: any) => Promise<any>,
  event: HandlerEvent,
): Promise<NetlifyResponse> {
  const { req, res, responsePromise, resolve } = createAdapter(event);
  try {
    await handler(req, res);
  } catch (err: any) {
    resolve({
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message || "Internal server error" }),
    });
  }
  return responsePromise;
}

export interface NetlifyResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}
