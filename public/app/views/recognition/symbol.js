/**
 * 
 @ Abstract Symbol Class
 * @param {*} x x coordinate
 * @param {*} y y coordiante
 * @param {*} value value of the symbol
 */
function Symbol(x, y, width, height, value) {
    
    if (this.constructor === Symbol) {
        throw new Error("Abstract Class Instatiation Error");
    }
    this.minX = x;
    this.minY = y;
    this.maxX = x + width;
    this.maxY = y + height;
    this.value = value;
    this.width = width;
    this.height = height;
    this.x = (this.minX + this.maxX)/2;
    this.y = (this.minY + this.maxY)/2;
    this.region = {};
    for (var region in REGION_NAMES) {
        this.region[REGION_NAMES[region]] = new Expression(REGION_NAMES[region]);
    }
    this.wall = {};
    delete(this.region.root);

    


}

Symbol.prototype.setWall = function(wall) {
    this.wall.top = wall.top;
    this.wall.bottom = wall.bottom;
    this.wall.left = wall.left;
    this.wall.right = wall.right;
}

Symbol.prototype.getWallCopy = function() {
    return {
        'top': this.wall.top,
        'bottom': this.wall.bottom,
        'left': this.wall.left,
        'right': this.wall.right,
    };
}