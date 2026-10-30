import React, { useRef } from "react";
import {
  PlusCircle, Download, Upload, Edit3, Save,
  AlertCircle, Bell, RotateCcw, Printer
} from "lucide-react";

const PAGE_TITLES = {
  overview: { title: "Dashboard General", sub: "KPIs financieros y resumen ejecutivo de KRONO" },
  cashflow: { title: "Flujo de Caja", sub: "Registro de entradas, salidas y operaciones del negocio" },
  partners: { title: "Cuentas entre Socios", sub: "Balance 50/50 Elian Navarro & Juan" },
  inventory: { title: "Inventario de Relojes", sub: "Catálogo de cronógrafos Krono en stock y vendidos" },
  strategy: { title: "Estrategia & Reinversión", sub: "Simulador del próximo lote y calendario comercial" },
};

export function TopBar({
  activePage, isEditMode, setIsEditMode, activeUser, partner,
  onLogout, onOpenNewTx, onOpenDebtModal, onExportExcel, onImportExcel,
  onReset, juanRemainingDebt, cashInHand, formatCOP
}) {
  const fileRef = useRef(null);
  const { title, sub } = PAGE_TITLES[activePage] || PAGE_TITLES.overview;
  const userColor = activeUser?.color || "#e5b869";

  return (
    <header className="topbar">
      {/* Left: Page title */}
      <div className="topbar-left">
        <h2 className="topbar-title">{title}</h2>
        <p className="topbar-sub">{sub}</p>
      </div>

      {/* Right: Actions */}
      <div className="topbar-right">
        {/* Cash badge */}
        <div className="topbar-cash-badge">
          <span className="tcb-label">Caja</span>
          <span className="tcb-val mono-num">{formatCOP(cashInHand)}</span>
        </div>

        {/* Debt alert */}
        {juanRemainingDebt > 0 && (
          <button className="topbar-alert-btn" onClick={onOpenDebtModal} title="Deuda pendiente de Juan">
            <AlertCircle size={16} />
            <span>Juan debe {formatCOP(juanRemainingDebt)}</span>
          </button>
        )}

        {/* Edit mode toggle */}
        <button
          className={`topbar-edit-btn ${isEditMode ? "editing" : ""}`}
          onClick={() => setIsEditMode(!isEditMode)}
          title={isEditMode ? "Guardar cambios" : "Activar modo edición"}
          style={isEditMode ? { "--edit-color": userColor } : {}}
        >
          {isEditMode ? <><Save size={15} /><span>Guardar</span></> : <><Edit3 size={15} /><span>Editar</span></>}
        </button>

        {/* New transaction */}
        <button className="topbar-new-btn" onClick={onOpenNewTx} style={{ "--btn-color": userColor }}>
          <PlusCircle size={16} />
          <span>Registrar</span>
        </button>

        {/* Excel actions dropdown */}
        <div className="topbar-excel-group">
          <input ref={fileRef} type="file" accept=".xlsx,.xls" style={{ display: "none" }} onChange={e => { if(e.target.files[0]) { onImportExcel(e.target.files[0]); e.target.value=""; } }} />
          <button className="topbar-icon-btn" onClick={() => fileRef.current?.click()} title="Importar Excel">
            <Upload size={16} />
          </button>
          <button className="topbar-icon-btn" onClick={onExportExcel} title="Exportar Excel">
            <Download size={16} />
          </button>
          <button className="topbar-icon-btn" onClick={() => window.print()} title="Imprimir">
            <Printer size={16} />
          </button>
          <button className="topbar-icon-btn" onClick={onReset} title="Restaurar datos originales">
            <RotateCcw size={16} />
          </button>
        </div>

        {/* User chip */}
        <div className="topbar-user-chip" style={{ "--user-color": userColor }}>
          <div className="tuc-avatar">{partner?.avatarInitials}</div>
          <span className="tuc-name">{activeUser?.name?.split(" ")[0]}</span>
        </div>
      </div>
    </header>
  );
}
