import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './css/Taikhoan.css';
import { 
  User, FileText, Settings, LogOut, Camera, Save, Truck, Search, Trash2
} from 'lucide-react';
import { MapPin, Plus, Edit2, CheckCircle } from 'lucide-react';

const TaiKhoan = () => {
  const [activeTab, setActiveTab] = useState('orders'); // Mặc định vào tab Đơn hàng
  const navigate = useNavigate();
  const { me, logout } = useAuth();

  // State lưu danh sách đơn hàng lấy từ DB
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  
  // State form Profile
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [formData, setFormData] = useState({
    ho_ten: '', 
    sdt: '', 
    email: '', 
    ngay_sinh: '', 
    gioi_tinh: 'khac'
  });
  // --- ADDRESS STATE ---
const [addresses, setAddresses] = useState([]);
const [loadingAddress, setLoadingAddress] = useState(false);
const [showAddressForm, setShowAddressForm] = useState(false);
const [editingAddress, setEditingAddress] = useState(null);

const emptyAddress = {
  ho_ten: '',
  sdt: '',
  tinh_thanh: '',
  quan_huyen: '',
  phuong_xa: '',
  dia_chi: '',
  ghi_chu: '',
  mac_dinh: false
};

const [addressForm, setAddressForm] = useState(emptyAddress);


const fetchAddresses = async () => {
  setLoadingAddress(true);
  try {
    const res = await axios.get(
      'http://localhost:5000/address/addresses',
      { withCredentials: true }
    );
    if (res.data.ok) {
      setAddresses(res.data.data.addresses);
    }
  } catch (e) {
    toast.error("Không tải được danh sách địa chỉ");
  } finally {
    setLoadingAddress(false);
  }
};

  useEffect(() => {
  if (activeTab === 'addresses') {
    fetchAddresses();
  }
}, [activeTab]);


const handleAddressChange = (e) => {
  const { name, value, type, checked } = e.target;
  setAddressForm(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value
  }));
};


const submitAddress = async () => {
  try {
    if (editingAddress) {
      await axios.put(
        `http://localhost:5000/address/addresses/${editingAddress.id}`,
        addressForm,
        { withCredentials: true }
      );
      toast.success("Đã cập nhật địa chỉ");
    } else {
      await axios.post(
        `http://localhost:5000/address/addresses`,
        addressForm,
        { withCredentials: true }
      );
      toast.success("Đã thêm địa chỉ");
    }
    setShowAddressForm(false);
    fetchAddresses();
  } catch {
    toast.error("Lỗi khi lưu địa chỉ");
  }
};


const handleEditAddress = (addr) => {
  setEditingAddress(addr);
  setAddressForm({
    ho_ten: addr.ho_ten,
    sdt: addr.sdt,
    tinh_thanh: addr.tinh_thanh,
    quan_huyen: addr.quan_huyen,
    phuong_xa: addr.phuong_xa,
    dia_chi: addr.dia_chi,
    ghi_chu: addr.ghi_chu || '',
    mac_dinh: !!addr.mac_dinh
  });
  setShowAddressForm(true);
};


const setDefaultAddress = async (id) => {
  await axios.patch(
    `http://localhost:5000/address/addresses/${id}/default`,
    {},
    { withCredentials: true }
  );
  fetchAddresses();
};


