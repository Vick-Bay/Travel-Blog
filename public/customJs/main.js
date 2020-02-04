$(function () {

    // INITIALIZE DATEPICKER PLUGIN
    $('.datepicker').datepicker({
        dateformat: "dd-mm-yyyy",
        autoclose: 'true',
        format: "dd-M-yyyy"
    });
});


function sortTable(e) {
    var th = e.target;
    if (th.nodeName.toLowerCase() !== 'th') return true;
  
    var n = 0; while (th.parentNode.cells[n] != th) ++n;
    var order = th.order || 1; th.order = -order;
    var t = this.querySelector('tbody');
  
    t.innerHTML = Object.keys(t.rows)
      .filter(k => !isNaN(k))
      .map(k => t.rows[k])
      .sort((a, b) => order * (typed(a) > typed(b) ? 1 : -1))
      .map(r => r.outerHTML)
      .join('');
  
    function typed(tr) {
      var s = tr.cells[n].innerText;
      var d = Date.parse(s.replace(/^(\d{1,2})st|th/, '$1'))
      return isNaN(d) ? s.toLowerCase() : d;
    }
  }
  
  document.querySelector('#sortTable')
    .addEventListener('click', sortTable, false);