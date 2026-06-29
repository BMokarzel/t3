import { Logger } from "../../contract/logger.contract.js";
import { Trace } from "../../contract/observability.contract.js";
import { EnrollmentStepRepository } from "../../contract/step-repository.contract.js";
import { EnrollmentStep } from "../../contract/step.contract.js";
import {
    PIFinancialProfileInput,
} from "../../validation/pi-financial-profile.schema.js";

// Forma do input agora vem do schema zod (fonte única) — ver validation/.
export type { PIFinancialProfileInput };

export class ClientFinancialProfileData {
    Name?: string
}

export class PartnerFinancialProfileData {
    Name?: string
}

export class PIFinancialProfileOutput {}

export class PIFinancialProfileStep implements EnrollmentStep<
    PIFinancialProfileInput,
    PIFinancialProfileOutput,
    [ClientFinancialProfileData, PartnerFinancialProfileData]
> {
    private constructor(
        private readonly aveRepository: EnrollmentStepRepository,
        private readonly pm5Repository: EnrollmentStepRepository,
        private readonly logger: Logger,
        private readonly trace: Trace,
    ) {}

    validate(payload: PIFinancialProfileInput): [ClientFinancialProfileData, PartnerFinancialProfileData] {
        return [
            { Name: payload.Name },
            { Name: payload.PartnerName },
        ]
    }

    // TODO(erros): validate só normaliza; precisa retornar os erros de intake
    //   padronizados para que o step/serviço consiga descrever o fluxo e o step
    //   atual ao consumidor. Casa com a taxonomia de erros a definir.
    async submit(payload: PIFinancialProfileInput): Promise<void> {
        const [clientData, partnerData] = this.validate(payload)
        try {
            await Promise.all([
                this.aveRepository.submit(clientData),
                this.pm5Repository.submit(partnerData),
            ])
        } catch (err) {
            // Antes: `this.logger.Error()` descartava a causa raiz.
            // TODO(logs/PII): incluir contexto rico após o alinhamento com as
            //   libs de logs — ATENÇÃO a PII (Name/PartnerName) ao logar; definir
            //   política de redação antes de logar payload/dados do cliente.
            this.logger.error("PIFinancialProfileStep.submit failed", { err })
            throw err
        }
    }

    async getPrevData(): Promise<PIFinancialProfileOutput> {
        // Cast explícito: o repo é stub tipado como `unknown`. Tipar o repo
        // concretamente (<_, PIFinancialProfileOutput>) remove o cast quando as
        // estruturas forem populadas.
        const res = await this.aveRepository.get()
        return res as PIFinancialProfileOutput
    }

    static create(
        aveRepository: EnrollmentStepRepository,
        pm5Repository: EnrollmentStepRepository,
        logger: Logger,
        trace: Trace,
    ): PIFinancialProfileStep {
        return new PIFinancialProfileStep(aveRepository, pm5Repository, logger, trace);
    }
}
