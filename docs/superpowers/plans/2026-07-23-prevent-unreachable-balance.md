# Prevenção de Saldo Inalcançável (Re-spin de R$ 10) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Impedir que a roleta sorteie prêmios que deixem exatamente R$ 10 de saldo na campanha (já que o prêmio mínimo é R$ 20, deixando a campanha travada).

**Architecture:** Modificar a lógica do serviço `calculateResult` no arquivo `src/services/prizeCalculationService.ts` para filtrar no nível matemático os prêmios que causam essa sobra de R$ 10.

**Tech Stack:** React, TypeScript.

## Global Constraints
- Sem uso de `any`
- TypeScript em modo estrito
- Seguir convenções de nomenclatura originais
- Nenhuma menção ao termo proibido "Bônus"

---

### Task 1: Modificar `calculateResult` no Serviço

**Files:**
- Modify: `src/services/prizeCalculationService.ts`

**Interfaces:**
- Produces: `calculateResult(availableBalance: number, segments: WheelSegment[]): WheelSegment`

- [ ] **Step 1: Atualizar a lógica matemática de seleção de segmentos no backend**

Atualizar o arquivo `src/services/prizeCalculationService.ts` para:
```typescript
import type { WheelSegment } from '../types/campaign';

/**
 * Sorteia um segmento respeitando o saldo disponível.
 * Se saldo < menor prêmio, force "Não foi dessa vez".
 */
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

/**
 * Calcula índice do segmento na roleta para parar a animação.
 * Retorna o índice (0-based) do segmento na array.
 */
export function getSegmentIndex(segments: WheelSegment[], targetId: string): number {
  return segments.findIndex(s => s.id === targetId);
}
```

- [ ] **Step 2: Verificar compilação estática do TypeScript**

Run: `npx tsc --noEmit`
Expected: Success with no type errors.

- [ ] **Step 3: Testar e compilar a build final do projeto**

Run: `npm run build`
Expected: Build compiles successfully to `dist/`.

- [ ] **Step 4: Commit**

```bash
git add src/services/prizeCalculationService.ts
git commit -m "fix: enforce math filtering in calculateResult to prevent leaving exactly R$ 10 balance"
```
