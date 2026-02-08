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
  const totalEntregue = entregas.reduce(
    (acc, e) => acc + Number(e.quantidade) * Number(e.valor_unitario),
    0
  );

  const totalPago = entregas.reduce(
    (acc, e) =>
      acc + (e.pagamentos || []).reduce((pacc, p) => pacc + Number(p.valor), 0),
    0
  );

  return {
    totalEntregue,
    totalPago,
    saldoGeral: totalEntregue - totalPago,
  };
}
