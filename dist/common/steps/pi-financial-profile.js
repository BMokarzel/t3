export class ClientFinancialProfileData {
    Name;
}
export class PartnerFinancialProfileData {
    Name;
}
export class PIFinancialProfileOutput {
}
export class PIFinancialProfileStep {
    aveRepository;
    pm5Repository;
    logger;
    trace;
    constructor(aveRepository, pm5Repository, logger, trace) {
        this.aveRepository = aveRepository;
        this.pm5Repository = pm5Repository;
        this.logger = logger;
        this.trace = trace;
    }
    validate(payload) {
        return [
            { Name: payload.Name },
            { Name: payload.PartnerName },
        ];
    }
    // TODO(erros): validate só normaliza; precisa retornar os erros de intake
    //   padronizados para que o step/serviço consiga descrever o fluxo e o step
    //   atual ao consumidor. Casa com a taxonomia de erros a definir.
    async submit(payload) {
        const [clientData, partnerData] = this.validate(payload);
        try {
            await Promise.all([
                this.aveRepository.submit(clientData),
                this.pm5Repository.submit(partnerData),
            ]);
        }
        catch (err) {
            // Antes: `this.logger.Error()` descartava a causa raiz.
            // TODO(logs/PII): incluir contexto rico após o alinhamento com as
            //   libs de logs — ATENÇÃO a PII (Name/PartnerName) ao logar; definir
            //   política de redação antes de logar payload/dados do cliente.
            this.logger.error("PIFinancialProfileStep.submit failed", { err });
            throw err;
        }
    }
    async getPrevData() {
        // Cast explícito: o repo é stub tipado como `unknown`. Tipar o repo
        // concretamente (<_, PIFinancialProfileOutput>) remove o cast quando as
        // estruturas forem populadas.
        const res = await this.aveRepository.get();
        return res;
    }
    static create(aveRepository, pm5Repository, logger, trace) {
        return new PIFinancialProfileStep(aveRepository, pm5Repository, logger, trace);
    }
}
//# sourceMappingURL=pi-financial-profile.js.map