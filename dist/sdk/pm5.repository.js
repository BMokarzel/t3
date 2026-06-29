// Adapter OPCIONAL (SDK). O PM5 é usado como repositório de step (submit/get) no
// PIFinancialProfileStep. O consumidor pode usar este ou prover o seu próprio.
export class PM5Repository {
    // TODO(stub): implementar persistência real no PM5.
    async submit(_payload) {
        return;
    }
    async get() {
        return {};
    }
    // Antes: `return PM5Repository` devolvia a CLASSE, não uma instância.
    static create() {
        return new PM5Repository();
    }
}
//# sourceMappingURL=pm5.repository.js.map