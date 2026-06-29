export interface EnrollmentService {
    getStatus(evaluate: boolean): Promise<EnrollmentStatus>;
    // `payload: any` é uma fronteira de dispatch dinâmico por string-key — a
    // tipagem forte por step vive em PIStepTypeMap (ver pi-da-flow.ts).
    submitStep(stepKey: string, payload: any): Promise<StepSubmissionResult>;
}

// TODO(modelagem): hoje EnrollmentStatus/StepSubmissionResult são classes vazias.
//   Após JSON.stringify viram `{}`, então o consumidor NÃO distingue
//   webview-redirect / ineligible / native. Quando as estruturas forem
//   populadas, transformar em discriminated union com um campo discriminante
//   (ex.: `type: 'webview_redirect' | 'ineligible' | 'native'`) para sobreviver
//   à serialização. Ver digital-advisor.model.ts.
export class EnrollmentStatus {}

export class StepSubmissionResult {}
