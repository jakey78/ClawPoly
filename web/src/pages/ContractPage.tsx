import { useParams } from "react-router-dom";
import AnimatedPage from "@/components/ui/AnimatedPage";
import SearchBar from "@/components/search/SearchBar";
import { useSearch } from "@/hooks/useSearch";
import { SkeletonCard } from "@/components/ui/LoadingSkeleton";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProofBundle from "@/components/evidence/ProofBundle";
import CopyButton from "@/components/evidence/CopyButton";
import {
  FileCode2,
  Code2,
  Shield,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

export default function ContractPage() {
  const { address } = useParams<{ address: string }>();

  const { data, isLoading, error } = useSearch({
    query: address || "",
    type: "contract",
    enabled: !!address,
  });

  const result = data?.data as Record<string, unknown> | undefined;
  const contractData = result?.data as Record<string, unknown> | undefined;
  const proofBundle = result?.proof as Record<string, unknown> | undefined;

  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto flex flex-col gap-8 px-6 sm:px-10 lg:px-16 pt-8 md:pt-14">
        <SearchBar size="sm" />

        {/* Header */}
        <div className="flex items-center gap-3 flex-wrap">
          <FileCode2 size={24} style={{ color: "var(--color-accent-purple)" }} />
          <h1
            className="text-xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Contract
          </h1>
          {contractData?.isProxy && <Badge variant="warning">Proxy</Badge>}
          {contractData?.verified && <Badge variant="success">Verified</Badge>}
        </div>

        {address && (
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-mono truncate"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {address}
            </span>
            <CopyButton text={address} />
            <a
              href={`https://polygonscan.com/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--color-accent-teal)" }}
            >
              <ExternalLink size={14} />
            </a>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* Error */}
        {error && (
          <Card className="flex items-center gap-3">
            <AlertTriangle
              size={20}
              style={{ color: "var(--color-status-error)" }}
            />
            <span style={{ color: "var(--color-status-error)" }}>
              {error.message}
            </span>
          </Card>
        )}

        {contractData && (
          <div className="space-y-4">
            {/* Contract Info */}
            <Card className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield
                  size={16}
                  style={{ color: "var(--color-accent-teal)" }}
                />
                <h2
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Contract Info
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {contractData.contractName && (
                  <div className="space-y-1">
                    <span style={{ color: "var(--color-text-muted)" }}>
                      Name
                    </span>
                    <p
                      className="font-medium"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {String(contractData.contractName)}
                    </p>
                  </div>
                )}
                {contractData.compilerVersion && (
                  <div className="space-y-1">
                    <span style={{ color: "var(--color-text-muted)" }}>
                      Compiler
                    </span>
                    <p
                      className="font-mono text-xs"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {String(contractData.compilerVersion)}
                    </p>
                  </div>
                )}
                {contractData.isProxy && contractData.implementationAddress && (
                  <div className="space-y-1 md:col-span-2">
                    <span style={{ color: "var(--color-text-muted)" }}>
                      Implementation
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={`/contract/${contractData.implementationAddress}`}
                        className="font-mono text-xs"
                        style={{ color: "var(--color-accent-teal)" }}
                      >
                        {String(contractData.implementationAddress)}
                      </a>
                      <CopyButton
                        text={String(contractData.implementationAddress)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Bytecode size */}
            {contractData.bytecodeSize && (
              <Card className="space-y-2">
                <span
                  className="text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Bytecode Size
                </span>
                <p
                  className="font-mono text-xl font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {Number(contractData.bytecodeSize).toLocaleString()} bytes
                </p>
              </Card>
            )}

            {/* ABI */}
            {contractData.abi && (
              <Card className="space-y-3">
                <div className="flex items-center gap-2">
                  <Code2
                    size={16}
                    style={{ color: "var(--color-accent-amber)" }}
                  />
                  <h2
                    className="text-sm font-semibold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    ABI
                  </h2>
                  {Array.isArray(contractData.abi) && (
                    <Badge variant="default">
                      {(contractData.abi as unknown[]).length} entries
                    </Badge>
                  )}
                </div>
                <pre
                  className="text-xs font-mono overflow-x-auto max-h-96 p-3 rounded-lg"
                  style={{
                    backgroundColor: "var(--color-bg-elevated)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {JSON.stringify(contractData.abi, null, 2)}
                </pre>
              </Card>
            )}

            {/* Source Code */}
            {contractData.sourceCode && (
              <Card className="space-y-3">
                <div className="flex items-center gap-2">
                  <Code2
                    size={16}
                    style={{ color: "var(--color-accent-teal)" }}
                  />
                  <h2
                    className="text-sm font-semibold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Source Code
                  </h2>
                </div>
                <pre
                  className="text-xs font-mono overflow-x-auto max-h-[600px] p-3 rounded-lg"
                  style={{
                    backgroundColor: "var(--color-bg-elevated)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {String(contractData.sourceCode)}
                </pre>
              </Card>
            )}
          </div>
        )}

        {/* Proof Bundle */}
        {proofBundle && <ProofBundle proof={proofBundle as never} />}
      </div>
    </AnimatedPage>
  );
}
