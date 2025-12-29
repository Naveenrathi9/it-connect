import React, { useState, useEffect } from 'react';
import { useApi } from '@/contexts/ApiContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const ApiTest = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { testConnection } = useApi();

  const handleTestConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await testConnection();
      setTestResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>API Connection Test</CardTitle>
          <CardDescription>Test the connection to the backend API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleTestConnection} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Testing...' : 'Test Connection'}
          </Button>
          
          {testResult && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
              <h3 className="font-medium text-green-800 dark:text-green-200">Success!</h3>
              <pre className="mt-2 text-sm text-green-700 dark:text-green-300 overflow-auto">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
              <h3 className="font-medium text-red-800 dark:text-red-200">Error</h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiTest;
