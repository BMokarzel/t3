// Adapter OPCIONAL (SDK) para o orchestrator. Use este ou prove o seu próprio.
export class VRZRepository {
    async init() {
        return;
    }
    async finish() {
        return;
    }
    async getStatus() {
        return {};
    }
    // Antes: `return VRZRepository` devolvia a CLASSE, não uma instância.
    static create() {
        return new VRZRepository();
    }
}
//# sourceMappingURL=vrz.repository.js.map