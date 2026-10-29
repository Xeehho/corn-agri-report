(function () {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();
  var bg = style.getPropertyValue('--bg').trim();

  var BASE_FONT = '"Instrument Sans", -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif';
  var MONO_FONT = '"IBM Plex Mono", monospace';

  function money(v) {
    if (v === 0) return '0';
    var s = v > 0 ? '+' : '−';
    var a = Math.abs(v);
    if (a >= 10000) return s + (a / 10000).toFixed(1) + ' 万';
    return s + Math.round(a).toLocaleString('en-US');
  }

  /* ---------------- 图 1：公开用户规模 ---------------- */
  var scaleNames = ['佳家农', '通辽农服平台', 'MAP 智农', '吉农码', '北大荒农服', '中国农技推广'];
  var scaleVals = [6, 13.97, 30, 49, 60, 100];
  var c1 = echarts.init(document.getElementById('chart-scale'), null, { renderer: 'svg' });
  c1.setOption({
    animation: false,
    textStyle: { fontFamily: BASE_FONT },
    grid: { left: 118, right: 70, top: 16, bottom: 34 },
    tooltip: {
      appendToBody: true,
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: ink,
      borderWidth: 0,
      textStyle: { color: bg, fontFamily: BASE_FONT, fontSize: 12 },
      formatter: function (p) {
        return p[0].name + '：约 ' + p[0].value + ' 万人';
      }
    },
    xAxis: {
      type: 'value',
      name: '万人',
      nameTextStyle: { color: muted, fontSize: 11, fontFamily: BASE_FONT },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } },
      axisLabel: { color: muted, fontSize: 11, fontFamily: MONO_FONT }
    },
    yAxis: {
      type: 'category',
      data: scaleNames,
      axisLine: { lineStyle: { color: rule } },
      axisTick: { show: false },
      axisLabel: { color: ink, fontSize: 12.5, fontFamily: BASE_FONT }
    },
    series: [{
      type: 'bar',
      data: scaleVals.map(function (v, i) {
        return {
          value: v,
          itemStyle: { color: i >= 4 ? accent : accent + 'B3' }
        };
      }),
      barWidth: 16,
      label: {
        show: true,
        position: 'right',
        color: ink,
        fontFamily: MONO_FONT,
        fontSize: 12,
        formatter: '{c}'
      }
    }]
  });
  window.addEventListener('resize', function () { c1.resize(); });

  /* ---------------- 图 2：竞争位置 ---------------- */
  var pts = [
    { name: '中国农技推广', value: [5.2, 1.6], size: 13, tone: 'muted' },
    { name: '吉农码', value: [7.2, 2.4], size: 16, tone: 'official' },
    { name: '辽天惠农', value: [3.8, 3.6], size: 16, tone: 'official' },
    { name: '佳家农', value: [8.4, 3.0], size: 16, tone: 'official' },
    { name: '北大荒农服', value: [9.2, 4.0], size: 16, tone: 'official' },
    { name: '大丰收 / 丰农通', value: [8.2, 4.8], size: 13, tone: 'muted' },
    { name: '作物帮', value: [6.0, 5.2], size: 13, tone: 'muted' },
    { name: 'MAP 智农', value: [9.4, 6.2], size: 18, tone: 'big' },
    { name: '爱科农', value: [8.2, 7.0], size: 18, tone: 'big' },
    { name: '土地帮帮', value: [7.6, 5.6], size: 14, tone: 'big' },
    { name: '原方案 A', value: [4.2, 6.8], size: 20, tone: 'you' },
    { name: '方案 B', value: [2.0, 9.0], size: 24, tone: 'best' }
  ];
  var toneColor = {
    muted: muted + 'AA',
    official: accent + '99',
    big: accent2 + 'CC',
    you: ink,
    best: accent
  };
  var c2 = echarts.init(document.getElementById('chart-position'), null, { renderer: 'svg' });
  c2.setOption({
    animation: false,
    textStyle: { fontFamily: BASE_FONT },
    grid: { left: 64, right: 40, top: 36, bottom: 58 },
    tooltip: {
      appendToBody: true,
      backgroundColor: ink,
      borderWidth: 0,
      textStyle: { color: bg, fontFamily: BASE_FONT, fontSize: 12 },
      formatter: function (p) {
        return p.name + '<br/>功能广度 ' + p.value[0] + ' / 本地关系 ' + p.value[1];
      }
    },
    xAxis: {
      min: 0, max: 10.5,
      name: '功能广度 →',
      nameLocation: 'middle',
      nameGap: 32,
      nameTextStyle: { color: muted, fontSize: 11.5, fontFamily: BASE_FONT },
      axisLine: { lineStyle: { color: rule } },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } },
      axisLabel: { show: false }
    },
    yAxis: {
      min: 0, max: 10.5,
      name: '离农户的距离 →  越靠近越本地',
      nameLocation: 'middle',
      nameGap: 44,
      nameTextStyle: { color: muted, fontSize: 11.5, fontFamily: BASE_FONT },
      axisLine: { lineStyle: { color: rule } },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } },
      axisLabel: { show: false }
    },
    series: [{
      type: 'scatter',
      data: pts.map(function (p) {
        return {
          name: p.name,
          value: p.value,
          symbolSize: p.size,
          itemStyle: {
            color: toneColor[p.tone],
            borderColor: p.tone === 'best' ? ink : 'transparent',
            borderWidth: p.tone === 'best' ? 2 : 0
          },
          label: {
            show: true,
            position: p.tone === 'best' ? 'top' : 'right',
            distance: 8,
            formatter: p.name,
            color: p.tone === 'best' || p.tone === 'you' ? ink : muted,
            fontSize: p.tone === 'best' ? 13 : 11.5,
            fontWeight: p.tone === 'best' ? 700 : 400,
            fontFamily: BASE_FONT
          }
        };
      }),
      markArea: {
        silent: true,
        itemStyle: { color: accent, opacity: 0.07 },
        label: {
          show: true,
          position: 'insideTopLeft',
          color: accent,
          fontSize: 11.5,
          fontFamily: BASE_FONT,
          padding: [8, 0, 0, 8],
          formatter: '空位：功能窄，但离人极近'
        },
        data: [[{ xAxis: 0, yAxis: 7.4 }, { xAxis: 3.6, yAxis: 10.4 }]]
      }
    }]
  });
  window.addEventListener('resize', function () { c2.resize(); });

  /* ---------------- 图 3：成本结构 ---------------- */
  var c3 = echarts.init(document.getElementById('chart-cost'), null, { renderer: 'svg' });
  c3.setOption({
    animation: false,
    textStyle: { fontFamily: BASE_FONT },
    legend: {
      data: ['现金支出', '时间成本（60 元/小时折算）'],
      top: 0, right: 0,
      textStyle: { color: muted, fontSize: 11.5, fontFamily: BASE_FONT },
      itemWidth: 12, itemHeight: 10
    },
    grid: { left: 56, right: 24, top: 44, bottom: 30 },
    tooltip: {
      appendToBody: true,
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: ink,
      borderWidth: 0,
      textStyle: { color: bg, fontFamily: BASE_FONT, fontSize: 12 },
      formatter: function (ps) {
        var total = 0;
        var s = ps[0].name + '<br/>';
        ps.forEach(function (p) {
          total += p.value;
          s += p.marker + p.seriesName + '：' + Math.round(p.value).toLocaleString('en-US') + ' 元<br/>';
        });
        return s + '合计：' + Math.round(total).toLocaleString('en-US') + ' 元';
      }
    },
    xAxis: {
      type: 'category',
      data: ['A 完整小程序', 'B 精简小程序', 'C 纯人工'],
      axisLine: { lineStyle: { color: rule } },
      axisTick: { show: false },
      axisLabel: { color: ink, fontSize: 12.5, fontFamily: BASE_FONT }
    },
    yAxis: {
      type: 'value',
      name: '元',
      nameTextStyle: { color: muted, fontSize: 11, fontFamily: BASE_FONT },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } },
      axisLabel: {
        color: muted, fontSize: 11, fontFamily: MONO_FONT,
        formatter: function (v) { return v / 1000 + 'k'; }
      }
    },
    series: [
      {
        name: '现金支出',
        type: 'bar',
        stack: 'cost',
        barWidth: 64,
        data: [4000, 800, 0],
        itemStyle: { color: accent },
        label: {
          show: true, position: 'inside',
          color: bg, fontSize: 11, fontFamily: MONO_FONT,
          formatter: function (p) { return p.value ? p.value : ''; }
        }
      },
      {
        name: '时间成本（60 元/小时折算）',
        type: 'bar',
        stack: 'cost',
        barWidth: 64,
        data: [12600, 6900, 9360],
        itemStyle: { color: accent + '4D' },
        label: {
          show: true, position: 'inside',
          color: ink, fontSize: 11, fontFamily: MONO_FONT,
          formatter: function (p) { return p.value; }
        }
      }
    ]
  });
  window.addEventListener('resize', function () { c3.resize(); });

  /* ---------------- 图 4：敏感性 ---------------- */
  var G = 240000;
  var ks = [];
  for (var i = 0; i <= 15; i++) ks.push(i);
  function line(cost) {
    return ks.map(function (k) { return [k, Math.round(G * k / 100 - cost)]; });
  }
  var c4 = echarts.init(document.getElementById('chart-sensitivity'), null, { renderer: 'svg' });
  c4.setOption({
    animation: false,
    textStyle: { fontFamily: BASE_FONT },
    legend: {
      data: ['A 完整小程序', 'B 精简小程序', 'C 纯人工'],
      top: 0, left: 0,
      textStyle: { color: muted, fontSize: 11.5, fontFamily: BASE_FONT },
      itemWidth: 14, itemHeight: 8
    },
    grid: { left: 72, right: 30, top: 48, bottom: 46 },
    tooltip: {
      appendToBody: true,
      trigger: 'axis',
      backgroundColor: ink,
      borderWidth: 0,
      textStyle: { color: bg, fontFamily: BASE_FONT, fontSize: 12 },
      formatter: function (ps) {
        var s = '销售增量 ' + ps[0].value[0] + '%<br/>';
        ps.forEach(function (p) {
          s += p.marker + p.seriesName + '：' + money(p.value[1]) + ' 元<br/>';
        });
        return s;
      }
    },
    xAxis: {
      type: 'value',
      min: 0, max: 15,
      name: '年销售增量率（%）',
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: { color: muted, fontSize: 11.5, fontFamily: BASE_FONT },
      axisLine: { lineStyle: { color: rule } },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } },
      axisLabel: { color: muted, fontSize: 11, fontFamily: MONO_FONT, formatter: '{value}%' }
    },
    yAxis: {
      type: 'value',
      name: '首年净收益（元）',
      nameTextStyle: { color: muted, fontSize: 11.5, fontFamily: BASE_FONT },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: rule, type: 'dashed' } },
      axisLabel: {
        color: muted, fontSize: 11, fontFamily: MONO_FONT,
        formatter: function (v) { return v === 0 ? '0' : (v / 10000).toFixed(1) + '万'; }
      }
    },
    series: [
      {
        name: 'A 完整小程序',
        type: 'line',
        data: line(16600),
        smooth: false,
        symbol: 'none',
        lineStyle: { width: 1.6, color: accent2, type: 'dashed' },
        itemStyle: { color: accent2 }
      },
      {
        name: 'C 纯人工',
        type: 'line',
        data: line(9360),
        smooth: false,
        symbol: 'none',
        lineStyle: { width: 1.6, color: muted + 'CC', type: 'dotted' },
        itemStyle: { color: muted }
      },
      {
        name: 'B 精简小程序',
        type: 'line',
        data: line(7700),
        smooth: false,
        symbol: 'none',
        lineStyle: { width: 3, color: accent },
        itemStyle: { color: accent },
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { color: ink, width: 1, type: 'solid' },
          label: {
            show: true, position: 'insideEndTop',
            color: ink, fontSize: 11, fontFamily: BASE_FONT,
            formatter: '盈亏平衡线'
          },
          data: [{ yAxis: 0 }]
        },
        markPoint: {
          symbol: 'circle',
          symbolSize: 9,
          data: [
            { coord: [3.2, 0], itemStyle: { color: accent }, label: { show: false } },
            { coord: [6.9, 0], itemStyle: { color: accent2 }, label: { show: false } }
          ]
        }
      }
    ]
  });
  window.addEventListener('resize', function () { c4.resize(); });
})();
