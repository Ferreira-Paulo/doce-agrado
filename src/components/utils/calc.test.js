import { describe, it, expect } from "vitest";
import { calcEntrega, resumoEntregas } from "./calc";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function entrega(quantidade, valor_unitario, pagamentos = []) {
  return { quantidade, valor_unitario, pagamentos };
}

function pag(valor, data = "2025-01-01") {
  return { valor, data };
}

// ---------------------------------------------------------------------------
// calcEntrega
// ---------------------------------------------------------------------------

describe("calcEntrega", () => {
  it("sem pagamentos → saldo = total, cor vermelha", () => {
    const r = calcEntrega(entrega(10, 5));
    expect(r.total).toBe(50);
    expect(r.totalPago).toBe(0);
    expect(r.saldo).toBe(50);
    expect(r.saldoColor).toBe("text-red-600");
  });

  it("pagamento parcial → saldo positivo, cor amarela", () => {
    const r = calcEntrega(entrega(10, 5, [pag(20)]));
    expect(r.total).toBe(50);
    expect(r.totalPago).toBe(20);
    expect(r.saldo).toBe(30);
    expect(r.saldoColor).toBe("text-yellow-600");
  });

  it("pagamento total → saldo zero, cor verde", () => {
    const r = calcEntrega(entrega(10, 5, [pag(50)]));
    expect(r.total).toBe(50);
    expect(r.totalPago).toBe(50);
    expect(r.saldo).toBe(0);
    expect(r.saldoColor).toBe("text-green-600");
  });

  it("múltiplos pagamentos que quitam a entrega", () => {
    const r = calcEntrega(entrega(10, 5, [pag(20), pag(15), pag(15)]));
    expect(r.totalPago).toBe(50);
    expect(r.saldo).toBe(0);
    expect(r.saldoColor).toBe("text-green-600");
  });

  it("múltiplos pagamentos parciais", () => {
    const r = calcEntrega(entrega(10, 5, [pag(10), pag(10)]));
    expect(r.totalPago).toBe(20);
    expect(r.saldo).toBe(30);
    expect(r.saldoColor).toBe("text-yellow-600");
  });

  it("sem dados (objeto vazio) → zeros sem crash", () => {
    const r = calcEntrega({});
    expect(r.total).toBe(0);
    expect(r.totalPago).toBe(0);
    expect(r.saldo).toBe(0);
  });

  it("pagamentos null → trata como array vazio", () => {
    const r = calcEntrega({ quantidade: 5, valor_unitario: 10, pagamentos: null });
    expect(r.total).toBe(50);
    expect(r.totalPago).toBe(0);
    expect(r.saldo).toBe(50);
  });

  it("pagamentos undefined → trata como array vazio", () => {
    const r = calcEntrega({ quantidade: 5, valor_unitario: 10 });
    expect(r.saldo).toBe(50);
  });

  it("quantidade e valor como string → converte corretamente", () => {
    const r = calcEntrega(entrega("10", "5.50"));
    expect(r.total).toBe(55);
  });

  it("precisão de float: 10 × 3.33 = 33.30", () => {
    const r = calcEntrega(entrega(10, 3.33));
    expect(r.total).toBe(33.3);
  });

  it("pagamento em float sem acúmulo de erro", () => {
    const r = calcEntrega(entrega(3, 3.33, [pag(9.99)]));
    expect(r.saldo).toBe(0);
  });

  it("overpagamento → saldo negativo (sistema registra, não impede)", () => {
    const r = calcEntrega(entrega(2, 10, [pag(30)]));
    expect(r.total).toBe(20);
    expect(r.totalPago).toBe(30);
    expect(r.saldo).toBe(-10);
  });

  it("quantidade zero → total zero", () => {
    const r = calcEntrega(entrega(0, 10));
    expect(r.total).toBe(0);
    expect(r.saldo).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// resumoEntregas
// ---------------------------------------------------------------------------

describe("resumoEntregas", () => {
  it("lista vazia → todos os contadores em zero", () => {
    const r = resumoEntregas([]);
    expect(r.totalEntregue).toBe(0);
    expect(r.totalPago).toBe(0);
    expect(r.saldoGeral).toBe(0);
    expect(r.entregasPendentes).toBe(0);
    expect(r.entregasPagas).toBe(0);
    expect(r.trufasEntregues).toBe(0);
    expect(r.trufasPendentes).toBe(0);
  });

  it("undefined → não quebra", () => {
    const r = resumoEntregas(undefined);
    expect(r.trufasEntregues).toBe(0);
  });

  it("uma entrega sem pagamentos → pendente", () => {
    const r = resumoEntregas([entrega(10, 5)]);
    expect(r.entregasPendentes).toBe(1);
    expect(r.entregasPagas).toBe(0);
    expect(r.trufasEntregues).toBe(10);
    expect(r.trufasPendentes).toBe(10);
    expect(r.totalEntregue).toBe(50);
    expect(r.saldoGeral).toBe(50);
    expect(r.valorARepassar).toBe(50);
  });

  it("uma entrega totalmente paga → paga", () => {
    const r = resumoEntregas([entrega(10, 5, [pag(50)])]);
    expect(r.entregasPendentes).toBe(0);
    expect(r.entregasPagas).toBe(1);
    expect(r.trufasPendentes).toBe(0);
    expect(r.saldoGeral).toBe(0);
  });

  it("mix: uma pendente + uma paga", () => {
    const r = resumoEntregas([
      entrega(10, 5),
      entrega(4, 10, [pag(40)]),
    ]);
    expect(r.entregasPendentes).toBe(1);
    expect(r.entregasPagas).toBe(1);
    expect(r.trufasEntregues).toBe(14);
    expect(r.trufasPendentes).toBe(10);
    expect(r.totalEntregue).toBe(90);
    expect(r.totalPago).toBe(40);
    expect(r.saldoGeral).toBe(50);
  });

  it("múltiplas entregas acumulam trufasEntregues corretamente", () => {
    const r = resumoEntregas([
      entrega(5, 10),
      entrega(8, 10),
      entrega(3, 10, [pag(30)]),
    ]);
    expect(r.trufasEntregues).toBe(16);
    expect(r.trufasVendidas).toBe(16);
  });

  it("valorARepassar é alias de saldoGeral", () => {
    const r = resumoEntregas([entrega(10, 5, [pag(20)])]);
    expect(r.valorARepassar).toBe(r.saldoGeral);
    expect(r.valorARepassar).toBe(30);
  });

  it("entrega com pagamento parcial conta como pendente", () => {
    const r = resumoEntregas([entrega(10, 5, [pag(25)])]);
    expect(r.entregasPendentes).toBe(1);
    expect(r.entregasPagas).toBe(0);
    expect(r.trufasPendentes).toBe(10);
  });
});
