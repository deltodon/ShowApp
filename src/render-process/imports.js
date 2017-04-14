const links = document.querySelectorAll('link[rel="import"]')

// function initView(link) {
//     let template = link.import.getElementById('view-template');
//     let clone = document.importNode(template.content, true);
//     document.getElementById('view-main').appendChild(clone);
// }

// Import and add each section page to the DOM
Array.prototype.forEach.call(links, function (link) {
    let template = link.import.querySelector('.task-template');
    let clone = document.importNode(template.content, true);
    document.getElementById('main').appendChild(clone);
});

// initView(links);