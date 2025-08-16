import React, { useMemo, useState } from "react";
import "./App.css";
import { motion } from "framer-motion"; 
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Search,
  PackageCheck,
  PackageX,
  AlertTriangle,
  Plus,
  Filter,
  Settings,
  Download,
  Upload,
  Warehouse,
  Box,
  ShoppingCart,
  Layers,
  FileBarChart2,
  LogOut,
  X,
} from "lucide-react";

// Basit Modal bileşeni
function Modal({ title, open, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__dialog" role="document">
        <div className="modal__header">
          <div className="modal__title">{title}</div>
          <button className="btn btn--ghost" aria-label="Kapat" onClick={onClose}>
            <X className="icon" />
          </button>
        </div>
        <div className="modal__body">{children}</div>
        <div className="modal__footer">{footer}</div>
      </div>
    </div>
  );
}




// Raporlar Görünümü
function ReportsView({ items, onBack }) {
  const [selectedReport, setSelectedReport] = useState("overview");
  const [dateFilter, setDateFilter] = useState("all");

  // Hesaplamalar
  const totalSku = items.length;
  const totalStock = items.reduce((s, i) => s + i.stock, 0);
  const lowStockItems = items.filter(i => i.stock > 0 && i.stock <= i.reorderPoint);
  const outOfStockItems = items.filter(i => i.stock === 0);
  const totalCostValue = items.reduce((s, i) => s + (i.stock * (i.cost || 0)), 0);
  const totalSaleValue = items.reduce((s, i) => s + (i.stock * (i.price || 0)), 0);
  const potentialProfit = totalSaleValue - totalCostValue;

  // Kategori bazlı veriler
  const categoryData = CATEGORIES.map(cat => {
    const categoryItems = items.filter(i => i.category === cat);
    const totalQty = categoryItems.reduce((s, i) => s + i.stock, 0);
    const totalValue = categoryItems.reduce((s, i) => s + (i.stock * (i.cost || i.price || 0)), 0);
    const lowStock = categoryItems.filter(i => i.stock <= i.reorderPoint).length;
    return {
      category: cat,
      quantity: totalQty,
      value: totalValue,
      lowStock: lowStock,
      items: categoryItems.length
    };
  });

  // Lokasyon bazlı veriler
  const locationData = ["Depo-1", "Depo-2", "Depo-3"].map(loc => {
    const locationItems = items.filter(i => i.location === loc);
    const totalQty = locationItems.reduce((s, i) => s + i.stock, 0);
    const totalValue = locationItems.reduce((s, i) => s + (i.stock * (i.cost || i.price || 0)), 0);
    return {
      location: loc,
      quantity: totalQty,
      value: totalValue,
      items: locationItems.length
    };
  });

  // En değerli ürünler
  const topValueItems = [...items]
    .map(item => ({
      ...item,
      totalValue: item.stock * (item.cost || item.price || 0)
    }))
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 5);

  const reportTabs = [
    { key: "overview", label: "Genel Özet", icon: FileBarChart2 },
    { key: "category", label: "Kategori Analizi", icon: Layers },
    { key: "financial", label: "Finansal Rapor", icon: ShoppingCart },
    { key: "location", label: "Lokasyon Raporu", icon: Warehouse },
    { key: "alerts", label: "Stok Uyarıları", icon: AlertTriangle }
  ];

  return (
    <div className="reports-view">
      <div className="reports-header">
        <button className="btn btn--primary inline-flex gap-2" onClick={onBack}>
          ← Dashboard'a Dön
        </button>
        <h2>Raporlar ve Analizler</h2>
        <select className="input select" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
          <option value="all">Tüm Zamanlar</option>
          <option value="month">Bu Ay</option>
          <option value="week">Bu Hafta</option>
        </select>
      </div>

      {/* Rapor Sekmeleri */}
      <Card className="mb-4">
        <div className="report-tabs">
          {reportTabs.map(tab => (
            <button
              key={tab.key}
              className={`report-tab ${selectedReport === tab.key ? 'report-tab--active' : ''}`}
              onClick={() => setSelectedReport(tab.key)}
            >
              <tab.icon className="icon" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Rapor İçerikleri */}
      {selectedReport === "overview" && (
        <div className="report-content">
          {/* Genel İstatistikler */}
          <section className="stats-grid mb-4">
            <Card><Stat icon={Box} label="Toplam SKU" value={totalSku} sub="Aktif ürün çeşidi" /></Card>
            <Card><Stat icon={ShoppingCart} label="Toplam Stok" value={totalStock.toLocaleString()} sub="adet" /></Card>
            <Card><Stat icon={AlertTriangle} label="Kritik Durum" value={lowStockItems.length + outOfStockItems.length} sub={`${lowStockItems.length} düşük, ${outOfStockItems.length} tükendi`} /></Card>
            <Card><Stat icon={FileBarChart2} label="Stok Değeri" value={`₺${totalCostValue.toLocaleString()}`} sub="Maliyet bazlı" /></Card>
          </section>

          {/* Grafikler */}
          <div className="grid-2 mb-4">
            <Card>
              <CardHeader title="Kategori Bazlı Stok Dağılımı" />
              <div className="chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantity" fill="#ff6a00" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <CardHeader title="En Değerli Ürünler" />
              <div className="card__body">
                <ul className="list">
                  {topValueItems.map(item => (
                    <li key={item.id} className="list__item">
                      <div>
                        <div className="list__title">{item.name}</div>
                        <div className="muted">{item.stock} adet • {item.category}</div>
                      </div>
                      <div className="price">₺{item.totalValue.toLocaleString()}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        </div>
      )}

      {selectedReport === "category" && (
        <div className="report-content">
          <Card>
            <CardHeader title="Kategori Detay Analizi" />
            <div className="category-table">
              <div className="table-header">
                <div>Kategori</div>
                <div>Ürün Sayısı</div>
                <div>Toplam Stok</div>
                <div>Toplam Değer</div>
                <div>Kritik Stok</div>
                <div>Ortalama Stok</div>
              </div>
              {categoryData.map(cat => (
                <div key={cat.category} className="table-row">
                  <div className="font-medium">{cat.category}</div>
                  <div>{cat.items}</div>
                  <div>{cat.quantity.toLocaleString()}</div>
                  <div>₺{cat.value.toLocaleString()}</div>
                  <div>
                    <span className={`chip ${cat.lowStock > 0 ? 'chip--danger' : 'chip--soft'}`}>
                      {cat.lowStock} ürün
                    </span>
                  </div>
                  <div>{cat.items > 0 ? Math.round(cat.quantity / cat.items) : 0}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {selectedReport === "financial" && (
        <div className="report-content">
          <section className="stats-grid mb-4">
            <Card><Stat icon={ShoppingCart} label="Toplam Maliyet" value={`₺${totalCostValue.toLocaleString()}`} sub="Stok maliyet değeri" /></Card>
            <Card><Stat icon={FileBarChart2} label="Satış Değeri" value={`₺${totalSaleValue.toLocaleString()}`} sub="Potansiyel satış değeri" /></Card>
            <Card><Stat icon={AlertTriangle} label="Potansiyel Kar" value={`₺${potentialProfit.toLocaleString()}`} sub={`%${((potentialProfit/totalCostValue)*100).toFixed(1)} marj`} /></Card>
            <Card><Stat icon={Box} label="Ortalama Marj" value={`%${((potentialProfit/totalCostValue)*100).toFixed(1)}`} sub="Kar oranı" /></Card>
          </section>

          <Card>
            <CardHeader title="Kategori Bazlı Karlılık Analizi" />
            <div className="chart">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₺${value.toLocaleString()}`} />
                  <Bar dataKey="value" fill="#ff6a00" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {selectedReport === "location" && (
        <div className="report-content">
          <div className="grid-2">
            <Card>
              <CardHeader title="Lokasyon Bazlı Dağılım" />
              <div className="card__body">
                <ul className="list">
                  {locationData.map(loc => (
                    <li key={loc.location} className="list__item">
                      <div>
                        <div className="list__title">{loc.location}</div>
                        <div className="muted">{loc.items} çeşit ürün</div>
                      </div>
                      <div>
                        <div className="price">{loc.quantity.toLocaleString()} adet</div>
                        <div className="muted">₺{loc.value.toLocaleString()}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            <Card>
              <CardHeader title="Depo Doluluk Oranları" />
              <div className="chart">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={locationData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="location" type="category" />
                    <Tooltip />
                    <Bar dataKey="quantity" fill="#ff6a00" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      )}

      {selectedReport === "alerts" && (
        <div className="report-content">
          <div className="grid-2">
            <Card>
              <CardHeader title="Kritik Stok Uyarıları" />
              <div className="card__body">
                {lowStockItems.length === 0 ? (
                  <div className="empty">Kritik stokta ürün bulunmuyor! 🎉</div>
                ) : (
                  <ul className="list">
                    {lowStockItems.map(item => (
                      <li key={item.id} className="list__item">
                        <div>
                          <div className="list__title">{item.name}</div>
                          <div className="muted">{item.id} • {item.location}</div>
                        </div>
                        <div className="text-right">
                          <div className="price">{item.stock}/{item.reorderPoint}</div>
                          <span className="chip chip--danger">Kritik</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Card>

            <Card>
              <CardHeader title="Stoksuz Ürünler" />
              <div className="card__body">
                {outOfStockItems.length === 0 ? (
                  <div className="empty">Stoksuz ürün bulunmuyor! ✅</div>
                ) : (
                  <ul className="list">
                    {outOfStockItems.map(item => (
                      <li key={item.id} className="list__item">
                        <div>
                          <div className="list__title">{item.name}</div>
                          <div className="muted">{item.id} • {item.location}</div>
                        </div>
                        <div className="text-right">
                          <span className="chip chip--danger">Tükendi</span>
                          {item.incoming > 0 && (
                            <div className="muted">Yolda: {item.incoming}</div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}








//YENI EKLENEN STOK GUNCELLE KISMI 

// Stok Güncelleme Görünümü
function StockUpdateView({ items, setItems, onBack }) {
  const [query, setQuery] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [newStock, setNewStock] = useState("");

  const filtered = items.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.id.toLowerCase().includes(query.toLowerCase())
  );

  const handleEdit = (item) => {
    setEditingItem(item.id);
    setNewStock(item.stock);
  };

  const handleSave = (itemId) => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, stock: Number(newStock) }
        : item
    ));
    setEditingItem(null);
    setNewStock("");
  };

  const handleCancel = () => {
    setEditingItem(null);
    setNewStock("");
  };

  return (
    <div className="stock-update-view">
      <div className="stock-header">
           <button className="btn btn--primary inline-flex gap-2" onClick={onBack}></button>
        <h2>Stok Güncelleme</h2>
      </div>

      <Card className="mb-4">
        <div className="card__body">
          <div className="search">
            <Search className="icon search__icon" />
            <input 
              className="input search__input" 
              placeholder="Ürün ara..." 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="stock-table">
          <div className="table-header">
            <div>Ürün</div>
            <div>SKU</div>
            <div>Kategori</div>
            <div>Mevcut Stok</div>
            <div>Yeni Stok</div>
            <div>İşlem</div>
          </div>
          {filtered.map(item => (
            <div key={item.id} className="table-row">
              <div>{item.name}</div>
              <div>{item.id}</div>
              <div>{item.category}</div>
              <div>{item.stock}</div>
              <div>
                {editingItem === item.id ? (
                  <input 
                    type="number" 
                    className="input table-input"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                  />
                ) : (
                  <span>{item.stock}</span>
                )}
              </div>
              <div>
                {editingItem === item.id ? (
                  <div className="inline-flex gap-2">
                    <Button variant="primary" onClick={() => handleSave(item.id)}>Kaydet</Button>
                    <Button onClick={handleCancel}>İptal</Button>
                  </div>
                ) : (
                  <Button onClick={() => handleEdit(item)}>Düzenle</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}


















// Basit UI bileşenleri (CSS ile stillenir)
function Button({ className = "", variant = "default", children, ...props }) {
  return (
    <button className={`btn ${variant ? `btn--${variant}` : ""} ${className}`} {...props}>
      {children}
    </button>
  );
}

function Card({ className = "", children }) {
  return <div className={`card ${className}`}>{children}</div>;
}

function CardHeader({ title, right }) {
  return (
    <div className="card__header">
      <div className="card__title">{title}</div>
      <div>{right}</div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub }) {
  return (
    <div className="stat">
      <div className="stat__icon"><Icon className="icon" /></div>
      <div className="stat__body">
        <div className="stat__label">{label}</div>
        <div className="stat__value">{value}</div>
        {sub && <div className="stat__sub">{sub}</div>}
      </div>
    </div>
  );
}

// --- MOCK DATA ---
const MOCK_ITEMS = [
  { id: "SKU-1001", name: "Kadın Sneaker",        category: "Ayakkabı",     stock: 42, reorderPoint: 20, location: "Depo-1", incoming: 50, price: 1299, cost: 850 },
  { id: "SKU-1002", name: "Omuz Çantası - Deri",  category: "Omuz Çantası", stock: 12, reorderPoint: 25, location: "Depo-2", incoming: 0,  price: 899,  cost: 520 },
  { id: "SKU-1003", name: "Okul Çantası 30L",     category: "Okul Çantası", stock: 0,  reorderPoint: 15, location: "Depo-1", incoming: 80, price: 749,  cost: 430 },
  { id: "SKU-1004", name: "Erkek Eşofman Altı",   category: "Eşofman",      stock: 18, reorderPoint: 12, location: "Depo-3", incoming: 0,  price: 499,  cost: 260 },
  { id: "SKU-1005", name: "Çorap 3'lü Paket",     category: "Aksesuar",     stock: 75, reorderPoint: 30, location: "Depo-2", incoming: 0,  price: 129,  cost: 60  },
];


const CATEGORIES = ["Ayakkabı", "Omuz Çantası", "Okul Çantası", "Eşofman", "Aksesuar"];


export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Hepsi");
  const [onlyLow, setOnlyLow] = useState(false);
  const [items, setItems] = useState(MOCK_ITEMS);
  const [sidebarOpen, setSidebarOpen] = useState(true); // YENİ
  const [reportsView, setReportsView] = useState(false); // YENİ

  // Toggle function - YENİ
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Sidebar menüsü
  const NAV_ITEMS = [
    { icon: FileBarChart2, label: "Dashboard",     key: "dashboard" },
    { icon: Layers,       label: "Ürünler",       key: "products"  },
    { icon: Plus,         label: "Ürün Ekle",     key: "create"    },
    { icon: PackageCheck, label: "Stok Güncelle", key: "stock"     },
    { icon: FileBarChart2,label: "Raporlar",      key: "reports"   },
    { icon: Settings,     label: "Ayarlar",       key: "settings"  },
  ];
  const [active, setActive] = useState("dashboard");

  // Ürün Ekle modalı & formu
const [addOpen, setAddOpen] = useState(false);
const [stockView, setStockView] = useState(false); // YENİ
const [editingItems, setEditingItems] = useState({}); // YENİ
const [stockHistory, setStockHistory] = useState([]); // YENİ
  const [form, setForm] = useState({
    name: "",
    category: "Aksesuar",
    location: "Depo-1",
    unit: "adet",
    stock: 0,
    reorderPoint: 10,
    price: 0,
    cost: 0,
    barcode: ""
  });
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Ürün adı gerekli";
    if (!form.category) e.category = "Kategori gerekli";
    if (!form.location) e.location = "Lokasyon gerekli";
    if (form.stock < 0) e.stock = "Stok negatif olamaz";
    if (form.reorderPoint < 0) e.reorderPoint = "ROP negatif olamaz";
    if (form.price < 0) e.price = "Fiyat negatif olamaz";
    if (form.cost < 0) e.cost = "Maliyet negatif olamaz";
    return e;
  }

  function handleAddSubmit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    // Benzersiz SKU türet
    const base = form.name.replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(0, 6) || "SKU";
    let idx = 1; 
    let sku = `${base}-${String(items.length + idx).padStart(4, "0")}`;
    while (items.some(i => i.id === sku)) { 
      idx++; 
      sku = `${base}-${String(items.length + idx).padStart(4, "0")}`; 
    }

    const newItem = {
      id: sku,
      name: form.name.trim(),
      category: form.category,
      location: form.location,
      unit: form.unit,
      stock: Number(form.stock) || 0,
      reorderPoint: Number(form.reorderPoint) || 0,
      price: Number(form.price) || 0,
      cost: Number(form.cost) || 0,
      incoming: 0,
      barcode: form.barcode,
      createdAt: new Date().toISOString(),
    };

    setItems(prev => [newItem, ...prev]);
    setAddOpen(false);
    setForm({ name: "", category: "Aksesuar", location: "Depo-1", unit: "adet", stock: 0, reorderPoint: 10, price: 0, cost: 0, barcode: "" });
  }

  // Çıkış işlemi
  function handleExit() {
    try { localStorage.clear(); sessionStorage.clear(); } catch(e) {}
    if (window?.electron?.quitApp) { window.electron.quitApp(); return; }
    if (window?.electronAPI?.quit) { window.electronAPI.quit(); return; }
    window.open('', '_self');
    window.close();
    window.location.replace('about:blank');
  }

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const matchQuery = [it.id, it.name, it.category, it.location].some((f) =>
        f.toLowerCase().includes(query.toLowerCase())
      );
      const matchCat = category === "Hepsi" || it.category === category;
      const matchLow = !onlyLow || it.stock <= it.reorderPoint;
      return matchQuery && matchCat && matchLow;
    });
  }, [items, query, category, onlyLow]);

  const totalSku = items.length;
  const totalStock = items.reduce((s, i) => s + i.stock, 0);
  const lowStock = items.filter((i) => i.stock > 0 && i.stock <= i.reorderPoint).length;
  const outStock = items.filter((i) => i.stock === 0).length;
  const totalValue = items.reduce((s, i) => s + i.stock * (i.cost ?? i.price ?? 0), 0);

  const chartData = useMemo(() => {
    return CATEGORIES.map((c) => {
      const inCat = items.filter((i) => i.category === c);
      const total = inCat.reduce((s, i) => s + i.stock, 0);
      const need = inCat.reduce((s, i) => s + Math.max(0, i.reorderPoint - i.stock), 0);
      return { category: c, Stok: total, "Eksik (İhtiyaç)": need };
    });
  }, [items]);

  function exportCSV() {
    const header = ["id", "name", "category", "stock", "reorderPoint", "location", "incoming", "price", "cost"].join(",");
    const rows = items
      .map((i) => [i.id, i.name, i.category, i.stock, i.reorderPoint, i.location, i.incoming, i.price ?? "", i.cost ?? ""].join(","))
      .join("\n");
    const csv = header + "\n" + rows;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stoklar.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app">
      {/* SIDEBAR */}
      {/* SIDEBAR */}
<aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : 'sidebar--closed'}`}>
  <div className="brand">
    <div className="brand__icon"><Warehouse className="icon" /></div>
    {sidebarOpen && <div className="brand__title">Stok Takip</div>}
  </div>
  <nav className="nav">
   {NAV_ITEMS.map((m) => (
  <button
    key={m.key}
    className={`nav-item ${active === m.key ? "nav-item--active" : ""}`}
    onClick={() => {
      if (m.key === "create") { setAddOpen(true); return; }
      if (m.key === "stock") { setStockView(true); setActive("stock"); return; }
      if (m.key === "reports") { setReportsView(true); setActive("reports"); return; }
      setStockView(false); setReportsView(false);
      setActive(m.key);
    }}
        title={!sidebarOpen ? m.label : ""}
      >
        <m.icon className="icon" />
        {sidebarOpen && <span>{m.label}</span>}
      </button>
    ))}
  </nav>
  <div className="sidebar__footer">
    <button className="toggle-btn" onClick={toggleSidebar}>
      {sidebarOpen ? "←" : "→"}
    </button>
    {sidebarOpen && <div>v1.0.0</div>}
  </div>
</aside>

      {/* TOP NAVBAR */}
<header className={`navbar ${sidebarOpen ? 'navbar--sidebar-open' : 'navbar--sidebar-closed'}`}>
  <div className="navbar__title">Stok Takip Sistemi</div>
  <div className="navbar__right">
    <div className="badge">Admin</div>
    <Button variant="primary" className="inline-flex gap-2" onClick={handleExit}>
      <LogOut className="icon" /> Çıkış
    </Button>
  </div>
</header>

  <main className={`main ${sidebarOpen ? 'main--sidebar-open' : 'main--sidebar-closed'}`}>
  <div className="container">
    {reportsView ? (
      <ReportsView 
        items={items} 
        onBack={() => { setReportsView(false); setActive("dashboard"); }}
      />
    ) : stockView ? (
      <StockUpdateView 
        items={items} 
        setItems={setItems} 
        onBack={() => { setStockView(false); setActive("dashboard"); }}
      />
    ) : (
      <>
        {/* FİLTRE BAR */}
        <Card>
            <div className="filter-bar">
              <div className="search">
                <Search className="icon search__icon" />
                <input className="input search__input" placeholder="SKU, ürün adı, kategori, lokasyon ara..." value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              <div className="filter-actions">
                <select className="input select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option>Hepsi</option>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <label className="checkbox">
                  <input type="checkbox" checked={onlyLow} onChange={(e) => setOnlyLow(e.target.checked)} />
                  <span>Sadece kritik stok</span>
                </label>
                <Button className="inline-flex gap-2"><Filter className="icon" /> Gelişmiş Filtreler</Button>
                <Button className="inline-flex gap-2" onClick={exportCSV}><Download className="icon" /> Dışa Aktar</Button>
              </div>
            </div>
          </Card>

          {/* İSTATİSTİK KARTLARI */}
          <section className="stats-grid">
            <Card><Stat icon={Box} label="Toplam Ürün" value={totalSku} sub="↑ %12" /></Card>
            <Card><Stat icon={ShoppingCart} label="Toplam Stok" value={totalStock} sub="↑ %8" /></Card>
            <Card><Stat icon={AlertTriangle} label="Düşük Stok" value={lowStock + outStock} sub={`kritik: ${lowStock}, stoksuz: ${outStock}`} /></Card>
            <Card><Stat icon={FileBarChart2} label="Toplam Değer" value={`₺${totalValue.toLocaleString("tr-TR")}`} sub="Maliyet esaslı" /></Card>
          </section>

          {/* UYARILAR & SON EKLENENLER & GRAFİK */}
          <section className="grid-3">
            <Card>
              <CardHeader title="Düşük Stok Uyarıları" />
              <div className="card__body">
                {items.filter((i) => i.stock <= i.reorderPoint).length === 0 ? (
                  <div className="empty">Tüm ürünlerde yeterli stok bulunuyor!</div>
                ) : (
                  <ul className="list">
                    {items
                      .filter((i) => i.stock <= i.reorderPoint)
                      .map((i) => (
                        <li key={i.id} className="list__item">
                          <div>
                            <div className="list__title">{i.name}</div>
                            <div className="muted">{i.id} • ROP: {i.reorderPoint} • Stok: {i.stock}</div>
                          </div>
                          {i.incoming > 0 ? (
                            <span className="chip chip--soft">Yolda: {i.incoming}</span>
                          ) : (
                            <span className="chip chip--danger">Sipariş gerekli</span>
                          )}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </Card>
              





                {/* DEGISTIRILDI  ------------------------*/}

                   <Card className="recent-products">
 <CardHeader title="Son Eklenen Ürünler" />
 <div className="card__body">
   <ul className="list list--plain">
     {items.map((i) => (
       <li key={i.id} className="list__item list__item--plain">
         <div>
           <div className="list__title">{i.name}</div>
           <div className="muted">{new Date(i.createdAt || Date.now()).toLocaleDateString("tr-TR")}</div>
         </div>
         <div className="price">₺{i.price}</div>
       </li>
     ))}
   </ul>
   <div className="link">Tüm ürünleri görüntüle →</div>
 </div>
</Card>

            <Card>
              <CardHeader title="Kategori Bazlı Stok & İhtiyaç" />
              <div className="chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <ReferenceLine y={0} />
                    <Bar dataKey="Stok" fill="#ff6a00" />
                    <Bar dataKey="Eksik (İhtiyaç)" fill="#94a3b8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </section>

          {/* HIZLI İŞLEMLER */}
<section className="quick-actions">
  {[{title: "Yeni Ürün Ekle", desc: "Stok sistemine yeni ürün ekleyin", icon: Plus}, {title: "Stok Güncelle", desc: "Mevcut stok miktarlarını güncelleyin", icon: PackageCheck}, {title: "Raporları Görüntüle", desc: "Detaylı stok raporlarını inceleyin", icon: FileBarChart2}].map(({title, desc, icon: I}, idx) => (
    <Card key={title}>
      <button className={`quick ${idx===0 ? "quick--accent" : ""}`} onClick={() => {
        if(idx===0) setAddOpen(true);
        if(idx===1) { setStockView(true); setActive("stock"); }
        if(idx===2) { setReportsView(true); setActive("reports"); }
      }}>
                  <div className="quick__icon"><I className="icon" /></div>
                  <div>
                    <div className="quick__title">{title}</div>
                    <div className="muted">{desc}</div>
                  </div>
                </button>
              </Card>
             ))}
          </section>
        </>
      )}
   </div>  
           
       




        <Modal
          title="Yeni Ürün Ekle"
          open={addOpen}
          onClose={() => setAddOpen(false)}
          footer={
            <div className="modal__actions">
              <Button onClick={() => setAddOpen(false)}>Vazgeç</Button>
              <Button variant="primary" onClick={handleAddSubmit}>Kaydet</Button>
            </div>
          }
        >
          <div className="form-grid">
            <label className="form-row">
              <span>Ürün Adı</span>
              <input className={`input ${errors.name ? "input--error" : ""}`} value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              {errors.name && <div className="error">{errors.name}</div>}
            </label>

            <label className="form-row">
              <span>Kategori</span>
              <select className="input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </label>

            <label className="form-row">
              <span>Lokasyon</span>
              <select className="input" value={form.location} onChange={e => setForm({...form, location: e.target.value})}>
                <option>Depo-1</option>
                <option>Depo-2</option>
                <option>Depo-3</option>
              </select>
            </label>

            <label className="form-row">
              <span>Birim</span>
              <select className="input" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
                <option>adet</option>
                <option>kutu</option>
                <option>paket</option>
              </select>
            </label>

            <label className="form-row">
              <span>Başlangıç Stok</span>
              <input type="number" className={`input ${errors.stock ? "input--error" : ""}`} value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
              {errors.stock && <div className="error">{errors.stock}</div>}
            </label>

            <label className="form-row">
              <span>ROP</span>
              <input type="number" className={`input ${errors.reorderPoint ? "input--error" : ""}`} value={form.reorderPoint} onChange={e => setForm({...form, reorderPoint: e.target.value})} />
              {errors.reorderPoint && <div className="error">{errors.reorderPoint}</div>}
            </label>

            <label className="form-row">
              <span>Satış Fiyatı (₺)</span>
              <input type="number" className={`input ${errors.price ? "input--error" : ""}`} value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
              {errors.price && <div className="error">{errors.price}</div>}
            </label>

            <label className="form-row">
              <span>Maliyet (₺)</span>
              <input type="number" className={`input ${errors.cost ? "input--error" : ""}`} value={form.cost} onChange={e => setForm({...form, cost: e.target.value})} />
              {errors.cost && <div className="error">{errors.cost}</div>}
            </label>

            <label className="form-row form-row--full">
              <span>Barkod / SKU Notu</span>
              <input className="input" value={form.barcode} onChange={e => setForm({...form, barcode: e.target.value})} placeholder="Barkod veya kısa not" />
            </label>
          </div>
        </Modal>
      </main>
    </div>
  );
}
