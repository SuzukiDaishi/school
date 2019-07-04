
/*

*/


let music = new class {
  constructor() {
    this.musicData = [] ;
    this.page = 0;
    this.audio = null ;

  }

  /* {"x": テーブの座標X, "y": テーブルの座標Y, "length": 長さ, "name": トラック名, "id": トラックのid} */
  add(track) {
    for (let t of this.musicData) {
      if (track.y===t.y) {
        if (t.x<=track.x&&track.x<t.x+t.length)
          return ;
        if (track.x<=t.x&&t.x<track.x+track.length)
          return ;
      }
    }
    this.musicData.push(track);
  }

  remove(tableX, tableY) {
    for (let i in this.musicData) {
      if ( this.musicData[i].y === tableY ) {
        if ( this.musicData[i].x<=tableX&&tableX<this.musicData[i].x+this.musicData[i].length ) {
          this.musicData.splice(i, 1);
        }
      }
    }
  }

  toAudioJSON() {
    let data = [] ;
    for (let t of this.musicData) {
      data.push({
        "id": t["id"],
        "name": t["name"],
        "start": t["x"],
        "length": t["length"],
        "trackNumber": t["y"]
      }) ;
    }
    return JSON.stringify(data);
  }

  toAudioJSON_V2() {
    let data = [];
    for (let t of this.musicData) {
      data.push({
        "id": t["id"],
        "name": t["name"],
        "start": t["x"],
        "length": t["length"],
        "trackNumber": t["y"],
        "volume": Number(document.querySelector("#track-"+(t["y"]+1)+">.title-range").value),
        "title": document.querySelector("#track-"+(t["y"]+1)+">.title-text").value
      }) ;
    }
    return JSON.stringify(data);
  }

  audioLoad() {
    //const url = "./API/track/changeAudio.php?tracks="+this.toAudioJSON() ;
    const url = "./API/track/changeAudio.php?tracks="+this.toAudioJSON_V2() ;
    console.log(url);
    return axios
    .get(url)
    .then(response => {
      this.audio = response.data.music;
      this.audio = "data:audio/wav;base64,"+this.audio;
    })
  }



}

/** canvasの初期化処理 **/
function setup(canvas) {
  if (canvas.getContext) {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width-100;
    canvas.height = rect.height;
  }
}

/** 更新毎にやることの一覧 **/
function update(canvas, p=0) {
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    background(canvas, ctx);
    for (let track of music.musicData) {
      trackBoxWrite(track.x-p, track.y, track.length, track.id, track.name, canvas);
    }
    // その他の処理
    indexWrite(canvas, ctx, p);
  }
}

function convertToRoman(num) {
    const decimal = [ 1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1 ];
    const romanNumeral = [ 'M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I' ];
    let romanized = '';
    for (var i = 0; i < decimal.length; i++) {
        while (decimal[i] <= num) {
            romanized += romanNumeral[i];
            num -= decimal[i];
        }
    }
    return romanized;
}

function indexWrite(canvas, ctx, p) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.font = "30px 'ＭＳ ゴシック'";
    ctx.textAlign = "center";
    for (let i=0;i<7;i++) {
        for (let j=0; j<=9; j++) {
            ctx.fillText(convertToRoman(i+p+1), (canvas.width/7)*i+(canvas.width/7)/2, (canvas.height/9)*(j-1)+50);
        }
    }
    ctx.textAlign = "start";
}

/** canvas内の座標をテーブルの座標に変換 **/
function canvasPos2tablePos(x, y, canvas) {
  let tty = null;
  let ttx = null;
  for (let i=0;i<9;i++) {
    const a = canvas.getBoundingClientRect().height/9*i;
    const b = a+canvas.getBoundingClientRect().height/9;
    if (a<=y&&y<=b) tty = i;
  }
  for (let i=0;i<14/2;i++) {
    const a = canvas.getBoundingClientRect().width/(14/2)*i;
    const b = canvas.getBoundingClientRect().width/(14/2)*(i+1);
    if (a<=x&&x<=b) ttx = i;
  }
  return {"x": ttx, "y": tty};
}

/** テーブルの座標をcanvas内の座標に変換 **/
function tablePos2canvasPos(x, y, canvas) {
  let tty = canvas.height/9*y;
  let ttx = canvas.width/7*x;
  return {"x": ttx, "y": tty};
}

/** テーブル内の長さをcanvas内の座標に変換 **/
function tableLen2canvasLen(length, canvas) {
  let len = canvas.width/7*length;
  return len;
}

/** canvas内の座標をテーブルの座標に変更 **/
function trackBoxWrite(tableX, tabelY, length, id, name, canvas) {
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    const {x, y} = tablePos2canvasPos(tableX, tabelY, canvas);
    const len    = tableLen2canvasLen(length, canvas);
    let strSumNum = 0 ;
    for (let i=0;i<name.length;i++) { strSumNum += name.charCodeAt(i); }
    let grad  = ctx.createLinearGradient(x,0, x+len,0) ;
    for (let i=1;i<=Math.floor(length)*2;i++) {
      grad.addColorStop(
        i/(Math.floor(length)*2),
        "hsl("+((i*name.length*4)+strSumNum)%360+", 100%, 50%)"
      ) ;
    }
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, len, canvas.height/9-1);
    ctx.fillStyle = "#ccc";
    ctx.fillRect(x, y, len, 10);
    ctx.fillStyle = "#000";
    const viewLen = tableLen2canvasLen(0.5, canvas);
    ctx.fillRect(x, y, viewLen, 10);
    ctx.beginPath();
    ctx.moveTo(x+viewLen, y);
    ctx.lineTo(x+viewLen+tableLen2canvasLen(0.1, canvas), y);
    ctx.lineTo(x+viewLen, y+10);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "8px 'ＭＳ ゴシック'";
    ctx.fillText(name, x, y+8);
    /**
      謝罪: http://localhost:8888/GaKu/API/track/makeWave.php?id=71
      波形表示 重すぎて動かない
      ので グラデーションしときました
    **/
  }
}

/** canvasの背景を設定 **/
function background(canvas, ctx) {
  ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
  for (let i=1;i<=9;i++) {
    ctx.fillStyle = i%2==0?"#fff":"#eee";
    ctx.fillRect(0, (canvas.height/9)*(i-1), canvas.width, canvas.height/9-1);
    ctx.beginPath();
    ctx.moveTo(0, (canvas.height/9)*i);
    ctx.lineTo(canvas.width, (canvas.height/9)*i);
    ctx.stroke();
  }
  for (let i=1;i<=14/2+1;i++) {
    ctx.beginPath();
    ctx.moveTo(canvas.width/14*i*2, 0);
    ctx.lineTo(canvas.width/14*i*2, canvas.height);
    ctx.stroke();
  }
}
