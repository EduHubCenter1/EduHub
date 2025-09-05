import { prisma } from '@/lib/prisma';

// Basic inline styles for readability
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', marginBottom: '2rem', fontSize: '0.9rem' };
const thStyle: React.CSSProperties = { border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2', textAlign: 'left' };
const tdStyle: React.CSSProperties = { border: '1px solid #ddd', padding: '8px', fontFamily: 'monospace' };
const preStyle: React.CSSProperties = { whiteSpace: 'pre-wrap', wordBreak: 'break-all' };

export default async function AnalyticsTestPage() {
  // Fetch data from all four log tables
  const searchLogs = await prisma.searchLog.findMany({
    take: 20,
    orderBy: { timestamp: 'desc' },
  });

  const downloadLogs = await prisma.downloadLog.findMany({
    take: 20,
    orderBy: { timestamp: 'desc' },
    include: { resource: { select: { title: true } } },
  });

  const fieldViewLogs = await prisma.fieldViewLog.findMany({
    take: 20,
    orderBy: { timestamp: 'desc' },
    include: { field: { select: { name: true } } },
  });

  const moduleViewLogs = await prisma.moduleViewLog.findMany({
    take: 20,
    orderBy: { timestamp: 'desc' },
    include: { module: { select: { name: true } } },
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Analytics Log Test Page</h1>
      <p>This page shows the 20 most recent entries from each log table. Visit the site and perform actions to see the logs appear here.</p>

      {/* Search Logs Table */}
      <h2 style={{ marginTop: '2rem' }}>Recent Searches</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Timestamp</th>
            <th style={thStyle}>Query</th>
            <th style={thStyle}>Results Count</th>
            <th style={thStyle}>Visitor ID</th>
          </tr>
        </thead>
        <tbody>
          {searchLogs.map(log => (
            <tr key={log.id}>
              <td style={tdStyle}>{log.timestamp.toISOString()}</td>
              <td style={tdStyle}>{log.query}</td>
              <td style={tdStyle}>{log.resultsCount}</td>
              <td style={tdStyle}><pre style={preStyle}>{log.visitorId}</pre></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Download Logs Table */}
      <h2 style={{ marginTop: '2rem' }}>Recent Downloads</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Timestamp</th>
            <th style={thStyle}>Resource</th>
            <th style={thStyle}>Visitor ID</th>
          </tr>
        </thead>
        <tbody>
          {downloadLogs.map(log => (
            <tr key={log.id}>
              <td style={tdStyle}>{log.timestamp.toISOString()}</td>
              <td style={tdStyle}>{log.resource.title} ({log.resourceId})</td>
              <td style={tdStyle}><pre style={preStyle}>{log.visitorId}</pre></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Field View Logs Table */}
      <h2 style={{ marginTop: '2rem' }}>Recent Field Views</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Timestamp</th>
            <th style={thStyle}>Field</th>
            <th style={thStyle}>Visitor ID</th>
          </tr>
        </thead>
        <tbody>
          {fieldViewLogs.map(log => (
            <tr key={log.id}>
              <td style={tdStyle}>{log.timestamp.toISOString()}</td>
              <td style={tdStyle}>{log.field.name} ({log.fieldId})</td>
              <td style={tdStyle}><pre style={preStyle}>{log.visitorId}</pre></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Module View Logs Table */}
      <h2 style={{ marginTop: '2rem' }}>Recent Module Views</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Timestamp</th>
            <th style={thStyle}>Module</th>
            <th style={thStyle}>Visitor ID</th>
          </tr>
        </thead>
        <tbody>
          {moduleViewLogs.map(log => (
            <tr key={log.id}>
              <td style={tdStyle}>{log.timestamp.toISOString()}</td>
              <td style={tdStyle}>{log.module.name} ({log.moduleId})</td>
              <td style={tdStyle}><pre style={preStyle}>{log.visitorId}</pre></td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
