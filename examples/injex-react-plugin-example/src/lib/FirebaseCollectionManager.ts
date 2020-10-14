export default abstract class FirebaseCollectionManager<T extends { id: string; }> {

    protected abstract get collectionName(): string;

    protected get collection() {
        return window.firebase.firestore().collection(this.collectionName);
    }

    protected async resolveDoc(id: string): Promise<T> {
        const doc = await this.collection.doc(id).get();
        return doc.data();
    }

    public async create(data: T): Promise<T> {
        await this.collection.doc(data.id).set(data);

        return data;
    }

    public async getAllById(ids: string[]): Promise<T[]> {
        const data = await this.collection.where(
            "id",
            "in",
            ids
        ).get();

        return data.docs.map(doc => doc.data());
    }

    public async getById(id: string): Promise<T> {
        const data = await this.resolveDoc(id);

        if (data) {
            data["id"] = id;
        }

        return data;
    }
}