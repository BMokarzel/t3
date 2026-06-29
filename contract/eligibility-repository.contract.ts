export class EligibilityScreenerResponse {
    // NOTA(casing): ver toggle.contract.ts.
    Eligibility?: boolean
}

export interface EligibilityScreenerRepository {
    // TODO(boolean-trap): `plan: boolean` é opaco — trocar por enum/objeto de
    //   opções com nome semântico.
    evaluate(plan: boolean): Promise<EligibilityScreenerResponse>;
}
