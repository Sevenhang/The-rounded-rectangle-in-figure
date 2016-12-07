/**
 * Created by jason on 2016/12/5.
 */
var element = document.getElementById('chart');
//颜色数组
var colors = ['#ff5473', '#00deff', '#ffd74b', '#1eff00', '#ff0000'];
//随机数据
function random() {
    return Math.floor(Math.random() * 333 + 100);
}
//假数据
var data = [
    {
        name: '财经',
        value: random()
    }, {
        name: '时政',
        value: random()
    }, {
        name: '领导',
        value: random()
    }, {
        name: '社会',
        value: random()
    }, {
        name: '教育',
        value: random()
    }
];
//降序排列
data.sort(function (a, b) {
    return b.value - a.value;
});

//toptip的创建方法
var tipTimerConfig = {
    longer: 0,
    target: null,
    exist: false,
    winEvent: window.event,
    boxHeight: 398,
    boxWidth: 376,
    maxWidth: 376,
    maxHeight: 398,
    tooltip: null,

    showTime: 3500,
    hoverTime: 300,
    displayText: "",
    show: function (val, e) {
        "use strict";
        var me = this;

        if (e != null) {
            me.winEvent = e;
        }

        me.displayText = val;

        me.calculateBoxAndShow();

        me.createTimer();
    },
    calculateBoxAndShow: function () {
        "use strict";
        var me = this;
        var _x = 0;
        var _y = 0;
        var _w = document.documentElement.scrollWidth;
        var _h = document.documentElement.scrollHeight;
        var wScrollX = window.scrollX || document.body.scrollLeft;
        var wScrollY = window.scrollY || document.body.scrollTop;
        var xMouse = me.winEvent.x + wScrollX;
        if (_w - xMouse < me.boxWidth) {
            _x = xMouse - me.boxWidth - 10;
        } else {
            _x = xMouse;
        }

        var _yMouse = me.winEvent.y + wScrollY;
        if (_h - _yMouse < me.boxHeight + 18) {
            _y = _yMouse - me.boxHeight - 25;
        } else {

            _y = _yMouse + 18;
        }

        me.addTooltip(_x, _y);
    },
    addTooltip: function (page_x, page_y) {
        "use strict";
        var me = this;

        me.tooltip = document.createElement("div");
        me.tooltip.style.left = page_x + "px";
        me.tooltip.style.top = page_y + "px";
        me.tooltip.style.position = "absolute";

        me.tooltip.style.width = me.boxWidth + "px";
        me.tooltip.style.height = me.boxHeight + "px";
        me.tooltip.className = "three-tooltip";

        var divInnerHeader = me.createInner();
        divInnerHeader.innerHTML = me.displayText;
        me.tooltip.appendChild(divInnerHeader);

        document.body.appendChild(me.tooltip);
    },
    createInner: function () {
        "use strict";
        var me = this;
        var divInnerHeader = document.createElement('div');
        divInnerHeader.style.width = me.boxWidth + "px";
        divInnerHeader.style.height = me.boxHeight + "px";
        return divInnerHeader;
    },
    ClearDiv: function () {
        "use strict";
        var delDiv = document.body.getElementsByClassName("three-tooltip");
        for (var i = delDiv.length - 1; i >= 0; i--) {
            document.body.removeChild(delDiv[i]);
        }
    },
    createTimer: function (delTarget) {
        "use strict";
        var me = this;
        var delTip = me.tooltip;
        var delTarget = tipTimerConfig.target;
        var removeTimer = window.setTimeout(function () {
            try {
                if (delTip != null) {
                    document.body.removeChild(delTip);
                    if (tipTimerConfig.target == delTarget) {
                        me.exist = false;
                    }
                }
                clearTimeout(removeTimer);
            } catch (e) {
                clearTimeout(removeTimer);
            }
        }, me.showTime);
    },
    hoverTimerFn: function (showTip, showTarget) {
        "use strict";
        var me = this;

        var showTarget = tipTimerConfig.target;

        var hoverTimer = window.setInterval(function () {
            try {
                if (tipTimerConfig.target != showTarget) {
                    clearInterval(hoverTimer);
                } else if (!tipTimerConfig.exist && (new Date()).getTime() - me.longer > me.hoverTime) {
                    //show
                    tipTimerConfig.show(showTip);
                    tipTimerConfig.exist = true;
                    clearInterval(hoverTimer);
                }
            } catch (e) {
                clearInterval(hoverTimer);
            }
        }, tipTimerConfig.hoverTime);
    }
};

