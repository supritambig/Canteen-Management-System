import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LogOut, ClipboardList, Settings, PackagePlus } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [restockAmount, setRestockAmount] = useState({});
  const navigate = useNavigate();
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    const ordersRes = await axios.get('http://localhost:8080/api/orders/admin/all');
    setOrders(ordersRes.data);
    
    const menuRes = await axios.get('http://localhost:8080/api/menu/all');
    setMenu(menuRes.data);
  };

  const updateOrderStatus = async (orderId, status) => {
    await axios.put(`http://localhost:8080/api/orders/${orderId}/status?status=${status}`);
    fetchData();
  };

  const toggleMenuAvailability = async (itemId) => {
    await axios.put(`http://localhost:8080/api/menu/${itemId}/toggle`);
    fetchData();
  };

  const handleRestock = async (itemId) => {
    const amount = restockAmount[itemId] || 0;
    if(amount > 0) {
      await axios.put(`http://localhost:8080/api/menu/${itemId}/restock?amount=${amount}`);
      setRestockAmount(prev => ({...prev, [itemId]: 0}));
      fetchData();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="page-container">
      <div className="header glass-panel" style={{ padding: '1rem 2rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <ThemeToggle />
          <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '8px 16px' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 500px', gap: '2rem' }}>
        {/* Orders Queue */}
        <div>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ClipboardList color="var(--primary)" /> Live Order Queue
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map(order => (
              <div key={order.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>Order #{order.id}</h3>
                    <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>By: {order.user.name}</span>
                  </div>
                  <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary)' }}>
                    ₹{order.totalPrice}
                  </div>
                </div>
                
                <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                  <ul style={{ listStyle: 'none', display: 'grid', gap: '0.5rem' }}>
                    {order.items.map((i, idx) => (
                      <li key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{i.quantity}x {i.menuItem.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                  <span style={{ marginRight: 'auto', fontWeight: 600 }}>Status:</span>
                  {['PREPARING', 'READY', 'DELIVERED'].map(status => (
                    <button 
                      key={status}
                      onClick={() => updateOrderStatus(order.id, status)}
                      style={{
                        padding: '6px 12px', border: 'none', borderRadius: '6px', fontWeight: 500, cursor: 'pointer',
                        background: order.status === status ? 'var(--primary)' : 'var(--glass-bg)',
                        color: order.status === status ? '#fff' : 'var(--primary)',
                        transition: 'all 0.2s'
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {orders.length === 0 && <p style={{ color: 'var(--text-light)' }}>No active orders.</p>}
          </div>
        </div>

        {/* Menu Management */}
        <div>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Settings color="var(--primary)" /> Custom Inventory Control
          </h2>
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {menu.map(item => (
              <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '1.8rem' }}>{item.imageUrl}</span>
                    <div>
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                        Stock: <b style={{ color: item.stockQuantity > 0 ? 'var(--success)' : 'var(--danger)' }}>{item.stockQuantity}</b>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleMenuAvailability(item.id)}
                    style={{ 
                      padding: '6px 12px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem',
                      background: item.available ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: item.available ? 'var(--success)' : 'var(--danger)'
                    }}
                  >
                    {item.available ? 'Active' : 'Disabled'}
                  </button>
                </div>
                
                {/* Restock Tool */}
                <div style={{ display: 'flex', gap: '10px', paddingTop: '10px', borderTop: '1px solid var(--glass-border)' }}>
                  <input 
                    type="number" 
                    placeholder="Qty" 
                    min="1"
                    value={restockAmount[item.id] || ''} 
                    onChange={e => setRestockAmount({...restockAmount, [item.id]: parseInt(e.target.value)})}
                    style={{ flex: 1, padding: '8px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
                  />
                  <button onClick={() => handleRestock(item.id)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    <PackagePlus size={16} /> Restock
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
