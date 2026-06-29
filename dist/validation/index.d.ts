export * from "./pi-financial-profile.schema.js";
export declare const PI_STEP_SCHEMAS: {
    readonly "financial-profile": import("zod").ZodObject<{
        Name: import("zod").ZodOptional<import("zod").ZodString>;
        PartnerName: import("zod").ZodOptional<import("zod").ZodString>;
    }, import("zod/v4/core").$strip>;
};
export type PIStepSchemaKey = keyof typeof PI_STEP_SCHEMAS;
//# sourceMappingURL=index.d.ts.map