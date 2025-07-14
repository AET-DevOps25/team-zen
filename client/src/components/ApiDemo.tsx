import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  CheckCircle,
  Clock,
  Layers,
  RefreshCw,
  Server,
  Settings,
  Shield,
  XCircle,
  Zap,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  useApiGatewayHealth,
  useApiGatewayStatus,
} from '@/hooks/useApiGatewayHealth';

interface ApiDemoProps {
  children?: React.ReactNode;
  open?: boolean;
}

export const ApiDemo = ({ children, open = false }: ApiDemoProps) => {
  const [isOpen, setIsOpen] = useState(open);
  const [showDetailed, setShowDetailed] = useState(false);

  const basicHealth = useApiGatewayHealth(false, isOpen);
  const detailedHealth = useApiGatewayHealth(true, isOpen);
  const status = useApiGatewayStatus(isOpen);

  // Choose which health data to display
  const currentHealth = showDetailed ? detailedHealth : basicHealth;

  const getStatusColor = (isHealthy: boolean | undefined) => {
    if (isHealthy === undefined) return 'text-gray-500';
    return isHealthy ? 'text-green-500' : 'text-red-500';
  };

  const getStatusIcon = (isHealthy: boolean | undefined) => {
    if (isHealthy === undefined) return <Activity className="w-4 h-4" />;
    return isHealthy ? (
      <CheckCircle className="w-4 h-4" />
    ) : (
      <XCircle className="w-4 h-4" />
    );
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return timestamp;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant="outline"
            className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <Activity className="size-4 mr-2" />
            API Health Monitor
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="min-w-4xl max-w-5xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Server className="w-5 h-5 text-teal-600" />
            <span>API Gateway Health Monitor</span>
          </DialogTitle>
          <DialogDescription>
            Real-time monitoring of API Gateway health and service dependencies
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Status Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* Basic Health Status */}
            <Card className="flex-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center space-x-2">
                  <div className={getStatusColor(basicHealth.isHealthy)}>
                    {getStatusIcon(basicHealth.isHealthy)}
                  </div>
                  <span>Health Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Status:
                    </span>
                    <Badge
                      variant={
                        basicHealth.isHealthy ? 'default' : 'destructive'
                      }
                      className="text-xs"
                    >
                      {basicHealth.health?.status || 'Unknown'}
                    </Badge>
                  </div>
                  {basicHealth.isLoading && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  )}
                  {basicHealth.isError && (
                    <p className="text-xs text-destructive">
                      Error: {basicHealth.error?.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Simple Status */}
            <Card className="flex-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center space-x-2">
                  <div className={getStatusColor(status.isOnline)}>
                    {getStatusIcon(status.isOnline)}
                  </div>
                  <span>Quick Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Response:
                    </span>
                    <Badge
                      variant={status.isOnline ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {status.status || 'Unknown'}
                    </Badge>
                  </div>
                  {status.isLoading && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Checking...</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Service Info */}
            <Card className="flex-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center space-x-2">
                  <Server className="w-4 h-4 text-blue-600" />
                  <span>Service Info</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Service:
                    </span>
                    <span className="text-xs font-mono">
                      {currentHealth.health?.service || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Port:</span>
                    <span className="text-xs font-mono">
                      {currentHealth.health?.port || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Version:
                    </span>
                    <span className="text-xs font-mono">
                      {currentHealth.health?.version || 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Detailed/Basic Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <Button
                variant={!showDetailed ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowDetailed(false)}
                className="text-xs"
              >
                <Zap className="w-3 h-3 mr-1" />
                Basic
              </Button>
              <Button
                variant={showDetailed ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowDetailed(true)}
                className="text-xs"
              >
                <Layers className="w-3 h-3 mr-1" />
                Detailed
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => currentHealth.refetch()}
                disabled={currentHealth.isLoading}
                className="text-xs"
              >
                {currentHealth.isLoading ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3" />
                )}
                Refresh
              </Button>
            </div>
          </motion.div>

          {/* Main Health Data Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={showDetailed ? 'detailed' : 'basic'}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Timestamp Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span>Last Updated</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-mono text-foreground">
                    {currentHealth.health?.timestamp
                      ? formatTimestamp(currentHealth.health.timestamp)
                      : 'No timestamp available'}
                  </p>
                </CardContent>
              </Card>

              {/* Dependencies (only for detailed view) */}
              {showDetailed && detailedHealth.dependencies && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                      <Server className="w-4 h-4 text-green-600" />
                      <span>Service Dependencies</span>
                    </CardTitle>
                    <CardDescription>
                      Status of connected microservices
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {Object.entries(detailedHealth.dependencies).map(
                        ([service, serviceStatus]) => (
                          <div
                            key={service}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <span className="text-sm font-medium capitalize">
                              {service.replace('-', ' ')}
                            </span>
                            <Badge
                              variant={
                                serviceStatus === 'configured'
                                  ? 'default'
                                  : 'destructive'
                              }
                              className="text-xs"
                            >
                              {serviceStatus}
                            </Badge>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Configuration (only for detailed view) */}
              {showDetailed && detailedHealth.configuration && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                      <Settings className="w-4 h-4 text-blue-600" />
                      <span>Configuration Status</span>
                    </CardTitle>
                    <CardDescription>
                      Security and system configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {Object.entries(detailedHealth.configuration).map(
                        ([config, configStatus]) => (
                          <div
                            key={config}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <div className="flex items-center space-x-2">
                              {config === 'authentication' && (
                                <Shield className="w-3 h-3" />
                              )}
                              {config === 'microservices' && (
                                <Server className="w-3 h-3" />
                              )}
                              {config === 'port-binding' && (
                                <Settings className="w-3 h-3" />
                              )}
                              <span className="text-sm font-medium capitalize">
                                {config.replace('-', ' ')}
                              </span>
                            </div>
                            <Badge
                              variant={
                                configStatus === 'enabled'
                                  ? 'default'
                                  : 'destructive'
                              }
                              className="text-xs"
                            >
                              {configStatus}
                            </Badge>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Error Display */}
              {currentHealth.isError && (
                <Card className="border-destructive/50 bg-destructive/5">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center space-x-2 text-destructive">
                      <XCircle className="w-4 h-4" />
                      <span>Error Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-destructive font-mono">
                      {currentHealth.error?.message}
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiDemo;
