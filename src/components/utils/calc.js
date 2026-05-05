export function round2(n) {
  return Math.round(n * 100) / 100;
}

function getQuantidade(entrega) {
  if (Array.isArray(entrega.itens) && entrega.itens.length > 0) {
    return entrega.itens.reduce((acc, item) => acc + Number(item.quantidade || 0), 0);
  }
  return Number(entrega.quantidade || 0);
}

export function calcEntrega(entrega) {
  const quantidade = getQuantidade(entrega);
  const total = round2(quantidade * Number(entrega.valor_unitario || 0));
  const totalPago = round2(
    (entrega.pagamentos || []).reduce((acc, p) => acc + Number(p.valor || 0), 0)
  );
  const saldo = round2(total - totalPago);

  let saldoColor = "text-red-600";
  if (saldo === 0) saldoColor = "text-green-600";
  else if (saldo < total) saldoColor = "text-yellow-600";

  return { total, totalPago, saldo, saldoColor, quantidade };
}

export function resumoEntregas(entregas = []) {
  let totalEntregue = 0;
  let totalPago = 0;
  let trufasEntregues = 0;
  let trufasPendentes = 0;
  let entregasPendentes = 0;
  let entregasPagas = 0;

  for (const e of entregas || []) {
    const { total = 0, totalPago: pago = 0, saldo = 0, quantidade = 0 } = calcEntrega(e);

    totalEntregue += Number(total) || 0;
    totalPago += Number(pago) || 0;
    trufasEntregues += quantidade;

    if ((Number(saldo) || 0) > 0) {
      entregasPendentes += 1;
      trufasPendentes += quantidade;
    } else {
      entregasPagas += 1;
    }
  }

  const saldoGeral = round2(totalEntregue - totalPago);

  return {
    totalEntregue: round2(totalEntregue),
    totalPago: round2(totalPago),
    saldoGeral,
    entregasPendentes,
    entregasPagas,
    trufasEntregues,
    trufasPendentes,
    trufasVendidas: trufasEntregues,
    valorARepassar: saldoGeral,
  };
}
