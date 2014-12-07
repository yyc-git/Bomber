(function () {
    var map_w, beginx, beginy, endx, endy;
    var arr_path_out = new Array();

    var pass = bomberConfig.map.terrain.pass,
        stop = bomberConfig.map.terrain.stop;


    var arr_map = new Array();
    var open_list = new Array(); //创建OpenList
    var close_list = new Array(); //创建CloseList
    var tmp = new Array(); //存放当前节点的八个方向的节点
    var arr_map_tmp = window.mapData; //存储从游戏中读入的地图数据
    var map_w = arr_map_tmp.length;

    function aCompute(mapData, begin, end) {
        //计算运行时间
        var startTime, endTime;
        var d = new Date();
        var time;
        startTime = d.getTime();


        var arr_path = new Array();
        var stopn = 0;

        /********************函数主体部分*************************/

        arr_map = setMap(mapData);

        map_w = mapData.length;
        beginx = begin.x;
        beginy = map_w - 1 - begin.y;
        endx = end.x;
        endy = map_w - 1 - end.y;
        var startNodeNum = tile_num(beginx, beginy);
        var targetNodeNum = tile_num(endx, endy);

        if (arr_map[targetNodeNum] && arr_map[targetNodeNum][0] == 0) {
            showError("目的地无法到达！");
            time = getTime(startTime);
            return { path: [], time: time };
        }
        if (arr_map[startNodeNum][0] == 0) {
            showError("起始点不可用！");
            time = getTime(startTime);
            return { path: [], time: time };
        }

        if (arr_map[targetNodeNum] && arr_map[targetNodeNum][0] * arr_map[startNodeNum][0] == 1) {
            arr_map[startNodeNum] = [arr_map[startNodeNum][0], startNodeNum, arr_map[startNodeNum][2], arr_map[startNodeNum][3], arr_map[startNodeNum][4]];//起始点的父节点为自己
            setH(targetNodeNum);
            setOpenList(startNodeNum); //把开始节点加入到openlist中
            //就要开始那个令人发指的循环了，==！！A*算法主体

            while (open_list.length != 0) {
                var bestNodeNum = selectFmin(open_list);
                stopn = 0;
                open_list.shift();
                setCloseList(bestNodeNum);

                if (bestNodeNum == targetNodeNum) {
                    showPath(close_list, arr_path);
                    break;
                }
                var i = 0, j = 0;
                //当目标为孤岛时的判断
                var tmp0 = new Array();
                var k;
                tmp0 = setSuccessorNode(targetNodeNum, map_w);
                for (j; j < 9; j++) {
                    if (j == 8) {
                        k = 0;
                        break;
                    }
                    if (tmp0[j][0] == 1) {
                        k = 1;
                        break;
                    }
                }
                //当目标为孤岛时的判断语句结束
                if (k == 0) {
                    showError("目标成孤岛!");
                    time = getTime(startTime);
                    return { path: [], time: time };
                }
                else {
                    tmp = setSuccessorNode(bestNodeNum, map_w);
                    for (i; i < 8; i++) {
                        if ((tmp[i][0] == 0) || (findInCloseList(tmp[i][4]))) continue;

                        if (findInOpenList(tmp[i][4]) == 1) {
                            if (tmp[i][2] >= (arr_map[bestNodeNum][2] + cost(tmp[i], bestNodeNum))) {
                                setG(tmp[i][4], bestNodeNum); //算g值，修改arr_map中[2]的值
                                arr_map[tmp[i][4]] = tmp[i] = [arr_map[tmp[i][4]][0], bestNodeNum, arr_map[tmp[i][4]][2], arr_map[tmp[i][4]][3], arr_map[tmp[i][4]][4]]; //修改tmp和arr_map中父节点的值，并修改tmp中g值，是之和arr_map中对应节点的值统一
                            }
                        }
                        if (findInOpenList(tmp[i][4]) == 0) {
                            setG(tmp[i][4], bestNodeNum); //算g值，修改arr_map中[2]的值
                            arr_map[tmp[i][4]] = tmp[i] = [arr_map[tmp[i][4]][0], bestNodeNum, arr_map[tmp[i][4]][2], arr_map[tmp[i][4]][3], arr_map[tmp[i][4]][4]]; //修改tmp和arr_map中父节点的值，并修改tmp中g值，是之和arr_map中对应节点的值统一
                            setOpenList(tmp[i][4]); //存进openlist中

                        }
                    }
                }

                stopn++;
                //if (stopn == map_w * map_w - 1) {     //2013.5.27修改
                if (stopn == map_w * map_w * 1000) {
                    showError("找不到路径!");
                    time = getTime(startTime);
                    return { path: [], time: time };

                    //                break;
                }
            }


            if (open_list.length == 0 && bestNodeNum != targetNodeNum) {
                showError("没有找到路径！！");   //对于那种找不到路径的点的处理
                time = getTime(startTime);
                return { path: [], time: time };
            }
        }

        time = getTime(startTime);

        return { path: arr_path_out, time: time };

    }

    function getTime(startTime) {
        /***显示运行时间********/
        var endTime = new Date().getTime();
        return (endTime - startTime) / 1000;
    };


    function showError(error) {
        console.log(error);
    };


    /**********************************************************************
     *function setMap(n)
     *功能：把外部的地图数据抽象成该算法中可操作数组的形式来输入算法
     *参数：n为地图的宽度，生成方阵地图
     ************************************************************************/
    function setMap(mapData) {

        map_w = mapData.length;
        var m = map_w * map_w;

        var arr_map0 = new Array(); //该函数对地图数据转换的操作数组
        var a = m - 1;
        for (a; a >= 0; a--) {
            var xTmp = tile_x(a); //把ID 编号值转换为x坐标值，用来对应读入地图数据
            var yTmp = map_w - 1 - tile_y(a); //把ID 编号值转换为y坐标值，用来对应读入地图数据,对应数组标号和我自定义xoy坐标位置

            //[cost,parent,g,h,id]
            if (mapData[yTmp][xTmp] == pass)
                arr_map0[a] = [1, 0, 0, 0, a];
            else
                arr_map0[a] = [0, 0, 0, 0, a];


        }

        return arr_map0;
    }

    /*********************************************************************
     *以下三个函数是地图上的编号与数组索引转换
     *function tile_num(x,y)
     *功能：将 x,y 坐标转换为地图上块的编号
     *function tile_x(n)
     *功能：由块编号得出 x 坐标
     *function tile_y(n)
     *功能：由块编号得出 y 坐标
     ******************************************************************/
    function tile_num(x, y) {
        return ((y) * map_w + (x));
    }

    function tile_x(n) {
        return (parseInt((n) % map_w));
    }

    function tile_y(n) {
        return (parseInt((n) / map_w));
    }

    /*********************************************************************
     *function setH(targetNode)
     *功能：初始化所有点H的值
     *参数：targetNode目标节点
     **********************************************************************/
    function setH(targetNode) {

        var x0 = tile_x(targetNode);
        var y0 = tile_y(targetNode);
        var i = 0;
        for (i; i < arr_map.length; i++) {
            var x1 = tile_x(i);
            var y1 = tile_y(i);
            /*****欧几里德距离********************************/
            // var h = (Math.sqrt((parseInt(x0) - parseInt(x1)) * (parseInt(x0) - parseInt(x1))) + Math.sqrt((parseInt(y0) - parseInt(y1)) * (parseInt(y0) - parseInt(y1))));
            /*****对角线距离********************************/
            var h = Math.max(Math.abs(parseInt(x0) - parseInt(x1)), Math.abs(parseInt(y0) - parseInt(y1)));
            /*****曼哈顿距离********************************/
                // var h=Math.abs(parseInt(x0) - parseInt(x1))+Math.abs(parseInt(y0) - parseInt(y1));
            arr_map[i][3] = h * parseInt(10);
        }
    }

    /*********************************************************************
     *function setG(nowNode,bestNode)
     *功能：计算现节点G的值
     *参数：nowNode现节点，bestNode其父节点
     **********************************************************************/
    function setG(nowNode, bestNode) {
        var x0 = tile_x(bestNode);
        var y0 = tile_y(bestNode);
        var x1 = tile_x(nowNode);
        var y1 = tile_y(nowNode);
        if (((x0 - x1) == 0) || ((y0 - y1) == 0)) {
            arr_map[nowNode] = [arr_map[nowNode][0], arr_map[nowNode][1], arr_map[nowNode][2] + parseInt(10), arr_map[nowNode][3], arr_map[nowNode][4]];

        }
        else {

            arr_map[nowNode] = [arr_map[nowNode][0], arr_map[nowNode][1], arr_map[nowNode][2] + parseInt(14), arr_map[nowNode][3], arr_map[nowNode][4]];
        }
    }

    /*********************************************************************
     *function selectFmin(open_list)
     *功能：在openlist中对f值进行排序(冒泡排序)，并选择一个f值最小的节点返回
     *参数：openlist
     ***********************************************************************/
    function selectFmin(open_list) {
        var i, j, min, temp;
        for (i = 0; i < open_list.length; i++) {
            for (j = i + 1; j < open_list.length; j++) {
                if ((open_list[i][2] + open_list[i][3]) > (open_list[j][2] + open_list[j][3])) {
                    temp = open_list[i];
                    open_list[i] = open_list[j];
                    open_list[j] = temp;
                }
            }
        }
        var min = open_list[0];
        return min[4];
    }

    /***********************************************************************
     *function setOpenList(NodeNum)
     *功能：把节点加入open表中
     *参数：待加入openlist的节点的编号
     ************************************************************************/
    function setOpenList(NodeNum) {
        var n = open_list.length;
        open_list[n] = [arr_map[NodeNum][0], arr_map[NodeNum][1], arr_map[NodeNum][2], arr_map[NodeNum][3], arr_map[NodeNum][4]];
    }

    /***********************************************************************
     *function setCloseList(NodeNum)
     *功能：把节点加入close表中
     *参数：待加入closelist的节点的编号
     ************************************************************************/
    function setCloseList(NodeNum) {
        var n = close_list.length;
        close_list[n] = [arr_map[NodeNum][0], arr_map[NodeNum][1], arr_map[NodeNum][2], arr_map[NodeNum][3], arr_map[NodeNum][4]];
    }

    /***********************************************************************
     *function findInOpenList(nowNodeNum)
     *功能：查询当前节点是否在openlist中，找到返回1，找不到返回0
     *参数：待查询的节点的编号
     ************************************************************************/
    function findInOpenList(nowNodeNum) {
        var i;
        for (i = 0; i < open_list.length; i++) {

            if (open_list[i][4] == nowNodeNum)
                return 1;
        }
        return 0;
    }

    /***********************************************************************
     *function findInCloseList(nowNodeNum)
     *功能：查询当前节点是否在closelist中，找到返回1，找不到返回0
     *参数：待查询的节点的编号
     ************************************************************************/
    function findInCloseList(nowNodeNum) {
        var i;
        for (i = 0; i < close_list.length; i++) {
            if (close_list[i][4] == nowNodeNum)
                return 1;
            else return 0;
        }
    }

    /***********************************************************************
     *function cost(SuccessorNodeNum,bestNodeNum)
     *功能：现节点到达周围节点的代价
     *参数：SuccessorNodeNum周围节点编号，bestNodeNum现节点
     ************************************************************************/
    function cost(SuccessorNodeNum, bestNodeNum) {
        var x0 = tile_x(bestNodeNum);
        var y0 = tile_y(bestNodeNum);
        var x1 = tile_x(SuccessorNodeNum);
        var y1 = tile_y(SuccessorNodeNum);
        if (((x0 - x1) == 0) || ((y0 - y1) == 0)) {
            return 10;
        }
        else
            return 14;
    }

    /**********************************************************************
     *function setSuccessorNode(bestNodeNum,map_w)
     *功能：把现节点的周围8个节点放入预先准备好的临时arr中以备检察
     *参数：现节点的编号
     035
     1 6
     247
     周围八个点的排序
     ***********************************************************************/
    function setSuccessorNode(bestNodeNum, n) {
        var x0 = tile_x(bestNodeNum);
        var y0 = tile_y(bestNodeNum);
        var m = n - 1;
        if ((x0 - 1) >= 0 && (y0) >= 0 && (x0 - 1) <= m && (y0) <= m) tmp[1] = [arr_map[tile_num(x0 - 1, y0)][0], arr_map[tile_num(x0 - 1, y0)][1], arr_map[tile_num(x0 - 1, y0)][2], arr_map[tile_num(x0 - 1, y0)][3], arr_map[tile_num(x0 - 1, y0)][4]]; else {
            tmp[1] = [0, 0, 0, 0, 0];
        }
        if ((x0) >= 0 && (y0 + 1) >= 0 && (x0) <= m && (y0 + 1) <= m) tmp[3] = [arr_map[tile_num(x0, y0 + 1)][0], arr_map[tile_num(x0, y0 + 1)][1], arr_map[tile_num(x0, y0 + 1)][2], arr_map[tile_num(x0, y0 + 1)][3], arr_map[tile_num(x0, y0 + 1)][4]]; else {
            tmp[3] = [0, 0, 0, 0, 0];
        }
        if ((x0) >= 0 && (y0 - 1) >= 0 && (x0) <= m && (y0 - 1) <= m) tmp[4] = [arr_map[tile_num(x0, y0 - 1)][0], arr_map[tile_num(x0, y0 - 1)][1], arr_map[tile_num(x0, y0 - 1)][2], arr_map[tile_num(x0, y0 - 1)][3], arr_map[tile_num(x0, y0 - 1)][4]]; else {
            tmp[4] = [0, 0, 0, 0, 0];
        }
        if ((x0 + 1) >= 0 && (y0) >= 0 && (x0 + 1) <= m && (y0) <= m) tmp[6] = [arr_map[tile_num(x0 + 1, y0)][0], arr_map[tile_num(x0 + 1, y0)][1], arr_map[tile_num(x0 + 1, y0)][2], arr_map[tile_num(x0 + 1, y0)][3], arr_map[tile_num(x0 + 1, y0)][4]]; else {
            tmp[6] = [0, 0, 0, 0, 0];
        }
        if (bomberConfig.algorithm.DIRECTION == 8) {
            if ((x0 - 1) >= 0 && (y0 + 1) >= 0 && (x0 - 1) <= m && (y0 + 1) <= m) tmp[0] = [arr_map[tile_num(x0 - 1, y0 + 1)][0], arr_map[tile_num(x0 - 1, y0 + 1)][1], arr_map[tile_num(x0 - 1, y0 + 1)][2], arr_map[tile_num(x0 - 1, y0 + 1)][3], arr_map[tile_num(x0 - 1, y0 + 1)][4]]; else {
                tmp[0] = [0, 0, 0, 0, 0];
            }

            if ((x0 - 1) >= 0 && (y0 - 1) >= 0 && (x0 - 1) <= m && (y0 - 1) <= m) tmp[2] = [arr_map[tile_num(x0 - 1, y0 - 1)][0], arr_map[tile_num(x0 - 1, y0 - 1)][1], arr_map[tile_num(x0 - 1, y0 - 1)][2], arr_map[tile_num(x0 - 1, y0 - 1)][3], arr_map[tile_num(x0 - 1, y0 - 1)][4]]; else {
                tmp[2] = [0, 0, 0, 0, 0];
            }

            if ((x0 + 1) >= 0 && (y0 + 1) >= 0 && (x0 + 1) <= m && (y0 + 1) <= m) tmp[5] = [arr_map[tile_num(x0 + 1, y0 + 1)][0], arr_map[tile_num(x0 + 1, y0 + 1)][1], arr_map[tile_num(x0 + 1, y0 + 1)][2], arr_map[tile_num(x0 + 1, y0 + 1)][3], arr_map[tile_num(x0 + 1, y0 + 1)][4]]; else {
                tmp[5] = [0, 0, 0, 0, 0];
            }

            if ((x0 + 1) >= 0 && (y0 - 1) >= 0 && (x0 + 1) <= m && (y0 - 1) <= m) tmp[7] = [arr_map[tile_num(x0 + 1, y0 - 1)][0], arr_map[tile_num(x0 + 1, y0 - 1)][1], arr_map[tile_num(x0 + 1, y0 - 1)][2], arr_map[tile_num(x0 + 1, y0 - 1)][3], arr_map[tile_num(x0 + 1, y0 - 1)][4]]; else {
                tmp[7] = [0, 0, 0, 0, 0];
            }

        }
        if (bomberConfig.algorithm.DIRECTION == 4) {
            tmp[0] = [0, 0, 0, 0, 0];
            tmp[2] = [0, 0, 0, 0, 0];
            tmp[5] = [0, 0, 0, 0, 0];
            tmp[7] = [0, 0, 0, 0, 0];
        }

        return tmp;
    }

    /*******************************************************************
     *function showPath(close_list)
     *功能：把结果路径存入arr_path输出
     *参数：close_list
     ********************************************************************/
    function showPath(close_list, arr_path) {
        var n = close_list.length;
        var i = n - 1;
        var ii = 0;
        var nn = 0;
        var mm = 0;


        var arr_path_tmp = new Array();
        var target = null;

        /**********把close_list中有用的点存入arr_path_tmp中*************/

        for (ii; ; ii++) {
            arr_path_tmp[ii] = close_list[n - 1][4];
            if (close_list[n - 1][1] == close_list[i][4]) {
                break;
            }
            for (i = n - 1; i >= 0; i--) {
                if (close_list[i][4] == close_list[n - 1][1]) {
                    n = i + 1;
                    break;
                }
            }
        }

        var w = arr_path_tmp.length - 1;
        var j = 0;
        for (var i = w; i >= 0; i--) {
            arr_path[j] = arr_path_tmp[i];
            j++;
        }
        for (var k = 0; k <= w; k++) {
            target = {
                x: tile_x(arr_path[k]),
                y: map_w - 1 - tile_y(arr_path[k])
            };
            arr_path_out.push(target);
        }
        arr_path_out.shift();
    }

    function _reset() {
        arr_path_out = new Array();
        arr_map = new Array();
        arr_map_tmp = window.mapData;
        map_w = arr_map_tmp.length;

        open_list = new Array(); //创建OpenList
        close_list = new Array(); //创建CloseList
        tmp = new Array(); //存放当前节点的八个方向的节点
    };


    var findPath = {
        aCompute: function (terrainData, begin, end) {
            _reset();
            return aCompute(terrainData, begin, end);
        }
    };

    window.findPath = findPath;
}());