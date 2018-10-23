const pos = {
  t: [4, 0],
  cl: [2, 2],
  cr: [4, 2],
  bl: [0, 4],
  bc: [2, 4],
  br: [4, 4]
};

const charToPaths = {
  " ": [],
  ".": [[[4, 3], [4, 4]]],
  ",": [[[4, 3], [3, 4]]],
  "-": [[pos.cl, pos.cr]],
  "'": [[pos.t, [3, 1]]],
  "`": [[pos.t, [4, 1]]],
  ":": [[pos.t, [4, 1]], [[4, 3], pos.br]],
  ";": [[pos.t, [4, 1]], [[4, 3], [3, 4]]],
  a: [[pos.bl, pos.t, pos.br], [pos.cl, pos.cr]],
  b: [[pos.bl, pos.t, pos.br, pos.bl], [pos.cl, pos.cr]],
  c: [[pos.cr, pos.t, pos.bl, pos.br]],
  d: [[pos.t, pos.br, pos.bl, pos.cl, pos.cr]],
  e: [[pos.t, pos.bl, pos.br], [pos.cl, pos.cr]],
  f: [[pos.cr, pos.t, pos.bl], [pos.cl, pos.br]],
  g: [[pos.t, pos.bl, pos.br, pos.cr]],
  h: [[pos.t, pos.bl], [pos.cl, pos.cr, pos.br]],
  i: [[pos.t, pos.cl, pos.bc], [pos.bl, pos.br]],
  j: [[pos.cl, pos.t, pos.br, pos.bl]],
  k: [[pos.t, pos.bl], [pos.cr, pos.cl, pos.br]],
  l: [[pos.t, pos.bl, pos.br]],
  m: [[pos.bl, pos.t, pos.br], [pos.cr, pos.bc]],
  n: [[pos.bl, pos.bc, pos.cl, pos.br, pos.t]],
  o: [[pos.t, pos.bl, pos.br, pos.t]],
  p: [[pos.bl, pos.t, pos.br, pos.cl]],
  q: [[pos.bc, pos.cr, pos.t, pos.bl, pos.br]],
  r: [[pos.bl, pos.t, pos.cr, pos.cl, pos.br]],
  s: [[pos.t, pos.cl, pos.cr, pos.br, pos.bl]],
  t: [[pos.bl, pos.t], [pos.cl, pos.br]],
  // u: [[pos.bl, pos.cl, pos.bc, pos.br, pos.t]],
  u: [[pos.cl, pos.bl, pos.br, pos.t]],
  v: [[pos.bl, pos.cl, pos.br, pos.t]],
  w: [[pos.bl, [1, 3], pos.bc, pos.cl, pos.br, pos.t]],
  x: [[pos.bl, pos.cl, pos.br], [pos.t, pos.cr, pos.bc]],
  y: [[pos.bl, pos.cl, pos.br], [pos.t, pos.br, pos.bc]],
  z: [[pos.bl, pos.t, pos.cr, pos.bc, pos.br]]
};

const unit = 4;

document.addEventListener("DOMContentLoaded", event => {
  for (const element of document.getElementsByClassName("trigger"))
    element.addEventListener("input", render);
});

const render = () => {
  const canvas = document.getElementById("output");
  const ctx = canvas.getContext("2d");

  const input = document.getElementById("input").value;
  const lines = input.split(/\r?\n/);
  const letterW = parseInt(document.getElementById("letter-w").value);
  const spaceX = parseFloat(document.getElementById("space-x").value);
  const spaceY = parseFloat(document.getElementById("space-y").value);
  const margin = parseFloat(document.getElementById("margin").value);
  const lenX = Math.max(...lines.map(line => line.length));
  const lenY = lines.length;
  canvas.width = (margin * 2 + lenX + (lenX - 1) * spaceX) * letterW;
  canvas.height = (margin * 2 + lenY + (lenY - 1) * spaceY) * letterW;

  ctx.fillStyle = document.getElementById("bg-color").value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  for (const [j, line] of lines.entries())
    for (const [i, char] of line.split("").entries())
      for (const path of charToPaths[char.toLowerCase()]) {
        ctx.moveTo(
          ...coordinate(
            path[0][0],
            path[0][1],
            i,
            j,
            letterW,
            margin,
            spaceX,
            spaceY
          )
        );

        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = parseInt(document.getElementById("line-w").value);

        ctx.strokeStyle = document.getElementById("color").value;
        /* ctx.imageSmoothingEnabled = document.getElementById(
          "smoothing"
        ).checked; */

        for (const [x, y] of path.slice(1))
          ctx.lineTo(
            ...coordinate(x, y, i, j, letterW, margin, spaceX, spaceY)
          );
      }
  ctx.stroke();
  ctx.closepath();
};
const coordinate = (x, y, i, j, letterW, margin, spaceX, spaceY) => [
  (margin + i * (1 + spaceX) + x / unit) * letterW,
  (margin + j * (1 + spaceY) + y / unit) * letterW
];
