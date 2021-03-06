const Surface = function (id) {
  this.params = {
    id: 'elementRenderingId',
    x: 0,
    y: 0,
    format:{ name: "sLTR", width: 216, height: 260},
    resX: 216,
    resY: 279,
    scale: 1,
    crop: 0,
    a: 0,
    f: 0,
    threshold: 0,
    ceiling: 1,
    formula: 'Math.sin(i/a.length * Math.PI * (l*w/2)) * q',
    structure: "net",
    path: 'zig',
  };
  this.sourceId = id;
  this.vertices = [];
  this.texture = [];
  this.path = [];
  this.pathString = "M0, 0 L216 130, L108, 230 Z";
};

Surface.prototype.setVertices = function (resX, resY) {

  if (resX && resY) {
    this.params.resX = resX;
    this.params.resY = resY;
  }
  const vWidth = this.params.resX;
  const vHeight = this.params.resY;

  this.vertices = new Array(vWidth * vHeight).fill(0).map( (e, i) => {

    const x = (i % vWidth) / vWidth + 1 / vWidth / 2;
    const y = Math.floor(i / vWidth) / vHeight + 1 / vHeight / 2;
    return { x, y, z: 0 };
  });

  return this;
};

Surface.prototype.loadTexture = function (id, option = 'luminance') {

  if (id) this.sourceId = id;

  const image = document.getElementById(this.sourceId).getContext("2d");
  
  let width = image.canvas.width;
  let height = image.canvas.height;
  
  const imagedata = image.getImageData(
      0,
      0,
      width,
      height
  ).data;
      
      
  this.texture = new Array(this.params.resX * this.params.resY).fill(0);
      
      
  this.vertices.forEach((e, i, a) => {
      const x = Math.floor(e.x * width);
      const y = Math.floor(e.y * height);
      
      const index = (width * y + x) * 4; //(RGBA = 4 channels)
      
      const red = imagedata[index];
      const green = imagedata[index + 1];
      const blue = imagedata[index + 2];
      const alpha = imagedata[index + 3];
      
      this.texture[i] = (red + green + blue) / 3 / 255.0; //normalized luminance
  }, this);

  return this;
};

Surface.prototype.computeMap = function (func) {


  this.vertices.forEach((e, i) => {
    this.vertices[i].z = func(
      e.x,
      e.y,
      this.texture[i],
      i,
      this.params.a,
      this.params.f,
      this.params.resX,
      this.params.resY
    );
  }, this);

  return this;
};



Surface.prototype.computePath = function () {

    const newPath = [];

    const sorted = [ ...this.vertices]

    // sorted.sort( (a, b) => a.z - b.z )

    sorted.forEach((e, i) => {
      const scaleOffset = (1-this.params.scale)/2
      const x = e.x * this.params.scale + scaleOffset + this.params.x;
      const y = (e.y + e.z) * this.params.scale + scaleOffset + this.params.y;

    if (
      this.texture[i] <= this.params.ceiling &&
      this.texture[i] >= this.params.threshold &&
      y >= 0 &&
      y < (1 - this.params.crop) &&
      x >= 0 &&
      x < 1
    ) {
      const yCount = Math.floor(i / this.params.resX);

      //(snake unique path)
      const index =
        yCount % 2 === 0
          ? i
          : this.params.resX -
            1 -
            (i % this.params.resX) +
            yCount * this.params.resX;

      newPath.push(index);
    }
  }, this);

  this.path = newPath;

  return this;
};



Surface.prototype.computePathString = function () {

    if (this.path.length) {

        this.pathString = this.path.map((e, i) => {

        const scaleOffset = (1-this.params.scale)/2

        const X =
          this.vertices[e].x * this.params.scale + scaleOffset + this.params.x;

        const Y =
          (this.vertices[e].y + this.vertices[e].z) * this.params.scale
          + scaleOffset + this.params.y;

        let str =
          i === 0 ?
            "M" + X * this.params.format.width + ", " + Y * this.params.format.height 
            //:
            //( e === this.size-1 ) ? 'L' + X + ' ' + Y  + ' ' + 'Z'
            :
            "L" + X * this.params.format.width + ", " + Y * this.params.format.height + " ";

        return str;
      })
      .join(" ");

      const pathElement = document.getElementById(this.params.id)
      pathElement && pathElement.setAttribute('d', this.pathString)
    }

    return this;
}

export { Surface };
