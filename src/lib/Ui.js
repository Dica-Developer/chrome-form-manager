import {
    byId,
    removeAllChildNodes,
    createOptionElement
} from './dom';

class Ui {
    constructor(api) {
        this.api = api;
        this.clearBtn = byId('clear');
        this.saveBtn = byId('save');
        this.updateBtn = byId('update');
        this.applyBtn = byId('apply');
        this.deleteBtn = byId('delete');
        this.presetsSelect = byId('presets');
        this.nameField = byId('name');
        this.descriptionField = byId('description');

        this.saveUpdate = this.saveUpdate.bind(this);
        this.showPresetDetails = this.showPresetDetails.bind(this);
        this.applyPreset = this.applyPreset.bind(this);

        this.clearBtn.addEventListener('click', this.api.clearStorage);
        this.saveBtn.addEventListener('click', this.saveUpdate);
        this.updateBtn.addEventListener('click', this.saveUpdate);
        this.presetsSelect.addEventListener('change', this.showPresetDetails);
        this.applyBtn.addEventListener('click', this.applyPreset);
    }

    fillPresetSelect() {
        removeAllChildNodes(this.presetsSelect);

        if(this.api.hasPresets()) {
            const option = createOptionElement('Please Select');

            this.presetsSelect.append(option);

            Object.keys(this.api.presets).forEach((name) => {
                const option = createOptionElement(name);

                this.presetsSelect.append(option);
            });
        } else {
            const option = createOptionElement('No presets available');

            this.presetsSelect.append(option);
            this.presetsSelect.disabled = true;
        }

    }

    saveUpdate() {
        this.gatherInformation()
            .then(this.api.addOrUpdate.bind(this.api))
            .then(this.api.save.bind(this.api))
            .then(window.close);
    }

    showPresetDetails(event) {
        const presetName = event.currentTarget.value;
        const isPresetName = presetName !== 'Please Select';

        this.api.setName(presetName);

        const { name, description } = this.api.getPreset();

        this.applyBtn.disabled = !isPresetName;
        this.updateBtn.style.display = isPresetName ? 'block' : 'none';
        this.deleteBtn.style.display = isPresetName ? 'block' : 'none';
        this.nameField.value = name || '';
        this.descriptionField.value = description || '';
    }

    applyPreset() {
        this.api.applyPreset()
            .then(window.close);
    }

    async gatherInformation() {
        const name = this.nameField.value;
        const description = this.descriptionField.value;
        const data = await this.api.gatherValues();

        const inputs = data.map((input) => {
            const { localName, id, concatedClassList, value } = input;

            return {
                selector: `${localName}#${id}${concatedClassList}`,
                value
            };
        });

        return {
            name,
            description,
            inputs
        };
    }
};

export default Ui;
