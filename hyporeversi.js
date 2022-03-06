var board=new Array(64);
var playing,passing;

var imgNone,imgBlack,imgWhite,imgDialog;
var imgButton,imgButtonHilite;
var imgButtonDefault,imgButtonDefaultHilite;
var imgTrans1,imgTrans2,imgTrans3;
var dialog,buttonPushing,cpu;
var title,startmenu;
var transiting,transArray;

onload = function(){ init(); }

function init(){
	title=true;
	startmenu=true;

	imgNone = new Image();
	imgNone.src = "img_none.png?" + new Date().getTime();;
	imgNone.onload = function(){ draw(); }
	
	imgBlack = new Image();
	imgBlack.src = "img_black.png?" + new Date().getTime();;
	imgBlack.onload = function(){ draw(); }
	
	imgWhite = new Image();
	imgWhite.src = "img_white.png?" + new Date().getTime();;
	imgWhite.onload = function(){ draw(); }
	
	imgDialog = new Image();
	imgDialog.src = "img_dialog.png?" + new Date().getTime();;
	//imgDialog.onload = function(){ draw(); }
	
	imgButton = new Image();
	imgButton.src = "img_button.png?" + new Date().getTime();;
	imgButton.onload = function(){ draw(); }
	
	imgButtonHilite = new Image();
	imgButtonHilite.src = "img_button_hilite.png?" + new Date().getTime();;
	imgButtonHilite.onload = function(){ draw(); }
	
	imgButtonDefault = new Image();
	imgButtonDefault.src = "img_button_default.png?" + new Date().getTime();;
	//imgButtonDefault.onload = function(){ draw(); }
	
	imgButtonDefaultHilite = new Image();
	imgButtonDefaultHilite.src = "img_button_default_hilite.png?" + new Date().getTime();;
	//imgButtonDefaultHilite.onload = function(){ draw(); }
	
	imgTrans1 = new Image();
	imgTrans1.src = "img_trans_1.png?" + new Date().getTime();;
	//imgTrans1.onload = function(){ draw(); }
	
	imgTrans2 = new Image();
	imgTrans2.src = "img_trans_2.png?" + new Date().getTime();;
	//imgTrans2.onload = function(){ draw(); }
	
	imgTrans3 = new Image();
	imgTrans3.src = "img_trans_3.png?" + new Date().getTime();;
	//imgTrans3.onload = function(){ draw(); }
	
	reset();
	
	var canvas = document.getElementById('boardCanvas');
	canvas.onmousedown=function(e){
		click(e);
		e.preventDefault();
		return false;
	}
	canvas.ontouchstart=function(){
		click(event.touches[0]);
		event.preventDefault();
		return false;
	}
	canvas.onmouseup=function(e){
		leave(e);
		e.preventDefault();
		return false;
	}
	canvas.ontouchend=function(){
		leave(event.touches[0]);
		event.preventDefault();
		return false;
	}
	
	if(navigator.userAgent.indexOf('iPhone')>=0||
		navigator.userAgent.indexOf('iPad')>=0||
		navigator.userAgent.indexOf('iPod')>=0||
		navigator.userAgent.indexOf('Android')>=0) environment=1;
	else environment=0;
	draw();
}

function reset(){
	for(var i=0;i<64;i++) board[i]=0;
	board[27]=2;
	board[28]=1;
	board[35]=1;
	board[36]=2;
	playing=1;
	passing=0;
	cpu=0;
	dialog=undefined;
	buttonPushing=0;
	transArray=undefined;
	transiting=0;
}

function leave(e){

	if(transiting!=0) return;

	if(dialog!=undefined&&dialog!=""&&buttonPushing>0){
		buttonPushing=0;
		dialog=undefined;
		if(playing==0) startmenu=true;
		draw();
		if(passing!=0){
			passing=0;
			cpusPlay();
		}
	}
	
	if(startmenu&&buttonPushing>0){
		var tmpCpu=0;
		if(buttonPushing==2) tmpCpu=2;
		if(buttonPushing==3) tmpCpu=1;
		buttonPushing=0;
		reset();
		cpu=tmpCpu;
		startmenu=false;
		title=false;
		draw();
		cpusPlay();
	}
}

function putDisc(pX,pY){
	var play=playable(pX,pY);
	if(play.length>0){
		board[pX+pY*8]=playing;
		for(var i=0;i<play.length;i++) board[play[i]]=playing;
		transArray=play;
		if(playing==1) transiting=-5;
		else if(playing==2) transiting=5;
		transit();
	}
}

