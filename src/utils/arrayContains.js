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

function getFromArray(array, key, text) {

    for (let i = 0; i < array.length; i++) {
        if (array[i][0][key] === text) {
            return array[i][0];
        }
    }
    return undefined;
}

function getIndexOf(array, key, text) {

    for (let i = 0; i < array.length; i++) {
        if (array[i][0][key] === text) {
            return i;
        }
    }
    return -1;
}

module.exports  = {contains, getFromArray, getIndexOf};
