// Adapter OPCIONAL (SDK) para o eligibility screener. Use este ou prove o seu.
export class ES2Repository {
    // `_plan` opaco — ver TODO(boolean-trap) no contrato/serviço.
    async evaluate(_plan) {
        return {};
    }
    // Antes: `return ES2Repository` devolvia a CLASSE, não uma instância.
    static create() {
        return new ES2Repository();
    }
}
//# sourceMappingURL=es2.repository.js.map