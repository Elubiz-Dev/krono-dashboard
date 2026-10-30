import React, { useState, useMemo } from "react";
import {
  Wallet,
  Search,
  Filter,
  PlusCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  CheckCircle,
  Clock,
  Trash2,
  Tag,
  User,
  Calendar,
} from "lucide-react";
import { formatDate } from "../utils/financeCalculations";

export function CashflowTab({
  transactions,
  onOpenNewTx,
  onToggleStatus,
  onDeleteTx,
  formatCOP,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [partnerFilter, setPartnerFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchSearch =
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.notes && tx.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
        tx.date.includes(searchTerm);

      const matchPartner =
        partnerFilter === "all" ||
        tx.partner === partnerFilter ||
        (partnerFilter === "ambos" && tx.partner === "ambos");

      const matchCategory =
        categoryFilter === "all" || tx.category === categoryFilter;

      const matchType = typeFilter === "all" || tx.type === typeFilter;

      return matchSearch && matchPartner && matchCategory && matchType;
    });
  }, [transactions, searchTerm, partnerFilter, categoryFilter, typeFilter]);

  // Aggregate stats from current view
  const { totalIn, totalOut, balance } = useMemo(() => {
    let tIn = 0;
    let tOut = 0;
    filteredTransactions.forEach((tx) => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === "entrada") tIn += amt;
      if (tx.type === "salida") tOut += amt;
    });
    return { totalIn: tIn, totalOut: tOut, balance: tIn - tOut };
  }, [filteredTransactions]);

  const getCategoryBadge = (category) => {
    switch (category) {
      case "venta":
        return <span className="badge badge-emerald">Venta Reloj</span>;
      case "cuenta_cobrar":
        return <span className="badge badge-amber">Por Cobrar</span>;
      case "insumo":
        return <span className="badge badge-rose">Insumo / Operación</span>;
      case "abono_deuda":
        return <span className="badge badge-cyan">Abono Juan</span>;
      case "aporte_lote":
        return <span className="badge badge-gold">Aporte Lote</span>;
      default:
        return <span className="badge badge-gold">{category}</span>;
    }
  };

  const getPartnerBadge = (partner) => {
    if (partner === "elian") {
      return (
        <span className="partner-chip partner-chip-elian" title="Elian Navarro">
          <span className="partner-dot bg-emerald" /> Elian
        </span>
      );
    }
    if (partner === "juan") {
      return (
        <span className="partner-chip partner-chip-juan" title="Juan">
          <span className="partner-dot bg-gold" /> Juan
        </span>
      );
    }
    return (
      <span className="partner-chip partner-chip-both" title="Sociedad Krono">
        <span className="partner-dot bg-cyan" /> Krono (Ambos)
      </span>
    );
  };

  return (
    <div className="cashflow-container">
      {/* Top Controls: Search & Filter Toolbar */}
      <div className="glass-panel cashflow-toolbar no-print">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por concepto, reloj, fecha (ej. Invicta, microfibra, 15/10)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={partnerFilter}
            onChange={(e) => setPartnerFilter(e.target.value)}
            className="form-select filter-select"
          >
            <option value="all">👥 Todos los Socios</option>
            <option value="elian">Elian Navarro</option>
            <option value="juan">Juan</option>
            <option value="ambos">Krono (Ambos)</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="form-select filter-select"
          >
            <option value="all">🔄 Todas las Operaciones</option>
            <option value="entrada">🟢 Entradas (+)</option>
            <option value="salida">🔴 Salidas (-)</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-select filter-select"
          >
            <option value="all">🏷️ Todas las Categorías</option>
            <option value="venta">Ventas de Relojes</option>
            <option value="insumo">Insumos & Operación</option>
            <option value="abono_deuda">Abonos a Deuda</option>
            <option value="aporte_lote">Aportes al Lote</option>
            <option value="cuenta_cobrar">Cuentas por Cobrar</option>
          </select>

          <button onClick={onOpenNewTx} className="btn-primary-gold btn-sm">
            <PlusCircle size={16} />
            <span>Registrar</span>
          </button>
        </div>
      </div>

      {/* Mini Summary of current view */}
      <div className="cashflow-strip-summary">
        <div className="strip-item">
          <span className="strip-label">Mostrando:</span>
          <span className="strip-val">{filteredTransactions.length} movimientos</span>
        </div>
        <div className="strip-item">
          <span className="strip-label">Total Entradas:</span>
          <span className="strip-val mono-num text-emerald-light">
            +{formatCOP(totalIn)}
          </span>
        </div>
        <div className="strip-item">
          <span className="strip-label">Total Salidas / Insumos:</span>
          <span className="strip-val mono-num text-rose-primary">
            -{formatCOP(totalOut)}
          </span>
        </div>
        <div className="strip-item">
          <span className="strip-label">Saldo del Filtro:</span>
          <span className="strip-val mono-num font-bold text-gold-light">
            {formatCOP(balance)}
          </span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-panel table-panel">
        <div className="table-wrapper">
          <table className="krono-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Concepto / Descripción</th>
                <th>Socio Responsable</th>
                <th>Categoría</th>
                <th className="text-right">Entrada (+)</th>
                <th className="text-right">Salida (-)</th>
                <th>Estado</th>
                <th className="no-print text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-table-cell">
                    No se encontraron movimientos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isEntry = tx.type === "entrada";
                  const isPending = tx.status === "pendiente";

                  return (
                    <tr key={tx.id} className={isPending ? "row-pending" : ""}>
                      <td className="mono-num text-muted" style={{ whiteSpace: "nowrap" }}>
                        {formatDate(tx.date)}
                      </td>
                      <td>
                        <div className="tx-desc-cell">
                          <span className="tx-title">{tx.description}</span>
                          {tx.notes && (
                            <span className="tx-notes">{tx.notes}</span>
                          )}
                        </div>
                      </td>
                      <td>{getPartnerBadge(tx.partner)}</td>
                      <td>{getCategoryBadge(tx.category)}</td>
                      <td className="text-right mono-num font-semibold">
                        {isEntry ? (
                          <span className="text-emerald-light">
                            +{formatCOP(tx.amount)}
                          </span>
                        ) : (
                          <span className="text-dim">—</span>
                        )}
                      </td>
                      <td className="text-right mono-num font-semibold">
                        {!isEntry ? (
                          <span className="text-rose-primary">
                            -{formatCOP(tx.amount)}
                          </span>
                        ) : (
                          <span className="text-dim">—</span>
                        )}
                      </td>
                      <td>
                        {isPending ? (
                          <button
                            onClick={() => onToggleStatus(tx.id)}
                            className="badge badge-amber btn-status-toggle"
                            title="Click para marcar como cobrado / completado"
                          >
                            <Clock size={12} /> Pendiente (30 Oct)
                          </button>
                        ) : (
                          <span className="badge badge-emerald">
                            <CheckCircle size={12} /> Completado
                          </span>
                        )}
                      </td>
                      <td className="no-print text-center">
                        <button
                          onClick={() => onDeleteTx(tx.id)}
                          className="btn-icon-danger"
                          title="Eliminar movimiento"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
