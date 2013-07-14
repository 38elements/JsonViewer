var json_viewer = {};
json_viewer._indent_width = 27;
json_viewer._id = 0;
json_viewer.root = 'root';
json_viewer.output = document.getElementById('output');
json_viewer.search_key_elem = document.getElementById('search_key');

json_viewer.closed_inner_object_template = Hogan.compile(document.getElementById('closed_inner_put_object').innerText);
json_viewer.opened_inner_object_template = Hogan.compile(document.getElementById('opened_inner_put_object').innerText);
json_viewer.opened_before_put_object_template = Hogan.compile(document.getElementById('before_put_object').innerText);
json_viewer.after_put_object_template = Hogan.compile(document.getElementById('after_put_object').innerText);
json_viewer.closed_inner_array_template = Hogan.compile(document.getElementById('closed_inner_put_array').innerText);
json_viewer.opened_inner_array_template = Hogan.compile(document.getElementById('opened_inner_put_array').innerText);
json_viewer.before_put_array_template = Hogan.compile(document.getElementById('before_put_array').innerText);
json_viewer.after_put_array_template = Hogan.compile(document.getElementById('after_put_array').innerText);
json_viewer._put_string_template = Hogan.compile(document.getElementById('_put_string').innerText);
json_viewer._put_number_template = Hogan.compile(document.getElementById('_put_number').innerText);

json_viewer._put_object = function(data, parent_id, left, key, indent) {
        this._id += 1; 
        var is_not_root = this._id != 1;
        this.output.innerHTML += this.opened_before_put_object_template.render({left: left, parent_id: parent_id, key: key, id: this._id, is_not_root: is_not_root}, {'inner': this.opened_inner_object_template})
        indent += 1
        var next_parent_id = this._id
        Object.keys(data).map(function(key) {
            this._put(data[key], indent, key, next_parent_id) 
        }, this)
        this._id += 1; 
        this.output.innerHTML += this.after_put_object_template.render({left: left, parent_id: next_parent_id, key: key, id: this._id})
}

json_viewer._put_array = function(data, parent_id, left, key, indent) {
        this._id += 1; 
        var is_not_root = this._id != 1;
        this.output.innerHTML += this.before_put_array_template.render({left: left, parent_id: parent_id, key: key, id: this._id, is_not_root: is_not_root}, {'inner': this.opened_inner_array_template})
        indent += 1
        var next_parent_id = this._id
        data.map(function(value, index) {
            this._put(value, indent, index, next_parent_id) 
        }, this)
        this._id += 1; 
        this.output.innerHTML += this.after_put_array_template.render({left: left, parent_id: next_parent_id, key: key, id: this._id})
}

json_viewer._put_string = function(data, parent_id, left, key) {
        this._id += 1; 
        this.output.innerHTML += this._put_string_template.render({left: left, parent_id: parent_id, key: key, id: this._id, data: data})
}

json_viewer._put_number = function(data, parent_id, left, key) {
        this._id += 1; 
        this.output.innerHTML += this._put_number_template.render({left: left, parent_id: parent_id, key: key, id: this._id, data: data})
}

json_viewer._put = function(data, indent, key, parent_id) {
    key = key === undefined ? null: key;
    parent_id = parent_id === undefined ? this.root: parent_id;
    var left = this._indent_width * indent;
    if (data === null) {
        this._put_number("null", parent_id, left, key);
    }
    else if (Array.isArray(data)) {
        this._put_array(data, parent_id, left, key, indent);
    }
    else if (data.toString() === '[object Object]') {
        this._put_object(data, parent_id, left, key, indent);
    }
    else if (data.constructor === String) {
        this._put_string(data, parent_id, left, key);
    }
    else {
        this._put_number(data, parent_id, left, key);
    }
}

json_viewer._close = function() {
    var target_parent_id = this.id;
    var child_list = document.querySelectorAll('[parent_id="' + target_parent_id + '"]');
    var children = Array.prototype.slice.call(child_list);
    var is_not_root = this.id != 1;
    if (this.getAttribute("data_type") == "Object" && "state" in this.dataset) {
        this.innerHTML = json_viewer.closed_inner_object_template.render({key: this.dataset.key, is_not_root: is_not_root}); 
    }
    if (this.getAttribute("data_type") == "Array" && "state" in this.dataset) {
        this.innerHTML = json_viewer.closed_inner_array_template.render({key: this.dataset.key, is_not_root: is_not_root}); 
    }
    this.dataset.state = '0';
    children.map(function(c){
        c.style.display = 'none';
        c.dataset.state = '0';
        json_viewer._close.call(c);
    });
}

json_viewer.close_all = function() {
    var root =  document.querySelector('[parent_id="' + this.root + '"]');
    this._close.call(root);
}

json_viewer._open = function() {
    var target_parent_id = this.id;
    var child_list = document.querySelectorAll('[parent_id="' + target_parent_id + '"]');
    var children = Array.prototype.slice.call(child_list);
    var is_not_root = this.id != 1;
    if (this.getAttribute("data_type") == "Object" && "state" in this.dataset) {
        this.innerHTML = json_viewer.opened_inner_object_template.render({key: this.dataset.key, is_not_root: is_not_root}); 
    }
    if (this.getAttribute("data_type") == "Array" && "state" in this.dataset) {
        this.innerHTML = json_viewer.opened_inner_array_template.render({key: this.dataset.key, is_not_root: is_not_root}); 
    }
    this.dataset.state = '1';
    children.map(function(c){
        c.style.display = 'block';
    });
}

json_viewer.change = function() {
    if (this.dataset.state === '1') {
        json_viewer._close.call(this);
    }
    else {
        json_viewer._open.call(this);
    }
}

json_viewer.display = function() {
    this.output.innerHTML = '';
    this._id = 0;
    try {
        this._data = JSON.parse(document.getElementById('input').value)
    } catch (e) {
        alert('不正なJSON \n ,}や,]はperseできません。\n http://www.json.org/');
        throw e;
    }
    this._put(this._data, 0);
    child_list = document.querySelectorAll('[data_type="Object"],[data_type="Array"]');
    var children = Array.prototype.slice.call(child_list);
    children.map(function(c){
        c.addEventListener('click', json_viewer.change, false);
    });
}

json_viewer._open_parent = function(elem) {
    var parent_id = elem.getAttribute("parent_id");
    var parent_elem = document.getElementById(parent_id);
    this._open.call(parent_elem);
    if (parent_elem.getAttribute("parent_id") == "root") {
        return
    }
    this._open_parent(parent_elem);
}

json_viewer.search = function() {
    var key = this.search_key_elem.value;
    var child_list = document.querySelectorAll('[key="' + key + '"]');
    var children = Array.prototype.slice.call(child_list);
    this.close_all();
    children.map(function(elem) {
        json_viewer._open_parent(elem);
    });
}

document.getElementById('display').addEventListener('click', json_viewer.display.bind(json_viewer), false);
document.getElementById('search_key_button').addEventListener('click', json_viewer.search.bind(json_viewer), false);
