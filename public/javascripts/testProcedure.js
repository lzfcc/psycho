var t;
var tt;
var c;
var countdownSeconds = 30;
var alertSeconds = 1.3;
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

function timedCount(){
	$("#countdown").text("倒计时" + c + "秒");
	--c;
	tt = setTimeout("timedCount()",1000);
	//console.log(tt);
}
function tutorial(){ // /tju:'t?:ri?:l/
	$("#mood_rating1").hide();
	$("img").attr("src", "/images/0.bmp");
	$("img").show();
	$("h1").text("下面要进行一个智力测试。");
	$("#countdown").html("<span>这是一个示例。请看图片。下对于以下每个题目，每张大的主题图中都缺少一部分，主题图下方有8张小图片，选择其中一个，使整个图案合理而完整。注意，有的题目有6个选项，有的有8个，根据选择按下相应的数字键。如果按下数字键，将会马上进入下一张（其他按键会给出错误提示）；否则，每张有30秒倒计时显示，倒计时结束后进入下一张。<b>在正式实验中，这里会显示倒计时秒数。</b>这道题应该选2，请按下键盘的数字键2。</span>");
	$(document).keypress(function(e){
		if(e.which == 48 + 2){
			//$(document).unbind();
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
				//console.log("for pic" + picNo + " you press " + String.fromCharCode(e.which));
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
	
	$("h1").text("实验第二部分已经完成！");

	$("#countdown").text("您总共完成了" + picNumber + "道题，其中正确的" + r + "道，正确率" + rratio.toFixed(2) +"%。当前共有" + Math.round(100 * (0.5 + Math.random())) + "人参与了实验，您的成绩超过了%" + 15 + "的参与者。按回车键继续。");
	$(document).keypress(function(e){
		if(e.which == 13){
			music();
		}
	});
}

function music(){
	$("#mood_rating").show();
	//$("#countdown").text("该测试者的输入为[" + buttonSequence + "]，反应时长为[" + reactionTime +"]");
	
	$("h1").text("接下来请听一段音乐。在听完音乐之后，请根据您此时此刻的心情状态进行评分。");
	$("#countdown").text("从一颗心到五颗心分别表示：几乎没有、比较少、中等程度、比较多、极其多.");
	$("#playButton").show();
}

function playMusic(){
	var myAudio=document.getElementById("myAudio");
	myAudio.play();
	var du = document.getElementById("myAudio").duration;  //不可用jQuery式写法！
	//console.log("music duration is " + du + "s.");
	setTimeout(function(){
		$("#mood_rating2").show();
	},du * 100);
}