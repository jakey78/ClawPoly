import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getBlockNumber } from "./_lib/rpc";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const blockNumber = await getBlockNumber();
    return res.status(200).json({
      status: "ok",
      chain: "polygon",
      chainId: 137,
      blockNumber: blockNumber.toString(),
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return res.status(503).json({
      status: "error",
      message: error.message || "RPC connection failed",
    });
  }
}
