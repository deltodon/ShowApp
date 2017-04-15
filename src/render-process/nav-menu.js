const ipc = require('electron').ipcRenderer;

const saveButton = document.getElementById('btn-save');
const projectsButton = document.getElementById('btn-projects');
const contentButton = document.getElementById('btn-content');
const previewButton = document.getElementById('btn-preview');
const settingsButton = document.getElementById('btn-settings');



//------------------------------------------------------------------------------

saveButton.addEventListener('click', function (event) {
    // hideAllSections();
    // document.getElementById('home-section').classList.add('is-shown');
});

projectsButton.addEventListener('click', function (event) {
    hideAllSections();
    document.getElementById('projects-section').classList.add('is-shown');
});

contentButton.addEventListener('click', function (event) {
    hideAllSections();
    document.getElementById('content-section').classList.add('is-shown');
});


previewButton.addEventListener('click', function (event) {
    $("#wrapper").hide();
    $("#view-main").show();
    ipc.send('preview-on');
});

ipc.on('preview-off', function() {
    $("#view-main").hide();
    $("#wrapper").show(); 
});


settingsButton.addEventListener('click', function (event) {
    hideAllSections();
    document.getElementById('settings-section').classList.add('is-shown');
});

activateDefaultSection();

//------------------------------------------------------------------------------

function hideAllSections () {
  const sections = document.querySelectorAll('.section.is-shown')
  Array.prototype.forEach.call(sections, function (section) {
    section.classList.remove('is-shown');
  });
};

//------------------------------------------------------------------------------ 

function activateDefaultSection () {
  projectsButton.click();
}



// 80 //////////////////////////////////////////////////////////////////////////

