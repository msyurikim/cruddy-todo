const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    var pathName = path.join(exports.dataDir , `${id}.txt`);
    fs.writeFile(pathName, text, (err) => callback(null, { id, text }) ); //--> called in server.js, to send back response object

  });
  // items[id] = text;
  // callback(null, { id, text });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, ((err, files) => {
    var filesArr = files.map((file) => {
      var id = file.slice(0, 5);
      return {"id": id, "text": id};
    });
    callback(null, filesArr);
  }));

  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
};

exports.readOne = (id, callback) => {
  var pathName = path.join(exports.dataDir , `${id}.txt`);
  fs.readFile(pathName, (err, text) => {
    if (!text) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, "text": text.toString() });
    }
  });
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {
  var pathName = path.join(exports.dataDir , `${id}.txt`);
  fs.readFile(pathName, (err, item) => {
    if (!item) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(pathName, text, (err) => {
        callback(null, { id, "text": text.toString() });
      });
    }
  });
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {
  var pathName = path.join(exports.dataDir , `${id}.txt`);
  fs.unlink(pathName, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
