import { EligibilityScreenerRepository } from "../contract/eligibility-repository.contract.js"
import { EnrollmentFlow } from "../contract/enrollment-flow.contract.js"
import { Logger } from "../contract/logger.contract.js"
import { Trace } from "../contract/observability.contract.js"
import { EnrollmentOrchestratorRepository } from "../contract/orchestrator-repository.contract.js"
import { EnrollmentService, EnrollmentStatus, StepSubmissionResult } from "../contract/service.contract.js"
import { Supergraph } from "../contract/supergraph.contract.js"
import { TogglesInterface } from "../contract/toggle.contract.js"
import { IneligibleStatus, WebViewRedirectStatus } from "./model/digital-advisor.model.js"

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

    async getStatus(evaluate: boolean): Promise<EnrollmentStatus> {
        return this.trace.withSpan("DigitalAdvisorService.getStatus", async () => {
            // NOTA: a execução é sequencial DE PROPÓSITO (regra de negócio) — cada
            // gate evita chamadas desnecessárias às etapas seguintes.
            // TODO(perf): cronometrar o tempo de resposta do VRZ (checkOrchestratorStatus)
            //   para confirmar que o ganho de curto-circuito compensa a latência serial.
            const gate = await this.checkReleaseGate()
            if (gate) return gate

            const inflight = await this.checkOrchestratorStatus()
            if (inflight) return inflight

            if (evaluate) {
                const ineligible = await this.checkEligibility()
                if (ineligible) return ineligible
            }

            return await this.loadCurrentStepData()
        }, { evaluate })
    }

    async submitStep(stepKey: string, payload: any): Promise<StepSubmissionResult> {
        return this.trace.withSpan("DigitalAdvisorService.submitStep", async () => {
            // TODO(perf/cache): getClientInfo é chamado a cada submitStep. Seria
            //   interessante cachear essa informação (por sessão/request) para evitar
            //   um round-trip por submit.
            const clientInfo = await this.supergraph.getClientInfo()

            if (clientInfo.RetailAccount) {
                return await this.piFlow.submitStep(stepKey, payload)
            }

            if (clientInfo.EmployeeAccount) {
                // TODO: rotear para VWS flow quando disponível
                this.logger.info("submitStep: EmployeeAccount flow not implemented", { stepKey })
                return new StepSubmissionResult()
            }

            // TODO(respostas-padrão): hoje retornamos um StepSubmissionResult vazio
            //   que PARECE sucesso tanto aqui (nenhuma conta casou) quanto no caso
            //   EmployeeAccount. Avaliar: (a) salvar respostas padrão num lugar único;
            //   (b) o próprio step/flow retornar um resultado discriminado de erro;
            //   ou (c) DTOs distintos entre camadas. Por ora é falha silenciosa.
            this.logger.error("submitStep: no account type matched", { stepKey })
            return new StepSubmissionResult()
        }, { stepKey })
    }

    private async checkReleaseGate(): Promise<EnrollmentStatus | null> {
        const toggles = await this.toggles.getToggles()
        if (!toggles.EnableRelease) {
            this.logger.info("getStatus: release gate closed, redirecting to webview")
            return new WebViewRedirectStatus()
        }
        return null
    }

    private async checkOrchestratorStatus(): Promise<EnrollmentStatus | null> {
        const res = await this.vrzRepository.getStatus()
        if (res?.FinancialProfile || res?.Household) {
            this.logger.info("getStatus: orchestrator already has data, redirecting to webview")
            return new WebViewRedirectStatus()
        }
        return null
    }

    private async checkEligibility(): Promise<EnrollmentStatus | null> {
        // TODO(segurança/AVE): verificar se o AVE consegue localizar o enrollment
        //   do cliente e qual o nível de cuidado com as informações enviadas ao
        //   AVE (PII, escopo, trust boundary). Ponto a explorar.
        // TODO(boolean-trap): `evaluate(false)` — o boolean `plan` é opaco;
        //   trocar por enum/objeto de opções com nome semântico.
        const eligibility = await this.es2Repository.evaluate(false)
        if (!eligibility.Eligibility) {
            this.logger.info("getStatus: client ineligible")
            return new IneligibleStatus()
        }
        return null
    }

    private async loadCurrentStepData(): Promise<EnrollmentStatus> {
        const step = this.piFlow.getCurrentStep()
        const data = await step.getPrevData()
        // TODO(modelagem): devolver um NativeStatus envolvendo `data` em vez do
        //   cast cego — ver digital-advisor.model.ts.
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
