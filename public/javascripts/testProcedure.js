var t;
var tt;
var c;
var countdownSeconds = 30;
var alertSeconds = 1;
var buttonSequence = [];
var answers = [0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1];
//图片的答案；0为简单题，无论选什么都对；1是难题，无论选什么都错。
var options = [0, 8, 8, 8, 8, 6, 8, 8, 6, 8, 8, 8, 8];
//图片的选项数
var picNumber = answers.length - 1;
var reactionTime = [];
var result = [];
var ms;
var userObj;
var hasMusic;

function tutorial(){ // /tju:'t?:ri?:l/

	$("#mood_rating11").hide();
	$("#mood_rating12").hide();

	//$("img").attr("src", "/images/0.bmp");
	$("img").show();
	$("h1").text("下面要进行一个智力测试。");
	$("#countdown").html("<span>这是一个示例。请看图片。对于以下每个题目，每张大的主题图中都缺少一部分，主题图下方有8张小图片，选择其中一个，使整个图案合理而完整。注意，有的题目有6个选项，有的有8个，根据选择按下相应的数字键。如果按下数字键，将会马上进入下一张（其他按键会给出错误提示）；否则，每张有30秒倒计时显示，倒计时结束后进入下一张。<b>在正式实验中，这里会显示倒计时秒数。正确率达到60%就可以通过这个测试。</b>这道题应该选1，请按下键盘的数字键2。</span>");
	$(document).keypress(function(e){
		if(e.which == 48 + 1){
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
		}
		else{
			swal("输入有误！","请注意我们给出的提示","warning");
		}
	});
}

function resiliency(currentUser, musicMood) {
	var x = $("#resiliency_rating1").serializeArray().concat($("#resiliency_rating2").serializeArray());

	if (_.min(x, function(it){return it.value;}).value == 0) {
		swal("哦——","请将本页所有评分项填写全！","warning");
		return;
	}

	userObj = JSON.parse(store.get(currentUser));
	userObj['music'] = musicMood;

	hasMusic = !!musicMood;

	console.log("music or not?" + hasMusic);

	var rt = [];
	var sum = 0;
	//按序号排好序
	function compare(item1, item2){
		var reg = /^(\d+)\./;//match后返回形如数组形如['12.', '12']
		return (item1.name.match(reg))[1] - (item2.name.match(reg))[1];
	}
	x.sort(compare);
	for(var i in x){
		rt.push({item: x[i].name, rating: x[i].value});
		sum += parseInt(x[i].value);
	}
	//注意这里value值默认会当做字符串处理，所以+就是字符串连接的意思了。
	userObj['resiliencyTest'] = rt;
	userObj['resSum'] = sum;

	swal({
		title: "实验第一部分已完成！",
		type: "success",
		timer: 2000
	});
	setTimeout(function(){
		$("#resiliency_rating1").hide();
		$("#resiliency_rating2").hide();
		$("#mood_rating11").show();
		$("#mood_rating12").show();
		$("h1").text("实验第二部分");
		$("#countdown").text("请根据您此时此刻的心情状态，对以下形容词进行评分。从一颗心到五颗心分别表示：几乎没有、比较少、中等程度、比较多、极其多");
	}, 2000);
}


function baseline () {
	var x1 = $("#mood_rating11").serializeArray(); //一个对象的数组[{name:'xxx', value:'yyy'}, {...}, ...]
    var x2 = $("#mood_rating12").serializeArray();
    var x = x1.concat(x2); //数组合并

	if (_.min(x, function(it){return it.value;}).value == 0) {
		swal("哦——","请将本页所有评分项填写全！","warning");
		return;
	}

    var sortedX = _.sortBy(x, 'name');  //sortBy：按照name关键字排序
    var moods = _.pluck(sortedX, 'name'); //pluck：按照name关键字把对象萃取为数组
    var firstRating = _.pluck(sortedX, 'value')

    //在localStorage中的user里增加一个key，moodTest，相应的value又是一个object
    userObj['moodTest'] = {moods: moods, first_rating:firstRating, second_rating:undefined};

    swal({
        title: "实验第二部分已完成！",
        type: "success",
        timer: 2000
    });

	setTimeout("tutorial()", 2000);
}

