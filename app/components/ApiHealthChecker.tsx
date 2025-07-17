'use client';

import { useEffect, useState } from 'react';

const endpoints = [
  { url: '/api/submit', method: 'POST', body: { test: true } },
  { url: '/api/schools', method: 'GET' },
  { url: '/api/charts', method: 'GET' },
];

export default function ApiHealthChecker() {
  const [errorEndpoints, setErrorEndpoints] = useState<string[]>([]);

  useEffect(() => {
    const checkApiHealth = async () => {
      const failed: string[] = [];

      for (const { url, method, body } of endpoints) {
        try {
          const res = await fetch(url, {
            method,
            headers: method === 'POST' ? { 'Content-Type': 'application/json' } : undefined,
            body: method === 'POST' ? JSON.stringify(body || {}) : undefined,
          });

          if (!res.ok) {
            console.error(`API false: ${url} 状态码: ${res.status}`);
            failed.push(url);
          } else {
            console.log(`API true: ${url}`);
          }
        } catch (err) {
          console.error(`API error: ${url}`, err);
          failed.push(url);
        }
      }

      setErrorEndpoints(failed);
    };

    checkApiHealth();
  }, []);

  if (errorEndpoints.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-red-100 text-red-800 p-4 rounded-xl shadow-lg z-50">
      <p className="font-bold">部分接口异常：</p>
      <ul className="text-sm mt-1 list-disc list-inside">
        {errorEndpoints.map((ep) => (
          <li key={ep}>{ep}</li>
        ))}
      </ul>
    </div>
  );
}
