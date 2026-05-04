"use client";
import useSWR from 'swr';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fetcher = (url) => fetch(url).then(r => r.json());

export default function History() {
  const { data: logs } = useSWR('/api/sensor', fetcher, { refreshInterval: 5000 });
  const [page, setPage] = useState(1);
  const perPage = 15;

  if (!logs) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#64748b' }}>
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          📡 Loading Historical Telemetry...
        </motion.div>
      </div>
    );
  }

  // Pagination Logic
  const totalPages = Math.ceil((logs.length || 0) / perPage);
  const paginated = logs.slice((page - 1) * perPage, page * perPage);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '40px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, system-ui' }}>
      
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#0f172a', margin: 0 }}>📜 Historical Sensor Logs</h1>
        <p style={{ color: '#64748b', marginTop: '8px' }}>Project Muktodhara - Archive</p>
      </header>

      <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table width="100%" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                <th style={thStyle}>Timestamp</th>
                <th style={thStyle}>Location</th>
                <th style={thStyle}>Upstream (s1)</th>
                <th style={thStyle}>Downstream (s2)</th>
                <th style={thStyle}>Total Depth</th>
                <th style={thStyle}>Risk</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode='wait'>
                {paginated.map((log) => (
                  <motion.tr 
                    key={log._id} 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0 }}
                    style={{ borderBottom: '1px solid #f8fafc' }}
                  >
                    <td style={tdStyle}>{new Date(log.createdAt).toLocaleString()}</td>
                    <td style={tdStyle}>{log.location}</td>
                    
                    {/* FIXED: Changed upstream_dist to s1 and downstream_dist to s2 */}
                    <td style={tdStyle}>{log.s1?.toFixed(1) || "0.0"} cm</td>
                    <td style={tdStyle}>{log.s2?.toFixed(1) || "0.0"} cm</td>
                    <td style={{ ...tdStyle, fontWeight: '600' }}>{log.water_depth?.toFixed(1)} cm</td>
                    
                    <td style={tdStyle}>
                      <span style={{ 
                        padding: '6px 12px', 
                        borderRadius: '20px', 
                        fontSize: '12px', 
                        fontWeight: '700',
                        backgroundColor: log.status === 'RED' ? '#fee2e2' : log.status === 'YELLOW' ? '#fef08a' : '#dcfce7',
                        color: log.status === 'RED' ? '#dc2626' : log.status === 'YELLOW' ? '#a16207' : '#16a34a' 
                      }}>
                        {log.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Upgraded Pagination Controls */}
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
          <span style={{ color: '#64748b', fontSize: '14px' }}>
            Showing {logs.length > 0 ? (page - 1) * perPage + 1 : 0} to {Math.min(page * perPage, logs.length)} of {logs.length} entries
          </span>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button 
              disabled={page === 1} 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              style={{ ...btnStyle, opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
            >
              Previous
            </button>
            <span style={{ fontWeight: '600', color: '#334155', minWidth: '90px', textAlign: 'center', fontSize: '14px' }}>
              Page {page} of {totalPages || 1}
            </span>
            <button 
              disabled={page >= totalPages} 
              onClick={() => setPage(p => p + 1)} 
              style={{ ...btnStyle, opacity: page >= totalPages ? 0.5 : 1, cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
            >
              Next
            </button>
          </div>
        </div>
        
      </div>
    </motion.div>
  );
}

// Styling constraints 
const thStyle = { padding: '16px 12px', color: '#64748b', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em', fontWeight: '600' };
const tdStyle = { padding: '16px 12px', color: '#334155', fontSize: '14px' };
const btnStyle = { padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#334155', fontWeight: '600', transition: 'all 0.2s ease-in-out' };