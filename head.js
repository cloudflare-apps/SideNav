(function(){
  if (!document.addEventListener || !document.documentElement.setAttribute) {
    return;
  }

  var options = INSTALL_OPTIONS;

  var pointerEventsSupport;
  (function(){
    var el = document.createElement('x');
    el.style.cssText = 'pointer-events:auto';
    pointerEventsSupport = el.style.pointerEvents === 'auto';
  })();

  var navEl = document.createElement('eager-side-nav');

  var buttonEl = document.createElement('eager-side-nav-button');

  var setPosition = function() {
    navEl.setAttribute('eager-side-nav-position', options.position);
    buttonEl.setAttribute('eager-side-nav-position', options.position);
  };
  setPosition();

  var coverEl = document.createElement('eager-side-nav-cover');

  var style;
  var addStyles = function() {
    style = document.createElement('style');
    renderStyles();
    document.body.appendChild(style);
  };

  var renderStyles = function() {
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
      'eager-side-nav-button:after {' +
        'content: "' + options.buttonText.replace(/"/g, '\\"') + '"' +
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
  };

  var addCover = function() {
    if (pointerEventsSupport) {
      document.body.appendChild(coverEl);
    }
  };

  var addNavItem = function(item) {
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

  var addNavEl = function() {
    document.body.appendChild(navEl);
  };

  var addNavItems = function() {
    for (var i = 0; i < options.items.length; i++) {
      addNavItem(options.items[i]);
    }
  };

  var addButton = function() {
    buttonEl.innerHTML = '' +
      '<eager-side-nav-button-bar></eager-side-nav-button-bar>' +
      '<eager-side-nav-button-bar></eager-side-nav-button-bar>' +
      '<eager-side-nav-button-bar></eager-side-nav-button-bar>' +
    '';
    document.body.appendChild(buttonEl);
  };

  var setupEvents = function() {
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

  var toggle = function() {
    if (buttonEl.getAttribute('eager-side-nav-opened') === 'true') {
      close();
    } else {
      open();
    }
  };

  var open = function() {
    coverEl.setAttribute('eager-side-nav-opened', 'true');
    buttonEl.setAttribute('eager-side-nav-opened', 'true');
    navEl.setAttribute('eager-side-nav-opened', 'true');
  };

  var close = function() {
    coverEl.setAttribute('eager-side-nav-opened', 'false');
    buttonEl.setAttribute('eager-side-nav-opened', 'false');
    navEl.setAttribute('eager-side-nav-opened', 'false');
  };

  document.addEventListener('DOMContentLoaded', function(){
    addStyles();
    addCover();
    addNavEl();
    addNavItems();
    addButton();
    setupEvents();
  });

  INSTALL_SCOPE = {
    setOptions: function(opts) {
      options = opts;
      renderStyles();
      navEl.innerHTML = '';
      addNavItems();
      setPosition();
    }
  };
})();
