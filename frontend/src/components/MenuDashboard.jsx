import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Clock, CheckCircle, Search, Wallet, FileText, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const MenuDashboard = () => {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [balance, setBalance] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMenu();
    fetchOrders();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8080/api/users/${user.id}`);
      setBalance(data.balance || 0);
      localStorage.setItem('user', JSON.stringify(data));
    } catch(e) {}
  };

  const fetchMenu = async () => {
    const { data } = await axios.get('http://localhost:8080/api/menu');
    setMenu(data);
  };

  const fetchOrders = async () => {
    const { data } = await axios.get(`http://localhost:8080/api/orders/user/${user.id}`);
    setOrders(data);
  };

  const topUpWallet = async () => {
    await axios.put(`http://localhost:8080/api/users/${user.id}/topup?amount=500`);
    fetchUser();
    alert('₹500 added to your wallet!');
  };

  const addToCart = (itemId) => {
    const item = menu.find(i => i.id === itemId);
    const currentQty = cart[itemId] || 0;
    if (item && currentQty < item.stockQuantity) {
      setCart(prev => ({ ...prev, [itemId]: currentQty + 1 }));
    } else {
      alert("Cannot add more, maximum stock reached.");
    }
  };

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [itemId, qty]) => {
      const item = menu.find(i => i.id === parseInt(itemId));
      return total + (item ? item.price * qty : 0);
    }, 0);
  };

  const placeOrder = async () => {
    if (Object.keys(cart).length === 0) return;
    const total = getCartTotal();
    if (total > balance) {
      alert(`Insufficient funds! Your balance is ₹${balance.toFixed(2)}, but the cart total is ₹${total.toFixed(2)}.`);
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/orders', {
        userId: user.id,
        items: cart
      });
      setCart({});
      fetchOrders();
      fetchMenu();
      fetchUser();
      alert('Order placed successfully! Funds have been deducted.');
    } catch (err) {
      alert(err.response?.data || 'Failed to place order');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const categories = ['All', ...new Set(menu.map(item => item.category).filter(Boolean))];

  const filteredMenu = menu.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCat === 'All' || item.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="page-container">
      <div className="header glass-panel" style={{ padding: '1rem 2rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>Hey, {user?.name} 👋</h1>
        
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--glass-bg)', padding: '6px 12px', borderRadius: '12px', fontWeight: 600 }}>
            <Wallet size={18} color="var(--primary)" />
            <span>₹{balance.toFixed(2)}</span>
            <button onClick={topUpWallet} style={{ marginLeft: '10px', background:'var(--primary)', color:'#fff', border:'none', borderRadius:'6px', padding:'4px 8px', cursor:'pointer', fontSize:'0.8rem' }}>+ ₹500</button>
          </div>
          <ThemeToggle />
          <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '8px 16px' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        {/* Menu Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.8rem' }}>🍽️</span> Menu
            </h2>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={18} color="var(--text-light)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="search" 
                placeholder="Search food..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '38px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-dark)' }}
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '2rem', paddingBottom: '0.5rem' }}>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCat(cat)}
                style={{
                  padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap',
                  background: selectedCat === cat ? 'var(--primary)' : 'var(--glass-bg)',
                  border: `1px solid ${selectedCat === cat ? 'transparent' : 'var(--glass-border)'}`,
                  color: selectedCat === cat ? '#fff' : 'var(--text-dark)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {filteredMenu.length === 0 && <p style={{ color: 'var(--text-light)' }}>No items found.</p>}
            {filteredMenu.map(item => {
              const isOut = item.stockQuantity === 0;
              return (
                <div key={item.id} className="glass-panel" style={{ padding: '1.5rem', opacity: isOut ? 0.6 : 1, transition: 'transform 0.2s', ':hover': { transform: isOut ? 'none' : 'translateY(-5px)' } }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}>{item.imageUrl}</span>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                        {item.category && <span style={{ fontSize: '0.8rem', padding: '4px 8px', borderRadius: '8px', background: 'var(--bg-color)', color: 'var(--text-light)' }}>{item.category}</span>}
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, padding: '4px 8px', borderRadius: '8px', background: isOut ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: isOut ? 'var(--danger)' : 'var(--success)' }}>
                          {isOut ? 'Sold Out' : `${item.stockQuantity} Left`}
                        </span>
                      </div>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.name}</h3>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1rem', minHeight: '40px' }}>{item.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary)' }}>₹{item.price}</span>
                    <button onClick={() => addToCart(item.id)} disabled={isOut} className="btn" style={{ padding: '6px 12px', fontSize: '0.9rem', opacity: isOut ? 0.5 : 1 }}>
                      Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          <h2 style={{ marginTop: '3rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={24} color="var(--primary)" /> Your Recent Orders
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.length === 0 && <p style={{ color: 'var(--text-light)' }}>No orders yet.</p>}
            {orders.map(order => (
              <div key={order.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ marginBottom: '0.5rem' }}>Order #{order.id}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                    {order.items.map(i => `${i.quantity}x ${i.menuItem.name}`).join(', ')}
                  </p>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                  <div style={{ fontWeight: 700 }}>₹{order.totalPrice}</div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, background: order.status === 'DELIVERED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: order.status === 'DELIVERED' ? 'var(--success)' : '#F59E0B' }}>
                      {order.status}
                    </span>
                    <button onClick={() => setSelectedOrder(order)} style={{ background: 'none', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FileText size={14} /> Receipt
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Sidebar */}
        <div>
          <div className="glass-panel" style={{ padding: '2rem', position: 'sticky', top: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShoppingCart color="var(--primary)" /> Your Cart
            </h2>
            
            {Object.keys(cart).length === 0 ? (
              <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '2rem 0' }}>Cart is empty</p>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  {Object.entries(cart).map(([itemId, qty]) => {
                    const item = menu.find(i => i.id === parseInt(itemId));
                    if (!item) return null;
                    return (
                      <div key={itemId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <div>
                          <div style={{ fontWeight: 500 }}>{item.name}</div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>₹{item.price} each</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-color)', padding: '4px 8px', borderRadius: '8px' }}>
                          <button onClick={() => removeFromCart(item.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--primary)' }}>-</button>
                          <span style={{ fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>{qty}</span>
                          <button onClick={() => addToCart(item.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--primary)' }}>+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 700 }}>
                  <span>Default Total:</span>
                  <span style={{ color: 'var(--primary)' }}>₹{getCartTotal().toFixed(2)}</span>
                </div>
                <button onClick={placeOrder} className="btn" style={{ width: '100%', padding: '12px', fontSize: '1.1rem' }}>
                  <CheckCircle size={20} /> Checkout (₹{getCartTotal()})
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Billing Modal */}
      {selectedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel animate-fade-in" style={{ padding: '2rem', width: '100%', maxWidth: '400px', background: 'var(--bg-color)', position: 'relative' }}>
            <button onClick={() => setSelectedOrder(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}>
              <X />
            </button>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-dark)' }}>Canteen Receipt</h2>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Order #{selectedOrder.id} • {new Date(selectedOrder.orderTime).toLocaleString()}</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
              {selectedOrder.items.map((it, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{it.quantity}x {it.menuItem.name}</span>
                  <span>₹{it.menuItem.price * it.quantity}</span>
                </div>
              ))}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary)' }}>
              <span>Total Paid:</span>
              <span>₹{selectedOrder.totalPrice.toFixed(2)}</span>
            </div>
            <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>
              <p>Paid securely via Campus Wallet</p>
              <p>Thank you for your order!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuDashboard;
