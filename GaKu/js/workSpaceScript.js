
let audio = null ;

/** base64 to blob **/
function toBlob(base64) {
    var bin = atob(base64.replace(/^.*,/, ''));
    var buffer = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
    }
    // Blobを作成
    try{
        var blob = new Blob([buffer.buffer], {
            type: 'image/png'
        });
    }catch (e){
        return false;
    }
    return blob;
}

/** ボタンのロゴの変更及び音声の再生 **/
function onClickOfClick(dom) {
  if (music.musicData.length===0) { return ; }
  if (this.isPlay===undefined) { this.isPlay = false; }
  this.isPlay = !this.isPlay;
  if (this.isPlay) {
    dom.className = "player-button stop-logo";
    music.audioLoad().then(() => {
      audio = new Audio(music.audio);
      if (audio !== null) {
        audio.play();
        this.animeID = setInterval(() => {
          // TODO: アニメーションすればよかった
        }, 2000);
        audio.addEventListener("ended", (e) => {
          this.isPlay = !this.isPlay;
          dom.className = "player-button play-logo";
          if (audio !== null) {
            audio.pause();
            clearInterval(this.animeID);
            audio.currentTime = 0;
          }
        });
      }
    })
  } else {
    dom.className = "player-button play-logo";
    if (audio !== null) {
      audio.pause();
      clearInterval(this.animeID);
      audio.currentTime = 0;
    }
  }
}

/** ハッシュタグの検索 **/
function onSearch(dom, e, trackList) {
  if (e.key==="Enter") {
    dom.blur();
    axios
    .get("./API/track/search.php")
    .then(response => {
      if (dom.value!=="") trackList.tracks = response.data.filter(x=>x["track_serch"].indexOf(dom.value)!==-1);
      else trackList.tracks = response.data ;
      if (trackList.tracks.length===0) trackList.tracks = response.data ;
      trackList.$forceUpdate();
    });
  }
}

/** 再生ボタンが押されたら **/
function audioTrackPlay(id, dom, ended=false) {
  const player = document.getElementById(id);
  if (this.keepID === undefined) this.keepID = [];
  if (this.keepID.indexOf(id)===-1||ended) {
    player.play();
    this.keepID.push(id);
    dom.querySelector("img").src = "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDYwIDYwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA2MCA2MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIyNTZweCIgaGVpZ2h0PSIyNTZweCI+CjxnPgoJPHBhdGggZD0iTTE2LDQ0aDI4VjE2SDE2VjQ0eiBNMTgsMThoMjR2MjRIMThWMTh6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8cGF0aCBkPSJNMzAsMEMxMy40NTgsMCwwLDEzLjQ1OCwwLDMwczEzLjQ1OCwzMCwzMCwzMHMzMC0xMy40NTgsMzAtMzBTNDYuNTQyLDAsMzAsMHogTTMwLDU4QzE0LjU2MSw1OCwyLDQ1LjQzOSwyLDMwICAgUzE0LjU2MSwyLDMwLDJzMjgsMTIuNTYxLDI4LDI4UzQ1LjQzOSw1OCwzMCw1OHoiIGZpbGw9IiMwMDAwMDAiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K";
  } else {
    player.pause();
    player.currentTime = 0;
    const index = this.keepID.indexOf(id);
    this.keepID.pop(index);
    dom.querySelector("img").src = "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDYwIDYwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA2MCA2MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI2NHB4IiBoZWlnaHQ9IjY0cHgiPgo8Zz4KCTxwYXRoIGQ9Ik00NS41NjMsMjkuMTc0bC0yMi0xNWMtMC4zMDctMC4yMDgtMC43MDMtMC4yMzEtMS4wMzEtMC4wNThDMjIuMjA1LDE0LjI4OSwyMiwxNC42MjksMjIsMTV2MzAgICBjMCwwLjM3MSwwLjIwNSwwLjcxMSwwLjUzMywwLjg4NEMyMi42NzksNDUuOTYyLDIyLjg0LDQ2LDIzLDQ2YzAuMTk3LDAsMC4zOTQtMC4wNTksMC41NjMtMC4xNzRsMjItMTUgICBDNDUuODM2LDMwLjY0LDQ2LDMwLjMzMSw0NiwzMFM0NS44MzYsMjkuMzYsNDUuNTYzLDI5LjE3NHogTTI0LDQzLjEwN1YxNi44OTNMNDMuMjI1LDMwTDI0LDQzLjEwN3oiIGZpbGw9IiMwMDAwMDAiLz4KCTxwYXRoIGQ9Ik0zMCwwQzEzLjQ1OCwwLDAsMTMuNDU4LDAsMzBzMTMuNDU4LDMwLDMwLDMwczMwLTEzLjQ1OCwzMC0zMFM0Ni41NDIsMCwzMCwweiBNMzAsNThDMTQuNTYxLDU4LDIsNDUuNDM5LDIsMzAgICBTMTQuNTYxLDIsMzAsMnMyOCwxMi41NjEsMjgsMjhTNDUuNDM5LDU4LDMwLDU4eiIgZmlsbD0iIzAwMDAwMCIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=" ;
  }
}