var createSvg = function (element, data) {
    this.dom = element;
    this.data = data;
    this.width = 615;
    this.height = 345;
    this.margin = {
        left: 0,
        right: 60,
        top: 0,
        bottom: 50
    };
    //图例空数组
    this.legends = [];
    //圆角矩形的颜色
    this.colors = ['#ff5473', '#00deff', '#ffd74b', '#1eff00', '#ff0000'];
};

createSvg.prototype.getNumber = function () {
    var slef = this;
    var arr = [];
    for (var i = 0; i < self.data.length; i++) {
        arr.push(self.data[i].value);
    }
    //取到最大值
    self.max = Math.max.apply(this, arr);
    //取到最小值
    self.min = Math.min.apply(this, arr);
};

createSvg.prototype.init = function () {
    var self = this;
    //生成svg并设置svg的宽高
    self.svg = d3.select(self.dom)
        .append('svg')
        .attr('width', self.width + self.margin.right)
        .attr('height', self.height + self.margin.bottom)
        .attr('class', 'svg_ellipse');
    //将最外层元素进行偏移
    self.g = self.svg.append('g')
        .attr('transform', 'translate(60,70)')
};

createSvg.prototype.xLine = function () {
    var self = this;
    //创建x轴线性比例尺
    self.x = d3.scaleBand()
        .rangeRound([0, self.width])
        .padding(0.5)
        .domain(data.map(function (d) {
            return d.name;
        }));
    //生成x坐标轴
    self.xAxis = self.g.append('g')
        .attr('class', 'axis-x')
        .attr('transform', 'translate(-3,' + (self.height - self.margin.bottom) + ')')
        .call(d3.axisBottom(self.x));
    //删除原坐标轴
    self.xAxis.select('path').remove();
    //删除原坐标轴上的所有刻度
    self.xAxis.selectAll('line').remove();
    // 添加新的坐标轴线
    self.xAxis.append('line')
        .attr('x1', '0')
        .attr('y1', '0')
        .attr('x2', self.width)
        .attr('y2', '0')
        .style('stroke', 'rgba(120,122,132,.8)')
        .style('stroke-width', '2')
        .attr('class', 'xAxis-line');
    //设置x轴的字体样式
    self.xAxis.selectAll('text')
        .style('fill', '#d8d8da')
        .style('font-size', '13');
};

createSvg.prototype.yLine = function () {
    var self = this;
    //创建序列比例尺
    self.y = d3.scaleLinear()
        .rangeRound([self.height - self.margin.bottom, 0])
        .domain([0, d3.max(self.data, function (d) {
            return d.value;
        })]);
    //生成y坐标轴
    self.yAxis = self.g.append('g')
        .attr('class', 'axis-y')
        .call(d3.axisLeft(self.y).ticks(self.data.length));
    //删除原y坐标轴
    self.yAxis.select('path').remove();
    //删除原y轴的刻度
    self.yAxis.selectAll('line').remove();
    //添加新的坐标轴线
    self.yAxis.append('line')
        .attr('x1', '0')
        .attr('y1', '0')
        .attr('x2', '0')
        .attr('y2', self.height - self.margin.bottom + 3)
        .style('stroke', 'rgba(120,122,132,.8)')
        .style('stroke-width', '2')
        .attr('class', 'yAxis-line');
    //设置y轴字体样式
    self.yAxis.selectAll('text')
        .style('fill', '#d8d8da')
        .style('font-size', '13');
};

