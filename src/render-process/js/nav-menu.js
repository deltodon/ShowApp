const electron = require('electron').remote;
const BrowserWindow = electron.BrowserWindow;
const dialog = electron.dialog;
const path = require('path');

const previewWindowBtn = document.getElementById('btn-preview');

previewWindowBtn.addEventListener('click', function (event) {
//   const modalPath = path.join('file://', __dirname, '../../sections/windows/modal.html')
//   let win = new BrowserWindow({ width: 400, height: 320 })
//   win.on('close', function () { win = null })
//   win.loadURL(modalPath)
//   win.show()
    dialog.showMessageBox({
        message: 'Preview Window',
        buttons: []
    });
});


