window.exports = [];

function appendExports(closureFn) {
    window.exports.push(closureFn.toString());
}