function transit(){
	if(transiting<0){
		transiting++;
		draw();
	}else if(transiting>0){
		transiting--;
		draw();
	}
	
	if(transiting==0){
		playing=3-playing;
		transArray=undefined;
		
		var flg=0;
		for(var y=0;y<8&&flg==0;y++){
			for(var x=0;x<8&&flg==0;x++){
				if(playable(x,y).length>0) flg=1;	
			}
		}
		if(flg==0){
			playing=3-playing;
			var flg2=0;
			for(var y=0;y<8&&flg==0;y++){
				for(var x=0;x<8&&flg==0;x++){
					if(playable(x,y).length>0) flg2=1;	
				}
			}
			if(flg2==0){
				playing=0;
				draw();
				judge();
			}else{
				if(playing==1){
					passing==1;
					dialog="後攻は石を置けないためパスします。";
				}
				if(playing==2){
					passing==2;
					dialog="先攻は石を置けないためパスします。";
				}
			}
			draw();
		}else{
			cpusPlay();
		}
	}else{
		setTimeout('transit()',100);
	}
}

function click(e){
	var aX,aY,pX,pY;
	
	if(transiting!=0) return;
	
	if(e.offsetX!=undefined){
		aX=e.offsetX;
		aY=e.offsetY;
		pX=Math.floor((e.offsetX)/32);
		pY=Math.floor((e.offsetY)/32);
	}else if(e.pageX!=undefined){
		aX=e.pageX-rect.left-window.pageXOffset;
		aY=e.pageY-rect.top-window.pageYOffset;
		pX=Math.floor((e.pageX-rect.left-window.pageXOffset)/32);
		pY=Math.floor((e.pageY-rect.top-window.pageYOffset)/32);
	}else{
		aX=e.clientX-rect.left-document.body.scrollLeft;
		aY=e.clientY-rect.top-document.body.scrollTop;
		pX=Math.floor((e.clientX-rect.left-document.body.scrollLeft)/32);
		pY=Math.floor((e.clientY-rect.top-document.body.scrollTop)/32);
	}
	
	//window.alert(""+pX+","+pY);
	
	if(dialog!=undefined&&dialog!=""){
		if(aX>144&&aY>136&&aX<224&&aY<160){
			buttonPushing=1;
			draw();
		}
		return;
	}
	
	if(startmenu){
		if(aX>88&&aY>212&&aX<168&&aY<236){
			buttonPushing=1;
			draw();
		}
		if(aX>24&&aY>180&&aX<104&&aY<204){
			buttonPushing=2;
			draw();
		}
		if(aX>152&&aY>180&&aX<232&&aY<204){
			buttonPushing=3;
			draw();
		}
		return;
	}
	
	putDisc(pX,pY);
}

function judge(){
	var cnt=0;
	for(i=0;i<64;i++){
		if(board[i]==1) cnt++;
		if(board[i]==2) cnt--;
	}
	if(cnt>0) dialog="この勝負は、先攻の勝ちです。";
	if(cnt<0) dialog="この勝負は、後攻の勝ちです。";
	if(cnt==0) dialog="この勝負は、引き分けです。";
	buttonPushing=0;
	draw();
}

