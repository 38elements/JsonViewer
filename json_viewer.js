var json_viewer = {};
var id = 0
var indent_width = 20
json_viewer._data = {"name": "foo", "list":[1,{fff: 1, er:"ty"},2,3,4,5], "obj":{fff: 1, er:"ty"}};
json_viewer._put = function(data, indent, key) {
    key = key === undefined ? "": key;
    var left = indent_width * indent;
    if (data.toString() === "[object Object]") {
        document.body.innerHTML += "<div style=\"left:" + left + "px;\">" + key + ":{}</div>"
        var put = json_viewer._put.bind(this)
        indent += 1
        Object.keys(data).map(function(key) {
            put(data[key], indent, key) 
        })
    }
    else if (Array.isArray(data)) {
        document.body.innerHTML += "<div style=\"left:" + left + "px;<div\">" + key + ":[]</div>"
        var put = json_viewer._put.bind(this)
        indent += 1
        data.map(function(value, index) {
            put(value, indent, index) 
        })
    }
    else if (data.constructor === String) {
        document.body.innerHTML += "<div style=\"left:" + left + "px;\">" + key + ":\"" + data + "\"</div>"
    }
    else if (data === null) {
        document.body.innerHTML += "<div style=\"left:" + left + "px;\">" + key + ":null</div>"
    }
    else if (data === undefined) {
        document.body.innerHTML += "<div style=\"left:" + left + "px;\">" + key + ":undefined</div>"
    }
    else {
        document.body.innerHTML += "<div style=\"left:" + left + "px;\">" + key + ":" + data + "</div>"
    }
}

json_viewer.display = function() {
    this._put(this._data, 0);
}

