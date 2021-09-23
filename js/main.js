enchant();
window.onload = function() {
	var game_ = new Game(320,320);
	game_.fps = 24;
	game_.preload('./img/gauge2.png',
                  './img/glass.png',
                  './img/jack.png',
                  './img/red.png',
                  './img/sanma.png',
                  './img/start.png',
                  './img/tree.png');
	game_.onload = function(){
		var createStartScene = function(){
			var scene = new Scene();
			scene.backgroundColor ='#c06020';
			var title = new Label('秋刀魚飛ばし');
			title.textAlign = 'center';
			title.color = '#c0f020';
			title.x =0;
			title.y =96;
			title.font ='35px sans-serif';
			scene.addChild(title);

			var startImage = new Sprite(320,160);
			startImage.image =game_.assets['./img/start.png'];
			startImage.x = 0;
			startImage.y = 175;
			startImage.scaleX =0.5;
			startImage.scaleY =0.5;
			scene.addChild(startImage);
			startImage.addEventListener(Event.TOUCH_START, function(e){
				game_.replaceScene(createGameScene());
			});
			return scene;
		};
		var createGameScene = function() {
			var scene = new Scene();
			scene.backgroundColor='#f0e080';
			var tree = new Sprite(200,200);
			tree.image = game_.assets['./img/tree.png'];
			tree.x=-320;
			tree.y=100;
			scene.addChild(tree);

			var gauge2 = new Sprite(50,150);
			gauge2.image = game_.assets['./img/gauge2.png'];
			gauge2.x=30;
			gauge2.y=70;
			scene.addChild(gauge2);

			var gauge = new Sprite(30,30);
			gauge.image = game_.assets['./img/red.png'];
			gauge.x=40;
			gauge.y=200;
			gauge.scaleY=0;
			scene.addChild(gauge);

			var sanma = new Sprite(200,54);
			sanma.image = game_.assets['./img/sanma.png'];
			sanma.x=120;
			sanma.y=200;
			sanma.scaleX =1;
			sanma.scaleY =1;
			scene.addChild(sanma);

			var glass = new Sprite(320,20);
			glass.image = game_.assets['./img/glass.png'];
			glass.x=0;
			glass.y=300;
			scene.addChild(glass);

			var glass2 = new Sprite(320,20);
			glass2.image = game_.assets['./img/glass.png'];
			glass2.x=-320;
			glass2.y=300;
			scene.addChild(glass2);

			var glass3 = new Sprite(320,20);
			glass3.image = game_.assets['./img/glass.png'];
			glass3.x=-160;
			glass3.y=300;
			scene.addChild(glass3);

			var jack = new Sprite(100,100);
			jack.image = game_.assets['./img/jack.png'];
			jack.x = -820;
			jack.y = 100;
			scene.addChild(jack);

			var length=0;

			var score = new Label();
			score.text ="Score:"+length;
			if(length>=10000){
				score.color='#aececb';
			}else if(length>=7000){
				score.color='#fcd424';
			}else if(length>=3000){
				score.color='#f3983b';
			}else{
				score.color='#f70f1f';
			}
			score.x=180;
			score.y=10;
			score.font='20px sans-serif';
			scene.addChild(score);

			var retry = new Label('RETRY');
			retry.color='#874684';
			retry.x=10;
			retry.y=10;
			scene.addChild(retry);

      var tweet = new Label('つぶやく');//removed
			tweet.color='#00ffff';
			tweet.x=1000;
			tweet.y=1000;
			tweet.font='15px sans-serif';
			scene.addChild(tweet);

			var rank =new Label();
			// rank.text="ランキング:取得中...";
			rank.color='#a6126a';
			rank.x=1000;
			rank.y=1000;
			scene.addChild(rank);

			var joutai = 0;
			var oufuku=0;
			var speedx;
			var speedy;
			var SPEEDX;
			var SPEEDY;
			var time;
			var ThisRank;
			var response;

			var total;

			function RankingNowRec(json){
				ThisRank=json.response.rank;
				total=json.response.total;
				rank.text="ランキング:"+json.response.rank + " / " + json.response.total;
				if(joutai==3){
        	tweet.x=210;
        	tweet.y=165;
				}
			}
			window.RankingNow = RankingNowRec;
			function loadScript(src, callback) {
  			var head = document.getElementsByTagName('head')[0];
  			var script = document.createElement('script');
   			script.src = src;
  			head.appendChild(script);
 				callback();
			}
			retry.addEventListener(Event.TOUCH_START,function(e){
				game_.replaceScene(createGameScene());
			});

      tweet.addEventListener(Event.TOUCH_START,function(e){
				setTimeout(function() {
					var locate = location.href;
					var tweetlink = "http://twitter.com/intent/tweet?text="+encodeURIComponent("Score: " +Math.floor(length)+"\nランキング: "+ ThisRank + " / " + total+"\n#秋刀魚飛ばし\n"+locate)+" \n";
					if(!window.open(tweetlink)) {
						window.location.href = tweetlink;
					}
				}, 10);
			});

			scene.addEventListener(Event.TOUCH_START,function(e){
				if(joutai===0){
					joutai=1;
					oufuku=0;
				}else if(joutai==1){
					joutai=2;
					speedx=(203-gauge.y)*Math.cos(sanma.rotation*(Math.PI/180));
					speedy=(203-gauge.y)*Math.sin(sanma.rotation*(Math.PI/180));
					SPEEDX=speedx;
					SPEEDY=speedy;
				}
			});
			scene.addEventListener(Event.ENTER_FRAME,function(){

				if(glass.x>=170){
					glass.x=-320;
				}
				if(glass2.x>=170){
					glass2.x=-320;
				}
				if(glass3.x>=170){
					glass3.x=-320;
				}
				if(jack.x>=320){
					jack.x=-820;
				}

				if(joutai===0){
					if(oufuku===0){
						sanma.rotate(3);
						sanma.y-=3*Math.cos(sanma.rotation*(Math.PI/180));
						sanma.x+=3*Math.sin(sanma.rotation*(Math.PI/180));
						if(sanma.rotation >= 90){
							oufuku = 1;
						}
					}else if(oufuku==1){
						sanma.rotate(-3);
						sanma.y+=3*Math.cos(sanma.rotation*(Math.PI/180));
						sanma.x-=3*Math.sin(sanma.rotation*(Math.PI/180));
						if(sanma.rotation <= 0){
	            sanma.x=120;
	            sanma.y=200;
							oufuku = 0;
						}
					}
				}
				if(joutai==1){
					if(oufuku===0){
						gauge.scaleY+=0.1;
						gauge.y-=1.5;
						if(gauge.y<=150){
							oufuku=1;
						}
					}else if(oufuku==1){
						gauge.scaleY-=0.1;
						gauge.y+=1.5;
						if(gauge.y>=200){
							oufuku=0;
						}
					}
				}
				if(joutai==2){
					if(sanma.y<=260){
						time++;
						if(sanma.x>75){
							sanma.x-=speedx;
						}
						tree.x+=speedx*0.1;
						gauge.x+=speedx;
						gauge2.x+=speedx;
					 	glass.x+=speedx;
					 	glass2.x+=speedx;
					 	glass3.x+=speedx;
					 	jack.x+=speedx;
						sanma.y-=speedy;
						speedy-=1;
						//console.log(speedy);
						length+=speedx;
						score.text = "Score:"+Math.floor(length);
						if(sanma.y<=100){
							sanma.rotation-=1;
						}
						if(sanma.y<=150&&sanma.y>=50&&((jack.x-sanma.x<=50&&jack.x-sanma.x>=0)||(jack.x-sanma.x>=-50&&jack.x-sanma.x<=0))){
							SPEEDY*=(0.9 + Math.random()*0.1);
							speedy=SPEEDY;
						}
						if(length>=11000){
							score.color='#aececb';
						}else if(length>=9000){
							score.color='#ff77aa';
						}else if(length>=7000){
							score.color='#00aeb9';
						}else if(length>=5000){
							score.color='#01a860';
						}else if(length>=3000){
							score.color='#f3983b';
						}else if(length>2000){
							score.color='#0775c4';
						}else{
							score.color='#f70f1f';
						}
					}
					if(sanma.y>=260){
						if(sanma.x<=70){
						 	gauge.x+=40;
						 	gauge2.x+=40;
						 	glass.x+=40;
						 	glass2.x+=40;
						 	sanma.x+=40;
						}
						if(sanma.x>=70){
							rank.text="ランキング:取得中...";
							rank.x=40;
							rank.y=150;
					 		score.textAlign = 'center';
							score.x=0;
					 		score.y=96;
							score.font='40px sans-serif';
              loadScript("https://script.google.com/macros/s/AKfycbyFEaVwU5yn0uFWsO4tQl8YqJJDWYRLO_LkR5APaHKmVk4HyVlPHucahJSJ24mlBSMh/exec?score=" + Math.floor(length) + "&callback=RankingNow", function() {
 								console.log('script loaded');
							});
							// ランキングが壊れてた時のやつ
							// tweet.x=210;
							// tweet.y=165;
							joutai=3;
  					}
					}
				}
			});
			return scene;
		};

		game_.replaceScene(createStartScene());
	};
	game_.start();
};
