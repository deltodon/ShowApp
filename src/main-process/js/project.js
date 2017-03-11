

module.exports.createProject = function() {
    var data = {
        header: {
            student: "name",
            title: "dissertation",
            cover: "image/path/pic.jpg"
        },
        entry: [
            {
                path: "Alex",
                text: true
            },
            {
                path: "Billy",
                text: false
            }
        ]
    };

    return data;
}