// TODO(modelagem): hoje EnrollmentStatus/StepSubmissionResult são classes vazias.
//   Após JSON.stringify viram `{}`, então o consumidor NÃO distingue
//   webview-redirect / ineligible / native. Quando as estruturas forem
//   populadas, transformar em discriminated union com um campo discriminante
//   (ex.: `type: 'webview_redirect' | 'ineligible' | 'native'`) para sobreviver
//   à serialização. Ver digital-advisor.model.ts.
export class EnrollmentStatus {
}
export class StepSubmissionResult {
}
//# sourceMappingURL=service.contract.js.map