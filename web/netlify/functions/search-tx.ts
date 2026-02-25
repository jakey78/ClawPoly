import type { Handler } from "@netlify/functions";
import { runHandler } from "./_adapter";
import originalHandler from "../../api/search/tx";

export const handler: Handler = async (event) =>
  runHandler(originalHandler, event);
