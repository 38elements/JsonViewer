var json_viewer = {};
json_viewer._indent_width = 20;
json_viewer._id = 0;
json_viewer.root = "root";
json_viewer._data = {"name": "foo", "list":[1,{fff: 1, er:"ty"},2,3,4,5], "obj":{fff: 1, er:"ty"}};

json_viewer._put_object = function(data, parent_id, left, key, indent) {
        this._id += 1; 
        document.body.innerHTML += "<div data-state=\"1\" parent_id=\"" + parent_id + "\" id=\"" + this._id + "\" style=\"left:" + left + "px;\" data_type=\"Object\" ><div class=\"mark\">+</div><span class=\"key_value\">" + key + ":{}</span></div>"
        indent += 1
        var next_parent_id = this._id
        Object.keys(data).map(function(key) {
            this._put(data[key], indent, key, next_parent_id) 
        }, this)
}

json_viewer._put_array = function(data, parent_id, left, key, indent) {
        this._id += 1; 
        document.body.innerHTML += "<div data-state=\"1\"  parent_id=\"" + parent_id + "\" id=\"" + this._id + "\"  style=\"left:" + left + "px;\" data_type=\"Array\" ><div class=\"mark\">+</div><span class=\"key_value\">" + key + ":&nbsp;[]</span></div>"
        indent += 1
        var next_parent_id = this._id
        data.map(function(value, index) {
            this._put(value, indent, index, next_parent_id) 
        }, this)
}

json_viewer._put_string = function(data, parent_id, left, key) {
        this._id += 1; 
        document.body.innerHTML += "<div data-state=\"1\"  parent_id=\"" + parent_id + "\" id=\"" + this._id + "\" style=\"left:" + left + "px;\" data_type=\"String\" ><span class=\"key_value\">" + key + ":&nbsp;\"" + data + "\"</span></div>"
}

json_viewer._put_null = function(data, parent_id, left, key) {
        this._id += 1; 
        document.body.innerHTML += "<div data-state=\"1\"  parent_id=\"" + parent_id + "\" id=\"" + this._id + "\"  style=\"left:" + left + "px;\" data_type=\"null\" ><span class=\"key_value>\"" + key + ":&nbsp;null</span></div>"
}

json_viewer._put_undefined = function(data, parent_id, left, key) {
        this._id += 1; 
        document.body.innerHTML += "<div data-state=\"1\"  parent_id=\"" + parent_id + "\" id=\"" + this._id + "\"  style=\"left:" + left + "px;\" data_type=\"undefined\" ><span class=\"key_value\">" + key + ":&nbsp;undefined</span></div>"
}

json_viewer._put_number = function(data, parent_id, left, key) {
        this._id += 1; 
        document.body.innerHTML += "<div data-state=\"1\"  parent_id=\"" + parent_id + "\" id=\"" + this._id + "\"  style=\"left:" + left + "px;\" data_type=\"Number\" ><span class=\"key_value\">" + key + ":&nbsp;" + data + "</span></div>"
}

json_viewer._put = function(data, indent, key, parent_id) {
    key = key === undefined ? "": key;
    parent_id = parent_id === undefined ? this.root: parent_id;
    var left = this._indent_width * indent;
    if (data.toString() === "[object Object]") {
        this._put_object(data, parent_id, left, key, indent);
    }
    else if (Array.isArray(data)) {
        this._put_array(data, parent_id, left, key, indent);
    }
    else if (data.constructor === String) {
        this._put_string(data, parent_id, left, key);
    }
    else if (data === null) {
        this._put_null(data, parent_id, left, key);
    }
    else if (data === undefined) {
        this._put_undefined(data, parent_id, left, key);
    }
    else {
        this._put_number(data, parent_id, left, key);
    }
}

json_viewer._close = function() {
    var target_parent_id = this.id;
    var child_list = document.querySelectorAll("[parent_id=\"" + target_parent_id + "\"]");
    var children = Array.prototype.slice.call(child_list);
    this.dataset.state = "0";
    children.map(function(c){
        c.style.display = "none";
        c.dataset.state = "0";
        json_viewer._close.call(c);
    });
}

json_viewer.close_all = function() {
    var root =  document.querySelector("[parent_id=\"" + this.root + "\"]");
    this._close.call(root);
}

json_viewer._open = function() {
    var target_parent_id = this.id;
    var child_list = document.querySelectorAll("[parent_id=\"" + target_parent_id + "\"]");
    var children = Array.prototype.slice.call(child_list);
    this.dataset.state = "1";
    children.map(function(c){
        c.style.display = "block";
    });
}

json_viewer.change = function() {
    if (this.dataset.state === "1") {
        json_viewer._close.call(this);
    }
    else {
        json_viewer._open.call(this);
    }
}

json_viewer.display = function() {
    this._put(this._data, 0);
    child_list = document.querySelectorAll("[data_type=\"Object\"],[data_type=\"Array\"]");
    var children = Array.prototype.slice.call(child_list);
    children.map(function(c){
        c.addEventListener("click", json_viewer.change, false);
    });
}

json_viewer.display()