const deleteAddress = async (id) => {
  if (!window.confirm("Xoá địa chỉ này?")) return;
  await axios.delete(
    `http://localhost:5000/address/addresses/${id}`,
    { withCredentials: true }
  );
  fetchAddresses();
};




  // --- 1. LOAD DATA KHI VÀO TRANG ---
  useEffect(() => {
    if (me) {
      // Set dữ liệu Profile
      setFormData({
        ho_ten: me.ho_ten || '',
        sdt: me.sdt || me.sdt || '',
        email: me.email || '',
        ngay_sinh: me.ngay_sinh ? new Date(me.ngay_sinh).toISOString().split('T')[0] : '',
        gioi_tinh: me.gioi_tinh || 'khac'
      });

      // Gọi API lấy đơn hàng
      fetchMyOrders();
    }
  }, [me]);

  // Hàm gọi API lấy đơn hàng thật
  const fetchMyOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken"); 

      if (!token) {
        setIsLoadingOrders(false);
        return;
      }

      // Gọi API lấy danh sách đơn hàng
      const res = await axios.get('http://localhost:5000/api/orders/my-orders', { 
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true 
      });
      
      if (res.data.ok) {
        setOrders(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
      // Nếu lỗi 500 do sai tên cột ở backend, nó sẽ log ra đây
    } finally {
      setIsLoadingOrders(false);
    }
  };

  // --- 2. HÀM HỦY ĐƠN HÀNG ---
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này? Dữ liệu đơn hàng sẽ bị xóa vĩnh viễn.")) {
        return;
    }

    try {
        const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
        // Gọi API DELETE (Cần đảm bảo Backend đã có route delete này)
        const res = await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.ok) {
            toast.success("Đã hủy đơn hàng thành công!");
            // Load lại danh sách đơn hàng ngay lập tức
            fetchMyOrders(); 
        } else {
            toast.error(res.data.message || "Không thể hủy đơn hàng");
        }
    } catch (error) {
        console.error("Lỗi khi hủy đơn:", error);
        toast.error("Lỗi kết nối server (Kiểm tra lại Backend đã có hàm deleteOrder chưa)");
    }
  };

  // --- 3. CÁC HÀM XỬ LÝ KHÁC ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoadingProfile(true);
    try {
      const res = await axios.put('http://localhost:5000/users/me', formData, { withCredentials: true });
      if (res.data.ok) toast.success("Cập nhật hồ sơ thành công!");
      else toast.error(res.data.message);
    } catch (error) {
      toast.error("Lỗi server khi cập nhật hồ sơ");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoutClick = async () => {
    try { await logout(); navigate("/auth-page", { replace: true }); } catch (err) {}
  };

  // --- 4. FORMATTERS & HELPERS ---
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  /// Cập nhật trạng thái hiển thị
  const getStatusBadge = (status) => {
    // Nếu không có status hoặc status là null -> gán giá trị mặc định
    if (!status) return <span className="order-status" style={{background: '#eee', color: '#666'}}>⚠️ Chưa có trạng thái</span>;

    const s = String(status).toLowerCase();
    switch (s) {
      case 'hoan_thanh':
      case 'completed':
        return <span className="order-status status-success">✅ Hoàn thành</span>;
      case 'dang_giao':
      case 'shipping':
        return <span className="order-status status-shipping"><Truck size={14}/> Đang vận chuyển</span>;
      case 'dang_xu_ly':
        return <span className="order-status" style={{background: '#e6f7ff', color: '#1890ff', border: '1px solid #91d5ff'}}>⚙️ Đang xử lý</span>;
      case 'cho_xac_nhan':
        return <span className="order-status" style={{background: '#fff7e6', color: '#d48806'}}>⏳ Chờ xác nhận</span>;
      case 'da_huy':
      case 'cancelled':
        return <span className="order-status status-cancel">❌ Đã hủy</span>;
      default:
        return <span className="order-status">{status}</span>;
    }
  };
  

  // Danh sách Menu
  const menuItems = [
    { id: 'profile', label: 'Hồ sơ của tôi', icon: <User size={18} /> },
    { id: 'orders', label: 'Danh sách đơn hàng', icon: <FileText size={18} /> },
    { id: 'addresses', label: 'Quản lý địa chỉ', icon: <MapPin size={18} /> },
    { id: 'settings', label: 'Cài đặt', icon: <Settings size={18} /> },
  ];
  // Danh sách Menu
  

  if (!me) return <div className="loading-screen">Đang tải thông tin...</div>;
const avatarSrc = "/img/avatar.webp";

  return (
    <div className="account-page">
      <div className="breadcrumb-section">
        <div className="container">
          <h1 className="page-title">Tài khoản</h1>
          <div className="breadcrumb-path"><span>🏠 Trang chủ</span> &gt; <span>Tài khoản</span></div>
        </div>
      </div>

      <div className="container">
        <div className="account-layout">
          {/* SIDEBAR */}
          <aside className="sidebar">
            <div className="profile-summary">
              <div className="avatar-container">
                <img src={avatarSrc} alt="Avatar" className="avatar-image" referrerPolicy="no-referrer" />
                <button className="camera-btn"><Camera size={12}/></button>
              </div>
              <h3 className="user-fullname">{me.ho_ten}</h3>
              <p className="user-email">{me.email}</p>
            </div>
            <nav className="menu-list">
              {menuItems.map(item => (
                <button key={item.id} className={`menu-item ${activeTab === item.id ? 'active' : ''}`} onClick={() => setActiveTab(item.id)}>
                  <div className="menu-label">{item.icon} <span>{item.label}</span></div>
                </button>
              ))}
              <button className="menu-item logout-btn" onClick={handleLogoutClick}>
                <div className="menu-label"><LogOut size={18}/> <span>Đăng xuất</span></div>
              </button>
            </nav>
          </aside>

          {/* MAIN CONTENT */}
          <main className="main-content">
            {/* --- TAB HỒ SƠ --- */}
            {activeTab === 'profile' && (
              <div className="profile-content fade-in">
                <h2 className="section-title">Hồ sơ của tôi</h2>
                <form className="profile-form" onSubmit={handleUpdateProfile}>
                   <div className="form-grid">
                      <div className="form-group"><label>Họ tên</label><input className="form-input" name="ho_ten" value={formData.ho_ten} onChange={handleInputChange}/></div>
                      <div className="form-group"><label>Số điện thoại</label><input className="form-input" name="sdt" value={formData.sdt} onChange={handleInputChange}/></div>
                      <div className="form-group"><label>Email</label><input className="form-input disabled" value={formData.email} disabled/></div>
                      <div className="form-group"><label>Ngày sinh</label><input type="date" className="form-input" name="ngay_sinh" value={formData.ngay_sinh} onChange={handleInputChange}/></div>
                      {/* <div className="form-group">
                        <label>Giới tính</label>
                        <select className="form-input" name="gioi_tinh" value={formData.gioi_tinh} onChange={handleInputChange}>
                          <option value="nam">Nam</option>
                          <option value="nu">Nữ</option>
                          <option value="khac">Khác</option>
                        </select>
                      </div> */}
                      <div className="form-group">
                        <label>Giới tính</label>
                        <div className="gender-group">
                          <label className={`gender-item ${formData.gioi_tinh === 'nam' ? 'active' : ''}`}>
                            <input
                              type="radio"
                              name="gioi_tinh"
                              value="nam"
                              checked={formData.gioi_tinh === 'nam'}
                              onChange={handleInputChange}
                            />
                            <span> Nam</span>
                          </label>

                          <label className={`gender-item ${formData.gioi_tinh === 'nu' ? 'active' : ''}`}>
                            <input
                              type="radio"
                              name="gioi_tinh"
                              value="nu"
                              checked={formData.gioi_tinh === 'nu'}
                              onChange={handleInputChange}
                            />
                            <span> Nữ</span>
                          </label>

                          <label className={`gender-item ${formData.gioi_tinh === 'khac' ? 'active' : ''}`}>
                            <input
                              type="radio"
                              name="gioi_tinh"
                              value="khac"
                              checked={formData.gioi_tinh === 'khac'}
                              onChange={handleInputChange}
                            />
                            <span>Khác</span>
                          </label>
                        </div>
                      </div>

                   </div>
                   <button type="submit" className="save-btn" disabled={isLoadingProfile}><Save size={18}/> Lưu thay đổi</button>
                </form>
              </div>
            )}

            {/* --- TAB DANH SÁCH ĐƠN HÀNG --- */}
            {activeTab === 'orders' && (
              <div className="orders-content fade-in">
                <h2 className="section-title">Lịch sử đơn hàng</h2>
                
                <div className="order-search-bar">
                    <Search size={18} style={{color: '#888', marginRight: '10px'}}/>
                    <input type="text" placeholder="Tìm kiếm đơn hàng..." />
                </div>

                {isLoadingOrders ? (
                  <div style={{textAlign: 'center', padding: '20px'}}>Đang tải danh sách đơn hàng...</div>
                ) : orders.length === 0 ? (
                  <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                    <p>Bạn chưa có đơn hàng nào.</p>
                  </div>
                ) : (
                  <div className="order-list">
                    {orders.map((order) => (
                      <div key={order.id} className="order-card">
                        {/* Header: Mã đơn + Trạng thái */}
                        <div className="order-header">
                          <div className="order-id-date">
                            <span className="order-id">Mã: {order.order_code}</span>
                            <span className="order-date"> | {formatDate(order.date)}</span>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>

                        {/* Items */}
                        <div className="order-items">
                          {order.items.map((item, index) => (
                            <div key={index} className="order-item">
                              <div className="item-image">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  onError={(e) => {e.target.src = "https://via.placeholder.com/80?text=No+Img"}}
                                />
                              </div>
                              <div className="item-info">
                                <h4 className="item-name">{item.name}</h4>
                                <p className="item-variant">Phân loại: {item.variant}</p>
                                <div className="item-price-qty">
                                  <span className="item-qty">x{item.quantity}</span>
                                  <span className="item-price">{formatCurrency(item.price)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Footer: Tổng tiền + Nút Hủy */}
                        <div className="order-footer" style={{display:'flex', justifyContent:'flex-end', alignItems:'center', marginTop:'15px', paddingTop:'15px', borderTop:'1px dashed #eee'}}>
                          <div className="order-total" style={{marginRight: 'auto'}}>
                            <span style={{color:'#666'}}>Thành tiền: </span>
                            <span className="total-amount" style={{fontSize:'18px', fontWeight:'bold', color:'#d0011b'}}>{formatCurrency(order.total)}</span>
                          </div>

                          {/* 👇 BUTTON HỦY ĐƠN HÀNG 👇 */}
                          {/* ĐÃ SỬA: Hiện nút hủy cho cả 'dang_xu_ly' VÀ 'cho_xac_nhan' để bạn test được với đơn cũ */}
                          {['dang_xu_ly', 'cho_xac_nhan'].includes(order.status) && (
                            <button 
                                onClick={() => handleCancelOrder(order.id)}
                                style={{
                                    backgroundColor: '#ff4d4f',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    transition: 'background 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.background = '#d9363e'}
                                onMouseOut={(e) => e.target.style.background = '#ff4d4f'}
                            >
                                <Trash2 size={16}/> Hủy đơn hàng
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
             {/* --- TAB DANH SÁCH ĐỊA CHỈ--- */}

            {activeTab === 'addresses' && (
              <div className="fade-in">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <h2 className="section-title">Địa chỉ của tôi</h2>
                  <button
                    className="save-btn"
                    onClick={() => {
                      setEditingAddress(null);
                      setAddressForm(emptyAddress);
                      setShowAddressForm(true);
                    }}
                  >
                    <Plus size={18}/> Thêm địa chỉ
                  </button>
                </div>

                {showAddressForm && (
                  <div className="address-modal">
                    <div className="address-modal-card">
                      <h3>
                        {editingAddress ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
                      </h3>

                      <div className="form-group">
                        <label>Họ tên *</label>
                        <input
                          className='form-input-address'
                          name="ho_ten"
                          value={addressForm.ho_ten}
                          onChange={handleAddressChange}
                        />
                      </div>

                      <div className="form-group">
                        <label>Số điện thoại *</label>
                        <input
                          className='form-input-address'
                          name="sdt"
                          value={addressForm.sdt}
                          onChange={handleAddressChange}
                        />
                      </div>

                      <div className="form-group">
                        <label>Tỉnh / Thành phố *</label>
                        <input
                          className='form-input-address'
                          name="tinh_thanh"
                          value={addressForm.tinh_thanh}
                          onChange={handleAddressChange}
                        />
                      </div>

                      <div className="form-group">
                        <label>Quận / Huyện *</label>
                        <input
                          className='form-input-address'
                          name="quan_huyen"
                          value={addressForm.quan_huyen}
                          onChange={handleAddressChange}
                        />
                      </div>

                      <div className="form-group">
                        <label>Phường / Xã *</label>
                        <input
                          className='form-input-address'
                          name="phuong_xa"
                          value={addressForm.phuong_xa}
                          onChange={handleAddressChange}
                        />
                      </div>

                      <div className="form-group">
                        <label>Địa chỉ cụ thể *</label>
                        <input
                          className='form-input-address'
                          name="dia_chi"
                          value={addressForm.dia_chi}
                          onChange={handleAddressChange}
                        />
                      </div>

                      <div className="form-group">
                        <label>Ghi chú</label>
                        <textarea
                          className='form-input-address'
                          name="ghi_chu"
                          value={addressForm.ghi_chu}
                          onChange={handleAddressChange}
                        />
                      </div>

                      <label className="checkbox-row">
                        <input
                          type="checkbox"
                          name="mac_dinh"
                          checked={addressForm.mac_dinh}
                          onChange={handleAddressChange}
                        />
                        Đặt làm địa chỉ mặc định
                      </label>

                      <div className="modal-actions">
                        <button className="save-btn" onClick={submitAddress}>
                          {editingAddress ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => setShowAddressForm(false)}
                        >
                          Huỷ
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {loadingAddress ? (
                  <p>Đang tải địa chỉ...</p>
                ) : addresses.length === 0 ? (
                  <p style={{color:'#666'}}>Bạn chưa có địa chỉ nào.</p>
                ) : (
                  <div className="address-list">
                    {addresses.map(addr => (
                      <div key={addr.id} className={`address-card ${addr.mac_dinh ? 'default' : ''}`}>
                        <div className="address-header">
                          <strong>{addr.ho_ten}</strong>
                          {addr.mac_dinh && <span className="badge">Mặc định</span>}
                        </div>

                        <p>{addr.sdt}</p>
                        <p>
                          {addr.dia_chi}, {addr.phuong_xa}, {addr.quan_huyen}, {addr.tinh_thanh}
                        </p>

                        <div className="address-actions">
                          {!addr.mac_dinh && (
                            <button onClick={() => setDefaultAddress(addr.id)}>
                              <CheckCircle size={14}/> Đặt mặc định
                            </button>
                          )}
                          <button onClick={() => handleEditAddress(addr)}>
                            <Edit2 size={14}/> Sửa
                          </button>
                          <button className="danger" onClick={() => deleteAddress(addr.id)}>
                            <Trash2 size={14}/> Xoá
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            
            {activeTab === 'settings' && <div>Chức năng đang cập nhật...</div>}
          </main>
        </div>
      </div>
    </div>
  );
};

export default TaiKhoan;