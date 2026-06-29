import { z } from "zod";
export declare const PIFinancialProfileInputSchema: z.ZodObject<{
    Name: z.ZodOptional<z.ZodString>;
    PartnerName: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type PIFinancialProfileInput = z.infer<typeof PIFinancialProfileInputSchema>;
//# sourceMappingURL=pi-financial-profile.schema.d.ts.map