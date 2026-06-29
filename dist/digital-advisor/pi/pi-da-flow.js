import { StepSubmissionResult } from "../../contract/enrollment-flow.contract.js";
export class PIDAEnrollmentFlow {
    steps;
    // O flow recebe o Map de steps PRONTO (ver createDefaultPISteps) — assim ele
    // não conhece construção de step nem deps de infra, fica testável (injeta
    // steps fake) e evita "fat constructor".
    //
    // O Map é heterogêneo (cada chave tem input/output diferentes), então o
    // `any` AQUI é inerente ao container — não dá para tipar um Map heterogêneo
    // sem mapped types. A segurança de tipos vem dos acessores tipados por chave
    // (`internalGetStep<K>`). Não trocar por `unknown`: um step concreto não é
    // atribuível a EnrollmentStep<unknown, unknown> sob strictFunctionTypes.
    constructor(steps) {
        this.steps = steps;
    }
    resolveKey(stepKey) {
        if (!this.steps.has(stepKey)) {
            throw new Error(`unknown step: ${stepKey}`);
        }
        return stepKey;
    }
    internalGetStep(key) {
        const step = this.steps.get(key);
        if (!step) {
            throw new Error(`step not registered: ${key}`);
        }
        return step;
    }
    async submitStep(stepKey, payload) {
        const key = this.resolveKey(stepKey);
        const step = this.internalGetStep(key);
        await step.submit(payload);
        return new StepSubmissionResult();
    }
    getStep(stepKey) {
        const key = this.resolveKey(stepKey);
        return this.internalGetStep(key);
    }
    // TODO(fluxo): ajustar para validar os steps nativos, talvez recebendo uma
    //   toggle do service para liberar a release de steps específicos.
    getCurrentStep() {
        const first = this.steps.values().next();
        if (first.done) {
            throw new Error("no steps registered");
        }
        return first.value;
    }
    static create(steps) {
        return new PIDAEnrollmentFlow(steps);
    }
}
//# sourceMappingURL=pi-da-flow.js.map