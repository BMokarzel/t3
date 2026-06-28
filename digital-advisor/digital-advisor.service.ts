import { EligibilityScreenerRepository } from "../contract/eligibility-repository.contract"
import { EnrollmentFlow } from "../contract/enrollment-flow.contract"
import { Logger } from "../contract/logger.contract"
import { Trace } from "../contract/observability.contract"
import { EnrollmentOrchestratorRepository } from "../contract/orchestrator-repository.contract"
import { EnrollmentService, EnrollmentStatus, StepSubmissionResult } from "../contract/service"
import { Supergraph } from "../contract/supergraph.contract"
import { TogglesInterface } from "../contract/toggle.contract"
import { IneligibleStatus, WebViewRedirectStatus } from "./model/digital-advisor.model"

export class DigitalAdvisorService implements EnrollmentService {
    private constructor (
        private readonly piFlow: EnrollmentFlow,
        // private readonly vwsFlow: EnrollmentFlow,
        private readonly es2Repository: EligibilityScreenerRepository,
        private readonly vrzRepository: EnrollmentOrchestratorRepository,
        private readonly toggles: TogglesInterface,
        private readonly supergraph: Supergraph,
        private readonly logger: Logger,
        private readonly trace: Trace,
    ) {}

    async GetStatus(evaluate: boolean): Promise<EnrollmentStatus> {
        this.trace.Span("DigitalAdvisorService.GetStatus", { evaluate })

        const gate = await this.checkReleaseGate()
        if (gate) return gate

        const inflight = await this.checkOrchestratorStatus()
        if (inflight) return inflight

        if (evaluate) {
            const ineligible = await this.checkEligibility()
            if (ineligible) return ineligible
        }

        return await this.loadCurrentStepData()
    }

    async SubmitStep(stepKey: string, payload: any): Promise<StepSubmissionResult> {
        this.trace.Span("DigitalAdvisorService.SubmitStep", { stepKey })

        const clientInfo = await this.supergraph.GetClientInfo()

        if (clientInfo.RetailAccount) {
            await this.piFlow.SubmitStep(stepKey, payload)
            return new StepSubmissionResult()
        }

        if (clientInfo.EmployeeAccount) {
            // TODO: rotear para VWS flow quando disponível
            this.logger.Info("SubmitStep: EmployeeAccount flow not implemented", { stepKey })
            return new StepSubmissionResult()
        }

        this.logger.Error("SubmitStep: no account type matched", { stepKey })
        return new StepSubmissionResult()
    }

    private async checkReleaseGate(): Promise<EnrollmentStatus | null> {
        const toggles = await this.toggles.GetToggles()
        if (!toggles.EnableRelease) {
            this.logger.Info("GetStatus: release gate closed, redirecting to webview")
            return new WebViewRedirectStatus()
        }
        return null
    }

    private async checkOrchestratorStatus(): Promise<EnrollmentStatus | null> {
        const res = await this.vrzRepository.GetStatus()
        if (res?.FinancialProfile || res?.Household) {
            this.logger.Info("GetStatus: orchestrator already has data, redirecting to webview")
            return new WebViewRedirectStatus()
        }
        return null
    }

    private async checkEligibility(): Promise<EnrollmentStatus | null> {
        const eligibility = await this.es2Repository.Evaluate(false)
        if (!eligibility.Eligibility) {
            this.logger.Info("GetStatus: client ineligible")
            return new IneligibleStatus()
        }
        return null
    }

    private async loadCurrentStepData(): Promise<EnrollmentStatus> {
        const step = this.piFlow.GetCurrentStep()
        const data = await step.GetPrevData()
        return data as EnrollmentStatus
    }

    static create(
        piFlow: EnrollmentFlow,
        es2Repository: EligibilityScreenerRepository,
        vrzRepository: EnrollmentOrchestratorRepository,
        toggles: TogglesInterface,
        supergraph: Supergraph,
        logger: Logger,
        trace: Trace,
    ): DigitalAdvisorService {
        return new DigitalAdvisorService(
            piFlow, es2Repository, vrzRepository,
            toggles, supergraph, logger, trace,
        )
    }
}
