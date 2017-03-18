var projectObj = {
    path: "",
    data: {
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
    }
};




module.exports.projectTemplate = function () {
    let temp = projectObj;
    return temp;
}