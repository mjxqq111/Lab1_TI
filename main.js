let cipherV = new VigenereCipher(
     "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ",
     "абвгдеёжзийклмнопрстуфхцчшщъыьэюя"
);
let cipherD = new DecimationCipher(
    "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ",
    "абвгдеёжзийклмнопрстуфхцчшщъыьэюя"
);
let cipher = null;

document.getElementById("encrRes").value = '';
document.getElementById("decrRes").value = '';
let encrInfoTextElem = document.getElementById("encrInfoTextElem");
let decrInfoTextElem = document.getElementById("decrInfoTextElem");
hideInfoText(encrInfoTextElem);
hideInfoText(decrInfoTextElem);

let encrKey = document.getElementById("encrKey");
let decrKey = document.getElementById("decrKey");

// Переключение шифров
let radioElems = document.getElementsByName("algSel");
for (let i = 0; i < radioElems.length; i++) {
    radioCheckAndSet(radioElems[i]);
    radioElems[i].addEventListener("change", (e) => { 
        radioCheckAndSet(e.currentTarget); 
    });
}

function radioCheckAndSet(r) {
    if (r.checked) {
        switch (r.value) {
            case "decimation":
                cipher = cipherD;
                break;
            case "vigenere":
                cipher = cipherV;
                break;
        }
    }
}

// Нажатие на кнопку шифрования
document.getElementById("encrBtn").addEventListener("click", () => {
    let encrRes = document.getElementById("encrRes");
    encrRes.value = '';
    const keyStr = document.getElementById("encrKey").value;
    const msgStr = document.getElementById("encrMsg").value;

    if (!setKeyAndMsg(cipher, keyStr, msgStr, encrInfoTextElem)) return;

    let res = cipher.encrypt();
    if (cipher.constructor.name == "VigenereCipher") {
        const newKey = VigenereCipher.getKey(cipher.key, cipher.msg);
        showInfoText(encrInfoTextElem, "Новый ключ: " + newKey);
    }
    encrRes.value = res;
});

function showInfoText(elem, text, color="black") {
    elem.innerText = text;
    elem.style.color = color;
    elem.hidden = false;
}

function hideInfoText(elem) {
    elem.hidden = true;
}

// Нажатие на кнопку дешифрования
document.getElementById("decrBtn").addEventListener("click", () => {
    let decrRes = document.getElementById("decrRes");
    decrRes.value = '';

    const keyStr = document.getElementById("decrKey").value;
    const msgStr = document.getElementById("decrCipher").value;

    if (!setKeyAndMsg(cipher, keyStr, msgStr, decrInfoTextElem)) return;

    if (cipher.constructor.name == "VigenereCipher") {
        if (cipher.key.length != cipher.msg.length) {
            showInfoText(decrInfoTextElem, "Ключ и шифротекст должны быть равной длины", "red");
            return;
        }
    }

    let res = cipher.decrypt();
    decrRes.value = res;
});

function setKeyAndMsg(cipher, keyStr, msgStr, infoTextElem) {
    // Установка ключа
    cipher.key = keyStr;
    switch (cipher.constructor.name) {
        case "DecimationCipher":
            if (cipher.hasError()) {
                showInfoText(infoTextElem, "Некорректный ключ", "red");
                return false;
            } else if (!cipher.keyMutPrime()) {
                showInfoText(infoTextElem, "Ключ должен быть взаимно простым с " + cipher.alph.length, "red");
                return false;
            }
            break;
        case "VigenereCipher":
            if (cipher.key == '') {
                showInfoText(infoTextElem, "Введите корректный ключ", "red");
                return false;
            }
            break;
    }

    // Установка сообщения
    cipher.msg = msgStr;
    if (cipher.msg == '') {
        showInfoText(infoTextElem, "Введите сообщение", "red");
        return false;
    }

    hideInfoText(infoTextElem);
    return true;
}

// Загрузка сообщения
document.getElementById("encrLoad").addEventListener("click", () => { loadFileTextTo("encrMsg"); });
document.getElementById("decrLoad").addEventListener("click", () => { loadFileTextTo("decrMsg"); });

function loadFileTextTo(id) {
    let filePicker = document.createElement("input");
    filePicker.type = "file";
    filePicker.onchange = () => {
        let pr = filePicker.files[0].text();
        pr.then((value) => {
            let element = document.getElementById(id);
            element.value = value;
            filePicker.remove();
        });
    };
    filePicker.click();
}

// Сохранение результата
document.getElementById("encrSave").addEventListener("click", () => { saveTextToFileFrom("encrRes") });
document.getElementById("decrSave").addEventListener("click", () => { saveTextToFileFrom("decrRes") });

function saveTextToFileFrom(id) {
    const text = document.getElementById(id).value;
    let blob = new Blob([text]);
    let fileSaver = document.createElement("a");
    fileSaver.setAttribute("download", "result.txt");
    const url = URL.createObjectURL(blob);
    fileSaver.setAttribute("href", url);
    fileSaver.click();
    setTimeout(() => {
        URL.revokeObjectURL(url);
        fileSaver.remove();
    }, 0);
}