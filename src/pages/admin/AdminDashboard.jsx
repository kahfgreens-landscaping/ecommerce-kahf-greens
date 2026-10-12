/**
 * pages/admin/AdminDashboard.jsx
 * Main admin control panel with stats, product table, quick edits
 */
import { useState, useMemo } from 'react';
import { 
  Package, TrendingUp, AlertTriangle, XCircle, 
  LogOut, Edit2, Trash2, Eye, EyeOff, Search,
  Upload, Download, Plus, Check, X, DollarSign,
  Image as ImageIcon
} from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { formatPrice, getColorHex, cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { products, categories, logout, updateVariant, updateProduct, toggleSoldOut, bulkUpdatePrice, deleteProduct, getStats } = useAdminStore();
  const [activeTab, setActiveTab] = useState('products');
  const [searchQ, setSearchQ]     = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues]= useState({});
  const [expandedProduct, setExpandedProduct] = useState(null);

  const stats = getStats();

  const filtered = useMemo(() => {
    if (!searchQ.trim()) return products;
    const q = searchQ.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }, [products, searchQ]);

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditValues({ name: product.name, minPrice: product.minPrice, maxPrice: product.maxPrice });
  };

  const saveEdit = (productId) => {
    updateProduct(productId, editValues);
    // Also bulk-update all variant prices if single price entered
    if (editValues.minPrice && editValues.minPrice === editValues.maxPrice) {
      bulkUpdatePrice(productId, Number(editValues.minPrice));
    }
    setEditingId(null);
  };

  const TABS = [
    { id: 'products', label: 'Products', count: products.length },
    { id: 'categories', label: 'Categories', count: categories.length },
    { id: 'lowstock', label: 'Low Stock', count: stats.lowStockCount },
    { id: 'soldout', label: 'Sold Out', count: stats.soldOutCount },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-brand-dark text-white px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-gold rounded-lg flex items-center justify-center">
            <span className="font-bold text-xs text-white">KG</span>
          </div>
          <div>
            <h1 className="font-bold text-sm">Kahf Greens Admin</h1>
            <p className="text-white/60 text-xs">Control Panel</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" target="_blank" className="text-xs text-white/70 hover:text-white flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> View Store
          </Link>
          <button onClick={logout} className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Products',    value: stats.totalProducts,  icon: Package,       color: 'text-blue-600 bg-blue-50' },
            { label: 'Variants',    value: stats.totalVariants,  icon: TrendingUp,    color: 'text-green-600 bg-green-50' },
            { label: 'Total Stock', value: stats.totalStock,     icon: Package,       color: 'text-purple-600 bg-purple-50' },
            { label: 'Sold Out',    value: stats.soldOutCount,   icon: XCircle,       color: 'text-red-600 bg-red-50' },
            { label: 'Low Stock',   value: stats.lowStockCount,  icon: AlertTriangle, color: 'text-amber-600 bg-amber-50' },
            { label: 'Avg Price',   value: `AED ${stats.avgPrice}`, icon: DollarSign, color: 'text-brand-dark bg-brand-light-bg' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="admin-card flex flex-col items-start gap-3">
              <div className={`p-2 rounded-lg ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto hide-scrollbar border-b border-border pb-3">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                activeTab === tab.id
                  ? 'bg-brand-dark text-white'
                  : 'text-muted-foreground hover:bg-muted'
              )}
            >
              {tab.label}
              <span className={cn('px-1.5 py-0.5 rounded-full text-xs', activeTab === tab.id ? 'bg-white/20' : 'bg-muted')}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  className="admin-input pl-9"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-brand-dark text-white rounded-lg text-sm hover:bg-brand-mid transition-colors">
                <Plus className="w-4 h-4" /> Add Product
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors">
                <Upload className="w-4 h-4" /> Import CSV
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>

            {/* Product Table */}
            <div className="admin-card p-0 overflow-hidden overflow-x-auto">
              <table className="admin-table w-full">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Colors</th>
                    <th>Sizes</th>
                    <th>Price (AED)</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(product => (
                    <>
                      <tr key={product.id} className="cursor-pointer" onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}>
                        <td>
                          <div className="flex items-center gap-2">
                            <span className={cn('w-2 h-2 rounded-full shrink-0', product.inStock ? 'bg-green-500' : 'bg-red-500')} />
                            {editingId === product.id ? (
                              <input
                                value={editValues.name}
                                onChange={e => setEditValues(v => ({ ...v, name: e.target.value }))}
                                className="admin-input py-1 text-xs w-48"
                                onClick={e => e.stopPropagation()}
                              />
                            ) : (
                              <span className="font-medium text-sm line-clamp-1">{product.name}</span>
                            )}
                          </div>
                        </td>
                        <td className="text-muted-foreground text-xs">{product.category}</td>
                        <td>
                          <div className="flex gap-1 flex-wrap">
                            {product.colors.slice(0, 5).map(c => (
                              <span key={c} title={c} className="w-4 h-4 rounded-full border border-white ring-1 ring-border" style={{ backgroundColor: getColorHex(c) }} />
                            ))}
                            {product.colors.length > 5 && <span className="text-xs text-muted-foreground">+{product.colors.length - 5}</span>}
                          </div>
                        </td>
                        <td className="text-xs text-muted-foreground">{product.sizes.length} sizes</td>
                        <td>
                          {editingId === product.id ? (
                            <input
                              type="number"
                              value={editValues.minPrice || ''}
                              onChange={e => setEditValues(v => ({ ...v, minPrice: e.target.value, maxPrice: e.target.value }))}
                              className="admin-input py-1 text-xs w-24"
                              placeholder="AED"
                              onClick={e => e.stopPropagation()}
                            />
                          ) : (
                            <span className="font-semibold text-sm">
                              {product.minPrice === product.maxPrice
                                ? `AED ${product.minPrice}`
                                : `AED ${product.minPrice}–${product.maxPrice}`}
                            </span>
                          )}
                        </td>
                        <td>
                          <span className={cn('font-semibold text-sm', product.totalQuantity <= 5 ? 'text-red-600' : product.totalQuantity <= 20 ? 'text-amber-600' : 'text-green-700')}>
                            {product.totalQuantity}
                          </span>
                        </td>
                        <td>
                          {product.inStock
                            ? <span className="badge-green">In Stock</span>
                            : <span className="badge-red">Sold Out</span>}
                        </td>
                        <td onClick={e => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            {editingId === product.id ? (
                              <>
                                <button onClick={() => saveEdit(product.id)} className="p-1.5 bg-green-50 text-green-700 rounded hover:bg-green-100" title="Save">
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => setEditingId(null)} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100" title="Cancel">
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => startEdit(product)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground" title="Edit">
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <Link to={`/products/${product.slug}`} target="_blank" className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground" title="View in store">
                                  <Eye className="w-3.5 h-3.5" />
                                </Link>
                                <button onClick={() => { if (confirm(`Delete "${product.name}"?`)) deleteProduct(product.id); }} className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600" title="Delete">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Variant Rows */}
                      {expandedProduct === product.id && (
                        <tr key={`${product.id}-variants`}>
                          <td colSpan={8} className="bg-muted/30 p-4">
                            <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">Variants — click row to edit</p>
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="text-muted-foreground">
                                  <th className="text-left pb-2">SKU</th>
                                  <th className="text-left pb-2">Color</th>
                                  <th className="text-left pb-2">Size</th>
                                  <th className="text-left pb-2">Price AED</th>
                                  <th className="text-left pb-2">Qty</th>
                                  <th className="text-left pb-2">Status</th>
                                  <th className="text-left pb-2">Toggle</th>
                                </tr>
                              </thead>
                              <tbody>
                                {product.variants.map(v => (
                                  <VariantRow
                                    key={v.sku}
                                    variant={v}
                                    productId={product.id}
                                    onUpdate={(sku, updates) => updateVariant(product.id, sku, updates)}
                                    onToggleSoldOut={() => toggleSoldOut(product.id, v.sku)}
                                  />
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="admin-card">
            <h2 className="font-semibold text-lg mb-4">Product Categories ({categories.length})</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.map(cat => {
                const count = products.filter(p => p.category === cat.name).length;
                return (
                  <div key={cat.slug} className="p-4 border border-border rounded-xl hover:border-brand-dark transition-colors">
                    <p className="font-semibold text-sm">{cat.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{count} products</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Low Stock Tab */}
        {activeTab === 'lowstock' && (
          <div className="admin-card">
            <h2 className="font-semibold text-lg mb-4 text-amber-700">⚠️ Low Stock Products (≤ 10 units)</h2>
            <table className="admin-table w-full">
              <thead><tr><th>Product</th><th>Category</th><th>Stock</th><th>Price</th></tr></thead>
              <tbody>
                {products.filter(p => p.totalQuantity > 0 && p.totalQuantity <= 10).map(p => (
                  <tr key={p.id}>
                    <td className="font-medium">{p.name}</td>
                    <td className="text-muted-foreground text-xs">{p.category}</td>
                    <td><span className="badge-gold">{p.totalQuantity} left</span></td>
                    <td>AED {p.minPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Sold Out Tab */}
        {activeTab === 'soldout' && (
          <div className="admin-card">
            <h2 className="font-semibold text-lg mb-4 text-red-700">🔴 Sold Out Variants</h2>
            <table className="admin-table w-full">
              <thead><tr><th>Product</th><th>SKU</th><th>Color</th><th>Size</th><th>Action</th></tr></thead>
              <tbody>
                {products.flatMap(p =>
                  p.variants.filter(v => v.soldOut).map(v => ({ product: p, variant: v }))
                ).map(({ product, variant }) => (
                  <tr key={variant.sku}>
                    <td className="font-medium">{product.name}</td>
                    <td className="font-mono text-xs text-muted-foreground">{variant.sku}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getColorHex(variant.color) }} />
                        {variant.color}
                      </div>
                    </td>
                    <td className="text-muted-foreground">{variant.size} {variant.sizeUnit}</td>
                    <td>
                      <button
                        onClick={() => toggleSoldOut(product.id, variant.sku)}
                        className="text-xs px-3 py-1 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors"
                      >
                        Mark Back In Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/** Inline-editable variant row */
function VariantRow({ variant: v, productId, onUpdate, onToggleSoldOut }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState({ price: v.price, quantity: v.quantity });

  const save = () => {
    onUpdate(v.sku, { price: Number(val.price), quantity: Number(val.quantity), inStock: Number(val.quantity) > 0, soldOut: Number(val.quantity) === 0 });
    setEditing(false);
  };

  return (
    <tr className="border-t border-border/50">
      <td className="font-mono py-1.5 pr-3 text-muted-foreground">{v.sku.slice(0, 20)}</td>
      <td className="py-1.5 pr-3">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getColorHex(v.color) }} />
          {v.color}
        </div>
      </td>
      <td className="py-1.5 pr-3">{v.sizeLabel || `${v.size} ${v.sizeUnit}`}</td>
      <td className="py-1.5 pr-3">
        {editing ? (
          <input type="number" value={val.price} onChange={e => setVal(p => ({ ...p, price: e.target.value }))} className="admin-input py-0.5 w-20 text-xs" />
        ) : (
          <span className="font-semibold">{v.price ? `${v.price}` : '–'}</span>
        )}
      </td>
      <td className="py-1.5 pr-3">
        {editing ? (
          <input type="number" value={val.quantity} onChange={e => setVal(p => ({ ...p, quantity: e.target.value }))} className="admin-input py-0.5 w-16 text-xs" />
        ) : (
          <span className={cn('font-semibold', v.quantity <= 5 ? 'text-red-600' : 'text-green-700')}>{v.quantity}</span>
        )}
      </td>
      <td className="py-1.5 pr-3">
        {v.soldOut ? <span className="badge-red">Sold Out</span> : <span className="badge-green">In Stock</span>}
      </td>
      <td className="py-1.5">
        <div className="flex items-center gap-1">
          {editing ? (
            <>
              <button onClick={save} className="p-1 bg-green-50 text-green-700 rounded hover:bg-green-100"><Check className="w-3 h-3" /></button>
              <button onClick={() => setEditing(false)} className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100"><X className="w-3 h-3" /></button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} className="p-1 rounded hover:bg-muted text-muted-foreground"><Edit2 className="w-3 h-3" /></button>
              <button onClick={onToggleSoldOut} className={cn('p-1 rounded text-xs', v.soldOut ? 'hover:bg-green-50 text-green-700' : 'hover:bg-red-50 text-red-600')}>
                {v.soldOut ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