function timedCount(){
	$("#countdown").text("倒计时" + c + "秒");
	--c;
	tt = setTimeout("timedCount()",1000);
	//console.log(tt);
}


function pics(picNo){
	$("img").attr("src", "/images/" + picNo + ".jpg");
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
					reactionTime.push({pic: picNo, time: countdownSeconds - c});
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

	//存储智力测试反应时间
	userObj['IQReaction'] = reactionTime;
	
	var r = 0;
	for(var i = 0; i < picNumber; i++){
		if(result[i]=='Right') r++;
	}
	var rratio = r / picNumber * 100;
	
	$("h1").text("智力测试已经完成！");

	$("#countdown").text("您总共完成了" + picNumber + "道题，其中正确的" + r + "道，正确率" + rratio.toFixed(2) +"%。很遗憾没有通过这项测试。按回车键继续。");
	$(document).keypress(function(e){
		if(e.which == 13){
			if(hasMusic){
				music();
			}
			else{
				$("#playing").hide();
				$("#mood_rating21").show();
				$("#mood_rating22").show();
				$("#h1").text("实验第三部分");
				$("#countdown").text("好，现在请根据您此时此刻的心情状态进行评分！从一颗心到五颗心分别表示：几乎没有、比较少、中等程度、比较多、极其多。");
			}
		}
	});
}

function music(){
	//$("#countdown").text("该测试者的输入为[" + buttonSequence + "]，反应时长为[" + reactionTime +"]");
	$("h1").text("不要走开，先听会儿音乐吧！在听完音乐之后，会进行实验第三部分，届时会请您根据您心情状态再进行一次评分。");
	$("#countdown").text("点击音符符号播放！");
	$("#playButton").show();
}

function playMusic(){
	$("#playing").show();
	$("#playButton").hide();
	var myAudio=document.getElementById("myAudio");
	myAudio.play();
	var du = myAudio.duration;  //不可用jQuery式写法！
	//console.log("music duration is " + du + "s.");
	setTimeout(function(){
		$("#playing").hide();
		$("#mood_rating21").show();
		$("#mood_rating22").show();
		$("#h1").text("实验第三部分");
		$("#countdown").text("好，现在请根据您此时此刻的心情状态进行评分！从一颗心到五颗心分别表示：几乎没有、比较少、中等程度、比较多、极其多。");
	},du * 990);
}

function finalTest (currentUser) {
	var x = $("#mood_rating21").serializeArray().concat($("#mood_rating22").serializeArray());

	if (_.min(x, function(it){return it.value;}).value == 0) {
		swal("哦——","请将本页所有评分项填写全！","warning");
		return;
	}

    userObj.moodTest.second_rating = _.pluck(_.sortBy(x, 'name'), 'value');//moodTest形如{moods: [...], first_rating: [...], second_rating: [...]}

	//存储心情自评的结果
    var testArr = _.unzip([userObj.moodTest.moods, userObj.moodTest.first_rating, userObj.moodTest.second_rating]); //返回一个数组的数组，形如[['mood1','first_rating1','second_rating1'], ...]
    var newObjArr = [];
    for(var i in testArr){
        newObjArr.push(_.object(['mood', 'first_rating', 'second_rating'], testArr[i]));  //返回一个对象，形如{'mood':'.', 'first_rating': '.', ''}
    }
    userObj.moodTest = newObjArr;

	var objStr = JSON.stringify(userObj);
    store.set(currentUser, objStr);

    swal("实验第三部分已完成！","","success");
    $.post("/test/new", {data: objStr},
            function(data, status) {
                console.log("\npost status: " + status);
            });
    //ajax post无法在路有里重定向？？？？
    /*$.ajax({
        type: 'POST',
        url: "/test/new",
        data: {data: objStr},
        success: function(dta, textStatus, jaXHR){
            if(typeof data.redirect == 'string') {
                return window.location = data.redirect;
            }
        },
        dataType: JSON
    });*/
    setTimeout("window.location.href='/ending'", 2000);
}
