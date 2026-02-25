import type { Handler } from "@netlify/functions";
import { createAdapter } from "./_adapter";
import originalHandler from "../../api/search/logs";

export const handler: Handler = async (event) => {
  const { req, res, responsePromise } = createAdapter(event);
  originalHandler(req as any, res as any);
  return responsePromise;
};
