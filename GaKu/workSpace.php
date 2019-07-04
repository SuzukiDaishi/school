<?php
session_start();
if (!isset($_SESSION["ID"])) {
    header("Location: /GaKu/Home/");
    exit;
}
?>

<!DOCTYPE html>
<html lang="ja">
	<head>
		<meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="./css/workSpaceStyle.css">
		<style type="text/css">
		a {
			text-decoration: none;
			color: #000;
			transition: text-shadow 0.2s;
		}
		a:hover {
			text-shadow: 1px 2px 3px #808080;
			transition: text-shadow 0.2s;
		}
    </style>
		<script src="./js/vue.min.js"></script>
		<script src="./js/axios.min.js"></script>
		<script src="./js/workSpaceScript.js" async></script>
		<script src="./js/workSpaceCanvasScript.js"></script>
		<script type="text/javascript" defer>
		window.onbeforeunload = (event) => {
  		event = event || window.event;
  		event.returnValue = "行った変更が保存されない可能性があります。";
		}

		let trackList ;
		let canvas ;
		onload = () => {
			/* UI変更系のScript */
			new Vue({el: ".vue-wrapper"});
			trackList = new Vue({
				el: "#track-list",
				data: {
					tracks: null
  			},
				mounted () {
    			axios
    			.get("./API/track/search.php")
      		.then(response => {
						this.tracks = response.data;
					})
  			}
			});

			/* workspace関連のScript */
			canvas = document.querySelector("#workspace-canvas");
			setup( canvas );
			update( canvas );
			document.addEventListener("dragstart", function( event ) {
				event.target.style.opacity = .3;
				window.sendTrack = event.target ;
  		}, false);
			document.addEventListener("drop", function( event ) {
				if (event.target.id === "workspace-canvas") {
					//console.log("ドロップ", event.target);
					//console.log("ドラッグ", sendTrack);
					const rect   = canvas.getBoundingClientRect() ;
					const x      = event.clientX - rect.left;
					const y      = event.clientY - rect.top;
					let data = canvasPos2tablePos(x, y, canvas);
					data["x"] += music.page;
					data["length"] = Number(sendTrack.querySelector("#length").value);
					data["id"] = Number(sendTrack.querySelector("#id").value);
					data["name"] = sendTrack.querySelector("p").innerHTML;
					music.add( data ) ;
					update(canvas, music.page) ;
				}
  		}, false);
			document.addEventListener("dragend", function( event ) {
				event.target.style.opacity = 1;
				window.sendTrack = null;
  		}, false);
			document.addEventListener("dragover", function( event ) {
				event.preventDefault();
  		}, false);
			document.addEventListener("dragenter", function( event ) {
				// 選択中
			}, false);
			document.addEventListener("dragleave", function( event ) {
				// 選択解除
			}, false);
			document.addEventListener("drop", function( event ) {
				event.preventDefault();
			}, false);
			window.addEventListener("keydown", function ( event ) {
				var keyCode = event.keyCode;
  			if (keyCode==39&&music.page+1>0) music.page += 1;
  			if (keyCode==37&&music.page-1>=0) music.page -= 1;
				update(canvas, music.page);
			});
			canvas.addEventListener("click", function( event ) {
				let rect = event.target.getBoundingClientRect();
    		let x = event.clientX - rect.left;
    		let y = event.clientY - rect.top;
				let pos = canvasPos2tablePos(x, y, canvas);
				music.remove(pos.x+music.page, pos.y);
				update(canvas, music.page);
			}, false);
		};
    setInterval( () => {
      let dom = document.querySelector('#gaku-logo')
      dom.innerHTML = "GaKu" ;
      if ( audio !== null ) {
        if ( audio.currentTime ) {
          dom.innerHTML = Math.floor(audio.currentTime*2)+1 + "/" + audio.duration*2 + "拍" ;
          update(canvas, music.page);
          let ctx = canvas.getContext('2d');
          ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
          console.log(music.page);
          ctx.fillRect(canvas.width/7*(Math.floor(audio.currentTime/2)-music.page), 0, canvas.width/7, canvas.height);
        } else {
          update(canvas, music.page);
        }
      }
    }, 100) ;
		</script>
		<title>GaKu</title>
	</head>
 	<body>
    <div>

      <div class="side-bar">
        <h1 class="side-bar-title"><a id="gaku-logo" href="/GaKu/mypage/">GaKu</a></h1>
				<input type="text" class="search-box" onkeyup="onSearch(this, event, trackList)" placeholder="search"/>
				<div id="track-list" class="scroll-box">
					<div :id="'track_'+track.track_id" class="track-box" draggable="true" v-for="track in tracks">
						<p>{{track.track_name}}</p>
						<input type="hidden" id="id" :value="track.track_id" />
						<input type="hidden" id="date" :value="track.track_date" />
						<input type="hidden" id="serch" :value="track.track_serch" />
						<input type="hidden" id="length" :value="track.track_length" />
						<input type="hidden" id="user" :value="track.user_id" />
						<audio :id="'audio_'+track.track_id" :src="'./track/'+track.track_file" loop></audio>
						<button :onclick="'audioTrackPlay(\'audio_'+track.track_id+'\', this)'">
							<img draggable="false" class="button-small" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDYwIDYwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA2MCA2MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI2NHB4IiBoZWlnaHQ9IjY0cHgiPgo8Zz4KCTxwYXRoIGQ9Ik00NS41NjMsMjkuMTc0bC0yMi0xNWMtMC4zMDctMC4yMDgtMC43MDMtMC4yMzEtMS4wMzEtMC4wNThDMjIuMjA1LDE0LjI4OSwyMiwxNC42MjksMjIsMTV2MzAgICBjMCwwLjM3MSwwLjIwNSwwLjcxMSwwLjUzMywwLjg4NEMyMi42NzksNDUuOTYyLDIyLjg0LDQ2LDIzLDQ2YzAuMTk3LDAsMC4zOTQtMC4wNTksMC41NjMtMC4xNzRsMjItMTUgICBDNDUuODM2LDMwLjY0LDQ2LDMwLjMzMSw0NiwzMFM0NS44MzYsMjkuMzYsNDUuNTYzLDI5LjE3NHogTTI0LDQzLjEwN1YxNi44OTNMNDMuMjI1LDMwTDI0LDQzLjEwN3oiIGZpbGw9IiMwMDAwMDAiLz4KCTxwYXRoIGQ9Ik0zMCwwQzEzLjQ1OCwwLDAsMTMuNDU4LDAsMzBzMTMuNDU4LDMwLDMwLDMwczMwLTEzLjQ1OCwzMC0zMFM0Ni41NDIsMCwzMCwweiBNMzAsNThDMTQuNTYxLDU4LDIsNDUuNDM5LDIsMzAgICBTMTQuNTYxLDIsMzAsMnMyOCwxMi41NjEsMjgsMjhTNDUuNDM5LDU4LDMwLDU4eiIgZmlsbD0iIzAwMDAwMCIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo="/>
						</button>
					</div>
				</div>
      </div>


      <div class="top-bar" >
				<a class="player-button play-logo" onclick="onClickOfClick(this);"></a>
				<div class="control-box">
					<button class="control-button" onclick="loadJson_V2(canvas);">load</button>
					<button onclick="saveJson_V2();" class="control-button">save</button>
					<button class="control-button" onclick="saveWav()">export</button>
				</div>
      </div>


      <div class="workspace">
				<div class="vue-wrapper">
					<div :id="'track-'+n" :style="n%2==0?'background:#fff;':'background:#eee;'" class="workspace-title" v-for="n in 9">
						<input type="text" class="title-text" :value="'track-'+n"/>
						<input type="range" class="title-range" value="0" min="-20" max="20" step="1">
					</div>
				</div>

				<canvas id="workspace-canvas">
				</canvas>
      </div>



    </div>
 	</body>
</html>
