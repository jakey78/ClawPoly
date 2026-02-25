import type { Handler } from "@netlify/functions";
import { runHandler } from "./_adapter";
import originalHandler from "../../api/x402/endpoints";

export const handler: Handler = async (event) =>
  runHandler(originalHandler, event);
