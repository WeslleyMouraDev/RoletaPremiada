# Spec: Prevenção de Saldo Inalcançável (Re-spin de R$ 10)

## Objetivo
Garantir que a roleta nunca sorteie um prêmio que reduza o saldo restante da campanha para exatamente R$ 10, já que não existem prêmios de R$ 10 no projeto e o saldo mínimo de premiação é R$ 20. Isso evita que a campanha fique em um estado travado onde o saldo restante de R$ 10 nunca pode ser zerado, impedindo a finalização comercial da campanha.

## Detalhes do Design
A filtragem de elegibilidade de segmentos de roleta no serviço `prizeCalculationService.ts` será modificada.

### Regra de Negócio
No método `calculateResult`:
1. Filtramos todos os segmentos (`WheelSegment`) elegíveis.
2. Um segmento é elegível se e somente se:
   - O valor do prêmio é menor ou igual ao saldo disponível da campanha (`s.prizeAmount <= availableBalance`).
   - O saldo que restaria após o pagamento desse prêmio não pode ser igual a R$ 10 (`availableBalance - s.prizeAmount !== 10`), exceto se o prêmio do próprio segmento for R$ 0.

### Código de Sorteio Proposto (`src/services/prizeCalculationService.ts`)
```typescript
export function calculateResult(
  availableBalance: number,
  segments: WheelSegment[]
): WheelSegment {
  // Filtra segmentos válidos que não extrapolam a verba e não deixam saldo de R$ 10
  const eligible = segments.filter(s => {
    const remaining = availableBalance - s.prizeAmount;
    if (s.prizeAmount > availableBalance) return false;
    if (remaining === 10 && s.prizeAmount > 0) return false;
    return true;
  });

  const totalWeight = eligible.reduce((sum, s) => sum + s.weight, 0);
  let rand = Math.random() * totalWeight;

  for (const seg of eligible) {
    rand -= seg.weight;
    if (rand <= 0) return seg;
  }

  return eligible[eligible.length - 1];
}
```

## Plano de Verificação
- Executar testes de build estáticos com `npx tsc --noEmit`.
- Fazer build de produção com `npm run build`.
- Simular cenários de saldo final (R$ 30 e R$ 40) para certificar-se de que a campanha é encerrada no prêmio de R$ 30 e prêmios de R$ 20 sequenciais, respectivamente.
