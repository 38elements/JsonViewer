var json_viewer = {};
var indent_width = 20;
json_viewer._id = 0;
json_viewer._data = {"name": "foo", "list":[1,{fff: 1, er:"ty"},2,3,4,5], "obj":{fff: 1, er:"ty"}};
json_viewer._put = function(data, indent, key, parent_id) {
    key = key === undefined ? "": key;
    parent_id = parent_id === undefined ? "": parent_id;
    var left = indent_width * indent;
    if (data.toString() === "[object Object]") {
        this._id += 1; 
        document.body.innerHTML += "<div parent_id=\"" + parent_id + "\" id=\"" + this._id + "\" style=\"left:" + left + "px;\">" + key + ":{}</div>"
        indent += 1
        var next_parent_id = this._id
        Object.keys(data).map(function(key) {
            this._put(data[key], indent, key, next_parent_id) 
        }, this)
    }
    else if (Array.isArray(data)) {
        this._id += 1; 
        document.body.innerHTML += "<div parent_id=\"" + parent_id + "\" id=\"" + this._id + "\"  style=\"left:" + left + "px;<div\">" + key + ":[]</div>"
        indent += 1
        var next_parent_id = this._id
        data.map(function(value, index) {
            this._put(value, indent, index, next_parent_id) 
        }, this)
    }
    else if (data.constructor === String) {
        this._id += 1; 
        document.body.innerHTML += "<div parent_id=\"" + parent_id + "\" id=\"" + this._id + "\" style=\"left:" + left + "px;\">" + key + ":\"" + data + "\"</div>"
    }
    else if (data === null) {
        this._id += 1; 
        document.body.innerHTML += "<div parent_id=\"" + parent_id + "\" id=\"" + this._id + "\"  style=\"left:" + left + "px;\">" + key + ":null</div>"
    }
    else if (data === undefined) {
        this._id += 1; 
        document.body.innerHTML += "<div parent_id=\"" + parent_id + "\" id=\"" + this._id + "\"  style=\"left:" + left + "px;\">" + key + ":undefined</div>"
    }
    else {
        this._id += 1; 
        document.body.innerHTML += "<div parent_id=\"" + parent_id + "\" id=\"" + this._id + "\"  style=\"left:" + left + "px;\">" + key + ":" + data + "</div>"
    }
}

json_viewer.display = function() {
    this._put(this._data, 0);
}

json_viewer.display()
