(function () {
  var PLANS = {
    A: { label: '方案 A 完整小程序', cash: 4000, hours: 210 },
    B: { label: '方案 B 精简小程序', cash: 800, hours: 115 },
    C: { label: '方案 C 纯人工', cash: 0, hours: 156 }
  };
  var current = 'B';

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    n: $('in-n'), mu: $('in-mu'), spend: $('in-spend'),
    gm: $('in-gm'), k: $('in-k'), hour: $('in-hour')
  };
  var out = {
    sales: $('out-sales'), gp: $('out-gp'), inc: $('out-inc'),
    cost: $('out-cost'), net: $('out-net'), roi: $('out-roi'),
    be: $('out-be'), verdict: $('out-verdict')
  };

  function fmt(v) {
    return Math.round(v).toLocaleString('en-US');
  }
  function pct(v) {
    if (!isFinite(v)) return '—';
    return (v >= 0 ? '+' : '−') + Math.abs(v * 100).toFixed(0) + '%';
  }

  function calc() {
    var n = parseFloat(els.n.value) || 0;
    var mu = parseFloat(els.mu.value) || 0;
    var spend = parseFloat(els.spend.value) || 0;
    var gm = (parseFloat(els.gm.value) || 0) / 100;
    var k = (parseFloat(els.k.value) || 0) / 100;
    var hr = parseFloat(els.hour.value) || 0;

    var p = PLANS[current];
    var cost = p.cash + p.hours * hr;
    var sales = n * mu * spend;
    var gp = sales * gm;
    var inc = gp * k;
    var net = inc - cost;
    var roi = cost > 0 ? net / cost : 0;
    var be = gp > 0 ? cost / gp : Infinity;

    out.sales.textContent = fmt(sales) + ' 元';
    out.gp.textContent = fmt(gp) + ' 元';
    out.inc.textContent = fmt(inc) + ' 元';
    out.cost.textContent = fmt(cost) + ' 元';
    out.net.textContent = (net >= 0 ? '+' : '−') + fmt(Math.abs(net)) + ' 元';
    out.net.style.color = net >= 0 ? 'var(--accent)' : 'var(--warn)';
    out.roi.textContent = pct(roi);
    out.roi.style.color = roi >= 0 ? 'var(--accent)' : 'var(--warn)';
    out.be.textContent = isFinite(be) ? (be * 100).toFixed(1) + '%' : '无法回本';

    var perHouse = n > 0 ? cost / gm / n : 0;
    var msg;
    if (!isFinite(be)) {
      msg = '毛利率为 0，任何增量都无法覆盖成本。';
    } else if (be > 0.30) {
      msg = '<strong>不建议做</strong><br>需要 <strong>' + (be * 100).toFixed(0) + '%</strong> 的销售增量才能回本，' +
        '相当于每户每年多买 <strong>' + fmt(perHouse) + '</strong> 元。这个幅度靠一个销售员很难达成。';
    } else if (be > k) {
      msg = '<strong>当前假设下不回本</strong><br>你填的增量是 <strong>' + (k * 100).toFixed(0) + '%</strong>，' +
        '但需要 <strong>' + (be * 100).toFixed(1) + '%</strong> 才打平，缺口相当于每户每年多买 <strong>' + fmt(perHouse) + '</strong> 元。';
    } else {
      msg = '<strong>可行</strong><br>你填的增量 <strong>' + (k * 100).toFixed(0) + '%</strong> 高于回本线 <strong>' +
        (be * 100).toFixed(1) + '%</strong>；打平所需的绝对增量为每户每年 <strong>' + fmt(perHouse) + '</strong> 元。' +
        'ROI 为 <strong>' + pct(roi) + '</strong>。';
    }
    out.verdict.innerHTML = msg;
  }

  var btns = document.querySelectorAll('.calc-plans button');
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', function () {
      for (var j = 0; j < btns.length; j++) btns[j].classList.remove('on');
      this.classList.add('on');
      current = this.getAttribute('data-plan');
      calc();
    });
  }

  Object.keys(els).forEach(function (key) {
    els[key].addEventListener('input', calc);
  });

  calc();
})();
