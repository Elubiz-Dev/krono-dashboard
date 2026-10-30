// Pure financial calculations engine for Krono

export function calculateFinancials(transactions, lotConfig = { totalCost: 260000, costPerPartner: 130000 }) {
  let totalEntriesAll = 0;
  let totalEntriesCompleted = 0;
  let totalEntriesPending = 0;
  let totalExits = 0;

  let totalSalesCompleted = 0;
  let totalSalesPending = 0;
  let salesCountCompleted = 0;
  let salesCountPending = 0;

  let elianLotPaid = 0;
  let juanLotPaid = 0;
  let juanAbonos = 0;

  let elianSupplies = 0;
  let juanSupplies = 0;

  transactions.forEach((tx) => {
    const amt = Number(tx.amount) || 0;

    if (tx.type === "entrada") {
      totalEntriesAll += amt;
      if (tx.status === "completado") {
        totalEntriesCompleted += amt;
      } else {
        totalEntriesPending += amt;
      }

      // Categories
      if (tx.category === "venta") {
        if (tx.status === "completado") {
          totalSalesCompleted += amt;
          salesCountCompleted++;
        } else {
          totalSalesPending += amt;
          salesCountPending++;
        }
      } else if (tx.category === "cuenta_cobrar") {
        totalSalesPending += amt;
        salesCountPending++;
      } else if (tx.category === "aporte_lote") {
        if (tx.partner === "elian") elianLotPaid += amt;
        if (tx.partner === "juan") juanLotPaid += amt;
      } else if (tx.category === "abono_deuda") {
        if (tx.partner === "juan") {
          juanLotPaid += amt;
          juanAbonos += amt;
        }
      }
    } else if (tx.type === "salida") {
      totalExits += amt;

      if (tx.category === "insumo" || tx.category === "gasto") {
        if (tx.partner === "elian") elianSupplies += amt;
        if (tx.partner === "juan") juanSupplies += amt;
      }
    }
  });

  // Saldo real en caja (Efectivo físico disponible hoy)
  const cashInHand = totalEntriesCompleted - totalExits;

  // Saldo proyectado en caja (con ventas cobradas + pendientes)
  const cashProjected = totalEntriesAll - totalExits;

  // Cuentas entre socios
  const agreedPerPartner = lotConfig.costPerPartner || 130000;
  const juanRemainingDebt = Math.max(0, agreedPerPartner - juanLotPaid);
  const juanDebtProgress = agreedPerPartner > 0 ? Math.min(100, Math.round((juanLotPaid / agreedPerPartner) * 100)) : 100;

  const totalSupplies = elianSupplies + juanSupplies;
  const suppliesDifference = elianSupplies - juanSupplies; // If positive, Elian paid more supplies

  const totalCapitalElian = elianLotPaid + elianSupplies;
  const totalCapitalJuan = juanLotPaid + juanSupplies;
  const totalCapitalInjected = totalCapitalElian + totalCapitalJuan;

  // Economía del Lote Base
  const totalSalesAll = totalSalesCompleted + totalSalesPending;
  const lotBaseCost = lotConfig.totalCost || 260000;
  
  // Ganancia Bruta del Lote (Ventas Totales - Costo Lote)
  const lotGrossProfit = totalSalesAll - lotBaseCost;

  // Ganancia Neta estimada (restando insumos operativos)
  const netProfitEstimated = totalSalesAll - lotBaseCost - totalSupplies;

  // 50% Fondo de Re-inversión obligatorio (Regla Krono #1)
  const reinvestmentFund50 = Math.max(0, Math.round(lotGrossProfit * 0.5));
  const distributableProfit50 = Math.max(0, lotGrossProfit - reinvestmentFund50);

  // Reparto 50/50 de la ganancia distribuible
  const elianNominalProfit = Math.round(distributableProfit50 * 0.5);
  const juanNominalProfit = Math.round(distributableProfit50 * 0.5);

  // Liquidación real considerando que Juan debe $40,000 a Elian
  // Si se liquida hoy, a Juan se le deduce su deuda y se le transfiere a Elian
  const juanDebtOffset = Math.min(juanNominalProfit, juanRemainingDebt);
  const elianLiquidatedProfit = elianNominalProfit + juanDebtOffset;
  const juanLiquidatedProfit = juanNominalProfit - juanDebtOffset;

  return {
    totalEntriesAll,
    totalEntriesCompleted,
    totalEntriesPending,
    totalExits,
    cashInHand,
    cashProjected,
    totalSalesAll,
    totalSalesCompleted,
    totalSalesPending,
    salesCountCompleted,
    salesCountPending,
    lotBaseCost,
    lotGrossProfit,
    netProfitEstimated,
    reinvestmentFund50,
    distributableProfit50,
    agreedPerPartner,
    elianLotPaid,
    juanLotPaid,
    juanAbonos,
    juanRemainingDebt,
    juanDebtProgress,
    elianSupplies,
    juanSupplies,
    totalSupplies,
    suppliesDifference,
    totalCapitalElian,
    totalCapitalJuan,
    totalCapitalInjected,
    elianNominalProfit,
    juanNominalProfit,
    elianLiquidatedProfit,
    juanLiquidatedProfit,
  };
}

// Formateador estándar de moneda colombiana (COP)
export function formatCOP(value, withDecimals = false) {
  const num = Number(value) || 0;
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: withDecimals ? 2 : 0,
    maximumFractionDigits: withDecimals ? 2 : 0,
  }).format(num);
}

// Formato de fecha legible
export function formatDate(dateString) {
  if (!dateString) return "";
  const parts = dateString.split("-");
  if (parts.length === 3) {
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    return d.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  return dateString;
}
