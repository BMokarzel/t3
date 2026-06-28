export interface Supergraph {
    GetClientInfo(): Promise<ClientInfo>
}

export class ClientInfo {
    RetailAccount?: boolean
    EmployeeAccount?: boolean
}
