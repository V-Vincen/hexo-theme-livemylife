(function() {
  function changeLang() {
    var selectLang = this.value;
    var canonical = this.dataset.canonical;
    var url = canonical.split('/')[0];
    var lang = url === 'index.html' ? '/' : (url === 'en' ? '/' : url);
    var index = canonical.indexOf('/') === -1 ? 0 : canonical.indexOf('/');
    var path = canonical.substring(index);
    path = selectLang + (path === 'index.html' ? '/index.html' : path);
    location.href = (location.origin + '/' + path).replace('index.html', '');
  }

  if (document.getElementById('lang-select')) {
    document.getElementById('lang-select').addEventListener('change', changeLang);
  }
}());