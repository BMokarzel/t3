# Roadmap de finalização — t3

Checklist ponto a ponto do que precisa ser **revisto, preenchido e adaptado** para
finalizar a library e alinhá-la com as **libs/padrões da empresa** (gatekeeper,
repositórios, logs, tracing, toggles, validação) e com os **dados reais** das
estruturas.

Ordem: **lógica → temporal → prioritária**. Faça de cima para baixo; cada fase
depende das anteriores.

Legenda de prioridade: **P0** bloqueia o uso real · **P1** importante para
produção · **P2** qualidade/evolução.

Status atual: esqueleto compila (`tsc` strict, NodeNext) e roda em Node ESM puro;
tudo que está aqui é stub/placeholder a ser preenchido.

---

## Fase 0 — Descoberta (ANTES de escrever código) · P0

> Nada abaixo deve ser implementado antes de levantar estas respostas, senão
> retrabalho garantido.

- [ ] **0.1** Mapear as **libs padrão da empresa** para cada port:
  - [ ] Logger (qual lib? níveis? assinatura? formato de contexto? correlação/trace-id?)
  - [ ] Tracing/observabilidade (OpenTelemetry? wrapper interno? como abre/fecha span?)
  - [ ] Feature toggles / release (qual provider? como avalia flags? cache?)
  - [ ] Cliente HTTP / SDKs internos (gatekeeper, supergraph, orchestrator, AVE, PM5, ES2/VRZ)
  - [ ] Validação (a empresa usa zod? yup? class-validator? — hoje escolhemos zod)
  - [ ] Tratamento de erros (existe taxonomia/base de erros corporativa?)
- [ ] **0.2** Levantar **convenções de projeto** da empresa (ver Fase 6):
  - [ ] tsconfig base / target / módulo (ESM vs CJS — hoje NodeNext ESM)
  - [ ] ESLint/Prettier compartilhados
  - [ ] estrutura de pastas e naming padrão
  - [ ] estratégia de build, versionamento e publicação de libs
- [ ] **0.3** Confirmar o **wire format** das APIs externas (resolve o casing dos DTOs):
  - supergraph (`ClientInfo`), orchestrator/VRZ (`EnrollmentStatusResponse`),
    eligibility/ES2 (`EligibilityScreenerResponse`), toggles (`Toggles`),
    AVE/PM5 (payloads de submit/get).
  - Decisão pendente: campos em **PascalCase** (atual) vs camelCase — ver `NOTA(casing)` nos contratos.
- [ ] **0.4** Verificar se já existe **library equivalente** na empresa (enrollment/onboarding)
  para reaproveitar contratos/DTOs em vez de duplicar.

**Saída desta fase:** um documento curto de decisões que destrava as Fases 1–3.

---

## Fase 1 — Alinhar os PORTS com as libs da empresa · P0

> Os contratos de hoje são mínimos/genéricos. Ajustar a assinatura ANTES de
> preencher dados e validações, pois muda tudo a jusante.

- [ ] **1.1 Logger** — `contract/logger.contract.ts`
  - [ ] Alinhar níveis e assinatura com a lib de logs.
  - [ ] Definir **política de PII/redação** (há TODO em `common/steps/pi-financial-profile.ts`).
- [ ] **1.2 Tracing** — `contract/observability.contract.ts`
  - [ ] Alinhar `span()`/`withSpan()` com a lib real (atributos, propagação, encerramento).
- [ ] **1.3 Toggles (gatekeeper de release)** — `contract/toggle.contract.ts`
  - [ ] Alinhar `getToggles()` com o provider de feature flags.
  - [ ] Confirmar semântica de `EnableRelease` e demais flags.
- [ ] **1.4 Supergraph** — `contract/supergraph.contract.ts`
  - [ ] Confirmar contrato real de `getClientInfo()` e os tipos de conta.
- [ ] **1.5 Eligibility (ES2)** — `contract/eligibility-repository.contract.ts`
  - [ ] Trocar o **boolean-trap** `evaluate(plan: boolean)` por enum/options (TODO no arquivo).
- [ ] **1.6 Orchestrator (VRZ)** — `contract/orchestrator-repository.contract.ts`
  - [ ] Confirmar `getStatus()/init()/finish()` contra o SDK real.
- [ ] **1.7 Step repository (AVE/PM5)** — `contract/step-repository.contract.ts`
  - [ ] Tipar concretamente `<TSubmit, TGet>` quando os DTOs existirem (remove casts).

---

## Fase 2 — Preencher as ESTRUTURAS de dados / DTOs · P0

> Depende da Fase 1 (assinaturas) e da Fase 0.3 (wire format).

- [ ] **2.1** `EnrollmentStatus` / `StepSubmissionResult` — `contract/service.contract.ts`
  - [ ] Migrar para **discriminated union** com campo discriminante
    (ex.: `type: 'webview_redirect' | 'ineligible' | 'native'`) — hoje viram `{}`
    após `JSON.stringify` e o consumidor não distingue os casos.
- [ ] **2.2** Status nativos — `digital-advisor/model/digital-advisor.model.ts`
  - [ ] Popular `WebViewRedirectStatus` / `IneligibleStatus` / `NativeStatus`.
  - [ ] Usar `NativeStatus` em `loadCurrentStepData` (hoje `data as EnrollmentStatus`).
- [ ] **2.3** DTOs de input/output dos steps — `common/steps/pi-financial-profile.ts`
  - [ ] Preencher `ClientFinancialProfileData` / `PartnerFinancialProfileData` / `PIFinancialProfileOutput`.
  - [ ] Renomear `PIFinancialProfileInput` se necessário (já sem o "P" sobrando).
