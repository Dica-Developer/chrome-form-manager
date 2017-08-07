if (window == top) {
    chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
        switch(req.type) {
            case 'findForms':
                sendResponse(findForms());
                break;
            case 'applyPreset':
                applyPreset(req.inputs);
                break;
            default:
                sendResponse(null);
                break;
        }
    });
}

function findForms(send) {
    const inputElems = [...document.getElementsByTagName('input')];
    const textAreaElems = [...document.getElementsByTagName('textarea')];

    return [].concat(
            inputElems,
            textAreaElems
        ).map((elem) => {
            const { localName, type, value, id, className, disabled } = elem;
            const trimmedClassName = className.trim().replace(' ', '.');
            const concatedClassList = trimmedClassName.length === 0 ? '' : '.' + trimmedClassName;
            console.log(className, concatedClassList);

            if (type !== 'password' && type !== 'hidden' && !disabled) {
                return {
                    localName,
                    value,
                    id,
                    concatedClassList
                };
            }
        });
}

function applyPreset(inputs) {
    inputs.forEach(({ selector, value }) => {
        document.querySelector(selector).value = value;
    });
}
