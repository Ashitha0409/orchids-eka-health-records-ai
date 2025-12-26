"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Database } from "lucide-react";

interface ConnectionStatus {
  connected: boolean;
  error?: string;
  dbName?: string;
}

// This would normally be imported from the MongoDB utility
// but for client-side use, we'll create a simple status checker
async function checkMongoDBStatus(): Promise<ConnectionStatus> {
  try {
    // In a real implementation, you would call an API endpoint
    // that checks the MongoDB connection status
    // For now, we'll simulate the check
    const response = await fetch('/api/health/db', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        connected: data.connected,
        dbName: data.dbName,
        error: data.error
      };
    } else {
      return {
        connected: false,
        error: 'Failed to connect to database'
      };
    }
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Connection failed'
    };
  }
}

export function MongoDBStatus() {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        setLoading(true);
        const result = await checkMongoDBStatus();
        setStatus(result);
      } catch (error) {
        setStatus({
          connected: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
    
    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <span className="text-sm text-muted-foreground">Checking database...</span>
        </div>
      </Card>
    );
  }

  if (!status) {
    return null;
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Database className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">MongoDB Database</p>
            <p className="text-sm text-muted-foreground">
              {status.connected 
                ? `Connected to ${status.dbName || 'database'}`
                : status.error || 'Connection failed'
              }
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={
              status.connected
                ? "border-success/20 bg-success/10 text-success"
                : "border-destructive/20 bg-destructive/10 text-destructive"
            }
          >
            <div className="flex items-center gap-1">
              {status.connected ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <XCircle className="h-3 w-3" />
              )}
              {status.connected ? 'Connected' : 'Disconnected'}
            </div>
          </Badge>
        </div>
      </div>
    </Card>
  );
}

// Server-side component for checking MongoDB status
export async function MongoDBStatusServer() {
  try {
    // Import the MongoDB utilities on the server side
    const { checkConnection } = await import('@/lib/mongodb');
    const status = await checkConnection();
    
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Database className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">MongoDB Database</p>
              <p className="text-sm text-muted-foreground">
                {status.connected 
                  ? `Connected to ${status.dbName || 'database'}`
                  : status.error || 'Connection failed'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={
                status.connected
                  ? "border-success/20 bg-success/10 text-success"
                  : "border-destructive/20 bg-destructive/10 text-destructive"
              }
            >
              <div className="flex items-center gap-1">
                {status.connected ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <XCircle className="h-3 w-3" />
                )}
                {status.connected ? 'Connected' : 'Disconnected'}
              </div>
            </Badge>
          </div>
        </div>
      </Card>
    );
  } catch (error) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Database className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">MongoDB Database</p>
              <p className="text-sm text-muted-foreground">
                Error checking database status
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-destructive/20 bg-destructive/10 text-destructive"
            >
              <div className="flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                Error
              </div>
            </Badge>
          </div>
        </div>
      </Card>
    );
  }
}
