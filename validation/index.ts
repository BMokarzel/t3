import { PIFinancialProfileInputSchema } from "./pi-financial-profile.schema.js";

export * from "./pi-financial-profile.schema.js";

// Registry por stepKey: o controller do consumidor valida genericamente sem
// conhecer cada schema individualmente. Ex.:
//   const payload = PI_STEP_SCHEMAS["financial-profile"].parse(req.body)
//   await service.submitStep("financial-profile", payload)
//
// Mantido com chaves string literais (sem importar PIStepKey) para evitar ciclo
// de imports com o flow.
export const PI_STEP_SCHEMAS = {
    "financial-profile": PIFinancialProfileInputSchema,
} as const;

export type PIStepSchemaKey = keyof typeof PI_STEP_SCHEMAS;
