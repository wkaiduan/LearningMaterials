/**
 * Created by liu on 2017-05-24 0024.

 $(".float ul").scrollFloor({
            floor: ".floor",
            float: ".float li",
            floatOn: "on",
            deviateTop:$("#header").height(),
            deviateBottom:$("#footer").height()
        });
 ***/
;(function ($) {
    $.fn.scrollFloor = function (options) {
        new scrollF(this, options);
    };
    var scrollF = function (element, options) {
        this.options = $.extend({}, scrollF.defaults, options);
        this.currElement = $(element);

        this.init();
    };
    scrollF.defaults = {
        floor: ".floor",
        float: ".float li",
        floatText:"",
        floatOn: "on",
        scrollTop:"",
        deviateTop: 0,
        deviateBottom: 0
    };
    scrollF.prototype = {
        init: function () {
            var _self = this;
            var _clone = $(_self.options.float).last().remove().clone();
            $(this.options.floor).each(function (index, item) {
                
                if(_self.options.floatText!=""){
                	_clone.find(_self.options.floatText).text($(item).text())
                }else{
                	_clone.text($(item).text());
                }

                _self.currElement.append(_clone[0].outerHTML);
            });
            _self.floatHeight = _self.currElement.height();
            _self.scrollTo();
            _self.bindScroll();
            if(_self.scrollTop!=""){
            	_self.scrollTop();
            }
        }, scrollTo: function () {
            var _self = this;
            
            $(_self.options.float).each(function (index, item) {
                $(this).click(function () {
                    var offsetTop = $(_self.options.floor).eq(index).offset().top - _self.options.deviateTop;
                    $("html,body").animate({scrollTop: offsetTop}, 500);
                })
            });
            _self.scroll();
        }, bindScroll: function () {
            var _self = this;
            $(window).scroll(function () {
                _self.scroll();
            })
        }, scroll: function () {
            var _self = this;
            var _scrollTop = $(window).scrollTop();
            $(_self.options.floor).each(function (index, item) {
                if (_scrollTop >= $(item).offset().top - _self.options.deviateTop){
                	$(_self.options.float).removeClass(_self.options.floatOn).eq(index).addClass(_self.options.floatOn);
                	if(_scrollTop <= $(item).offset().top + $(item).height() - _self.options.deviateTop){
                		$(_self.options.float).removeClass(_self.options.floatOn).eq(index).addClass(_self.options.floatOn);
                	}
                } 

            });
            var _surplus = $("html,body").height() - _self.currElement.height() - _self.currElement.offset().top;
            if (_surplus < _self.options.deviateBottom) {
                var maxHeight = $(window).height() - _self.floatHeight - _self.options.deviateBottom;
                //_self.currElement.height(maxHeight);
            } else {
                //_self.currElement.height(_self.floatHeight);
            }
        },scrollTop:function(){
        	$(this.options.scrollTop).on("click",function(){
        		$("html,body").animate({scrollTop: 0}, 500);
        	})
        }
    }
})(jQuery);

//1.实现自动加载漂浮楼层
//2.实现自动定位
//3.绑定滚动事件，自动定位漂浮楼层