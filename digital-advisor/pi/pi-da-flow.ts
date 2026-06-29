import { EnrollmentFlow, StepSubmissionResult } from "../../contract/enrollment-flow.contract.js";
import { EnrollmentStep } from "../../contract/step.contract.js";
import { PIFinancialProfileOutput } from "../../common/steps/pi-financial-profile.js";
import { PIFinancialProfileInput } from "../../validation/pi-financial-profile.schema.js";

export interface PIStepTypeMap {
    "financial-profile": {
        input: PIFinancialProfileInput;
        output: PIFinancialProfileOutput;
    };
    // "risk-quiz": { input: RiskQuizInput; output: RiskQuizOutput };
}

export type PIStepKey = keyof PIStepTypeMap;

export class PIDAEnrollmentFlow implements EnrollmentFlow {
    // O flow recebe o Map de steps PRONTO (ver createDefaultPISteps) — assim ele
    // não conhece construção de step nem deps de infra, fica testável (injeta
    // steps fake) e evita "fat constructor".
    //
    // O Map é heterogêneo (cada chave tem input/output diferentes), então o
    // `any` AQUI é inerente ao container — não dá para tipar um Map heterogêneo
    // sem mapped types. A segurança de tipos vem dos acessores tipados por chave
    // (`internalGetStep<K>`). Não trocar por `unknown`: um step concreto não é
    // atribuível a EnrollmentStep<unknown, unknown> sob strictFunctionTypes.
    private constructor(
        private readonly steps: Map<PIStepKey, EnrollmentStep<any, any>>,
    ) {}

    private resolveKey(stepKey: string): PIStepKey {
        if (!this.steps.has(stepKey as PIStepKey)) {
            throw new Error(`unknown step: ${stepKey}`);
        }
        return stepKey as PIStepKey;
    }

    private internalGetStep<K extends PIStepKey>(
        key: K,
    ): EnrollmentStep<PIStepTypeMap[K]["input"], PIStepTypeMap[K]["output"]> {
        const step = this.steps.get(key);
        if (!step) {
            throw new Error(`step not registered: ${key}`);
        }
        return step as EnrollmentStep<PIStepTypeMap[K]["input"], PIStepTypeMap[K]["output"]>;
    }

    async submitStep(stepKey: string, payload: any): Promise<StepSubmissionResult> {
        const key = this.resolveKey(stepKey);
        const step = this.internalGetStep(key);
        await step.submit(payload);
        return new StepSubmissionResult();
    }

    getStep(stepKey: string): EnrollmentStep<any, any> {
        const key = this.resolveKey(stepKey);
        return this.internalGetStep(key);
    }

    // TODO(fluxo): ajustar para validar os steps nativos, talvez recebendo uma
    //   toggle do service para liberar a release de steps específicos.
    getCurrentStep(): EnrollmentStep<any, any> {
        const first = this.steps.values().next();
        if (first.done) {
            throw new Error("no steps registered");
        }
        return first.value;
    }

    static create(
        steps: Map<PIStepKey, EnrollmentStep<any, any>>,
    ): PIDAEnrollmentFlow {
        return new PIDAEnrollmentFlow(steps);
    }
}
