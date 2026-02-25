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

  return { req, res, responsePromise };
}

export interface NetlifyResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}
