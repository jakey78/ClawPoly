import AnimatedPage from "@/components/ui/AnimatedPage";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useAccount } from "wagmi";
import { useReadContract } from "wagmi";
import { accessControllerContract } from "@/config/contracts";
import {
  Shield,
  AlertTriangle,
  Lock,
  Loader2,
} from "lucide-react";

export default function AdminPage() {
  const { address, isConnected } = useAccount();

  const { data: isAdmin, isLoading } = useReadContract({
    ...accessControllerContract,
    functionName: "isAdmin",
    args: address ? [address] : undefined,
    query: { enabled: isConnected && !!address },
  });

  const { data: isOperator } = useReadContract({
    ...accessControllerContract,
    functionName: "isOperator",
    args: address ? [address] : undefined,
    query: { enabled: isConnected && !!address },
  });

  return (
    <AnimatedPage>
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <section className="pt-4 pb-6">
          <div className="flex items-center gap-4 mb-4">
            <Shield size={24} style={{ color: "var(--color-accent-amber)" }} />
            <h1
              className="text-3xl font-bold tracking-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              Admin Panel
            </h1>
          </div>
          <p
            className="text-base leading-relaxed max-w-lg"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Manage endpoints, pricing, and access control for ClawPoly
            contracts.
          </p>
        </section>

        {/* Not connected */}
        {!isConnected && (
          <Card className="flex items-center gap-3 py-8 justify-center">
            <Lock
              size={24}
              style={{ color: "var(--color-text-muted)" }}
            />
            <span style={{ color: "var(--color-text-secondary)" }}>
              Connect your wallet to access the admin panel.
            </span>
          </Card>
        )}

        {/* Loading */}
        {isConnected && isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2
              size={24}
              className="animate-spin"
              style={{ color: "var(--color-accent-teal)" }}
            />
          </div>
        )}

        {/* Not authorized */}
        {isConnected && !isLoading && !isAdmin && !isOperator && (
          <Card className="flex items-center gap-3 py-8 justify-center">
            <AlertTriangle
              size={24}
              style={{ color: "var(--color-status-error)" }}
            />
            <div>
              <p
                className="font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                Access Denied
              </p>
              <p
                className="text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Your address ({address}) does not have admin or operator role.
              </p>
            </div>
          </Card>
        )}

        {/* Authorized */}
        {isConnected && !isLoading && (isAdmin || isOperator) && (
          <div className="flex flex-col gap-6">
            <Card className="space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Your Roles
                </span>
              </div>
              <div className="flex gap-2">
                {isAdmin && <Badge variant="success">Admin</Badge>}
                {isOperator && <Badge variant="info">Operator</Badge>}
              </div>
              <p
                className="font-mono text-xs"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {address}
              </p>
            </Card>

            {/* Endpoint Management */}
            <Card className="space-y-3">
              <h2
                className="text-sm font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                Endpoint Management
              </h2>
              <p
                className="text-xs"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Register, update, and enable/disable API endpoints in the
                EndpointRegistry contract. Requires{" "}
                <Badge variant="info">Operator</Badge> role.
              </p>
              <div
                className="p-4 rounded-lg text-center text-sm"
                style={{
                  backgroundColor: "var(--color-bg-elevated)",
                  color: "var(--color-text-muted)",
                }}
              >
                Endpoint management UI coming soon. Use the contract directly
                via PolygonScan.
              </div>
            </Card>

            {/* Pricing Management */}
            <Card className="space-y-3">
              <h2
                className="text-sm font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                Pricing Management
              </h2>
              <p
                className="text-xs"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Set and update per-endpoint USDC pricing in the PricingRegistry
                contract. Requires{" "}
                <Badge variant="info">Operator</Badge> role.
              </p>
              <div
                className="p-4 rounded-lg text-center text-sm"
                style={{
                  backgroundColor: "var(--color-bg-elevated)",
                  color: "var(--color-text-muted)",
                }}
              >
                Pricing management UI coming soon. Use the contract directly via
                PolygonScan.
              </div>
            </Card>

            {/* Fee Vault */}
            {isAdmin && (
              <Card className="space-y-3">
                <h2
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Fee Vault
                </h2>
                <p
                  className="text-xs"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Configure recipients and distribute accumulated fees.
                  Requires <Badge variant="success">Admin</Badge> (owner)
                  role.
                </p>
                <div
                  className="p-4 rounded-lg text-center text-sm"
                  style={{
                    backgroundColor: "var(--color-bg-elevated)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  Fee vault management UI coming soon.
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}
