import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  CheckCircle2,
  Package,
  Crown,
  Zap,
  Search,
  ArrowRight,
  ShieldCheck,
  BookmarkCheck,
  RotateCcw,
} from "lucide-react";

export function InventoryPage({
  inventory,
  onSellWatch,
  onOpenReserve,
  onCompleteReservation,
  onCancelReservation,
  formatCOP,
  isEditMode,
}) {
  const [categoryFilter, setCategoryFilter] = useState("all"); // 'all' | 'rolex' | 'invicta'
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'available' | 'reserved' | 'sold'
  const [searchTerm, setSearchTerm] = useState("");

  const rolexItems = useMemo(() => inventory.filter((i) => i.category === "rolex"), [inventory]);
  const invictaItems = useMemo(() => inventory.filter((i) => i.category === "invicta"), [inventory]);
  const reservedItems = useMemo(() => inventory.filter((i) => i.status === "Apartado"), [inventory]);

  const totalStock = inventory.reduce((a, i) => a + (i.status === "Apartado" ? 0 : (i.stock || 0)), 0);
  const soldUnits = inventory.reduce((a, i) => a + (i.status === "Agotado" || i.stock === 0 ? (i.initialUnits || 1) : 0), 0);

  const filtered = useMemo(() => {
    return inventory.filter((item) => {
      const matchCat = categoryFilter === "all" || item.category === categoryFilter;
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "available" && item.stock > 0 && item.status !== "Apartado") ||
        (statusFilter === "reserved" && item.status === "Apartado") ||
        (statusFilter === "sold" && (item.stock === 0 || item.status === "Agotado"));
      const matchSearch =
        searchTerm === "" ||
        item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.reservation?.clientName && item.reservation.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.highlight && item.highlight.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchCat && matchStatus && matchSearch;
    });
  }, [inventory, categoryFilter, statusFilter, searchTerm]);

  return (
    <div className="page-layout inventory-page-v2">
      {/* Banner de Proyección del Inventario Restante */}
      <div className="society-banner dash-panel" style={{ border: "1px solid rgba(229,184,105,0.3)" }}>
        <div className="sb-metric">
          <span className="sbm-label">Inventario Restante Krono</span>
          <strong className="sbm-val gold-text">9 Relojes por Liquidar</strong>
        </div>
        <div className="sb-divv" />
        <div className="sb-metric">
          <span className="sbm-label">Ingresos Brutos por Entrar</span>
          <strong className="sbm-val mono-num text-emerald">{formatCOP(805000)}</strong>
          <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
            1 Invicta ($85k) + 4 Invictas ($320k) + 4 Rolex ($400k)
          </span>
        </div>
        <div className="sb-divv" />
        <div className="sb-metric">
          <span className="sbm-label">Descuento Inversión ($0 Deuda)</span>
          <strong className="sbm-val mono-num text-rose">-{formatCOP(40000)}</strong>
          <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
            $20k Invictas + $20k Rolex
          </span>
        </div>
        <div className="sb-divv" />
        <div className="sb-metric">
          <span className="sbm-label">Ganancia Neta Limpia (50/50)</span>
          <strong className="sbm-val mono-num gold-text">{formatCOP(765000)}</strong>
          <span style={{ fontSize: "0.72rem", color: "#34d399" }}>
            $382.500 Elian / $382.500 Juan
          </span>
        </div>
      </div>

      {/* Top Category Hero Cards */}
      <div className="cat-hero-grid">
        {/* ROLEX CARD */}
        <div
          className={`cat-hero-card cat-hero-rolex ${categoryFilter === "rolex" ? "active-hero" : ""}`}
          onClick={() => setCategoryFilter(categoryFilter === "rolex" ? "all" : "rolex")}
        >
          <div className="chc-bg-glow chc-glow-gold" />
          <div className="chc-content">
            <div className="chc-top">
              <span className="badge badge-gold">
                <Crown size={14} /> Alta Gama
              </span>
              <span className="chc-count mono-num">{rolexItems.length} Modelos</span>
            </div>
            <h2 className="chc-title gold-text">Colección ROLEX</h2>
            <p className="chc-desc">
              Lote disponible: Submariner Cerachrom, Daytona Panda, Datejust Jubilee & Day-Date President.
            </p>
            <div className="chc-footer">
              <span className="chc-tagline text-gold">4 disponibles en stock a $100.000 c/u • $400.000 total</span>
              <span className="chc-action-link">
                {categoryFilter === "rolex" ? "Viendo Rolex" : "Filtrar Rolex"} <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </div>

        {/* INVICTA CARD */}
        <div
          className={`cat-hero-card cat-hero-invicta ${categoryFilter === "invicta" ? "active-hero" : ""}`}
          onClick={() => setCategoryFilter(categoryFilter === "invicta" ? "all" : "invicta")}
        >
          <div className="chc-bg-glow chc-glow-cyan" />
          <div className="chc-content">
            <div className="chc-top">
              <span className="badge badge-cyan">
                <Zap size={14} /> Lote de Arranque
              </span>
              <span className="chc-count mono-num">{invictaItems.length} Modelos</span>
            </div>
            <h2 className="chc-title text-cyan-primary">Colección INVICTA</h2>
            <p className="chc-desc">
              Cronógrafos Krono: Subaqua Reserve, Bolt Zeus Magnum Master Gold y Crimson Skeleton.
            </p>
            <div className="chc-footer">
              <span className="chc-tagline text-cyan">1 en negociación ($85k) + 4 disponibles ($80k c/u = $320k)</span>
              <span className="chc-action-link">
                {categoryFilter === "invicta" ? "Viendo Invicta" : "Filtrar Invicta"} <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI & Controls Strip */}
      <div className="inv-controls-panel dash-panel">
        <div className="icp-top-row">
          <div className="icp-stats">
            <div className="icp-stat-box">
              <span className="icp-stat-label">Stock Disponible</span>
              <span className="icp-stat-val text-emerald mono-num">{totalStock} unidades</span>
            </div>
            <div className="icp-stat-div" />
            <div className="icp-stat-box">
              <span className="icp-stat-label">Apartados</span>
              <span className="icp-stat-val text-amber mono-num">{reservedItems.length} piezas</span>
            </div>
            <div className="icp-stat-div" />
            <div className="icp-stat-box">
              <span className="icp-stat-label">Relojes Vendidos</span>
              <span className="icp-stat-val text-gold mono-num">{soldUnits} vendidos</span>
            </div>
            <div className="icp-stat-div" />
            <div className="icp-stat-box">
              <span className="icp-stat-label">Catálogo Total</span>
              <span className="icp-stat-val text-main mono-num">{inventory.length} piezas</span>
            </div>
          </div>

          <div className="icp-search-wrap">
            <Search size={16} className="text-dim" />
            <input
              type="text"
              placeholder="Buscar modelo, bisel, cliente apartado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="icp-search-input"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="icp-filter-row">
          <div className="icp-group">
            <span className="icp-group-title">Marca / Categoría:</span>
            <button
              className={`filter-chip ${categoryFilter === "all" ? "chip-active" : ""}`}
              onClick={() => setCategoryFilter("all")}
            >
              Todos ({inventory.length})
            </button>
            <button
              className={`filter-chip chip-gold ${categoryFilter === "rolex" ? "chip-active" : ""}`}
              onClick={() => setCategoryFilter("rolex")}
            >
              <Crown size={13} /> Rolex ({rolexItems.length})
            </button>
            <button
              className={`filter-chip chip-cyan ${categoryFilter === "invicta" ? "chip-active" : ""}`}
              onClick={() => setCategoryFilter("invicta")}
            >
              <Zap size={13} /> Invicta ({invictaItems.length})
            </button>
          </div>

          <div className="icp-group">
            <span className="icp-group-title">Disponibilidad:</span>
            <button
              className={`filter-chip ${statusFilter === "all" ? "chip-active" : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              Todos
            </button>
            <button
              className={`filter-chip ${statusFilter === "available" ? "chip-active" : ""}`}
              onClick={() => setStatusFilter("available")}
            >
              Disponibles ({totalStock})
            </button>
            <button
              className={`filter-chip chip-amber ${statusFilter === "reserved" ? "chip-active" : ""}`}
              onClick={() => setStatusFilter("reserved")}
            >
              <BookmarkCheck size={13} /> Apartados ({reservedItems.length})
            </button>
            <button
              className={`filter-chip ${statusFilter === "sold" ? "chip-active" : ""}`}
              onClick={() => setStatusFilter("sold")}
            >
              Agotados / Vendidos
            </button>
          </div>
        </div>
      </div>

      {/* Watches Grid */}
      <div className="watches-grid-v2">
        {filtered.map((item) => {
          const isReserved = item.status === "Apartado";
          const avail = !isReserved && item.stock > 0;
          const isRolex = item.category === "rolex";

          return (
            <div
              key={item.id}
              className={`watch-card-v2 ${isReserved ? "wcv2-reserved" : avail ? "wcv2-available" : "wcv2-sold"} ${
                isRolex ? "wcv2-rolex" : "wcv2-invicta"
              }`}
            >
              {/* Executive Brand Header (No Photos) */}
              <div className={`wcv2-brand-banner ${isRolex ? "banner-rolex" : "banner-invicta"}`}>
                <div className="wcv2-brand-identity">
                  <div className={`wcv2-brand-icon-box ${isRolex ? "icon-box-rolex" : "icon-box-invicta"}`}>
                    {isRolex ? <Crown size={18} /> : <Zap size={18} />}
                  </div>
                  <div>
                    <span className="wcv2-brand-label">MARCA</span>
                    <h4 className={`wcv2-brand-name ${isRolex ? "gold-text" : "text-cyan"}`}>
                      {isRolex ? "ROLEX" : "INVICTA"}
                    </h4>
                  </div>
                </div>

                <span
                  className={`wcv2-stock-badge ${
                    isReserved
                      ? "stock-reserved"
                      : avail
                      ? item.stock === 1
                        ? "stock-single"
                        : "stock-multi"
                      : "stock-sold"
                  }`}
                >
                  {isReserved ? "🔒 Apartado" : avail ? `${item.stock} en stock` : "Vendido"}
                </span>
              </div>

              {/* Details Body */}
              <div className="wcv2-body">
                <div className="wcv2-header">
                  <span className="wcv2-subseries">{item.brand}</span>
                  <h3 className="wcv2-title">{item.model}</h3>
                </div>

                <div className="wcv2-pricing-strip">
                  <div className="wcv2-price-col">
                    <span className="wcv2-price-label">Precio Referencia:</span>
                    <span className="wcv2-price-ref mono-num">{item.refPrice}</span>
                  </div>

                  {item.soldPrice ? (
                    <div className="wcv2-price-col text-right">
                      <span className="wcv2-price-label">Vendido por:</span>
                      <span className="wcv2-price-sold text-emerald mono-num">
                        {formatCOP(item.soldPrice)}
                      </span>
                    </div>
                  ) : (
                    <div className="wcv2-price-col text-right">
                      <span className="wcv2-price-label">Venta Krono:</span>
                      <span className="wcv2-price-target gold-text mono-num">
                        {formatCOP(item.targetPrice || 90000)}
                      </span>
                    </div>
                  )}
                </div>

                {/* If Apartado: Detailed Reservation Card */}
                {isReserved && item.reservation && (
                  <div className="wcv2-reserved-info-box">
                    <div className="wrib-header">
                      <BookmarkCheck size={14} className="text-amber" />
                      <strong>Apartado: {item.reservation.clientName}</strong>
                    </div>
                    <div className="wrib-grid">
                      <div className="wrib-item">
                        <span>Anticipo en caja:</span>
                        <strong className="text-emerald mono-num">+{formatCOP(item.reservation.depositAmount)}</strong>
                      </div>
                      <div className="wrib-item">
                        <span>Saldo por cobrar:</span>
                        <strong className="text-amber mono-num">{formatCOP(item.reservation.remainingBalance)}</strong>
                      </div>
                      {item.reservation.dueDate && (
                        <div className="wrib-item full-w">
                          <span>Fecha cobro pactada:</span>
                          <strong className="mono-num text-main">{item.reservation.dueDate}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {item.highlight && !isReserved && (
                  <p className="wcv2-highlight">
                    <ShieldCheck size={13} className="text-gold-light" />
                    <span>{item.highlight}</span>
                  </p>
                )}

                {/* Footer Action */}
                <div className="wcv2-footer">
                  {isReserved ? (
                    <div className="wcv2-reserve-actions">
                      <button
                        className="btn-sm btn-emerald"
                        style={{ flex: 1.6 }}
                        onClick={() => onCompleteReservation(item.id)}
                      >
                        <CheckCircle2 size={14} />
                        <span>Completar Venta</span>
                      </button>
                      <button
                        className="btn-sm btn-outline-rose"
                        onClick={() => onCancelReservation(item.id)}
                        title="Cancelar apartado y regresar al inventario"
                      >
                        <RotateCcw size={14} />
                        <span>Cancelar</span>
                      </button>
                    </div>
                  ) : avail ? (
                    <div className="wcv2-actions-duo">
                      <button
                        className={`wcv2-action-btn ${isRolex ? "btn-rolex-action" : "btn-invicta-action"}`}
                        style={{ flex: 1.3 }}
                        onClick={() => onSellWatch(item)}
                      >
                        <ShoppingBag size={14} />
                        <span>Venta Contado</span>
                      </button>
                      <button
                        className="wcv2-action-btn btn-reserve-action"
                        onClick={() => onOpenReserve(item)}
                        title="Apartar reloj con anticipo inicial"
                      >
                        <BookmarkCheck size={14} />
                        <span>Apartar</span>
                      </button>
                    </div>
                  ) : (
                    <div className="wcv2-sold-banner">
                      <CheckCircle2 size={15} className="text-emerald" />
                      <span>Venta Concretada y Registrada</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state-panel dash-panel">
          <Package size={48} className="text-dim" />
          <h3 className="empty-title">No se encontraron relojes con estos filtros</h3>
          <p className="empty-desc">Prueba cambiando la marca o el estado de disponibilidad.</p>
          <button
            className="btn-sm btn-gold mt-2"
            onClick={() => {
              setCategoryFilter("all");
              setStatusFilter("all");
              setSearchTerm("");
            }}
          >
            Limpiar Filtros
          </button>
        </div>
      )}
    </div>
  );
}

export default InventoryPage;
