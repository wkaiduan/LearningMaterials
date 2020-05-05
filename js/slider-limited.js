/**
 * Created by xiaolou on 2017/5/22.
 */
(function ($) {
    //不循环的切换插件
    $.fn.sliderLimite = function (options) {
        //当前滑动元素对象
        var that = $(this);
        //合并参数来覆盖默认值
        var opts = $.extend({}, $.fn.sliderLimite.defaults, options);
        //判断是否有子元素
        if($(this).find(opts.child).length <= 0){
            return;
        }
        //滑动子元素的个数
        var length = Math.ceil(that.find(opts.child).length/opts.count);
        //判断滑动元素的子元素是否达到允许滑动的个数
        if(length < opts.len){
            return;
        }
        //初始化索引小按钮
        if(opts.hasPag){
            for(var i=0;i<length;i++){
                if(i==0){
                    $(opts.pagination).append($(opts.pagItem).addClass(opts.pagCurrClass));
                }else{
                    $(opts.pagination).append(opts.pagItem);
                }
            }
            var pw = (parseFloat($(opts.pagination).find(opts.pagChild).width())
                +parseFloat($(opts.pagination).find(opts.pagChild).css("margin-left"))
                +parseFloat($(opts.pagination).find(opts.pagChild).css("margin-right")))*length;
            
            $(opts.pagination).css({"width": '100%'});
            //$(opts.pagination).parent().css("marginLeft",- pw/2);
        }

        //左右切换
        if(opts.type == "left-right"){
            //每切换一次滚动的left值
            var leftWidth = parseFloat(that.children(opts.child+":first").width())
                + parseFloat(that.children(opts.child+":first").css("margin-left"))
                + parseFloat(that.children(opts.child+":first").css("margin-right"));
                
            //动态设置滑动元素的宽度
            that.css("width",leftWidth*length*opts.count + 100);
            if(opts.slider) {
                //把最后指定子元素插入到滑动元素的最前边，并且设置left的值
                that.find(opts.child + ":gt(" + (that.find(opts.child).length - opts.count - 1) + ")").prependTo(that);
                that.css("left", -leftWidth * opts.count);
            }
            //点击左按钮切换
            $(opts.leftArrow).click(function () {
                leftFn();
            });
            //点击右按钮切换
            $(opts.rightArrow).click(function () {
                rightFn();
            });
        }

        //定时器
        if(opts.isTimer){
            var timer = setInterval(function () {
                leftFn();
            },opts.time);
            //清除定时器
            that.hover(function () {
                clearInterval(timer);
            },function () {
                timer = setInterval(function () {
                    leftFn();
                },opts.time);
            });
        }

        //点击索引项切换
        $(opts.pagination).find(opts.pagChild).each(function () {
            $(this).click(function () {
                $(this).addClass(opts.pagCurrClass).siblings().removeClass(opts.pagCurrClass);
                that.animate({left: -(leftWidth*($(this).index())*opts.count) + "px"},500);
            })
        });

        var index = 0;
        //左滑动处理函数
        function leftFn() {
            if (that.is(':animated')) {
                return;
            }
            index++;
            if(opts.hasPag){
                if(index == length){
                    index = 0;
                }
                $(opts.pagination).find(opts.pagChild).eq(index).addClass(opts.pagCurrClass).siblings().removeClass(opts.pagCurrClass);
            }
            if(opts.slider){
                that.animate({left: -(leftWidth*2*opts.count) + "px"},500,function(){
                    that.find(opts.child+":lt(" + opts.count + ")").appendTo(that);
                    that.css({left:-(leftWidth*opts.count)+"px"});
                });
            }else {
                that.animate({left: -(leftWidth*index*opts.count) + "px"},500);
            }
        }
        //右滑动处理函数
        function rightFn() {
            if (that.is(':animated')) {
                return;
            }
            index--;
            if(opts.hasPag){
                if(index == -1){
                    index = length-1;
                }
                $(opts.pagination).find(opts.pagChild).eq(index).addClass(opts.pagCurrClass).siblings().removeClass(opts.pagCurrClass);
            }
            if(opts.slider){
                that.animate({left: 0 + "px"},500,function(){
                    that.find(opts.child + ":gt(" + (that.find(opts.child).length - opts.count - 1) + ")").prependTo(that);
                    that.css({left:-(leftWidth*opts.count)+"px"});
                });
            }else {
                that.animate({left: -(leftWidth*index*opts.count) + "px"},500);
            }
        }
    }
    //默认配置项
    $.fn.sliderLimite.defaults = {
        type:"left-right",//切换的方向，默认是左右切换
        leftArrow: "#left-arrow",//左侧点击按钮
        rightArrow:"#right-arrow",//右侧点击按钮
        hasPag:false,//是否有索引项，默认false
        isTimer:false,//是否开启定时器，默认false不开启
        pagination:"#pagination",//滑动的当前项索引
        pagItem:'<li class="specal"></li>',//索引项
        pagCurrClass:"curr",//当前索引项类
        pagChild:"li",//索引项标签
        child:"li",//滑动元素的子元素,默认是li
        len:2, //默认允许滑动的最少子元素是2
        count:1, //默认是每次滚动一个
        slider:false,//是否循环,
        time:3000//自动轮播的时间间隔
    }
})(jQuery);
