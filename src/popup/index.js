import Api from '../lib/Api';
import Ui from '../lib/Ui';
import './popup.scss';

let tabInfo = null;
let presets = {};
let inputs = null;
let currentPreset = null;

function preparePreset() {
    const { inputElems, url } = tabInfo;
    const nameInput = document.getElementById('name');
    const desctiptionElem = document.getElementById('description');
    const name = nameInput.value;
    const description = desctiptionElem.value;

    return new Promise((resolve, reject) => {
        presets[name] = presets[name] || {};
        inputs = inputElems.map((elem) => {
            const { localName, id, concatedClassList, value } = elem;

            return {
                selector: `${localName}#${id}${concatedClassList}`,
                value
            };
        });

        const preset = {
            name,
            description,
            inputs
        };

        presets[name] = preset;
        resolve();
    });
}

function saveUpdatePreset() {
    getTabInfo()
        .then(preparePreset)
        .then(savePreset)
        .then(window.close);
}

function init() {
    const api = new Api();

    api.init()
        .then(() => {
            const ui = new Ui(api);

            ui.fillPresetSelect();
            console.log(ui);
        });
}

window.onload = init;
