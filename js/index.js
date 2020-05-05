/**
 * Created by doudou on 2018/7/19.
 */
$(function () {

    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        $("body").css("width", "1280px");
        $(".show_top").addClass("animate");
        $(".show_bottom").addClass("animate");
        $(".show_left").addClass("animate");
        $(".show_right").addClass("animate");
    }


    function setFont() {
        var HTML = document.getElementsByTagName('html')[0];
        var Size = document.documentElement.clientWidth / 10;
        HTML.style.fontSize = Size + 'px'
    }

    setFont();
    window.onresize = function () {
        $(".case-bd").css("height", $(".case-bd li").height() * 2 + "px");
        $(".news-bd-box").css("height", ($(".news-bd-list li").height() + 25 ) * 3);
        if ($(window).width()<=768) {
            aboutList();
        }
    };

    function navShow() {
        var timer = null;
        $(".h-nav .show-menu").hover(
            function (e) {
                clearTimeout(timer)
                menuShow();
                var index = $(this).index();
                var containBox = $(".h-menu-list[data-type=" + index + "]");
                containBox.addClass("show").siblings(".show").removeClass("show");
                containBox.find("li").css({"opacity": 0, "left": "50px"}).animate({"opacity": 1, "left": 0});
            },
            function (e) {
                timer = setTimeout(function () {
                    menuHide();
                }, 100)
            }
        )

        $(".h-menu").hover(function () {
                clearTimeout(timer)
                menuShow();
            },
            function () {
                timer = setTimeout(function () {
                    menuHide();
                }, 100)
            }
        )

        function menuShow() {
            $(".h-menu").addClass("show");
        }

        function menuHide() {
            $(".h-menu").removeClass("show");
            $(".h-menu-list").removeClass("show");
            $(".h-menu-list li").css({"opacity": 0, "left": "50px"});
        }
    }

    navShow()

    var showId = [".show_top", ".show_bottom", ".show_left", ".show_right"];

    function show(arry) {
        for (var i = 0; i < arry.length; i++) {
            $(arry[i]).each(function (e) {
                var oTop = $(this).offset().top;
                var sTop = $(window).scrollTop() + $(window).height();
                if (sTop >= oTop && sTop - oTop <= $(window).height()) {
                    var delay = $(this).attr("data-delay");
                    $(this).addClass("animate").css({"animationDelay": delay + "s"});
                }
            });
        }
    }

    $(window).scroll(function () {
        show(showId);
        isScroll($(".about-bd"), aboutShow);
        isScroll($(".advantage-bd-num"), numAnimate);
        if($(window).scrollTop() >= 90){
            $(".header").css({"background" : "#fff"});
        }else{
            $(".header").css({"background" : "transparent"});
        }

    });

    show(showId);

    isScroll($(".about-bd"), aboutShow);
    isScroll($(".advantage-bd-num"), numAnimate);

    function isScroll($element, callback) {
        if($element.length == 0 )return;
        var oTop = $element.offset().top;
        var sTop = $(window).scrollTop() + $(window).height();
        if (sTop >= oTop && sTop - oTop <= $(window).height()) {
            callback();
        }
    }

    function aboutShow() {
        $(".about-bd-list ul").addClass("show");
    }

    function numAnimate() {
        $(".advantage-bd-num").each(function (e) {
            var _this = $(this);
            var num = _this.attr("data-num");
            var html = 0;
            var timer = setInterval(function () {
                html += Math.ceil(num / 19);
                if (html >= num) {
                    _this.html(num);
                    numAnimate = function () {
                    }
                    clearInterval(timer);
                } else {
                    _this.html(html);
                }
            }, 100)
        })

    }

    $(".h-nav-btn").click(function () {
        var type = $(this).attr("data-type");
        if (type == "show") {
            $(this).removeClass("hide").addClass("show").attr("data-type", "hide");
            $(".h-nav-box ul").addClass("show");
        } else if (type == "hide") {
            $(this).removeClass("show").addClass("hide").attr("data-type", "show");
            $(".h-nav-box ul").removeClass("show");
        }
    })

    function aboutList() {
        var li = $(".about-bd-list-box li");
        var indexList = li.length;
        var indexWidth = parseFloat(li.css("width")) + parseFloat(li.css("marginLeft"))*2;

        $(".about-bd-list-box ul").css("width", indexList * indexWidth + "px");

        var isChange = true;
        var indexI = 0;

        $(".about-bd-btn p").click(function (e) {
            if (isChange) {
                isChange = false;

                var type = $(e.target).attr("data-type");
                if (type == "prev" && indexI > 0) {
                    indexI--;
                } else if (type == "next" && indexI <= indexList - 6) {
                    indexI++;
                }

                $(".about-bd-list-box ul").stop(true).animate({"left": -indexI * indexWidth + "px"}, function () {
                    isChange = true;
                });

            }

        })
    }

    function switchItem(ul, btn) {
        var li = ul.children("li");
        var w = parseFloat(li.css("width"));
        ul.css("width", (li.length + 2) * w + "px");
        var isClick = true;
        btn.click(function (e) {

            if (isClick) {
                isClick = false;
                var switchList = [];
                var type = $(e.target).attr("data-type");
                ul.children("li").attr("class", "").each(function () {
                    switchList.push($(this).prop("outerHTML"));
                });
                if (type == "prev") {
                    switchList.unshift(switchList[switchList.length - 1]);
                    ul.css("left", -w + "px").html(switchList.join(" ")).stop().animate({left: "0"}, 500, function () {
                        switchList.pop();
                        $(this).html(switchList.join(" "));
                        isClick = true;
                    });
                } else if (type == "next") {
                    switchList.push(switchList[0]);
                    ul.html(switchList.join(" ")).stop().animate({left: -w + "px"}, 500, function () {
                        switchList.shift();
                        $(this).html(switchList.join(" ")).css("left", 0);
                        isClick = true;
                    });
                }
            }
        });
    }

    switchItem($(".address-bd ul"), $(".address-btn p"));
    switchItem($(".p-case-news-rt ul"), $(".p-case-news-btn span"));


    $(".float_qq1").click(function (e) {
        e.preventDefault();
        var i = $(window).scrollTop() ;

        var t = setInterval(function () {
            i-= 60;
            if(i<= 0){
                clearInterval(t);
                $(window).scrollTop(0);
            }else {
                $(window).scrollTop(i);
            }
        },24)
    });

    $(".float_list li").click(function () {
        $(this).addClass("show").siblings(".show").removeClass("show");
        var type = $(this).attr("data-type");
        var top = $("." + type).offset().top;
        var i = $(window).scrollTop();
        if (i > top) {
            var t = setInterval(function () {
                i -= 60;
                if (i - top <= 0) {
                    clearInterval(t);
                    $(window).scrollTop(top);
                } else {
                    $(window).scrollTop(i);
                }
            }, 24)
        }else{
            var t = setInterval(function () {
                i += 60;
                if (i - top >= 0) {
                    clearInterval(t);
                    $(window).scrollTop(top);
                } else {
                    $(window).scrollTop(i);
                }
            }, 24)
        }


    })
})