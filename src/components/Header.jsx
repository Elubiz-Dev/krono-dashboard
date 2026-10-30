import React, { useState, useEffect } from "react";
import {
  Clock,
  PlusCircle,
  Download,
  Upload,
  Printer,
  Users,
  ShieldCheck,
  TrendingUp,
  Wallet,
  Sparkles,
} from "lucide-react";

export function Header({
  activeTab,
  setActiveTab,
  onOpenNewTx,
  onOpenDebtModal,
  onExportExcel,
  onImportExcel,
  cashInHand,
  juanRemainingDebt,
  formatCOP,
}) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedDate = currentTime.toLocaleDateString("es-CO", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImportExcel(file);
      e.target.value = "";
    }
  };

  return (
    <header className="header-container no-print">
      {/* Top Bar: Brand, Live Time, Actions */}
      <div className="top-bar">
        <div className="brand-wrapper">
          <div className="brand-logo-glow">
            <img
              src="/assets/krono_logo.jpg"
              alt="Krono Logo"
              className="brand-logo-img"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
          <div>
            <div className="brand-title-row">
              <h1 className="brand-title">KRONO</h1>
              <span className="brand-badge">FINANZAS & ASOCIADOS</span>
            </div>
            <p className="brand-subtitle">
              Elian Navarro & Juan • Control Financiero y Relojería de Alta Gama
            </p>
          </div>
        </div>

        {/* Live Clock & Quick Badges */}
        <div className="header-meta">
          <div className="clock-pill">
            <Clock size={16} className="clock-icon" />
            <div className="clock-content">
              <span className="clock-time mono-num">{formattedTime}</span>
              <span className="clock-date">{formattedDate}</span>
            </div>
          </div>

          <div className="header-actions">
            <input
              type="file"
              id="excel-import-input"
              accept=".xlsx, .xls"
              style={{ display: "none" }}
              onChange={handleFileInput}
            />
            <button
              onClick={() => document.getElementById("excel-import-input").click()}
              className="btn-secondary btn-sm"
              title="Cargar archivo Excel (.xlsx)"
            >
              <Upload size={15} />
              <span>Importar Excel</span>
            </button>

            <button
              onClick={onExportExcel}
              className="btn-secondary btn-sm"
              title="Descargar copia en Excel"
            >
              <Download size={15} />
              <span>Exportar Excel</span>
            </button>

            <button
              onClick={() => window.print()}
              className="btn-secondary btn-sm"
              title="Imprimir informe financiero"
            >
              <Printer size={15} />
            </button>

            {juanRemainingDebt > 0 && (
              <button
                onClick={onOpenDebtModal}
                className="btn-emerald btn-sm"
                title="Registrar abono de Juan"
              >
                <Sparkles size={15} />
                <span>Abono Juan ({formatCOP(juanRemainingDebt)})</span>
              </button>
            )}

            <button onClick={onOpenNewTx} className="btn-primary-gold btn-sm">
              <PlusCircle size={16} />
              <span>Nueva Operación</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <TrendingUp size={17} />
          <span>Resumen General</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "cashflow" ? "active" : ""}`}
          onClick={() => setActiveTab("cashflow")}
        >
          <Wallet size={17} />
          <span>Flujo de Caja</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "partners" ? "active" : ""}`}
          onClick={() => setActiveTab("partners")}
        >
          <Users size={17} />
          <span>Socios (Elian & Juan)</span>
          {juanRemainingDebt > 0 && <span className="tab-debt-dot" title="Deuda pendiente" />}
        </button>

        <button
          className={`tab-btn ${activeTab === "inventory" ? "active" : ""}`}
          onClick={() => setActiveTab("inventory")}
        >
          <ShieldCheck size={17} />
          <span>Inventario & Relojes</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "strategy" ? "active" : ""}`}
          onClick={() => setActiveTab("strategy")}
        >
          <Sparkles size={17} />
          <span>Estrategia & Reinversión</span>
        </button>
      </nav>
    </header>
  );
}
