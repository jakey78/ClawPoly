import type { Handler } from "@netlify/functions";
import { runHandler } from "./_adapter";
import originalHandler from "../../api/search/docs";

export const handler: Handler = async (event) =>
  runHandler(originalHandler, event);
