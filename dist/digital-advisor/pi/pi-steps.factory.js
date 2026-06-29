import { PIFinancialProfileStep } from "../../common/steps/pi-financial-profile.js";
// Catálogo canônico dos steps do fluxo PI (quais steps e em que ordem). Mantém o
// conhecimento de domínio DENTRO da library, enquanto o flow permanece magro e
// recebe o Map pronto — facilitando teste/override por step no consumidor.
export function createDefaultPISteps(aveRepository, pm5Repository, logger, trace) {
    return new Map([
        ["financial-profile", PIFinancialProfileStep.create(aveRepository, pm5Repository, logger, trace)],
    ]);
}
//# sourceMappingURL=pi-steps.factory.js.map