function draw(){
	var canvas = document.getElementById('boardCanvas');
	var x,y;
	if(!canvas||!canvas.getContext){
		return false;
	}
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0,0,256,256);
	
	for(y=0;y<8;y++){
		for(x=0;x<8;x++){
			switch(board[x+y*8]){
				case 1:
					ctx.drawImage(imgBlack,x*32,y*32);
					break;
				case 2:
					ctx.drawImage(imgWhite,x*32,y*32);
					break;
				case 0:
					ctx.drawImage(imgNone,x*32,y*32);
					break;
			}
		}
	}
	
	if(transiting!=0&&transArray!=undefined){
		for(var i=0;i<transArray.length;i++){
			x=parseInt(transArray[i]%8);
			y=parseInt(transArray[i]/8);
			if(transiting<=-5){
				ctx.drawImage(imgTrans3,x*32,y*32);
			}else if(transiting==-4){
				ctx.drawImage(imgTrans3,x*32,y*32);
			}else if(transiting==-3){
				ctx.drawImage(imgTrans2,x*32,y*32);
			}else if(transiting==-2){
				ctx.drawImage(imgTrans1,x*32,y*32);
			}else if(transiting==-1){
				ctx.drawImage(imgBlack,x*32,y*32);
			}else if(transiting==1){
				ctx.drawImage(imgWhite,x*32,y*32);
			}else if(transiting==2){
				ctx.drawImage(imgTrans3,x*32,y*32);
			}else if(transiting==3){
				ctx.drawImage(imgTrans2,x*32,y*32);
			}else if(transiting==4){
				ctx.drawImage(imgTrans1,x*32,y*32);
			}else if(transiting>=5){
				ctx.drawImage(imgTrans1,x*32,y*32);
			} 
		}
	}
	
	if(dialog!=undefined&&dialog!=""){
		ctx.drawImage(imgDialog,16,80);
		ctx.font="12px sans-serif";
		ctx.fillStyle="black";
		ctx.lineWidth=1.0;
		ctx.textAlign="left";
		ctx.fillText(dialog,32,112);
		
		if(buttonPushing==0){
			ctx.drawImage(imgButtonDefault,144,136);
			ctx.fillStyle="black";
		}else{
			ctx.drawImage(imgButtonDefaultHilite,144,136);
			ctx.fillStyle="white";
		}
		ctx.font="12px sans-serif";
		ctx.lineWidth=1.0;
		ctx.textAlign="center";
		ctx.fillText("OK",184,153);
	}
	
	if(title){
		ctx.font="36px sans-serif";
		ctx.textAlign="center";
		ctx.lineWidth=3.0;
		ctx.strokeStyle="black";
		ctx.strokeText("HypoReversi",129,73);
		ctx.strokeStyle="black";
		ctx.strokeText("HypoReversi",128,72);
		ctx.fillStyle="white";
		ctx.fillText("HypoReversi",128,72);
	}
	
	if(startmenu){
		if(buttonPushing==1){
			ctx.drawImage(imgButtonHilite,88,212);
			ctx.fillStyle="white";
		}else{
			ctx.drawImage(imgButton,88,212);
			ctx.fillStyle="black";
		}
		ctx.font="12px sans-serif";
		ctx.lineWidth=1.0;
		ctx.textAlign="center";
		ctx.fillText("人間 vs 人間",128,229);
		
		if(buttonPushing==2){
			ctx.drawImage(imgButtonHilite,24,180);
			ctx.fillStyle="white";
		}else{
			ctx.drawImage(imgButton,24,180);
			ctx.fillStyle="black";
		}
		ctx.font="12px sans-serif";
		ctx.lineWidth=1.0;
		ctx.textAlign="center";
		ctx.fillText("人間 vs CPU",64,197);
		
		if(buttonPushing==3){
			ctx.drawImage(imgButtonHilite,152,180);
			ctx.fillStyle="white";
		}else{
			ctx.drawImage(imgButton,152,180);
			ctx.fillStyle="black";
		}
		ctx.font="12px sans-serif";
		ctx.lineWidth=1.0;
		ctx.textAlign="center";
		ctx.fillText("CPU vs 人間",192,197);
	}
}

