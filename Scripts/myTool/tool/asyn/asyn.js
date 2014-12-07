/************************************ 异步操作 ***************************************/


YYC.Pattern.namespace("Tool").asyn = {
    /*
     等待second秒后，执行nextStep。
     可指定nextStep指向obj。

     例如：
     wait(window, 3); //暂停3秒，此处指定nextStep中的this指向window
     this.nextStep = function () {   //3秒后执行的函数，里面的this已指向window
     alert("Next!");
     alert(this);
     };
     */
    wait: function (obj, second) {
        var ind = -1;

        //内部函数goOn
        //该函数把要暂停的函数放到数组window.eventList里，同时通过setTimeout来调用继续函数(nextStep)。 
        function goOn(ind) {
            var obj = window.eventList[ind];
            var i = 0;

            window.eventList[ind] = null;
            if (obj.nextStep) obj.nextStep.call(obj, null); //这里调用后续方法
            else obj();
        };

        if (window.eventList == null) {
            window.eventList = new Array();
        }

        for (i = 0; window.eventList.length; i++) {
            if (window.eventList[i] == null) {
                window.eventList[i] = obj;
                ind = i;
                break;
            }
        }
        if (ind == -1) {
            ind = window.eventList.length;
            window.eventList[ind] = obj;
        }
        setTimeout(function () {
            goOn(ind);  //调用内部函数goOn
        }, second * 1000);
    },
    //清空"所有"的定时器 
    clearAllTimer: function (firstIndex) {
        var i = 0, num = firstIndex + 500;

        //以第一个计时器序号为起始值（计时器的序号会递加，但是ie下每次刷新浏览器后计时器序号会叠加，
        //且最初的序号也不一定从1开始（可能比1大），也就是说ie下计时器序号的起始值可能很大；chrome和firefox计时器每次从1开始）
        for (i = firstIndex; i < num; i++) {
            window.clearTimeout(i);
        }
        for (i = firstIndex; i < num; i++) {
            window.clearInterval(i);
        }
    },
    //阻塞线程一段时间
    sleep: function (s) {
        var d = new Date();
        while ((new Date().getTime() - d.getTime()) < s) {
        }
    }
};