/***
 *2017.6.5 取消最大化操作
 ***/

var topWin = (function (p, c) {
    while (p != c) {
        c = p
        p = p.parent
    }
    return c
})(window.parent, window);

/****
 * 操作iframe
 * 调用方法：JFrame.getFrame("mainFrame|listFrame").document.getElementById("id");
 * @type {{getFrame: JFrame.getFrame, getId: JFrame.getId}}
 */
var JFrame = {
    getFrame: function (iframeNames) {
        //弹出层框架
        var objIframe = iframeNames.split("|");
        var currObj = topWin;
        for (var i = 0; i < objIframe.length; i++) {
            currObj = $(currObj.JFrame.getId(objIframe[i])).find("iframe")[0].contentWindow;
        }
        return currObj;
    },
    getMainFrame: function (iframeNames) {
        //主框架
        var currObj = topWin;
        if (iframeNames) {
            var objIframe = iframeNames.split("|");
            for (var i = 0; i < objIframe.length; i++) {
                currObj = currObj.JFrame.getId(objIframe[i]).contentWindow;
            }
        } else {
            currObj = currObj.JFrame.getId("mainFrame").contentWindow;
        }
        return currObj;
    },
    getId: function (id) {
        return document.getElementById(id);
    }
}

/***弹出层****/
var JLayer = {
    /**config: {
        id: (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1),
        title: 'title',
        width: 700,
        height: 530,
        url: "about:blank",
        success: function () {
        },
        close: function () {
        }
    },***/
    openFrame: function (options) {
        var opts = $.extend({}, options);
      var index=layer.open({
            id: opts.id,
            type: 2,
            full:opts.full,
            title: opts.title,
            area: [opts.width + 'px', opts.height + 'px'],
            fixed: opts.fixed,
            maxmin: opts.maxmin,
            closeBtn:opts.closeBtn,
            shadeClose:opts.shadeClose,
            content: opts.url,
            success: opts.success,
            end: opts.close,
            btn:opts.btn,
            shade: opts.shade ? opts.shade : 0.3
        });
        if(opts.full){
        	layer.full(index);
        }
    },
    loading: function () {
        layer.load(1, {shade: [0.2, '#000'], id: "msg-loading"})
    },
    closeFrame: function (id) {
        var _index = parseInt($("#" + id).parent().attr("times"));
        layer.close(_index);
    },
    closeLoading: function () {
        this.closeFrame("msg-loading");
    },
    closeAll: function () {
        layer.closeAll();
    },
    alert: function (msg, callback, closecallback) {
        layer.alert(msg, {
            title: "提示",
            icon: 1,
            skin: 'layer-ext-moon',
            yes: function (index) {
                if (typeof callback === "function") {
                    callback();
                }
                layer.close(index);
            }, end: function () {
                if (typeof closecallback === "function") {
                    closecallback();
                } else {
                    if (typeof callback === "function") {
                        callback();
                    }
                }
            }
        })
    },
    confirm: function (msg, yescallback, nocallback) {
        layer.confirm(msg, {
            title: "提示",
            btn: ['确定', '取消'] //按钮
        }, function (index) {
            if (typeof yescallback === "function") {
                yescallback();
            }
            layer.close(index);
        }, function () {
            if (typeof nocallback === "function") {
                nocallback();
            }
        });

    },
    success: function (msg, callback) {
        layer.alert(msg, {
            title: "提示",
            icon: 1,
            skin: 'layer-ext-moon',
            yes: function (index) {
                if (typeof callback === "function") {
                    callback();
                }
                layer.close(index);
            }, end: function () {
                if (typeof callback === "function") {
                    callback();
                }
            }
        })
    },  
    openContent: function (options, callback, cancelcallback) {
    	
    	var opts = $.extend({}, options);
       var index=layer.open({
           	id: opts.id,
            type: 1,
            title: opts.title,
            area: [opts.width + 'px', opts.height + 'px'],
            fixed: opts.fixed,
            maxmin: opts.maxmin,
            closeBtn:opts.closeBtn,
            shadeClose:opts.shadeClose,
            content: opts.content,
            success: opts.success,
            end: opts.close,
            btn:opts.btn,
            shade: opts.shade ? opts.shade : 0.3
            , yes: function () {
                if (typeof callback === "function") {
                    callback();
                }
            }
            , btn2: function () {
                if (typeof cancelcallback === "function") {
                    cancelcallback();
                }
            }
        });
        if(opts.full){
        	layer.full(index);
        }
       
		
    },
    full:function(index){
    	layer.full(index);
    }
    ,
    fail: function (msg, callback) {
        layer.alert(msg, {
            title: "提示",
            icon: 2,
            skin: 'layer-ext-moon',
            end: function () {
                if (typeof callback === "function") {
                    callback();
                }
            }
        })
    }
}

