// Ponto de entrada público da biblioteca t3.
//
// É uma LIBRARY (não uma API): o consumidor monta o grafo de dependências.
// Subpaths disponíveis:
//   - "t3/contracts" → ports (o que você PRECISA satisfazer)
//   - "t3/sdk"       → adapters opcionais (use ou traga os seus)
//   - "t3/validation"→ schemas zod + registry por stepKey (para o controller)
//
// Exemplo de wiring no consumidor:
//
//   const steps = createDefaultPISteps(
//       AVERepository.create(), PM5Repository.create(), logger, trace,
//   )
//   const piFlow = PIDAEnrollmentFlow.create(steps)
//   const service = DigitalAdvisorService.create(
//       piFlow,
//       ES2Repository.create(),
//       VRZRepository.create(),
//       toggles, supergraph, logger, trace,
//   )

// Ports (contratos).
export * from "./contract/index.js";

// Serviço, flow, factory de steps, model e steps.
export * from "./digital-advisor/digital-advisor.service.js";
export * from "./digital-advisor/model/digital-advisor.model.js";
export * from "./digital-advisor/pi/pi-da-flow.js";
export * from "./digital-advisor/pi/pi-steps.factory.js";
export * from "./common/steps/pi-financial-profile.js";

// Validação (schemas zod + registry).
export * from "./validation/index.js";

// Adapters opcionais (SDK).
export * from "./sdk/index.js";
