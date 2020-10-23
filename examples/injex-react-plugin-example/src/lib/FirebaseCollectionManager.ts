export default abstract class FirebaseCollectionManager<T extends { id: string }> {

    private _cache: {
        [index: string]: { created: number; value: T };
    };

    constructor() {
        this._cache = {};
    }

    protected get cacheTTL(): number {
        return 1000 * 60 * 10;
    }

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

        return data.docs.map(doc => {
            const item = doc.data();
            this._setCache(item.id, item);
            return item;
        });
    }

    public async getById(id: string): Promise<T> {
        const fromCache = this._getFromCache(id);

        if (fromCache) {
            return fromCache;
        }

        const data = await this.resolveDoc(id);

        if (data) {
            data["id"] = id;
            this._setCache(id, data);
        }

        return data;
    }

    private _setCache(id: string, value: T) {
        this._cache[id] = {
            created: Date.now(),
            value
        };
    }

    private _getFromCache(id: string): T {
        const fromCache = this._cache[id];

        if (fromCache && Date.now() - fromCache.created < this.cacheTTL) {
            return fromCache.value;
        }

        return null;
    }
}