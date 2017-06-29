$(document).ready(function(){
	var square_length = 20;//每个方块的边长[都是正方形]
	var speedArr = [1000, 600, 300, 100];//预定速度值
	var speed = speedArr[2];//速度
	var direction = 39;//方向： 左[ascII码37] 上[38]   右[39]    下[40]
	var direction_flag = false;//键盘相应，初始为关闭状态
	var gamebox_width = 600;//游戏盒子宽度
	var gamebox_height = 400;//游戏盒子高度
	var timer = null;//定时器
	var bGameOver = true;//游戏是否结束[是]
	var bFood = false;//食物是否存在[否]
	var snake =  new Array();//蛇
	
	var each_square = $(".game_box").find(".square");
	each_square.each(function(){
		snake.push( $(this) );//添加蛇初始的每一块身体
	});
	
	$(".start").click(function(){
		if( $(this).val()=="开始游戏" ){
			bGameOver = false;
			clearInterval(timer);
			timer = setInterval(run, speed);//开启游戏
			$(this).val("暂停");
		}else if( $(this).val()=="暂停" ){
			clearInterval(timer);
			$(this).val("开始游戏");
		}
	});
	
	$(".again").click(function(){
		  window.location.reload();//刷新当前页面
	});
	
	$("body").keydown(function(event) {
		if( direction_flag && event.keyCode>=37 && event.keyCode<=40 && (event.keyCode-direction)%2!=0){
			direction = event.keyCode;
			direction_flag = false;//关闭键盘响应
		}
	});
	
	function run(){
		/*如果食物不存在则添加食物*/
		if(!bFood){
			var food_top = null;
			var food_left = null;
			food_position();
			/*生成食物*/
			function food_position(){
				var rand_top = parseInt( gamebox_height * Math.random() );
				var rand_left = parseInt( gamebox_width * Math.random() );
				food_top = parseInt( rand_top/square_length );
				food_top = food_top * square_length;
				food_left = parseInt( rand_left/square_length );
				food_left = food_left * square_length;
				//console.log("食物坐标"+ food_left +","+ food_top);
				for(var i=0; i<snake.length; i++){
					if( snake[i].position.top==food_top && snake[i].position.left==food_left ){
						food_position();
						break;
					}
				}
			}
			var food = '<div class="square" style="top:'+food_top+'px; left:'+food_left+'px;"></div>';
			$(".game_box").append(food);
			bFood = true;
		};
		//console.log("[" + snake[1].position().left +","+ snake[1].position().top +"]");//打印“蛇”头部的位置
		/*头部位置只与方向挂钩，其他身体的每一个小块移动到上一个小块的位置*/
		var oldTop = snake[0].position().top;
		var oldLeft = snake[0].position().left;
		for(var i=0; i<snake.length; i++){
			var temp_oldTop = snake[i].position().top;
			var temp_oldLeft = snake[i].position().left;
			if( i==0 ){
				switch (direction){
					case 37:
						snake[0].css("left", oldLeft - square_length);
						break;
					case 38:
						snake[0].css("top", oldTop - square_length);
						break;
					case 39:
						snake[0].css("left", oldLeft + square_length);
						break;
					case 40:
						snake[0].css("top", oldTop + square_length);
						break;
					default:
						break;
				}
			}else{
				snake[i].css("top", oldTop);
				snake[i].css("left", oldLeft);
			}
			oldTop = temp_oldTop;
			oldLeft = temp_oldLeft;
		}
		direction_flag = true;//开启键盘响应
		eatFood();//判断是否吃到食物
		isAlive();//判断游戏是否结束
		var score = snake.length - 4;//计算得分
		$(".score").val( "当前得分：" + score);//显示得分
		
	}
	/*设置速度*/
	$("#speed").click(function(){
		
		/*只允许在游戏开始前更改*/
		if(bGameOver){
			switch ( $(this).val() ){
				case "慢速":
					speed = speedArr[0];
					break;
				case "中速":
					speed = speedArr[1];
					break;
				case "快速":
					speed = speedArr[2];
					break;
				case "极速":
					speed = speedArr[3];
					break;
				default:
					break;
			}
		}
	});
	
	/*判断是否吃到食物*/
	function eatFood(){
		//alert( $("div[class=square]:last").attr("type") );
		var food = $("div[class=square]:last");
		//console.log( food.position().left +","+ food.position().top);
		if( food.position().left==snake[0].position().left && food.position().top==snake[0].position().top ){
			food.css("left", snake[snake.length-1].position().left);
			food.css("top", snake[snake.length-1].position().top);
			snake.push(food);
			bFood = false;//食物被消灭
		}
	}
	/*判断游戏是否结束*/
	function isAlive(){
		/*撞到墙壁*/
		if( snake[0].position().left>=gamebox_width | snake[0].position().left<0 | snake[0].position().top>=gamebox_height | snake[0].position().top<0 ){
			clearInterval(timer);
			bGameOver = true;
			$(".start").val("游戏结束");
			alert("游戏结束，您撞到墙了");
		}
		/*撞到自己*/
		for(var i=1; i<snake.length; i++){
			if( snake[0].position().left == snake[i].position().left && snake[0].position().top == snake[i].position().top){
				clearInterval(timer);
				bGameOver = true;
				$(".start").val("游戏结束");
				alert("游戏结束，您撞到自己了");
			}
		}
	}
});
