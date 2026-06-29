import { StepSubmissionResult } from "../contract/service.contract.js";
import { IneligibleStatus, WebViewRedirectStatus } from "./model/digital-advisor.model.js";
export class DigitalAdvisorService {
    piFlow;
    es2Repository;
    vrzRepository;
    toggles;
    supergraph;
    logger;
    trace;
    constructor(piFlow, 
    // private readonly vwsFlow: EnrollmentFlow,
    es2Repository, vrzRepository, toggles, supergraph, logger, trace) {
        this.piFlow = piFlow;
        this.es2Repository = es2Repository;
        this.vrzRepository = vrzRepository;
        this.toggles = toggles;
        this.supergraph = supergraph;
        this.logger = logger;
        this.trace = trace;
    }
    async getStatus(evaluate) {
        return this.trace.withSpan("DigitalAdvisorService.getStatus", async () => {
            // NOTA: a execução é sequencial DE PROPÓSITO (regra de negócio) — cada
            // gate evita chamadas desnecessárias às etapas seguintes.
            // TODO(perf): cronometrar o tempo de resposta do VRZ (checkOrchestratorStatus)
            //   para confirmar que o ganho de curto-circuito compensa a latência serial.
            const gate = await this.checkReleaseGate();
            if (gate)
                return gate;
            const inflight = await this.checkOrchestratorStatus();
            if (inflight)
                return inflight;
            if (evaluate) {
                const ineligible = await this.checkEligibility();
                if (ineligible)
                    return ineligible;
            }
            return await this.loadCurrentStepData();
        }, { evaluate });
    }
    async submitStep(stepKey, payload) {
        return this.trace.withSpan("DigitalAdvisorService.submitStep", async () => {
            // TODO(perf/cache): getClientInfo é chamado a cada submitStep. Seria
            //   interessante cachear essa informação (por sessão/request) para evitar
            //   um round-trip por submit.
            const clientInfo = await this.supergraph.getClientInfo();
            if (clientInfo.RetailAccount) {
                return await this.piFlow.submitStep(stepKey, payload);
            }
            if (clientInfo.EmployeeAccount) {
                // TODO: rotear para VWS flow quando disponível
                this.logger.info("submitStep: EmployeeAccount flow not implemented", { stepKey });
                return new StepSubmissionResult();
            }
            // TODO(respostas-padrão): hoje retornamos um StepSubmissionResult vazio
            //   que PARECE sucesso tanto aqui (nenhuma conta casou) quanto no caso
            //   EmployeeAccount. Avaliar: (a) salvar respostas padrão num lugar único;
            //   (b) o próprio step/flow retornar um resultado discriminado de erro;
            //   ou (c) DTOs distintos entre camadas. Por ora é falha silenciosa.
            this.logger.error("submitStep: no account type matched", { stepKey });
            return new StepSubmissionResult();
        }, { stepKey });
    }
    async checkReleaseGate() {
        const toggles = await this.toggles.getToggles();
        if (!toggles.EnableRelease) {
            this.logger.info("getStatus: release gate closed, redirecting to webview");
            return new WebViewRedirectStatus();
        }
        return null;
    }
    async checkOrchestratorStatus() {
        const res = await this.vrzRepository.getStatus();
        if (res?.FinancialProfile || res?.Household) {
            this.logger.info("getStatus: orchestrator already has data, redirecting to webview");
            return new WebViewRedirectStatus();
        }
        return null;
    }
    async checkEligibility() {
        // TODO(segurança/AVE): verificar se o AVE consegue localizar o enrollment
        //   do cliente e qual o nível de cuidado com as informações enviadas ao
        //   AVE (PII, escopo, trust boundary). Ponto a explorar.
        // TODO(boolean-trap): `evaluate(false)` — o boolean `plan` é opaco;
        //   trocar por enum/objeto de opções com nome semântico.
        const eligibility = await this.es2Repository.evaluate(false);
        if (!eligibility.Eligibility) {
            this.logger.info("getStatus: client ineligible");
            return new IneligibleStatus();
        }
        return null;
    }
    async loadCurrentStepData() {
        const step = this.piFlow.getCurrentStep();
        const data = await step.getPrevData();
        // TODO(modelagem): devolver um NativeStatus envolvendo `data` em vez do
        //   cast cego — ver digital-advisor.model.ts.
        return data;
    }
    static create(piFlow, es2Repository, vrzRepository, toggles, supergraph, logger, trace) {
        return new DigitalAdvisorService(piFlow, es2Repository, vrzRepository, toggles, supergraph, logger, trace);
    }
}
//# sourceMappingURL=digital-advisor.service.js.map