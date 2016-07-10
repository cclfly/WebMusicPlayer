var Music = function(id){
	id = id?id:"music";
	return {
		//音频对象
		audioDom: null,
		//播放状态
		playFlag: false,
		//当前歌曲文件名
		fileName: "",
		
		//初始化音乐环境
		Init: function(){
			this.audioDom = document.getElementById(id);
			if(this.audioDom == null){
				this.audioDom = new Audio();
				this.audioDom.id = id;
			}
			this.load("media/灰烬.mp3");
		},
		//加载音乐文件
		load: function(src){
			this.audioDom.src = src;
			this.fileName = src.substring(src.lastIndexOf("/")+1,src.lastIndexOf("."));
			console.log(this.fileName);
		},
		//播放
		Play: function(){
			this.audioDom.play();
			this.playFlag = true;
		},
		//停止
		Stop: function(){
			this.audioDom.pause();
			this.audioDom.currentTime = 0;
			this.playFlag = false;
		},
		//暂停
		Pause: function(){
			this.audioDom.pause();
			this.playFlag = false;
		},
		//获取当前播放时间（秒）
		_getTime: function(){
			return this.audioDom.currentTime;
		},
		//格式化当前播放时间（分:秒.毫秒）
		getTime: function(){
			var time = this._getTime();
			var m = Math.floor(m = time / 60);
			var s = Math.floor(time % 60);
			var ms = Math.floor((time - Math.floor(time))*100);
			return (m<10?'0'+m:m)+':'+(s<10?'0'+s:s)+'.'+(ms<10?'0'+ms:ms);
		},
		//获取当前歌曲总时长（秒）
		_getDuration: function(){
			return this.audioDom.duration;
		},
		//格式化当前歌曲总时长（分:秒.毫秒）
		getDuration: function(){
			var time = this._getDuration();
			var m = Math.floor(m = time / 60);
			var s = Math.floor(time % 60);
			var ms = Math.floor((time - Math.floor(time))*100);
			return (m<10?'0'+m:m)+':'+(s<10?'0'+s:s)+'.'+(ms<10?'0'+ms:ms);
		},
		//判断歌曲是否结束
		isEnd: function(){
			return this.audioDom.ended;
		}
	};
}