import { EnrollmentFlow, StepSubmissionResult } from "../../contract/enrollment-flow.contract";
import { Logger } from "../../contract/logger.contract";
import { Trace } from "../../contract/observability.contract";
import { EnrollmentStepRepository } from "../../contract/step-repository";
import {
    PIFinancialProfilePInput,
    PIFinancialProfileOutput,
    PIFinancialProfileStep,
} from "../../commun/steps/pi-financial-profile";
import { EnrollmentStep } from "../../contract/step.contract";

export interface PIStepTypeMap {
    "financial-profile": {
        input: PIFinancialProfilePInput;
        output: PIFinancialProfileOutput;
    };
    // "risk-quiz": { input: RiskQuizInput; output: RiskQuizOutput };
}

export type PIStepKey = keyof PIStepTypeMap;

export class PIDAEnrollmentFlow implements EnrollmentFlow {
    private readonly steps: Map<PIStepKey, EnrollmentStep<any, any>>;

    private constructor(
        private readonly aveRepository: EnrollmentStepRepository,
        private readonly pm5Repository: EnrollmentStepRepository,
        private readonly logger: Logger,
        private readonly trace: Trace,
    ) {
        this.steps = new Map<PIStepKey, EnrollmentStep<any, any>>([
            ["financial-profile", PIFinancialProfileStep.create(aveRepository, pm5Repository, logger, trace)],
        ]);
    }

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

    async SubmitStep(stepKey: string, payload: any): Promise<StepSubmissionResult> {
        const key = this.resolveKey(stepKey);
        const step = this.internalGetStep(key);
        await step.Submit(payload);
        return new StepSubmissionResult();
    }

    GetStep(stepKey: string): EnrollmentStep<any, any> {
        const key = this.resolveKey(stepKey);
        return this.internalGetStep(key);
    }

    GetCurrentStep(): EnrollmentStep<any, any> {
        // TODO: quando houver mais de um step, derivar o "atual" de uma fonte
        // de progresso (orquestrador ou estado persistido). Por ora, retorna
        // o primeiro registrado na ordem do Map.
        const first = this.steps.values().next();
        if (first.done) {
            throw new Error("no steps registered");
        }
        return first.value;
    }

    static create(
        aveRepository: EnrollmentStepRepository,
        pm5Repository: EnrollmentStepRepository,
        logger: Logger,
        trace: Trace,
    ): PIDAEnrollmentFlow {
        return new PIDAEnrollmentFlow(aveRepository, pm5Repository, logger, trace);
    }
}
