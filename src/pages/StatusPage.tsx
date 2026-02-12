import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle, AlertTriangle, XCircle, Activity, Server, Database,
  Globe, Cpu, Zap, Clock, TrendingUp, Shield
} from "lucide-react";
import { motion } from "framer-motion";

interface Service {
  name: string;
  status: "operational" | "degraded" | "outage";
  icon: any;
  latency: number;
  uptime: string;
}

const services: Service[] = [
  { name: "AI Chat Engine", status: "operational", icon: Cpu, latency: 45, uptime: "99.98%" },
  { name: "Authentication", status: "operational", icon: Shield, latency: 22, uptime: "99.99%" },
  { name: "Database", status: "operational", icon: Database, latency: 8, uptime: "99.99%" },
  { name: "API Gateway", status: "operational", icon: Globe, latency: 15, uptime: "99.97%" },
  { name: "Credit System", status: "operational", icon: Zap, latency: 12, uptime: "99.99%" },
  { name: "Real-time Updates", status: "operational", icon: Activity, latency: 30, uptime: "99.95%" },
  { name: "Marketplace", status: "operational", icon: Server, latency: 35, uptime: "99.96%" },
  { name: "Studio Sync Plugin", status: "operational", icon: TrendingUp, latency: 50, uptime: "99.90%" },
];

const statusConfig = {
  operational: { color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", label: "Operational", icon: CheckCircle },
  degraded: { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", label: "Degraded", icon: AlertTriangle },
  outage: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", label: "Outage", icon: XCircle },
};

export default function StatusPage() {
  const allOperational = services.every(s => s.status === "operational");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">System Status</h1>
            <Card className={`inline-flex items-center gap-3 px-6 py-3 ${allOperational ? 'border-green-500/20' : 'border-yellow-500/20'}`}>
              {allOperational ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <span className="text-lg font-semibold text-green-400">All Systems Operational</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-6 w-6 text-yellow-400" />
                  <span className="text-lg font-semibold text-yellow-400">Some Systems Degraded</span>
                </>
              )}
            </Card>
          </div>

          <div className="space-y-3">
            {services.map((service, i) => {
              const config = statusConfig[service.status];
              return (
                <motion.div key={service.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className={`p-4 flex items-center gap-4 border ${config.border}`}>
                    <div className={`p-2 rounded-lg ${config.bg}`}>
                      <service.icon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{service.name}</p>
                      <p className="text-xs text-muted-foreground">{service.latency}ms • {service.uptime} uptime</p>
                    </div>
                    <Badge variant="outline" className={`${config.color} border-current/30`}>
                      {config.label}
                    </Badge>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-8 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 inline mr-1" />
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
