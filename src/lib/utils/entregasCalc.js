export function calcEntregaResumo(entrega) {
  const total = Number(entrega.quantidade) * Number(entrega.valor_unitario);
  const totalPago = (entrega.pagamentos || []).reduce((acc, pay) => acc + Number(pay.valor), 0);
  const saldo = total - totalPago;

  let saldoColor = "text-red-600";
  if (saldo === 0) saldoColor = "text-green-600";
  else if (saldo < total) saldoColor = "text-yellow-600";

  return { total, totalPago, saldo, saldoColor };
}

export function resumoGeral(entregas) {
  const totalEntregue = entregas.reduce(
    (acc, p) =>
      acc +
      p.entregas.reduce(
        (eAcc, e) => eAcc + Number(e.quantidade) * Number(e.valor_unitario),
        0
      ),
    0
  );

  const totalPago = entregas.reduce(
    (acc, p) =>
      acc +
      p.entregas.reduce(
        (eAcc, e) =>
          eAcc + (e.pagamentos || []).reduce((pAcc, pay) => pAcc + Number(pay.valor), 0),
        0
      ),
    0
  );

  return {
    totalEntregue,
    totalPago,
    saldoGeral: totalEntregue - totalPago,
  };
}
