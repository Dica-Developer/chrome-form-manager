export const byId = (id) => document.getElementById(id);

export const removeAllChildNodes = (parent) => {
    if (parent.hasChildNodes()) {
        let node = parent.firstChild;

        for (; node; node = node.nextSibling) {
            parent.removeChild(node);
        }
    }
};

export const createOptionElement = (value) => {
    let option = document.createElement('option');
    let optionText = document.createTextNode(value);

    option.value = value;
    option.append(optionText);

    return option;
}
