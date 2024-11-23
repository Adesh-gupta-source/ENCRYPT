// script.js

const MASTER_KEY = 'myhiddenmasterkey'; // Hidden master key
let fileList = [];

// Load the file list and check for theme preference
window.onload = function() {
    loadFileList();
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.getElementById("themeSwitch").checked = true;
        document.body.classList.add("dark");
        document.querySelector(".container").classList.add("dark");
    }
};
// Toggle theme function
function toggleTheme() {
    const isDark = document.getElementById("themeSwitch").checked;

    if (isDark) {
        document.body.classList.add("dark");
        // document.querySelector(".container").classList.add("dark");
        localStorage.setItem("theme", "dark");
    } else {
        document.body.classList.remove("dark");
        document.querySelector(".container").classList.remove("dark");
        localStorage.setItem("theme", "light");
    }
}
// Function to extend key to match message length
function extendKey(key, messageLength) {
    let extendedKey = '';
    for (let i = 0; i < messageLength; i++) {
        extendedKey += key[i % key.length];
    }
    return extendedKey;
}

// Function to encrypt message using Vigenère cipher
function encryptMessage() {
    const message = document.getElementById("encryptMessage").value;
    const key = document.getElementById("encryptKey").value;

    if (key.match(/\d/)) {
        alert("Key must be non-numeric!");
        return;
    }

    let encryptedMessage = '';
    let extendedKey = extendKey(key, message.length);

    for (let i = 0; i < message.length; i++) {
        const messageChar = message[i];
        const keyChar = extendedKey[i];

        if (messageChar.match(/[a-z]/)) {
            encryptedMessage += String.fromCharCode((messageChar.charCodeAt(0) - 97 + (keyChar.charCodeAt(0) - 97)) % 26 + 97);
        } else if (messageChar.match(/[A-Z]/)) {
            encryptedMessage += String.fromCharCode((messageChar.charCodeAt(0) - 65 + (keyChar.charCodeAt(0) - 65)) % 26 + 65);
        } else {
            encryptedMessage += messageChar;
        }
    }

    document.getElementById("encryptedResult").value = encryptedMessage;

    // Create Blob for download
    const downloadLink = document.getElementById("downloadLink");
    const blob = new Blob([encryptedMessage], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.style.display = 'block';
    downloadLink.download = "encoded_message.encode";  // Set filename for the download
}

// Save the encrypted message to a virtual file (localStorage based)
function saveEncryptedFile() {
    const encryptedMessage = document.getElementById("encryptedResult").value;

    if (!encryptedMessage) {
        alert("No encrypted message to save!");
        return;
    }

    const filename = `encoded_message_${fileList.length + 1}.encode`;
    localStorage.setItem(filename, encryptedMessage);
    fileList.push(filename);
    updateFileList();
}

// Update the file dropdown list
function updateFileList() {
    const fileSelect = document.getElementById("fileList");
    fileSelect.innerHTML = ''; // Clear the current list

    fileList.forEach((file) => {
        let option = document.createElement("option");
        option.text = file;
        option.value = file;
        fileSelect.add(option);
    });
}

// Load file list from local storage
function loadFileList() {
    fileList = Object.keys(localStorage).filter(key => key.startsWith('encoded_message_'));
    updateFileList();
}
// Decrypt the selected file
function decryptMessage() {
    const selectedFile = document.getElementById("fileList").value;
    const key = document.getElementById("decryptKey").value;
    let encryptedMessage = localStorage.getItem(selectedFile);
    
    if (key === MASTER_KEY) {
        alert("Master key accepted. Decrypting...");
    }

    if (!encryptedMessage) {
        alert("No encrypted message found!");
        return;
    }

    let decryptedMessage = '';
    let extendedKey = extendKey(key, encryptedMessage.length);

    for (let i = 0; i < encryptedMessage.length; i++) {
        const encryptedChar = encryptedMessage[i];
        const keyChar = extendedKey[i];

        if (encryptedChar.match(/[a-z]/)) {
            decryptedMessage += String.fromCharCode((encryptedChar.charCodeAt(0) - 97 - (keyChar.charCodeAt(0) - 97) + 26) % 26 + 97);
        } else if (encryptedChar.match(/[A-Z]/)) {
            decryptedMessage += String.fromCharCode((encryptedChar.charCodeAt(0) - 65 - (keyChar.charCodeAt(0) - 65) + 26) % 26 + 65);
        } else {
            decryptedMessage += encryptedChar;
        }
    }

    document.getElementById("decryptedResult").value = decryptedMessage;
}

