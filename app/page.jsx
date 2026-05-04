"use client";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const fetcher = (url) => fetch(url).then(r => r.json());

export default function Dashboard() {
  const { data: logs = [] } = useSWR("/api/sensor", fetcher, { refreshInterval: 3000 });

  if (logs.length === 0) return <div style={centerStyle}>📡 Syncing with Muktodhara Network...</div>;

  const latest = logs[0] || {};
  const chartData = [...logs].reverse().slice(-20);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerStyle}>
      <header style={headerStyle}>
        <div>
          <h1 style={{ margin: 0, color: '#0f172a' }}>Muktodhara Intelligence</h1>
          <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>Real-time Drainage Monitoring</p>
        </div>
        <div style={badgeStyle}>{latest.location}</div>
      </header>

      {/* Top Stats Cards */}
      <div style={statsGrid}>
        <motion.div whileHover={{ scale: 1.02 }} style={cardStyle}>
          <span style={labelStyle}>Current Water Level</span>
          <div style={valueWrapper}>
            <h2 style={mainValue}>{latest.water_depth?.toFixed(1) || "0.0"}</h2>
            <span style={unitStyle}>cm</span>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} style={cardStyle}>
          <span style={labelStyle}>System Risk Status</span>
          <h2 style={{ ...mainValue, color: latest.status === 'RED' ? '#ef4444' : '#22c55e' }}>
            {latest.status || "UNKNOWN"}
          </h2>
        </motion.div>
      </div>

      {/* Trend Graph */}
      <motion.div initial={{ y: 20 }} animate={{ y: 0 }} style={{ ...cardStyle, marginTop: '24px' }}>
        <h4 style={labelStyle}>Hydrological Trend (Last 20 Readings)</h4>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="createdAt" tickFormatter={(t) => new Date(t).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Area type="monotone" dataKey="water_depth" stroke="#3b82f6" fill="#eff6ff" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Animated Data Table */}
      <motion.div initial={{ y: 20 }} animate={{ y: 0 }} style={{ ...cardStyle, marginTop: '24px' }}>
        <h4 style={labelStyle}>Historical Sensor Logs</h4>
        <table width="100%" style={{ borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={thRowStyle}>
              <th style={tableHeader}>Timestamp</th>
              <th style={tableHeader}>Upstream (s1)</th>
              <th style={tableHeader}>Downstream (s2)</th>
              <th style={tableHeader}>Depth</th>
              <th style={tableHeader}>Risk</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode='popLayout'>
              {logs.map((log) => (
                <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={log._id} style={trStyle}>
                  <td style={tdStyle}>{new Date(log.createdAt).toLocaleString()}</td>
                  <td style={tdStyle}>{log.s1?.toFixed(1) || "0.0"} cm</td>
                  <td style={tdStyle}>{log.s2?.toFixed(1) || "0.0"} cm</td>
                  <td style={tdStyle}>{log.water_depth?.toFixed(1)} cm</td>
                  <td style={tdStyle}>
                    <span style={{ color: log.status === 'RED' ? '#ef4444' : '#22c55e', fontWeight: '700' }}>
                      {log.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
}

// STYLES
const containerStyle = { padding: '40px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, system-ui' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' };
const badgeStyle = { background: '#fff', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: '#64748b', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' };
const statsGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };
const cardStyle = { background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' };
const labelStyle = { fontSize: '12px', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em', fontWeight: '600' };
const valueWrapper = { display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '10px' };
const mainValue = { fontSize: '36px', margin: 0, color: '#1e293b', fontWeight: '800' };
const unitStyle = { color: '#64748b', fontSize: '16px', fontWeight: '500' };
const thRowStyle = { borderBottom: '2px solid #f1f5f9', textAlign: 'left' };
const tableHeader = { padding: '12px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' };
const trStyle = { borderBottom: '1px solid #f8fafc' };
const tdStyle = { padding: '16px 12px', fontSize: '14px', color: '#334155' };
const centerStyle = { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#64748b', fontWeight: '500' };