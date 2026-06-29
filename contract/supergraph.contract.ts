export interface Supergraph {
    getClientInfo(): Promise<ClientInfo>
}

export class ClientInfo {
    // NOTA(casing): ver toggle.contract.ts.
    RetailAccount?: boolean
    EmployeeAccount?: boolean
}
