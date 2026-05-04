"use client";
import { useState, useEffect } from 'react';

export default function Manage() {
  const [nodes, setNodes] = useState([]);
  const [form, setForm] = useState({ node_id: '', location: '', baseline_depth: 200 });

  const fetchNodes = async () => {
    const res = await fetch('/api/nodes');
    setNodes(await res.json());
  };

  useEffect(() => { fetchNodes(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    await fetch('/api/nodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    alert("Node Calibration Saved!");
    fetchNodes();
  };

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: 0 }}>⚙️ Node Management</h1>
        <p style={{ color: '#666' }}>Calibrate baseline depths and assign locations to hardware IDs.</p>
      </div>

      <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <form onSubmit={handleSave} style={{ display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Node Hardware ID</label>
            <input style={inputStyle} value={form.node_id} onChange={e => setForm({...form, node_id: e.target.value})} placeholder="e.g. ESP32_GULSHAN_01" required />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Physical Location</label>
            <input style={inputStyle} value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Banani Road 11" required />
          </div>
          <div style={{ flex: 0.5 }}>
            <label style={labelStyle}>Drain Depth (cm)</label>
            <input style={inputStyle} type="number" value={form.baseline_depth} onChange={e => setForm({...form, baseline_depth: e.target.value})} required />
          </div>
          <button style={btnStyle}>Save Configuration</button>
        </form>
      </div>

      <div style={{ marginTop: '30px', background: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
        <table width="100%" cellPadding="15" style={{ borderCollapse: 'collapse' }}>
          <thead style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
            <tr style={{ textAlign: 'left' }}>
              <th>Node ID</th><th>Location</th><th>Baseline Depth</th><th>Last Status</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map(n => (
              <tr key={n._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td><code>{n.node_id}</code></td>
                <td>{n.location}</td>
                <td>{n.baseline_depth} cm</td>
                <td style={{ color: n.status === 'RED' ? 'red' : 'green', fontWeight: 'bold' }}>{n.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#888' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' };
const btnStyle = { padding: '12px 25px', background: '#001529', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' };