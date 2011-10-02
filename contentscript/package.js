window.closureStrings = [];

function pack(closureFn) {
    window.closureStrings.push(closureFn.toString());
}

