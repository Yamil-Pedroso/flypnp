interface SetInLocalStorage {
    (key: string, value: string): void;
}

export const setItemsInLocalStorage: SetInLocalStorage = (key, value) => {
    if(!key || !value) {
        throw new Error("Cannot set localStorage key/value without valid key/value");
    }

    const valueToStore = typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, valueToStore);
}

interface GetFromLocalStorage {
    (key: string): string | null;
}

export const getItemsFromLocalStorage: GetFromLocalStorage = (key) => {
    if(!key) {
        throw new Error("Cannot get localStorage value without valid key");
    }

    const value = localStorage.getItem(key);
    return value;
}

interface RemoveFromLocalStorage {
    (key: string): void;
}

export const removeItemFromLocalStorage: RemoveFromLocalStorage = (key) => {
    if(!key) {
        throw new Error("Cannot remove localStorage value without valid key");
    }

    localStorage.removeItem(key);
}