function playable(pX,pY,pP){
	var res=new Array(0);
	var tmp=new Array(0);
	var x,y;
	var p=pP;
	if(p==undefined) p=playing;
	
	if(board[pX+pY*8]!=0) return false;
	
	tmp=new Array(0); x=pX; y=pY;
	x++;
	while(x>=0&&y>=0&&x<=7&&y<=7){
		if(board[x+y*8]==0){
			tmp=new Array(0);
			break;
		}
		if(board[x+y*8]==3-p) tmp.push(x+y*8);
		if(board[x+y*8]==p) break;
		x++;
	}
	if(x>=0&&y>=0&&x<=7&&y<=7) res=res.concat(tmp);
	
	tmp=new Array(0); x=pX; y=pY;
	x--;
	while(x>=0&&y>=0&&x<=7&&y<=7){
		if(board[x+y*8]==0){
			tmp=new Array(0);
			break;
		}
		if(board[x+y*8]==3-p) tmp.push(x+y*8);
		if(board[x+y*8]==p) break;
		x--;
	}
	if(x>=0&&y>=0&&x<=7&&y<=7) res=res.concat(tmp);
	
	tmp=new Array(0); x=pX; y=pY;
	y++;
	while(x>=0&&y>=0&&x<=7&&y<=7){
		if(board[x+y*8]==0){
			tmp=new Array(0);
			break;
		}
		if(board[x+y*8]==3-p) tmp.push(x+y*8);
		if(board[x+y*8]==p) break;
		y++;
	}
	if(x>=0&&y>=0&&x<=7&&y<=7) res=res.concat(tmp);
	
	tmp=new Array(0); x=pX; y=pY;
	y--;
	while(x>=0&&y>=0&&x<=7&&y<=7){
		if(board[x+y*8]==0){
			tmp=new Array(0);
			break;
		}
		if(board[x+y*8]==3-p) tmp.push(x+y*8);
		if(board[x+y*8]==p) break;
		y--;
	}
	if(x>=0&&y>=0&&x<=7&&y<=7) res=res.concat(tmp);
	
	tmp=new Array(0); x=pX; y=pY;
	x++; y++;
	while(x>=0&&y>=0&&x<=7&&y<=7){
		if(board[x+y*8]==0){
			tmp=new Array(0);
			break;
		}
		if(board[x+y*8]==3-p) tmp.push(x+y*8);
		if(board[x+y*8]==p) break;
		x++; y++;
	}
	if(x>=0&&y>=0&&x<=7&&y<=7) res=res.concat(tmp);
	
	tmp=new Array(0); x=pX; y=pY;
	x++; y--;
	while(x>=0&&y>=0&&x<=7&&y<=7){
		if(board[x+y*8]==0){
			tmp=new Array(0);
			break;
		}
		if(board[x+y*8]==3-p) tmp.push(x+y*8);
		if(board[x+y*8]==p) break;
		x++; y--;
	}
	if(x>=0&&y>=0&&x<=7&&y<=7) res=res.concat(tmp);
	
	tmp=new Array(0); x=pX; y=pY;
	x--; y++;
	while(x>=0&&y>=0&&x<=7&&y<=7){
		if(board[x+y*8]==0){
			tmp=new Array(0);
			break;
		}
		if(board[x+y*8]==3-p) tmp.push(x+y*8);
		if(board[x+y*8]==p) break;
		x--; y++;
	}
	if(x>=0&&y>=0&&x<=7&&y<=7) res=res.concat(tmp);
	
	tmp=new Array(0); x=pX; y=pY;
	x--; y--;
	while(x>=0&&y>=0&&x<=7&&y<=7){
		if(board[x+y*8]==0){
			tmp=new Array(0);
			break;
		}
		if(board[x+y*8]==3-p) tmp.push(x+y*8);
		if(board[x+y*8]==p) break;
		x--; y--;
	}
	if(x>=0&&y>=0&&x<=7&&y<=7) res=res.concat(tmp);
	
	return res;
}

function cpusPlay(){
	if(playing==0||cpu!=playing) return;
	var max=-1;
	var place=0;
	
	for(var y=0;y<8;y++){
		for(var x=0;x<8;x++){
			var arr=playable(x,y);
			if(arr.length>0){
				arr.push(x+y*8);
				var score=playableToScore(arr);
				if(max<score){
					place=x+y*8;
					max=score;
				}
			}
		}
	}
	
	putDisc(parseInt(place%8),parseInt(place/8));
}

function playableToScore(arr){
	var score=40;
	for(var i=0;i<arr.length;i++){
		var x=parseInt(arr[i]%8);
		var y=parseInt(arr[i]/8);
		if((x==0&&y==0)||(x==0&&y==7)||(x==7&&y==7)||(x==7&&y==0)){
			score+=64;
		}else if((x==1&&y==0)||(x==0&&y==1)){
			if(board[0]==0) score--;
			else score++;
		}else if((x==1&&y==7)||(x==0&&y==6)){
			if(board[56]==0) score--;
			else score++;
		}else if((x==6&&y==7)||(x==7&&y==6)){
			if(board[63]==0) score--;
			else score++;
		}else if((x==6&&y==0)||(x==7&&y==1)){
			if(board[7]==0) score--;
			else score++;
		}if((x==0)||(x==7)){
			if(board[x+y*8-8]==3-playing&&board[x+y*8+8]==3-playing) score+=8;
			else if(board[x+y*8-8]==3-playing||board[x+y*8+8]==3-playing) score-=8;
			else score-=8;
		}if((y==7)||(y==0)){
			if(board[x+y*8-1]==3-playing&&board[x+y*8+1]==3-playing) score+=8;
			else if(board[x+y*8-1]==3-playing||board[x+y*8+1]==3-playing) score-=8;
			else score-=8;
		}else if(x==1&&y==1){
			if(board[0]==0) score-=8;
			else score+=8
		}else if(x==1&&y==6){
			if(board[56]==0) score-=8;
			else score+=8;
		}else if(x==6&&y==6){
			if(board[63]==0) score-=8;
			else score+=8;
		}else if(x==6&&y==1){
			if(board[7]==0) score-=8;
			else score+=8;
		}else{
			score++;
		}
	}
	
	return score;
}