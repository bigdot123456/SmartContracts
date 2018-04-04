function isException(error) {
    let strError = error.toString();
    return strError.includes('invalid opcode') || strError.includes('invalid JUMP') || strError.includes('revert') ;
}

function ensureException(error) {
    assert(isException(error), error.toString());
}

Array.prototype.unique = function() {
    return this.filter(function (value, index, self) {
        return self.indexOf(value) === index;
    });
}

Array.prototype.removeZeros = function() {
    return this.filter(function (value, index, self) {
        return value != 0x0 && value != 0 && value.valueOf() != '0'
    });
}

module.exports = {
    zeroAddress: '0x0000000000000000000000000000000000000000',
    isException: isException,
    ensureException: ensureException
};