/** 保存 **/
function saveJson() {
  let data = [];
  for (let track of music.musicData) {
    data.push({
      "id": track["id"],
      "name": track["name"],
      "start": track["x"],
      "length": track["length"],
      "trackNumber":  track["y"]
    }) ;
  }
  const jsonText = JSON.stringify(data);
  const a = document.createElement("a");
  a.href = "data:text/plain," + encodeURIComponent(jsonText+"\n") ;
  a.download = "music.json";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/** 保存 **/
function saveJson_V2() {
  let data = [];
  for (let track of music.musicData) {
    data.push({
      "id": track["id"],
      "name": track["name"],
      "start": track["x"],
      "length": track["length"],
      "trackNumber":  track["y"],
      "volume": Number(document.querySelector("#track-"+(track["y"]+1)+">.title-range").value),
      "title": document.querySelector("#track-"+(track["y"]+1)+">.title-text").value
    }) ;
  }
  const jsonText = JSON.stringify(data);
  const a = document.createElement("a");
  a.href = "data:text/plain," + encodeURIComponent(jsonText+"\n") ;
  a.download = "music.json";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/** ロード **/
function loadJson(canvas) {
  const input = document.createElement("input") ;
  input.type = "file" ;
  input.accept = "application/json" ;
  input.onchange = (e) => {
    const file = e.target.files ;
    const reader = new FileReader() ;
    reader.readAsText( file[0] ) ;
    reader.onload = () => {
      let ret = [] ;
      const data = JSON.parse(reader.result);
      for (let track of data) {
        ret.push({
          "x": track["start"],
          "y": track["trackNumber"],
          "length": track["length"],
          "name": track["name"],
          "id": track["id"]
        }) ;
      }
      music.musicData = ret;
      music.page = 0;
      this.audio = null ;
      update(canvas, p=0);
    } ;
  } ;
  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
}

/** ロード **/
function loadJson_V2(canvas) {
  const input = document.createElement("input") ;
  input.type = "file" ;
  input.accept = "application/json" ;
  input.onchange = (e) => {
    const file = e.target.files ;
    const reader = new FileReader() ;
    reader.readAsText( file[0] ) ;
    reader.onload = () => {
      let ret = [] ;
      const data = JSON.parse(reader.result);
      for (let track of data) {
        ret.push({
          "x": track["start"],
          "y": track["trackNumber"],
          "length": track["length"],
          "name": track["name"],
          "id": track["id"]
        }) ;
        if ("title" in track) {
          document.querySelector("#track-"+(track["trackNumber"]+1)+">.title-text").value = track["title"];
        }
        if ("volume" in track) {
          document.querySelector("#track-"+(track["trackNumber"]+1)+">.title-range").value = track["volume"];
        }
      }
      music.musicData = ret;
      music.page = 0;
      this.audio = null ;
      update(canvas, p=0);
    } ;
  } ;
  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
}

/** wavで保存 **/
function saveWav() {
  music.audioLoad().then(() => {
    console.log(music.audio);
    if ( music.audio.split(",")[1]!=="undefined" ) {
      const blob = toBlob(music.audio);
      const a    = document.createElement("a");
      a.href     = URL.createObjectURL(blob);
      a.target   = "_blank";
      a.download = "music.wav";
      a.click();
    }
  })
}
