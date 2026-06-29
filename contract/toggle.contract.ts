export interface TogglesInterface {
    getToggles(): Promise<Toggles>
}

export class Toggles {
    // NOTA(casing): campos de DTO mantidos em PascalCase por possivelmente
    //   espelharem o wire format externo. Padronizar se forem internos.
    EnableRelease?: boolean
}
