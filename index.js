var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

canvas.height = '512';
canvas.width = '512';

changeMatrixSize('4x4');

var coef = 4;
var colorLeft = '#000';
var colorRight = '#fff';
var lineWidth = 1;

let colorInputLeft = document.getElementById("colorLeft");
let colorInputRight = document.getElementById("colorRight");
colorLeft = colorInputLeft.value;
colorRight = colorInputRight.value;

colorInputLeft.addEventListener("input", function() {
    colorLeft = colorInputLeft.value;
}, false);
colorInputRight.addEventListener("input", function() {
    colorRight = colorInputRight.value;
}, false);



document.getElementById('matrixSize').addEventListener('change', function () {
   changeMatrixSize(this.value);
});

function changeMatrixSize(value) {
    let matrix;
    if(value == '512x512'){
        matrix = new Image();
        matrix.onload = function() {
            context.drawImage(matrix, 0, 0 , 512 , 512);
            coef = 512;
        };
        matrix.src = "src/512x512.png";
    }
    else{
        matrix = getJson(value);
        drawFromFile(matrix);
    }
}

document.getElementById('lineWidth').addEventListener('change', function () {
    lineWidth = this.value;
});


function drawFromFile(matrix) {
  if(matrix!=undefined){
      let colorDraw;
      let getColor;
      let i = 0;
      let j = 0;
      if(matrix[0][0].length == 4) {
          getColor = function () {
              return `rgba(${matrix[i][j][0]},${matrix[i][j][1]},${matrix[i][j][2]},${255 / matrix[i][j][3]})`;
          };
      }else{
          getColor = function () {
              return `#${matrix[i][j]}`;
          };
      }
      for (i=0; i<matrix.length; i++){
          for (j=0; j<matrix[i].length; j++){
              let x = i*(512/coef);
              let y = j*(512/coef);
              colorDraw = getColor();
              context.fillStyle = colorDraw;
              context.fillRect(x, y, 512/coef, 512/coef);
              context.fill();
          }
      }
  }
}



function getJson(fileName) {
    let matrix;
    let oReq = new XMLHttpRequest();
    oReq.onload = reqListener;
    oReq.open("get", `src/${fileName}.json`, false);
    oReq.send();
    function reqListener() {
        matrix = JSON.parse(this.responseText);
        coef = matrix.length;
    }
    return matrix;
}


canvas.onmousedown = function (event) {
    let color = colorLeft;
    if(event.button==2){
        color = colorRight;
    }
    let x = event.offsetX;
    let y = event.offsetY;
    context.fillRect(Math.floor(x/(512/coef))*(512/coef), Math.floor(y/(512/coef))*(512/coef), 512/coef*lineWidth, 512/coef*lineWidth);
    context.fillStyle = color;
    context.fill();

    canvas.onmousemove = function (event) {
        let x = event.offsetX;
        let y = event.offsetY;
        context.fillRect(Math.floor(x/(512/coef))*(512/coef), Math.floor(y/(512/coef))*(512/coef), 512/coef*lineWidth, 512/coef*lineWidth);
        context.fillStyle = color;
        context.fill();
    };
    canvas.onmouseup = function () {
        canvas.onmousemove = null;
    };
};

canvas.oncontextmenu = function (event) {
    event.preventDefault();
};

