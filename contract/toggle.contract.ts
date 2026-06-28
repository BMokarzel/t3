export interface TogglesInterface {
    GetToggles(): Promise<Toggles>
}

export class Toggles {
    EnableRelease?: boolean
}
