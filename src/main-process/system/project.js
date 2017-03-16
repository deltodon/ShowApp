




module.exports.projectTemplate = function () {
    let temp = {
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
    return temp;
}