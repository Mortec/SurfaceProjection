const Surface = function (id) {
  this.params = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    resX: 100,
    resY: 100,
    skew: 1,
    crop: 0,
    q: 1,
    formula: "y",
    structure: "net",
    threshold: 0,
    ceiling: 1,
    path: "one",
    paper_color: 1,
    pen_color: 0,
  };
  this.sourceId = id;
  this.vertices = [];
  this.texture = [];
  this.path = [];
  this.string = "";
};

Surface.prototype.loadVertices = function (resX, resY) {
  if (resX && resY) {
    this.params.resX = resX;
    this.params.resY = resY;
  }
  let width = this.params.resX;
  let height = this.params.resY;

  this.vertices = new Array(width * height).fill(0).map((e, i) => {
    const x = (i % width) / width + 1 / width / 2;
    const y = Math.floor(i / width) / height + 1 / height / 2;
    return { x, y, z: 0 };
  });

  return this;
};

Surface.prototype.loadTexture = function (id, option) {
  if (id) this.sourceId = id;

  const image = document.getElementById(this.sourceId).getContext("2d");
  const imagedata = image.getImageData(
    0,
    0,
    image.canvas.width,
    image.canvas.height
  );

  let width = imagedata.width;
  let height = imagedata.height;

  this.texture = new Array(this.params.resX * this.params.resY).fill(0);

  this.vertices.forEach((e, i, a) => {
    const x = Math.floor(e.x * width);
    const y = Math.floor(e.y * height);

    const index = (width * y + x) * 4;

    const red = imagedata.data[index];
    const green = imagedata.data[index + 1];
    const blue = imagedata.data[index + 2];
    const alpha = imagedata.data[index + 3];

    this.texture[i] = (red + green + blue) / 3 / 255.0; //normalized luminance
  }, this);

  return this;
};

Surface.prototype.process = function (func) {
  this.vertices.forEach((e, i, a) => {
    this.vertices[i].z = func(
      e.x,
      e.y,
      this.texture[i],
      i,
      a,
      this.params.q,
      this.params.resX,
      this.params.resY
    );
  }, this);

  return this;
};

Surface.prototype.loadPath = function () {
  //snake unique path
  const newPath = [];

  this.vertices.forEach((e, i) => {
    const y = e.y * this.params.height + e.z;
    //   console.log( 't : ', this.params.floor  )

    if (
      this.texture[i] <= this.params.ceiling &&
      this.texture[i] >= this.params.threshold &&
      y >= 0 &&
      y < this.params.height * (1 - this.params.crop)
    ) {
      const yCount = Math.floor(i / this.params.resX);

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

Surface.prototype.getSVGstring = function () {
  if (this.path) {
    this.string = this.path
      .map((e, i) => {
        const X =
          this.vertices[e].x * this.params.width * this.params.skew +
          this.params.x;
        const Y =
          (this.vertices[e].y * this.params.height + this.vertices[e].z) *
            this.params.skew +
          this.params.y;

        let str =
          i === 0
            ? "M" + X + ", " + Y
            : // : ( e === this.size-1 ) ? 'L' + X + ' ' + Y  + ' ' + 'Z'
              "L" + X + ", " + Y + " ";

        return str;
      })
      .join(" ");

    return this.string;
  } else return "M0, 0";
};

export { Surface };