var CMS = {
    ajax: function (options) {
        $.ajax({
            url: options.url,
            type: options.type,
            dataType: options.dataType,
            beforeSend: function (xhr) {
                topWin.JLayer.loading();
            },
            data: options.data,
            cache: false,
            success: function (data) {
                //此处处理业务
                if (typeof(options.success) === "function") {
                    options.success(data);
                }
            },
            error: function (xhr) {
                topWin.JLayer.fail("请求失败");
            },
            complete: function (xhr, ts) {
                topWin.JLayer.closeLoading();
            }

        })
    }
}

/***展示验证的错误信息***/
var ValidMsg = {
    showMsg: function (msg, o, cssctl) {
        if (!o.obj.is("form")) {//验证表单元素时o.obj为该表单元素，全部验证通过提交表单时o.obj为该表单对象;
            // o.obj.parent().css("position", "relative");
            var $tip;
            if (o.obj.parent().find(".validform-info").length == 0) {
                $tip = $("<div class='validform-info'><div class='arrow'><img src='./inc/Validform/images/icon_arrow.png'></div><span class='validform-tip'></span></div>");
                $tip.css({
                    position: "absolute",
                    left: "auto",
                    //top: "-30px",
                    //right:'-50px',
                    display: "none"
                })
                o.obj.after($tip);
            } else {
                $tip = o.obj.parent().find(".validform-info");
            }

            var objtip = $tip.find(".validform-tip");
            cssctl(objtip, o.type);
            objtip.text(msg);

            if (o.type == 2) {
                $tip.fadeOut(200);
            } else {
                if ($tip.is(":visible")) {
                    return;
                }
                var left = o.obj.offset().left,
                    top = o.obj.offset().top;

                if (o.obj.width() < 100) {
                    left =left+100;
                } else {
                    left = left + o.obj.width() - 50;
                }
                $tip.css({
                    left: left
                }).show().animate({
                    top: top - 28
                }, 200);
            }
        }
    }
}

/***
 * 表单填充
 * @type {{setFrom: FormFill.setFrom}}
 * 实例：FormFill.setForm($("#form"),data)
 */
var FormFill = {
    setForm: function (form, data) {
        $.each(data, function (i) {
            var $objArr = $(form).find("[name='" + i + "']");
            if ($objArr.attr("type") === "radio" || $objArr.attr("type") === "checkbox") {
                $.each($objArr, function (k, item) {
                    if (data[i] === $(item).val()) {
                        $(item).attr("checked", "true");
                    }
                })
            } else {
                $objArr.val(data[i]);
            }
        });
    }
}
/**
 * 上传控件
 */
var WebUploader = function (response, uid, id) {


}

/**
 公用类
 *调用方法：util.toMillon()
 */
var util = {
    toMillon: function (str) {
        if (parseFloat(str) > 10000) {
            return parseFloat(str) / 10000 + "万";
        }
    }

}


/***屏蔽页面拖拽、右键操作操作***/
//if (document.body) {
//    document.body.oncopy = function () {
//        return false;
//    }
//}
////屏蔽 选中
//document.onselectstart = function () {
//    return false;
//}
////屏蔽拖拽
//document.ondragstart = function () {
//    return false;
//};
////屏蔽右键操作
//document.oncontextmenu = function () {
//    return false;
//}

//$(document).ajaxError(function (event, jqxhr, settings, exception) {
//    switch (jqxhr.status) {
//        case(500):
//            JLayer.alert("服务器系统内部错误");
//            break;
//        case(401):
//            JLayer.alert("您还没有登录！",function(){
//                topWin.location.href="";
//            });
//            //topWin.location.reload();
//            break;
//        case(403):
//            JLayer.alert("无权限执行此操作");
//            //topWin.location.reload();
//            break;
//        case(408):
//            JLayer.alert("请求超时");
//            break;
//        default:
//            JLayer.alert("未知错误");
//    }
//});