createSvg.prototype.legend = function () {
    var self = this;
    //图例之间的距离
    var circleSpace = 60;
    //文字与圆的间距
    var space = 16;
    //圆角矩形距离x轴的距离
    var cSpace = 4;
    //生成legend数组
    for (var i = 0; i < self.data.length; i++) {
        self.legends.push(self.data[i].name);
    }
    //创建legend容器
    var r = self.g.append('g')
        .attr('class', 'svg-legend')
        .attr('transform', 'translate(110,-40)');
    //生成legend圆
    r.selectAll('circle')
        .data(self.legends)
        .enter()
        .append('circle')
        .attr('r', '6')
        .style('fill', function (d, i) {
            return self.colors[i]
        })
        .attr('transform', function (d, i) {
            return 'translate(' + circleSpace * i + ',0)'
        });
    //生成legend文字并设置样式
    r.selectAll('text')
        .data(self.data)
        .enter()
        .append('text')
        .text(function (d) {
            return d.name;
        })
        .style('font-size', '13')
        .attr('transform', function (d, i) {
            return 'translate(' + (circleSpace * i + space) + ',' + cSpace + ')'
        });
};

createSvg.prototype.addRect = function () {
    var self = this;
    //创建圆角矩形
    self.g.selectAll('rect')
        .data(self.data)
        .enter()
        .append('rect')
        .attr('class', 'rect-svg')
        .style('fill', function (d, i) {
            return self.colors[i]
        })
        .attr('width', self.x.bandwidth())
        .attr('height', function (d) {
            return 1
        })
        .attr('x', function (d) {
            return self.x(d.name)
        })
        .attr('y', function (d) {
            return self.height - self.margin.bottom;
        })
        .attr('rx', '25')
        .attr('ry', '25');
};

createSvg.prototype.addTip = function () {
    var self = this;
    //给所有圆角矩形添加tip
    self.rect = self.g.selectAll('.rect-svg')
        .on('mouseover', function (d) {
            d3.select(this).attr("opacity", 0.8);
            // 添加 div
            tipTimerConfig.target = this;
            tipTimerConfig.longer = new Date().getTime();
            tipTimerConfig.exist = false;
            //获取坐标
            tipTimerConfig.winEvent = {
                x: event.clientX - 100,
                y: event.clientY
            };
            tipTimerConfig.boxHeight = 50;
            tipTimerConfig.boxWidth = 140;
            //hide
            tipTimerConfig.ClearDiv();
            //show
            tipTimerConfig.hoverTimerFn(self.createTooltipTableData(d));
        })
        .on('mouseout', function (d) {
            d3.select(this).attr("opacity", 1);
            tipTimerConfig.target = null;
            tipTimerConfig.ClearDiv();
        })
};

createSvg.prototype.createTooltipTableData = function (info) {
    //tip的内容设置
    var ary = [];
    ary.push("<div class='tip-hill-div'>");
    ary.push("<h1>name:" + info.name + "</h1>");
    ary.push("<h2>value: " + info.value + '</h2>');
    ary.push("</div>");
    return ary.join("");
};

createSvg.prototype.animation = function () {
    var self = this;
    //找到所有圆角矩形设置动画
    self.g.selectAll('.rect-svg')
        .transition()
        .duration(2500)
        .attr('height', function (d) {
            return self.height - self.y(d.value) - self.margin.bottom - 5;
        })
        .attr('x', function (d) {
            return self.x(d.name)
        })
        .attr('y', function (d) {
            return self.y(d.value)
        });
    // self.g.selectAll('rect')
    //     .data(self.data)
    //     .enter()
    //     .append('rect')
    //     .attr('class', 'rect-svg')
    //     .style('fill', function (d, i) {
    //         return self.colors[i]
    //     })
    //     .attr('width', self.x.bandwidth())
    //     .attr('height', function (d) {
    //         return self.height - self.y(d.value) - self.margin.bottom - 5;
    //     })
    //     .attr('x', function (d) {
    //         return self.x(d.name)
    //     })
    //     .attr('y', function (d) {
    //         return self.y(d.value)
    //     })
    //     .attr('rx', '25')
    //     .attr('ry', '25');
};

createSvg.prototype.set = function () {
    var self = this;
    self.getNumber();
    self.init();
    self.xLine();
    self.yLine();
    self.legend();
    self.addRect();
    self.addTip();
    self.animation();
};
var b = new createSvg(element, data);
b.set();