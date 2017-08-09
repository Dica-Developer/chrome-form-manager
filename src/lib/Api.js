const tabs = chrome.tabs;
const storage = chrome.storage.sync;

function getCurrentTab() {
    return new Promise((resolve) => tabs.query({ active: true, currentWindow: true }, resolve));
}

function storeGet(url) {
    return new Promise((resolve) => storage.get(url, resolve));
}

function storeSet(name, data) {
    return new Promise((resolve) => storage.set({ [name]: data }, resolve));
}

function sendMessage(id, event) {
    return new Promise((resolve) => tabs.sendMessage(id, event, resolve));
}

class Api {
    construtor() {
        this.id = null;
        this.url = null;
        this.presets = null;
        this.name = '';

    }

    async init() {
        const tabInfo = await getCurrentTab()
        const { id, url } = tabInfo[0];
        const presets = await storeGet(url);

        this.id = id;
        this.url = url;
        this.presets = presets[url];
    }

    clearStorage() {
        storage.clear();
    }

    setName(name) {
        this.name = name;
    }

    hasPresets() {
        return Object.keys(this.presets).length > 0;
    }

    getPreset() {
        return this.presets[this.name] || {};
    }

    addPreset(data) {
        const { name } = data;

        this.presets[name] = data;
    }

    deletePreset() {
        delete this.presets[this.name];
    }

    updatePreset(data) {
        const newData = { ...this.presets[this.name], ...data };

        this.presets[this.name] = newData;
    }

    addOrUpdate(data) {
        const { name } = data;

        name === this.name ? this.updatePreset(data) : this.addPreset(data);
    }

    async applyPreset() {
        const { inputs } = this.presets[this.name];

        await sendMessage(this.id, { type: 'applyPreset', inputs })
    }

    async save() {
        await storeSet(this.url, this.presets);
    }

    async gatherValues() {
        return sendMessage(this.id, { type: 'findForms' });
    }
};

export default Api;
