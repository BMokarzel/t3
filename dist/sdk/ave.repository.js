// Adapter OPCIONAL (SDK). O AVE é usado como repositório de step (submit/get) no
// PIFinancialProfileStep. O consumidor pode usar este ou prover o seu próprio.
export class AVERepository {
    // TODO(stub): implementar persistência real no AVE.
    async submit(_payload) {
        return;
    }
    async get() {
        return {};
    }
    // Antes: `return AVERepository` devolvia a CLASSE, não uma instância.
    static create() {
        return new AVERepository();
    }
}
//# sourceMappingURL=ave.repository.js.map