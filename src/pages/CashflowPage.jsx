import React, { useState, useMemo } from "react";
import { Search, PlusCircle, CheckCircle2, Clock, Trash2, Edit2, Check, X } from "lucide-react";
import { formatDate } from "../utils/financeCalculations";

const CAT_BADGES = {
  venta: "badge-emerald",
  cuenta_cobrar: "badge-amber",
  insumo: "badge-rose",
  abono_deuda: "badge-cyan",
  aporte_lote: "badge-gold",
  gasto: "badge-rose",
};
const CAT_LABELS = {
  venta: "Venta Reloj",
  cuenta_cobrar: "Por Cobrar",
  insumo: "Insumo",
  abono_deuda: "Abono Juan",
  aporte_lote: "Aporte Lote",
  gasto: "Gasto",
};

function InlineEditCell({ value, onSave, isEditMode, type = "text" }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  if (!isEditMode) return <span>{value}</span>;
  if (editing) return (
    <span className="inline-edit-wrap">
      <input type={type} className="inline-input" value={draft} onChange={e => setDraft(e.target.value)}
        autoFocus onKeyDown={e => { if(e.key==="Enter"){onSave(draft);setEditing(false);} if(e.key==="Escape")setEditing(false); }} />
      <button className="ie-btn ie-save" onClick={()=>{onSave(draft);setEditing(false);}}><Check size={11}/></button>
      <button className="ie-btn ie-cancel" onClick={()=>setEditing(false)}><X size={11}/></button>
    </span>
  );
  return <span className="editable-val" onClick={()=>setEditing(true)}>{value} <Edit2 size={10} className="edit-pencil"/></span>;
}

export function CashflowPage({ transactions, onOpenNewTx, onToggleStatus, onDeleteTx, onUpdateTx, formatCOP, isEditMode, activeUser }) {
  const [search, setSearch] = useState("");
  const [partnerF, setPartnerF] = useState("all");
  const [typeF, setTypeF] = useState("all");
  const [catF, setCatF] = useState("all");

  const filtered = useMemo(() => transactions.filter(tx => {
    const q = search.toLowerCase();
    return (
      (tx.description.toLowerCase().includes(q) || tx.date.includes(q) || (tx.notes||"").toLowerCase().includes(q)) &&
      (partnerF === "all" || tx.partner === partnerF) &&
      (typeF === "all" || tx.type === typeF) &&
      (catF === "all" || tx.category === catF)
    );
  }), [transactions, search, partnerF, typeF, catF]);

  const totIn = filtered.filter(t=>t.type==="entrada").reduce((a,t)=>a+t.amount,0);
  const totOut = filtered.filter(t=>t.type==="salida").reduce((a,t)=>a+t.amount,0);

  return (
    <div className="page-layout">
      {/* Toolbar */}
      <div className="cf-toolbar dash-panel">
        <div className="search-wrap">
          <Search size={16} className="search-ic" />
          <input className="search-input" placeholder="Buscar operación, reloj, fecha..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <div className="cf-filters">
          <select className="filter-sel" value={partnerF} onChange={e=>setPartnerF(e.target.value)}>
            <option value="all">Todos los socios</option>
            <option value="elian">Elian</option>
            <option value="juan">Juan</option>
            <option value="ambos">Ambos (Krono)</option>
          </select>
          <select className="filter-sel" value={typeF} onChange={e=>setTypeF(e.target.value)}>
            <option value="all">Entradas y Salidas</option>
            <option value="entrada">Solo Entradas (+)</option>
            <option value="salida">Solo Salidas (-)</option>
          </select>
          <select className="filter-sel" value={catF} onChange={e=>setCatF(e.target.value)}>
            <option value="all">Todas las categorías</option>
            <option value="venta">Ventas</option>
            <option value="insumo">Insumos</option>
            <option value="abono_deuda">Abonos</option>
            <option value="aporte_lote">Aportes</option>
            <option value="cuenta_cobrar">Por Cobrar</option>
          </select>
          <button className="btn-sm btn-indigo" onClick={onOpenNewTx}><PlusCircle size={15}/> Registrar</button>
        </div>
      </div>

      {/* Summary strip */}
      <div className="cf-summary-strip">
        <div className="css-item"><span>Movimientos:</span><strong>{filtered.length}</strong></div>
        <div className="css-item"><span>Entradas:</span><strong className="text-emerald mono-num">+{formatCOP(totIn)}</strong></div>
        <div className="css-item"><span>Salidas:</span><strong className="text-rose mono-num">-{formatCOP(totOut)}</strong></div>
        <div className="css-item"><span>Balance:</span><strong className="text-indigo mono-num">{formatCOP(totIn - totOut)}</strong></div>
      </div>

      {/* Table */}
      <div className="dash-panel table-panel-wrap">
        <table className="krono-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Concepto</th>
              <th>Socio</th>
              <th>Categoría</th>
              <th className="text-r">Entrada (+)</th>
              <th className="text-r">Salida (-)</th>
              <th>Estado</th>
              {isEditMode && <th className="text-c">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="empty-row">No hay movimientos con los filtros aplicados.</td></tr>
            ) : filtered.map(tx => {
              const isIn = tx.type === "entrada";
              return (
                <tr key={tx.id} className={tx.status === "pendiente" ? "row-pending" : ""}>
                  <td className="mono-num text-dim td-date">
                    <InlineEditCell value={tx.date} onSave={v=>onUpdateTx(tx.id,{date:v})} isEditMode={isEditMode} type="date" />
                  </td>
                  <td className="td-desc">
                    <div className="tx-title-wrap">
                      <InlineEditCell value={tx.description} onSave={v=>onUpdateTx(tx.id,{description:v})} isEditMode={isEditMode} />
                      {tx.notes && <span className="tx-note">{tx.notes}</span>}
                    </div>
                  </td>
                  <td>
                    <span className={`partner-chip partner-${tx.partner}`}>
                      {tx.partner === "elian" ? "Elian" : tx.partner === "juan" ? "Juan" : "Ambos"}
                    </span>
                  </td>
                  <td><span className={`badge ${CAT_BADGES[tx.category] || "badge-gold"}`}>{CAT_LABELS[tx.category] || tx.category}</span></td>
                  <td className="text-r mono-num">
                    {isIn ? (
                      <span className="text-emerald">
                        +<InlineEditCell value={tx.amount} onSave={v=>onUpdateTx(tx.id,{amount:Number(v)})} isEditMode={isEditMode} type="number" />
                      </span>
                    ) : "—"}
                  </td>
                  <td className="text-r mono-num">
                    {!isIn ? (
                      <span className="text-rose">
                        -<InlineEditCell value={tx.amount} onSave={v=>onUpdateTx(tx.id,{amount:Number(v)})} isEditMode={isEditMode} type="number" />
                      </span>
                    ) : "—"}
                  </td>
                  <td>
                    <button className={`status-btn ${tx.status === "completado" ? "status-ok" : "status-pending"}`} onClick={()=>onToggleStatus(tx.id)} title="Cambiar estado">
                      {tx.status === "completado" ? <><CheckCircle2 size={12}/> Completado</> : <><Clock size={12}/> Pendiente</>}
                    </button>
                  </td>
                  {isEditMode && (
                    <td className="text-c">
                      <button className="btn-del" onClick={()=>onDeleteTx(tx.id)} title="Eliminar"><Trash2 size={14}/></button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
