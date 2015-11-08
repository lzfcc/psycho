if (localStorage.pagecount){
	localStorage.pagecount=Number(localStorage.pagecount) +1;
}
else{
	localStorage.pagecount=1;//页面访问次数，当做user的唯一键
}

var t;
var tt;
var c;
var countdownSeconds = 30;
var alertSeconds = 2;
var buttonSequence = [];
var answers = [0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1];
//图片的答案；0为简单题，无论选什么都对；1是难题，无论选什么都错。
var options = [0, 8, 6, 8, 8, 8, 8, 8, 8, 8, 6, 8, 8];
//图片的选项数
var picNumber = answers.length - 1;
var reactionTime = [];
var result = [];
var userName;
var ms ;
function timedMsg(){
	userName = $("#userName").val();//http://xieyu.blog.51cto.com/213338/55498
	if (userName === "") {
		//alert("请先输入用户名");
		$("#noNameWarning").show();
		return;
	} 
	$("#noNameWarning").hide();
	$("#button").hide();
	 
	$("#nameInput").hide();

	tutorial();
	
}
function timedCount(){
	$("#countdown").text("倒计时" + c + "秒");
	--c;
	tt = setTimeout("timedCount()",1000);
	//console.log(tt);
}
function tutorial(){ // /tju:'t?:ri?:l/
	$("img").attr("src", "/images/0.bmp");
	$("img").show();
	$("h1").text("这是一个示例。请看图片。");
	$("#countdown").text("在正式实验中，这里会显示倒计时秒数。图片应该选2，请按下键盘数字键2。");
	$(document).keypress(function(e){
		if(e.which == 48 + 2){
			swal({
				title: "好的！选择正确！",
				text: "你现在应该已经明白实验流程，开始正式实验吧！",
				type: "success",
				showCancelButton: false,
				confirmButtonColor: "#227722",
				confirmButtonText: "OK",
				closeOnConfirm: true,
				},
				function(){
					pics(1); 
				}
			);
			//
		}
		else{
			swal("输入有误！","请注意我们给出的提示","warning");
		}
	});
}

function pics(picNo){
	$("img").attr("src", "/images/" + picNo + ".bmp");
	$("img").show();
	$("h1").text("请看图片" + picNo);
	
	clearTimeout(t);
	clearTimeout(tt);
	c = countdownSeconds;
	timedCount();

	t = setTimeout(function(){
			$(document).unbind();
			buttonSequence.push(-1);
			reactionTime.push(countdownSeconds);
			console.log("timing in pic" + picNo + " finished!");
			if(picNo == picNumber){
				finishFeedback();
			} else {
				pics(picNo + 1);
			}
			
		}, countdownSeconds * 1000);
	$(document).keypress(function(e){
				console.log("for pic" + picNo + " you press " + String.fromCharCode(e.which));
				if(e.which > 48 && e.which <= 48 + options[picNo]){
					buttonSequence.push(e.which - 48);
					reactionTime.push(countdownSeconds - c);
					$(document).unbind(); //解除所有document元素的事件处理器
					if (answers[picNo] == 0) {
						swal({
							title: "图片" + picNo + "选择正确！",
							type: "success",
							timer: alertSeconds * 1000
						});
						result.push("Right");
					} else {
						swal({
							title: "图片" + picNo + "选择错误！",
							type: "error",
							timer: alertSeconds * 1000
						});
						result.push("Wrong");
					}
					
					
					if(picNo == picNumber){
						setTimeout("finishFeedback()", alertSeconds * 1000);
					} else {
						setTimeout(function(){
							pics(picNo + 1);
						}, alertSeconds * 1000);	
					}
					$("#invalidInputWarning").hide();
				} else {  //键盘输入不合法
					$("#invalidInputWarning").show();
				}
			});
}

function finishFeedback(){
	clearTimeout(tt);
	clearTimeout(t);
	$("img").hide();
	
	var r = 0;
	for(var i = 0; i < picNumber; i++){
		if(result[i]=='Right') r++;
	}
	var rratio = r / picNumber * 100;
	
	$("h1").text("实验第一部分已经完成！");
	$("#countdown").text("您总共完成了" + picNumber + "道题，其中正确的" + r + "道，正确率" + rratio.toFixed(2) +"%。按回车键继续。");
	$(document).keypress(function(e){
		if(e.which == 13){
			music();
		}
	});
}

function music(){
	$("#countdown").hide();
	$(".hi-icon-wrap").show();
	//$("#countdown").text("该测试者的输入为[" + buttonSequence + "]，反应时长为[" + reactionTime +"]");
	
	$("h1").text("接下来请听一段音乐。在听完音乐之后，请根据您此时此刻的情绪状态进行评分。");
	
	$(".hi-icon-wrap").show();
	
	$('#heart-rating').on('rating.change', function() {
            //alert($('#heart-rating').val());
			ms = parseInt($('#heart-rating').val());
			$('#heart-rating').rating('refresh', {
				disabled:true
			});
			console.log("音乐评分：" + ms);
			var myAudio=document.getElementById("myAudio");
			swal("实验结束","感谢您的参与！祝您心情愉快！在播放" + myAudio.currentTime +"s后评分。");
			storeInfo();
    });
	
	/*$(document).keypress(function(e){
		if(e.which >= 48 && e.which <= 57){
				//buttonSequence.push(String.fromCharCode(e.which));
				ms = e.which - 48;
				console.log("音乐评分：" + ms);
				$('#heart-rating').rating('refresh', {
					disabled:true
				});
				$(document).unbind(); //解除所有document元素的事件处理器
				swal("实验结束","感谢您的参与！祝您心情愉快！在播放" + myAudio.currentTime +"s后评分。");
				storeInfo();
				return;
		}
	});*/
	
	console.log("音乐评分：" + ms);  //undefined
	//刚开始把storeInfo()写在这里了。虽然执行了，但ms竟然是个null！因为是评分的监听函数的确执行了但是没有阻塞在那里，直接下来了，所以这里是未定义
}

function playMusic(){
	var myAudio=document.getElementById("myAudio");
	myAudio.play();
	$("#rating").show();
}

function storeInfo(){
	//var uid = "user" + Date.parse(Date());
	var currentUserObject = JSON.stringify({'name': userName, 'date': Date(), 'input': buttonSequence, 'result': result, 'reaction(in second)': reactionTime, 'musicScore': ms});
	//否则存储结果为字符串"[object Object]"，丢失信息
	store.set(localStorage.pagecount, currentUserObject);
	$.post("/newuser", {
		name: userName,
		date: Date.now(),
		score: ms
	},
	function(data, status) {
		console.log("\npost status: " + status);
	});
}


/*alertify.core.css中更改.alertify-logs，改变弹出框位置和大小*/