import { EnrollmentStatus } from "../../contract/service.contract.js";
// TODO(modelagem): estes status são hoje classes vazias e indistinguíveis após
//   serialização (instanceof só funciona em processo). Quando forem populados,
//   migrar para discriminated union com campo discriminante. Ver service.contract.ts.
export class WebViewRedirectStatus extends EnrollmentStatus {
}
export class IneligibleStatus extends EnrollmentStatus {
}
// TODO(uso): NativeStatus ainda não é usado. O lugar natural é
//   DigitalAdvisorService.loadCurrentStepData, que hoje devolve os dados do step
//   crus (`data as EnrollmentStatus`); deveria envolvê-los num NativeStatus.
export class NativeStatus extends EnrollmentStatus {
}
//# sourceMappingURL=digital-advisor.model.js.map