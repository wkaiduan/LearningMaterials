/**
 * Created by liu on 2017-05-21 0021.
 */
;(function ($) {
    $.fn.slider = function (options) {
        var settings = $.extend(true, {
            preBtn: ".prev",
            nextBtn: ".next",
            ul: "ul",
            li: "li",         //单个单元格
            rollCount: 1,   //滚动的个数
            rowCount: 1,    //展示的行数
            showCount: 1,   //一行展示的个数
            time: 0,
            showCircle: false,
            circleUL: ".circle",
            circleLIClass:"point",
            circleOn: "curr"
        }, options);

        var root = this, _ul = root.find(settings.ul), _li = root.find(settings.li);
        var next = $(settings.nextBtn), prev = $(settings.preBtn);
        var liLeftWidth = parseInt(_li.outerWidth(true));
        var timer, time = settings.time, rollCount = settings.rollCount;
        var isBindEvent = settings.rowCount * settings.showCount < _li.length;
        var play = function () {
            if (isBindEvent) {
                timer = setInterval(function () {
                    $(settings.nextBtn).trigger("click");
                }, time * 1000)
            }
            _ul.hover(function () {
                stop();
            }, function () {
                start();
            })
        };
        var stop = function () {
            if (isBindEvent && time > 0) {
                clearInterval(timer)
            }
        };
        var start = function () {
            if (isBindEvent && time > 0) {
                timer = setInterval(function () {
                    $(settings.nextBtn).trigger("click");
                }, time * 1000)
            }
        };
        var showCircle = function () {
            if (settings.showCircle) {
                var showIndex = _ul.find(settings.li).eq(1).attr("s") - 1;
                $(settings.circleUL).find("li").removeClass(settings.circleOn).eq(showIndex).addClass(settings.circleOn);
            }
        }
        if (isBindEvent) {
            _li.each(function (index) {
                $(this).attr("s", index + 1);
            });
            _ul.css("left", -liLeftWidth * rollCount).find(settings.li + ":gt(" + (_li.length - rollCount - 1) + ")").prependTo(_ul);
            prev.click(function () {
                if (_ul.is(':animated')) {
                    return;
                }
                _ul.animate({left: 0 + "px"}, 500, function () {
                    $(this).find(settings.li + ":gt(" + ( _li.length - rollCount - 1) + ")").prependTo(_ul);
                    $(this).css({left: -(liLeftWidth * rollCount) + "px"});
                    showCircle();
                });
            });
            prev.hover(function () {
                stop();
            }, function () {
                start();
            });
            next.click(function () {
                if (_ul.is(':animated')) {
                    return;
                }
                _ul.animate({left: -(liLeftWidth * 2 * rollCount) + "px"}, 500, function () {
                    $(this).find(settings.li + ":lt(" + ( rollCount) + ")").appendTo(_ul);
                    $(this).css({left: -(liLeftWidth * rollCount) + "px"});
                    showCircle();
                });
            });
            next.hover(function () {
                stop();
            }, function () {
                start();
            });
            if (time > 0) {
                play();
            }
            if (settings.showCircle) {
                var _count = _li.length / rollCount / settings.rowCount;
                var totalCirCount = parseInt(_count) < _count ? ( parseInt(_count) + 1) : parseInt(_count);
                for (var i = 1; i <= totalCirCount; i++) {
                    var cirLi = "<li c='" + i + "' class='"+settings.circleLIClass+"'></li>";
                    $(settings.circleUL).append(cirLi);
                }
                if($(settings.circleUL).find("li").length>0){
                    $(settings.circleUL).find("li").eq(0).addClass(settings.circleOn);
                }
                $(settings.circleUL).find("li").each(function (index) {
                    $(this).click(function () {
                        var currIndex = $(settings.circleUL + " li[class*='"+settings.circleOn+"']").attr("c");
                        var thisIndex = $(this).attr("c");
                        if (thisIndex > currIndex) {
                            if (_ul.is(':animated')) {
                                return;
                            }
                            var _rollCount = parseInt(thisIndex - currIndex);
                            var rollDouble=(_rollCount*_rollCount)==1?2:(_rollCount*rollCount);
                            _ul.animate({left: -(liLeftWidth * rollDouble) + "px"}, 500, function () {
                                $(this).find(settings.li + ":lt(" + ( _rollCount * rollCount) + ")").appendTo(_ul);
                                $(this).css({left: -(liLeftWidth) + "px"});
                                showCircle();
                            });

                        } else if (thisIndex < currIndex) {
                            if (_ul.is(':animated')) {
                                return;
                            }
                            var _rollCount = parseInt(currIndex - thisIndex);
                            _ul.animate({left: 0 + "px"}, 500, function () {
                                $(this).find(settings.li + ":gt(" + ( _li.length - (_rollCount * rollCount) - 1) + ")").prependTo(_ul);
                                $(this).css({left: -(liLeftWidth ) + "px"});
                                showCircle();
                            });
                        }
                    })
                })
            }
        }
    }
})(jQuery);