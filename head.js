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

  var navEl = document.createElement('cfapps-side-nav');

  var buttonEl = document.createElement('cfapps-side-nav-button');

  var setPosition = function() {
    navEl.setAttribute('cfapps-side-nav-position', options.position);
    buttonEl.setAttribute('cfapps-side-nav-position', options.position);
  };
  setPosition();

  var coverEl = document.createElement('cfapps-side-nav-cover');

  var style;
  var addStyles = function() {
    style = document.createElement('style');
    renderStyles();
    document.body.appendChild(style);
  };

  var renderStyles = function() {
    style.innerHTML = '' +
      'cfapps-side-nav > a {' +
        'color: ' + options.linkColor + ' !important' +
      '}' +
      'cfapps-side-nav-label {' +
        'color: ' + options.labelColor + ' !important' +
      '}' +
      'cfapps-side-nav {' +
        'background: ' + options.backgroundColor + ' !important' +
      '}' +
      'cfapps-side-nav-button-bar {' +
        'background: ' + options.buttonColor + ' !important' +
      '}' +
      'cfapps-side-nav-button[cfapps-side-nav-opened="true"] cfapps-side-nav-button-bar {' +
        'background: ' + options.linkColor + ' !important' +
      '}' +
      (options.showCover ? '' +
      'cfapps-side-nav-cover {' +
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
        itemEl.setAttribute('cfapps-side-nav-icon', item.icon);
      }
    } else {
      itemEl = document.createElement('cfapps-side-nav-label');
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
      '<cfapps-side-nav-button-bar></cfapps-side-nav-button-bar>' +
      '<cfapps-side-nav-button-bar></cfapps-side-nav-button-bar>' +
      '<cfapps-side-nav-button-bar></cfapps-side-nav-button-bar>' +
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
    if (buttonEl.getAttribute('cfapps-side-nav-opened') === 'true') {
      close();
    } else {
      open();
    }
  };

  var open = function() {
    coverEl.setAttribute('cfapps-side-nav-opened', 'true');
    buttonEl.setAttribute('cfapps-side-nav-opened', 'true');
    navEl.setAttribute('cfapps-side-nav-opened', 'true');
  };

  var close = function() {
    coverEl.setAttribute('cfapps-side-nav-opened', 'false');
    buttonEl.setAttribute('cfapps-side-nav-opened', 'false');
    navEl.setAttribute('cfapps-side-nav-opened', 'false');
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
