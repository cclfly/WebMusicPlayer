var Player = function(id){
	id = id?id:'musicbox';
	return {
		//播放器盒子
		musicbox: null,
		//音乐环境
		music: null,
		//控制器盒子
		control: null,
		//开始暂停按钮
		oBtn_PlayPause: null,
		//停止按钮
		oBtn_Stop: null,
		//时间
		oTxt_Time: null,
		//当前曲目总时长
		oTxt_Duration: null,
		//计时器
		timer: null,
		//歌词框
		oBoxLrc: null,
		//歌词本体
		oBdyLrc: null,
		//歌词文本元素
		aLrc: [],
		//进度条
		progress: null,
		
		//初始化播放器
		Init: function(){
			//获取或创建播放器盒子
			this.musicbox = document.getElementById(id);
			if(!this.musicbox){
				this.musicbox = document.createElement('div');
				this.musicbox.id = id;
				document.getElementsByTagName('body')[0].appendChild(this.musicbox);
			}
			
			//实例化音乐环境
			this.music = new Music();
			this.music.Init();
			
			//控制器盒子
			this.control = document.createElement('div');
			this.control.id = "mp_control";
			
			//定义开始暂停按钮
			this.oBtn_PlayPause = document.createElement('input');
			this.oBtn_PlayPause.type = "button";
			this.oBtn_PlayPause.id = "mp_playpause";
			this.oBtn_PlayPause.value = "播放";
			//绑定点击事件
			this.oBtn_PlayPause.onclick = function(){
				if(this.music.playFlag){
					this.music.Pause();
					this.oBtn_PlayPause.value = "播放";
				}else{
					this.music.Play();
					this.oBtn_PlayPause.value = "暂停";
				}
			} .bind(this);
			
			//定义停止按钮
			this.oBtn_Stop = document.createElement('input');
			this.oBtn_Stop.type = "button";
			this.oBtn_Stop.id = "mp_stop";
			this.oBtn_Stop.value = "停止";
			//绑定点击事件
			this.oBtn_Stop.onclick = function(){
				this.music.Stop();
				this.oBtn_PlayPause.value = "播放";
				this.oBdyLrc.style.top = '0';
			} .bind(this);
			
			//定义时间显示
			this.oTxt_Time = document.createElement('input');
			this.oTxt_Time.type = "text";
			this.oTxt_Time.id = "mp_time";
			this.oTxt_Time.readOnly = "true";
			
			//定义总时间显示
			this.oTxt_Duration = document.createElement('input');
			this.oTxt_Duration.type = "text";
			this.oTxt_Duration.id = "mp_duration";
			this.oTxt_Duration.readOnly = "true";
			
			
			
			//定义进度条
			this.progress = document.createElement('div');
			this.progress.id = "mp_progress";
			
			//将按钮添加到控制器组件
			this.control.appendChild(this.oBtn_PlayPause);
			this.control.appendChild(this.oBtn_Stop);
			this.control.appendChild(this.oTxt_Time);
			this.control.appendChild(this.oTxt_Duration);
			this.control.appendChild(this.progress);
			
			//定义计时器
			var v = 0;	//单行歌词超长时的运动速度
			this.timer = setInterval(function(){
				//获取播放时间
				this.oTxt_Time.value = this.music.getTime()+" /";
				this.oTxt_Duration.value = this.music.getDuration();
				//歌曲完毕时将music状态转为false
				if(this.music.isEnd())
				{
					this.oBtn_PlayPause.value = "播放";
					this.music.playFlag = false;
				}
				//当前歌词
				for(var i=0;i<this.aLrc.length;i++)
				{
					if(this.music._getTime()>this.aLrc[i].getAttribute('data-LrcTime')&&this.aLrc[i+1]&&this.music._getTime()<this.aLrc[i+1].getAttribute('data-LrcTime'))
					{
						if(this.aLrc[i].className == "mp_lrcitem on"){
							continue;
						}
						this.aLrc[i].className = "mp_lrcitem on";
						if((this.aLrc[i].innerText||this.aLrc[i].textContent).length*22>this.oBoxLrc.offsetWidth){
							if((this.aLrc[i].innerText||this.aLrc[i].textContent).length*22+30>this.oBoxLrc.offsetWidth){
								this.aLrc[i].style.marginLeft = '15px';
							}
						}
					} else{
						this.aLrc[i].className = "mp_lrcitem"
						this.aLrc[i].style.marginLeft = '0';
					}
				}
				//歌词位置
				var oLrcOn = document.getElementsByClassName('on')[0];
				if(oLrcOn){
					//判断当前歌词是否在歌词框中
					if((oLrcOn.offsetTop+this.oBdyLrc.offsetTop) > (this.oBoxLrc.offsetHeight/2-11)){
						this.oBdyLrc.style.top = this.oBdyLrc.offsetTop - ((oLrcOn.offsetTop+this.oBdyLrc.offsetTop)-(this.oBoxLrc.offsetHeight/2-11))/10 + 'px';
					}else if((oLrcOn.offsetTop+this.oBdyLrc.offsetTop) < 11){
						this.oBdyLrc.style.top = this.oBdyLrc.offsetTop - Math.floor(((oLrcOn.offsetTop+this.oBdyLrc.offsetTop)-11)/10) + 'px';
					}
					//判断歌词是否超长
					var iWidthLrcOn = (oLrcOn.innerText||oLrcOn.textContent).length * 22 + 30;
					var iMLLrc = parseFloat(oLrcOn.style.marginLeft);
					if((oLrcOn.innerText||oLrcOn.textContent).length*22>this.oBoxLrc.offsetWidth){
						if(iWidthLrcOn+iMLLrc > this.oBoxLrc.offsetWidth){
							var t = (this.aLrc[this.aLrc.indexOf(oLrcOn)+1].getAttribute('data-LrcTime')-oLrcOn.getAttribute('data-LrcTime'))*1000;
							var s = iWidthLrcOn - this.oBoxLrc.offsetWidth;
							var a = s/Math.pow(t,2);
							var b = 30;	//30ms刷新一次，时间单位由(ms)转换成(30ms)
							if(v>=0){
								if(15-iMLLrc<s/2){
									v += a*b;
								}else{
									v -= a*b;
								}
							}else{
								v = 0;
							}
							oLrcOn.style.marginLeft = iMLLrc - (v*b) + 'px';
						}else{
							v = 0;
						}
					}
				}
			} .bind(this),30);
			
			//定义歌词框
			this.oBoxLrc = document.createElement('div');
			this.oBoxLrc.id = "mp_lrcbox";
			this.oBdyLrc = document.createElement('div');
			this.oBdyLrc.id = "mp_lrcbody";
			var tmpThis = this;
			ajax({
				type: "post",
				url: "lib/getlrc.php",
				data: {
					"path": "media/lrc/",
					"name": tmpThis.music.fileName
				},
				success: function(json){
					if(json.flag){
						for(var i=0;i<json['count'];i++){
							
							var oLrcItem = document.createElement('p');
							oLrcItem.className = "mp_lrcitem";
							oLrcItem.setAttribute('data-LrcTime',json['time'][i]);
							if(oLrcItem.innerText){
								oLrcItem.innerText = json['lrc'][i];
							}else{
								oLrcItem.textContent = json['lrc'][i];
							}
							tmpThis.aLrc.push(oLrcItem);
							if(json['lrc'][i]=="")
							{
								continue;
							}
							tmpThis.oBdyLrc.appendChild(oLrcItem);
						}
						var oLrcItem = document.createElement('p');
						oLrcItem.setAttribute('data-LrcTime',tmpThis.music._getDuration());
						tmpThis.aLrc.push(oLrcItem);
					}
				},
				dataType: "json"
			});
			this.oBoxLrc.appendChild(this.oBdyLrc);
			
			//将组件添加到播放器盒子
			this.musicbox.appendChild(this.control);
			this.musicbox.appendChild(this.oBoxLrc);
			
			//显示默认播放器样式
			this.music.audioDom.controls = "controls";
			this.music.audioDom.style.width = "100%";
			this.musicbox.appendChild(this.music.audioDom);
		}
	};
};
