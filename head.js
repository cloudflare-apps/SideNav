(function(){
  if (!document.addEventListener || !document.documentElement.setAttribute) {
    return;
  }

  var options, pointerEventsSupport, navEl, buttonEl, addStyles, addCover, addNavItem, addNavItems, addButton, setupEvents, toggle, open, close;

  options = INSTALL_OPTIONS;

  (function(){
    var el = document.createElement('x');
    el.style.cssText = 'pointer-events:auto';
    pointerEventsSupport = el.style.pointerEvents === 'auto';
  })();

  navEl = document.createElement('eager-side-nav');
  navEl.setAttribute('eager-side-nav-position', options.position);

  buttonEl = document.createElement('eager-side-nav-button');
  buttonEl.setAttribute('eager-side-nav-position', options.position);

  coverEl = document.createElement('eager-side-nav-cover');

  addStyles = function() {
    var style = document.createElement('style');
    style.innerHTML = '' +
      'eager-side-nav > a {' +
        'color: ' + options.linkColor + ' !important' +
      '}' +
      'eager-side-nav-label {' +
        'color: ' + options.labelColor + ' !important' +
      '}' +
      'eager-side-nav {' +
        'background: ' + options.backgroundColor + ' !important' +
      '}' +
      'eager-side-nav-button-bar {' +
        'background: ' + options.buttonColor + ' !important' +
      '}' +
      'eager-side-nav-button[eager-side-nav-opened="true"] eager-side-nav-button-bar {' +
        'background: ' + options.linkColor + ' !important' +
      '}' +
      (options.showCover ? '' +
      'eager-side-nav-cover {' +
        'background: ' + options.coverColor + ' !important' +
      '}' : '') +
    '';
    document.body.appendChild(style);
  };

  addCover = function() {
    if (pointerEventsSupport) {
      document.body.appendChild(coverEl);
    }
  };

  addNavItem = function(item) {
    var itemEl;

    if (item.itemType === 'link') {
      itemEl = document.createElement('a');
      itemEl.appendChild(document.createTextNode(item.linkText));
      itemEl.setAttribute('href', item.href || '');
      if (item.targetBlank === true) {
        itemEl.setAttribute('target', '_blank');
      }
      if (item.icon && item.icon !== 'none') {
        itemEl.setAttribute('eager-side-nav-icon', item.icon);
      }
    } else {
      itemEl = document.createElement('eager-side-nav-label');
      itemEl.appendChild(document.createTextNode(item.labelText));
    }

    navEl.appendChild(itemEl);
  };

  addNavItems = function() {
    for (var i = 0; i < options.items.length; i++) {
      addNavItem(options.items[i]);
    }
    document.body.appendChild(navEl);
  };

  addButton = function() {
    buttonEl.innerHTML = '' +
      '<eager-side-nav-button-bar></eager-side-nav-button-bar>' +
      '<eager-side-nav-button-bar></eager-side-nav-button-bar>' +
      '<eager-side-nav-button-bar></eager-side-nav-button-bar>' +
    '';
    document.body.appendChild(buttonEl);
  };

  setupEvents = function() {
    buttonEl.addEventListener('click', toggle);

    document.body.addEventListener('click', function(event){
      if (!event || !event.target) {
        return;
      }

      if (event.target === buttonEl || event.target === navEl || buttonEl.contains(event.target) || navEl.contains(event.target)) {
        return;
      }

      close();
    });

    window.addEventListener('pushState', close);
    window.addEventListener('replaceState', close);
    window.addEventListener('hashchange', close);

    // iOS :hover CSS hack
    coverEl.addEventListener('touchstart', function(){}, false);
    buttonEl.addEventListener('touchstart', function(){}, false);
    navEl.addEventListener('touchstart', function(){}, false);
  };

  toggle = function() {
    if (buttonEl.getAttribute('eager-side-nav-opened') === 'true') {
      close();
    } else {
      open();
    }
  };

  open = function() {
    coverEl.setAttribute('eager-side-nav-opened', 'true');
    buttonEl.setAttribute('eager-side-nav-opened', 'true');
    navEl.setAttribute('eager-side-nav-opened', 'true');
  };

  close = function() {
    coverEl.setAttribute('eager-side-nav-opened', 'false');
    buttonEl.setAttribute('eager-side-nav-opened', 'false');
    navEl.setAttribute('eager-side-nav-opened', 'false');
  };

  document.addEventListener('DOMContentLoaded', function(){
    addStyles();
    addCover();
    addNavItems();
    addButton();
    setupEvents();
  });
})();
