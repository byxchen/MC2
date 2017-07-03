function BracketSymbol(x, y, height, value) {
    Symbol.apply(this, [x, y, 0, height, value]);
    this.type = SYMBOL_TYPES.BRACKET;
    this.bracketType = BRACKET_TYPES.CLOSE;
    if (BRACKET.indexOf(value) < BRACKET.length / 2) {
        this.bracketType = BRACKET_TYPES.OPEN;
        delete(this.region.above);
        delete(this.region.supers);
    }
    delete(this.region.tleft);
    delete(this.region.contains);
    delete(this.region.bleft);
    delete(this.region.below);
    delete(this.region.subsc);
}
BracketSymbol.prototype = Object.create(Symbol.prototype);
BracketSymbol.prototype.constructor = BracketSymbol;