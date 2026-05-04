"use client";

export default function Resources() {
  const teams = [
    { zone: "Zone 5 (Kaliganj)", head: "Md. Rafiqul Islam", contact: "+880 1711-XXXXXX", status: "Active" },
    { zone: "Zone 3 (Gulshan)", head: "Anisul Huq Jr.", contact: "+880 1822-XXXXXX", status: "On Standby" }
  ];

  return (
    <div style={{ padding: '40px' }}>
      <h1>👥 DCC Resource Management</h1>
      <p style={{ color: '#666' }}>Directory of emergency response teams and equipment.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {teams.map((t, i) => (
          <div key={i} style={{ background: '#fff', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #1890ff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>{t.zone}</h3>
            <p><b>Lead:</b> {t.head}</p>
            <p><b>Phone:</b> {t.contact}</p>
            <span style={{ padding: '4px 10px', background: '#e6f7ff', color: '#1890ff', borderRadius: '4px', fontSize: '12px' }}>{t.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}