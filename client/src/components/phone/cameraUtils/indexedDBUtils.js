const dbName = "CameraAppDB";
const storeName = "PhotosStore";

export const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
        };

        request.onerror = (event) => {
            reject(`Database error: ${event.target.errorCode}`);
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    });
};

export const addPhoto = async (photoData) => {
    const db = await initDB();
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    store.add({ timestamp: new Date().toISOString(), data: photoData });

    transaction.oncomplete = () => db.close();
};

export const getPhotos = async () => {
    const db = await initDB();
    return new Promise((resolve) => {
        const transaction = db.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result);
            db.close();
        };
    });
};

export const deletePhoto = async (id) => {
    const db = await initDB();
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    store.delete(id);

    transaction.oncomplete = () => db.close();
};
