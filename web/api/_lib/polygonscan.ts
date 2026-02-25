const BASE_URL = "https://api.polygonscan.com/api";

function getApiKey(): string {
  return process.env.POLYGONSCAN_API_KEY || "";
}

async function fetchPolygonScan(params: Record<string, string>): Promise<any> {
  const url = new URL(BASE_URL);
  url.searchParams.set("apikey", getApiKey());
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`PolygonScan API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function getTxList(
  address: string,
  startblock = "0",
  endblock = "99999999",
  page = "1",
  offset = "25",
  sort = "desc"
) {
  return fetchPolygonScan({
    module: "account",
    action: "txlist",
    address,
    startblock,
    endblock,
    page,
    offset,
    sort,
  });
}

export async function getTokenTx(
  address: string,
  startblock = "0",
  endblock = "99999999",
  page = "1",
  offset = "25",
  sort = "desc"
) {
  return fetchPolygonScan({
    module: "account",
    action: "tokentx",
    address,
    startblock,
    endblock,
    page,
    offset,
    sort,
  });
}

export async function getABI(address: string) {
  return fetchPolygonScan({
    module: "contract",
    action: "getabi",
    address,
  });
}

export async function getSourceCode(address: string) {
  return fetchPolygonScan({
    module: "contract",
    action: "getsourcecode",
    address,
  });
}

export async function getAccountBalance(address: string) {
  return fetchPolygonScan({
    module: "account",
    action: "balance",
    address,
    tag: "latest",
  });
}

export async function getInternalTxList(
  address: string,
  startblock = "0",
  endblock = "99999999",
  page = "1",
  offset = "25",
  sort = "desc"
) {
  return fetchPolygonScan({
    module: "account",
    action: "txlistinternal",
    address,
    startblock,
    endblock,
    page,
    offset,
    sort,
  });
}
