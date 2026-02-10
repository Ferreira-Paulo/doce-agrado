export function calcEntrega(entrega) {
  const total = Number(entrega.quantidade) * Number(entrega.valor_unitario);
  const totalPago = (entrega.pagamentos || []).reduce(
    (acc, p) => acc + Number(p.valor),
    0
  );
  const saldo = total - totalPago;

  let saldoColor = "text-red-600";
  if (saldo === 0) saldoColor = "text-green-600";
  else if (saldo < total) saldoColor = "text-yellow-600";

  return { total, totalPago, saldo, saldoColor };
}

export function resumoEntregas(entregas = []) {
  let totalEntregue = 0;
  let totalPago = 0;

  let trufasEntregues = 0;
  let trufasPendentes = 0;

  let entregasPendentes = 0;
  let entregasPagas = 0;

  for (const e of entregas || []) {
    const { total = 0, totalPago: pago = 0, saldo = 0 } = calcEntrega(e);

    const qtd = Number(e?.quantidade ?? e?.qtd ?? e?.qtde ?? e?.itens ?? 0) || 0;

    totalEntregue += Number(total) || 0;
    totalPago += Number(pago) || 0;

    trufasEntregues += qtd;

    if ((Number(saldo) || 0) > 0) {
      entregasPendentes += 1;
      trufasPendentes += qtd;
    } else {
      entregasPagas += 1;
    }
  }

  const saldoGeral = totalEntregue - totalPago;

  return {
    // Admin
    totalEntregue,
    totalPago,
    saldoGeral,
    entregasPendentes,
    entregasPagas,
    trufasEntregues,
    trufasPendentes,

    // Parceiro
    trufasVendidas: trufasEntregues,
    valorARepassar: saldoGeral,
  };
}