- [ ] **2.4** Respostas dos repos — `EligibilityScreenerResponse`, `EnrollmentStatusResponse`, `ClientInfo`, `Toggles`
  - [ ] Preencher campos reais + resolver **casing** (Fase 0.3).
- [ ] **2.5** Decidir **DTOs distintos entre camadas** (domínio do step ✗ transporte/status)
  e o mapeamento explícito entre eles (TODO `respostas-padrão` no service).

---

## Fase 3 — Validações e taxonomia de erros · P0/P1

> Depende da Fase 2 (formas dos dados).

- [ ] **3.1** Completar os **schemas zod** por step — `validation/`
  - [ ] `pi-financial-profile.schema.ts` com regras reais (hoje só `Name`/`PartnerName` opcionais).
  - [ ] Adicionar schema de cada novo step e registrar em `PI_STEP_SCHEMAS`.
  - [ ] Confirmar que **zod é o padrão da empresa** (Fase 0.1) — senão trocar a lib.
- [ ] **3.2** `validate()` retornar **erros de intake padronizados** — `contract/step.contract.ts` + step (P1)
- [ ] **3.3** Definir **taxonomia de erros de domínio** (substitui falhas silenciosas
  que hoje retornam `StepSubmissionResult` vazio) — `digital-advisor.service.ts`.

---

## Fase 4 — Lógica de negócio pendente · P1

- [ ] **4.1** Implementar o **VWS flow** (EmployeeAccount) — hoje só loga "not implemented" no service.
- [ ] **4.2** Tratar os casos "nenhuma conta casou" / "não implementado" com erro tipado (depende de 3.3).
- [ ] **4.3** `getCurrentStep` — validar steps nativos / liberar release por step via toggle
  (`pi-da-flow.ts`).
- [ ] **4.4** **Cache** de `getClientInfo` por sessão/request — `digital-advisor.service.ts`.
- [ ] **4.5** **Cronometrar** o tempo de resposta do VRZ para validar o curto-circuito sequencial.
- [ ] **4.6** **Segurança/AVE**: confirmar que o AVE acha o enrollment do cliente e qual o
  cuidado com as infos enviadas (PII, escopo, trust boundary).

---

## Fase 5 — Implementar os ADAPTERS reais (SDK) · P1

- [ ] **5.1** Implementar de verdade `AVERepository`, `PM5Repository`, `VRZRepository`,
  `ES2Repository` usando os SDKs/clientes da empresa (hoje stubs `{}`).
- [ ] **5.2** Decidir se os adapters são **parte do pacote público** (`t3/sdk`) ou
  **pacote separado** (`@t3/sdk-*`) — TODO em `index.ts`. Se puxarem deps pesadas, separar.

---

## Fase 6 — Padrões de projeto da empresa & qualidade · P1/P2

> Verificar contra libs/projetos existentes da empresa (Fase 0.2).

- [ ] **6.1** Alinhar **tsconfig** ao base corporativo; reativar os strict extras hoje
  comentados (`noUnusedLocals`, `noUnusedParameters`, `exactOptionalPropertyTypes`).
- [ ] **6.2** Adotar **ESLint/Prettier** compartilhados da empresa.
- [ ] **6.3** Confirmar a estratégia de módulo (**ESM/NodeNext** atual vs padrão da empresa).
  ⚠️ Se voltar para resolução tipo "Bundler", lembrar: o JS emitido **não roda em Node ESM puro** —
  manter as extensões `.js` nos imports.
- [ ] **6.4** **Testes** unitários: roteamento do flow (com steps fake), gates do service,
  steps, schemas zod. (A Fase 1 — flow recebendo `Map` — já deixou isso testável.)
- [ ] **6.5** **CI** (typecheck + lint + test + build).
- [ ] **6.6** Padronizar **nomenclatura** restante: confirmar casing dos campos de DTO (Fase 0.3);
  trocar boolean-traps (`getStatus(evaluate)`, `evaluate(plan)`) por enums/options.
- [ ] **6.7** Verificar **convenção de nomes dos repos** (AVE/PM5/VRZ/ES2 são opacos) —
  considerar aliases semânticos alinhados ao vocabulário da empresa.

---

## Fase 7 — Publicação · P2

- [ ] **7.1** `package.json`: nome/escopo definitivos, versionamento (semver), `files`, `exports` (revisar).
- [ ] **7.2** Changelog + estratégia de release.
- [ ] **7.3** Validar o pacote consumido de fora (`npm pack` + import dos subpaths `t3/contracts`, `t3/sdk`, `t3/validation`).
- [ ] **7.4** README final + exemplos de wiring revisados.

---

## Apêndice — Índice rápido dos TODO/NOTA no código

| Local | Assunto | Fase |
|---|---|---|
| `contract/service.contract.ts` | discriminated union status | 2.1 |
| `digital-advisor/model/digital-advisor.model.ts` | popular status + usar NativeStatus | 2.2 |
| `contract/step.contract.ts` | validate retornar erros | 3.2 |
| `contract/step-repository.contract.ts` | tipar `<TSubmit,TGet>` | 1.7 |
| `common/steps/pi-financial-profile.ts` | erros de intake; PII; cast | 3.2 / 1.1 |
| `digital-advisor/digital-advisor.service.ts` | VWS; respostas-padrão; cache; VRZ; AVE; boolean-trap; NativeStatus | 4.x |
| `contract/eligibility-repository.contract.ts` | boolean-trap | 1.5 |
| `contract/{toggle,supergraph,eligibility,orchestrator}.*` | NOTA(casing) | 0.3 / 2.4 |
| `digital-advisor/pi/pi-da-flow.ts` | getCurrentStep / release por step | 4.3 |
| `sdk/*.repository.ts` | implementar stubs | 5.1 |
| `index.ts` | SDK público vs separado | 5.2 |
| `tsconfig.json` | reativar strict extras | 6.1 |
