import findIndex from 'lodash/fp/findIndex';
import './popup.less';

let tabInfo = null;
let presets = null;
let inputs = null;
let currentPreset = null;

function isEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

function removeAllChildNodes(parent) {
    if (parent.hasChildNodes()) {
        let node = parent.firstChild;

        for (; node; node = node.nextSibling) {
            parent.removeChild(node);
        }
    }
}

function createOptionElement(value) {
    let option = document.createElement('option');
    let optionText = document.createTextNode(value);

    option.value = value;
    option.append(optionText);

    return option;
}

function getTabInfo() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const { id, url } = tabs[0];

            chrome.tabs.sendMessage(id, { type: 'findForms' }, function(inputElems) {
                tabInfo = {id, url, inputElems};
                resolve();
            });
        });
    });
}

function getStoredPresets() {
    const { url } = tabInfo;
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(url, (result) => {
            console.log(result);
            presets = result;
            resolve();
        });
    });
}

function savePreset() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set(presets, resolve);
    });
}

function fillPresetSelect() {
    const { url } = tabInfo;
    const select = document.getElementById('presets');

    removeAllChildNodes(select);

    if(isEmpty(presets)) {
        const option = createOptionElement('No presets available');

        select.append(option);
        select.disabled = true;
    } else {
        const option = createOptionElement('Please Select');

        select.append(option);

        presets[url].forEach((preset) => {
            const { name } = preset;
            const option = createOptionElement(name);

            select.append(option);
        });

    }

}

function preparePreset() {
    const { inputElems, url } = tabInfo;
    const nameInput = document.getElementById('name');
    const desctiptionElem = document.getElementById('description');
    const name = nameInput.value;
    const description = desctiptionElem.value;

    return new Promise((resolve, reject) => {
        if (!presets[url]) {
            presets[url] = [];
        }

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
        const existingPresetIndex = findIndex({ name }, presets[url]);

        if (existingPresetIndex === -1) {
            presets[url].push(preset);
            resolve();
            return;
        }

        presets[url][existingPresetIndex] = preset;
        resolve();
    });
}

function applyPreset() {
    const { url, id } = tabInfo;
    const { inputs } = currentPreset;

    chrome.tabs.sendMessage(id, { type: 'applyPreset', inputs }, () => {})
}

function fillDescription() {
    const { description } = currentPreset;
    const descriptionCon = document.getElementById('description');

    const descTextNode = document.createTextNode(description || '');

    removeAllChildNodes(descriptionCon);
    descriptionCon.append(descTextNode);
}

function fillName() {
    const { name } = currentPreset;
    const nameCon = document.getElementById('name');

    nameCon.value = name ? name : '';
}

function toggleApplyButton(disabled) {
    const button = document.getElementById('apply');

    button.disabled = disabled;
}

function togglePresetButtons(show) {
    const updateBtn = document.getElementById('update');
    const deleteBtn = document.getElementById('delete');

    updateBtn.style.display = show ? 'block' : 'none';
    deleteBtn.style.display = show ? 'block' : 'none';
}

function showPresetDetails(event) {
    const presetName = event.currentTarget.value;

    if (presetName === 'Please Select') {
        togglePresetButtons(false);
        toggleApplyButton(true);
        currentPreset = null;
        return;
    }

    const { url, id } = tabInfo;
    const preset = presets[url].filter((obj) => obj.name === presetName)[0];

    currentPreset = { ...preset };

    fillName();
    fillDescription();
    toggleApplyButton(false);
    togglePresetButtons(true);
}

function saveUpdatePreset() {
    getTabInfo()
        .then(preparePreset)
        .then(savePreset)
        .then(window.close);
}

function init() {
    getTabInfo()
        .then(getStoredPresets)
        .then(fillPresetSelect);

    let clearButton = document.getElementById('clear');
    let saveButton = document.getElementById('save');
    let presetsSelect = document.getElementById('presets');
    let updateBtn = document.getElementById('update');
    let applyBtn = document.getElementById('apply');

    clearButton.addEventListener('click', () => {
        chrome.storage.sync.clear(() => console.log('Storage empty'));
    });

    saveButton.addEventListener('click', saveUpdatePreset);
    updateBtn.addEventListener('click', saveUpdatePreset);

    presetsSelect.addEventListener('change', showPresetDetails);
    applyBtn.addEventListener('click', applyPreset);
}

window.onload = init;
