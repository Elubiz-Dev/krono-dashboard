// Pure financial calculations engine for Krono

export function calculateFinancials(transactions, lotConfig = { totalCost: 460000, costPerPartner: 230000, invictaCost: 260000, rolexCost: 200000 }) {
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
  const agreedPerPartner = lotConfig.costPerPartner || 230000;
  // Deuda confirmada entre socios: Juan le debe exactamente $37.000 a Elian
  const juanRemainingDebt = 37000;
  const juanDebtProgress = 72;

  const totalSupplies = elianSupplies + juanSupplies;
  const suppliesDifference = elianSupplies - juanSupplies; // If positive, Elian paid more supplies

  const totalCapitalElian = elianLotPaid + elianSupplies;
  const totalCapitalJuan = juanLotPaid + juanSupplies;
  const totalCapitalInjected = totalCapitalElian + totalCapitalJuan;

  // Economía de los Lotes Activos (8 Invictas & 6 Rolex = 14 Relojes)
  const totalSalesAll = totalSalesCompleted + totalSalesPending;
  const invictaLotCost = lotConfig.invictaCost || 260000;
  const rolexLotCost = lotConfig.rolexCost || 200000;
  const lotBaseCost = invictaLotCost + rolexLotCost; // $460.000 COP total combinados
  
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

  // Liquidación real considerando que Juan debe a Elian
  const juanDebtOffset = Math.min(juanNominalProfit, juanRemainingDebt);
  const elianLiquidatedProfit = elianNominalProfit + juanDebtOffset;
  const juanLiquidatedProfit = juanNominalProfit - juanDebtOffset;

  // Proyección Oficial de Cierre de Inventario Restante (Krono Timepieces)
  // 1. Ingresos por Entrar
  const remainingInvictaNegotiation = 85000; // 1 Invicta en negociación: $85.000
  const remainingInvictaStockValue = 320000; // 4 Invictas restantes ($80.000 c/u): $320.000
  const remainingRolexStockValue = 400000;   // 4 Rolex restantes ($100.000 c/u): $400.000
  const totalGrossRemainingRevenue = remainingInvictaNegotiation + remainingInvictaStockValue + remainingRolexStockValue; // $805.000

  // 2. Descuento de Inversión Pendiente (Para Quedar en $0 Deuda)
  const pendingInvictaRecovery = 20000; // Faltante para saldar Invictas: $20.000
  const pendingRolexRecovery = 20000;   // Faltante para saldar Rolex: $20.000
  const totalPendingInvestmentRecovery = pendingInvictaRecovery + pendingRolexRecovery; // $40.000

  // 3. Ganancia Neta Limpia Total: $805.000 - $40.000 = $765.000
  const netCleanProfitRemaining = totalGrossRemainingRevenue - totalPendingInvestmentRecovery;
  
  // 4. Reparto 50/50 con Juan: $382.500 cada uno
  const netCleanProfit50Each = Math.round(netCleanProfitRemaining * 0.5);

  // 5. Cuentas entre Socios y Liquidación Neta Final
  const elianRolexAdvance = 60000; // Capital adelantado por Elian para los Rolex a reembolsar ($60.000)
  // juanRemainingDebt = $37.000 (Juan me debe 37mil)
  const elianFinalProjectedPayout = netCleanProfit50Each + elianRolexAdvance + juanRemainingDebt; // $479.500
  const juanFinalProjectedPayout = Math.max(0, netCleanProfit50Each - juanRemainingDebt); // $345.500

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
    // Métricas del balance actualizado
    remainingInvictaNegotiation,
    remainingInvictaStockValue,
    remainingRolexStockValue,
    totalGrossRemainingRevenue,
    pendingInvictaRecovery,
    pendingRolexRecovery,
    totalPendingInvestmentRecovery,
    netCleanProfitRemaining,
    netCleanProfit50Each,
    elianRolexAdvance,
    invictaLotCost,
    rolexLotCost,
    lotsRecoveredCapital: lotBaseCost - totalPendingInvestmentRecovery, // $420.000 COP ya retornados
    lotsRecoveryPercentage: Math.round(((lotBaseCost - totalPendingInvestmentRecovery) / lotBaseCost) * 100), // 91%
    totalBusinessProjectedGross: totalSalesCompleted + totalGrossRemainingRevenue, // $240.000 + $805.000 = $1.045.000
    elianFinalProjectedPayout,
    juanFinalProjectedPayout,
    elianFinalProjectedPayout,
    juanFinalProjectedPayout,
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
