import { Logger } from "../../contract/logger.contract";
import { Trace } from "../../contract/observability.contract";
import { EnrollmentStepRepository } from "../../contract/step-repository";
import { EnrollmentStep } from "../../contract/step.contract";

export class PIFinancialProfilePInput {
    Name?: string;
    PartnerName?: string;
}

export class ClientFinancialProfileData {
    Name?: string
}

export class PartnerFinancialProfileData {
    Name?: string
}

export class PIFinancialProfileOutput {}

export class FinancialProfilePrevData {}

export class HouseholdPrevData {}

export class PIFinancialProfileStep implements EnrollmentStep<PIFinancialProfilePInput, PIFinancialProfileOutput> {
    private constructor(
        private readonly aveRepository: EnrollmentStepRepository,
        private readonly pm5Repository: EnrollmentStepRepository,
        private readonly logger: Logger,
        private readonly trace: Trace,
    ) {}
    
    Validate(payload: PIFinancialProfilePInput): [ClientFinancialProfileData, PartnerFinancialProfileData] {
        return [
            {Name: payload.Name},
            {Name: payload.PartnerName},
        ]
    }

    async Submit(payload: PIFinancialProfilePInput): Promise<void> {
        const [clientData, partnerData] = this.Validate(payload)
        try {
            await Promise.all([
            this.aveRepository.Submit(clientData),
            this.pm5Repository.Submit(partnerData),
        ])
        } catch(err) {
            this.logger.Error()
            throw err
        }
        return
    }

    async GetPrevData(): Promise<PIFinancialProfileOutput> {
        const res = await this.aveRepository.Get()
        return res
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
