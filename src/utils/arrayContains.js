Array.prototype.contains = function (element) {
    return this.indexOf(element) > -1;
};


function contains(array, key, text) {

    for (let i = 0; i < array.length; i++) {
        if (array[i][key] === text) {
            return true;
        }
    }
    return false;
}

module.exports  = contains;
