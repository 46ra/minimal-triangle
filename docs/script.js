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
  ".": [
    [
      [4, 3],
      [4, 4]
    ]
  ],
  ",": [
    [
      [4, 3],
      [3, 4]
    ]
  ],
  "-": [
    [pos.cl, pos.cr]
  ],
  "'": [
    [pos.t, [3, 1]]
  ],
  "`": [
    [pos.t, [4, 1]]
  ],
  ":": [
    [pos.t, [4, 1]],
    [
      [4, 3], pos.br
    ]
  ],
  ";": [
    [pos.t, [4, 1]],
    [
      [4, 3],
      [3, 4]
    ]
  ],
  a: [
    [pos.bl, pos.t, pos.br],
    [pos.cl, pos.cr]
  ],
  b: [
    [pos.bl, pos.t, pos.br, pos.bl],
    [pos.cl, pos.cr]
  ],
  c: [
    [pos.cr, pos.t, pos.bl, pos.br]
  ],
  d: [
    [pos.t, pos.br, pos.bl, pos.cl, pos.cr]
  ],
  e: [
    [pos.t, pos.bl, pos.br],
    [pos.cl, pos.cr]
  ],
  f: [
    [pos.cr, pos.t, pos.bl],
    [pos.cl, pos.br]
  ],
  g: [
    [pos.t, pos.bl, pos.br, pos.cr]
  ],
  h: [
    [pos.t, pos.bl],
    [pos.cl, pos.cr, pos.br]
  ],
  i: [
    [pos.t, pos.cl, pos.bc],
    [pos.bl, pos.br]
  ],
  j: [
    [pos.cl, pos.t, pos.br, pos.bl]
  ],
  k: [
    [pos.t, pos.bl],
    [pos.cr, pos.cl, pos.br]
  ],
  l: [
    [pos.t, pos.bl, pos.br]
  ],
  m: [
    [pos.bl, pos.t, pos.br],
    [pos.cr, pos.bc]
  ],
  n: [
    [pos.bl, pos.bc, pos.cl, pos.br, pos.t]
  ],
  o: [
    [pos.t, pos.bl, pos.br, pos.t]
  ],
  p: [
    [pos.bl, pos.t, pos.br, pos.cl]
  ],
  q: [
    [pos.bc, pos.cr, pos.t, pos.bl, pos.br]
  ],
  r: [
    [pos.bl, pos.t, pos.cr, pos.cl, pos.br]
  ],
  s: [
    [pos.t, pos.cl, pos.cr, pos.br, pos.bl]
  ],
  /*t: [
    [pos.bl, pos.t],
    [pos.cl, pos.br]
  ],*/
  t: [
    [pos.cl, pos.t, pos.br],
    [pos.cr, pos.bc, pos.bl]
  ],
  // u: [[pos.bl, pos.cl, pos.bc, pos.br, pos.t]],
  u: [
    [pos.cl, pos.bl, pos.br, pos.t]
  ],
  v: [
    [pos.bl, pos.cl, pos.br, pos.t]
  ],
  w: [
    [pos.bl, [1, 3], pos.bc, pos.cl, pos.br, pos.t]
  ],
  x: [
    [pos.bl, pos.cl, pos.br],
    [pos.t, pos.cr, pos.bc]
  ],
  y: [
    [pos.bl, pos.cl, pos.br],
    [pos.t, pos.br, pos.bc]
  ],
  z: [
    [pos.bl, pos.t, pos.cr, pos.bc, pos.br]
  ]
};

const unit = 4;

document.addEventListener("DOMContentLoaded", event => {
  let query = {};
  for (const pair of decodeURIComponent(window.location.search).substring(1).split("&")) {
    const [key, value] = pair.split("=");
    query[key] = value;
  }

  for (const [f, id] of [
      [x => x, "input"],
      [parseInt, "char-w"],
      [parseInt, "stroke-w"],
      [parseFloat, "space-x"],
      [parseFloat, "space-y"],
      [parseFloat, "margin"],
      [x => x, "color"],
      [x => x, "bg-color"]
    ])
    if (query[id]) document.getElementById(id).value = f(query[id]);

  render();

  for (const element of document.getElementsByClassName("trigger"))
    element.addEventListener("input", render);

  document.getElementById("input").addEventListener("focusout", () => {
    const queryString =
      "?" + [
        "char-w",
        "stroke-w",
        "space-x",
        "space-y",
        "margin",
        "color",
        "bg-color",
        "input"
      ]
      .map(id => id + "=" + document.getElementById(id).value)
      .join("&");

    window.location.search =
      encodeURIComponent(window.location.search.split("?")[0] + queryString);
  })

  document.getElementById("download").addEventListener("click", () => {

  });
});

const render = () => {
  const canvas = document.getElementById("output");
  const ctx = canvas.getContext("2d");

  const input = document.getElementById("input").value;
  const lines = input.split(/\r?\n/);
  const charW = parseInt(document.getElementById("char-w").value);
  const spaceX = parseFloat(document.getElementById("space-x").value);
  const spaceY = parseFloat(document.getElementById("space-y").value);
  const margin = parseFloat(document.getElementById("margin").value);
  const lenX = Math.max(...lines.map(line => line.length));
  const lenY = lines.length;
  canvas.width  = (margin * 2 + lenX + (lenX - 1) * spaceX) * charW;
  canvas.height = (margin * 2 + lenY + (lenY - 1) * spaceY) * charW;

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
            charW,
            margin,
            spaceX,
            spaceY
          )
        );

        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = parseInt(document.getElementById("stroke-w").value);

        ctx.strokeStyle = document.getElementById("color").value;
        /* ctx.imageSmoothingEnabled = document.getElementById(
          "smoothing"
        ).checked; */

        for (const [x, y] of path.slice(1))
          ctx.lineTo(
            ...coordinate(x, y, i, j, charW, margin, spaceX, spaceY)
          );
      }
  ctx.stroke();
};

const coordinate = (x, y, i, j, charW, margin, spaceX, spaceY) => [
  (margin + i * (1 + spaceX) + x / unit) * charW,
  (margin + j * (1 + spaceY) + y / unit) * charW
];