import { z } from "zod";
// Fonte ÚNICA da forma do input do step "financial-profile".
// O tipo é derivado do schema (z.infer) — schema e tipo nunca dessincronizam.
// NOTA(casing): campos em PascalCase espelhando o input atual; padronizar se
//   forem internos (ver toggle.contract.ts).
export const PIFinancialProfileInputSchema = z.object({
    Name: z.string().min(1).optional(),
    PartnerName: z.string().min(1).optional(),
});
//# sourceMappingURL=pi-financial-profile.schema.js.map