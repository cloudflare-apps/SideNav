(function () {
  'use strict'

  if (!document.addEventListener) return

  var options = INSTALL_OPTIONS

  var pointerEventsSupport
  ;(function () {
    var el = document.createElement('x')
    el.style.cssText = 'pointer-events:auto'
    pointerEventsSupport = el.style.pointerEvents === 'auto'
  })()

  var navEl = document.createElement('cfapps-side-nav')

  var buttonEl = document.createElement('cfapps-side-nav-button')

  function setPosition () {
    navEl.setAttribute('cfapps-side-nav-position', options.position)
    buttonEl.setAttribute('cfapps-side-nav-position', options.position)
  }

  setPosition()

  var coverEl = document.createElement('cfapps-side-nav-cover')

  var style
  function addStyles () {
    style = document.createElement('style')
    renderStyles()
    document.body.appendChild(style)
  }

  function renderStyles () {
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
    ''
  }

  function addCover () {
    if (pointerEventsSupport) {
      document.body.appendChild(coverEl)
    }
  }

  function addNavItem (item) {
    var itemEl

    if (item.itemType === 'link') {
      itemEl = document.createElement('a')
      itemEl.appendChild(document.createTextNode(item.linkText))
      itemEl.setAttribute('href', item.href || '')
      if (item.targetBlank === true) {
        itemEl.setAttribute('target', '_blank')
      }
      if (item.icon && item.icon !== 'none') {
        itemEl.setAttribute('cfapps-side-nav-icon', item.icon)
      }
    } else {
      itemEl = document.createElement('cfapps-side-nav-label')
      itemEl.appendChild(document.createTextNode(item.labelText))
    }

    navEl.appendChild(itemEl)
  }

  function addNavEl () {
    document.body.appendChild(navEl)
  }

  function addNavItems () {
    options.items.forEach(addNavItem)
  }

  function addButton () {
    buttonEl.innerHTML = '' +
      '<cfapps-side-nav-button-bar></cfapps-side-nav-button-bar>' +
      '<cfapps-side-nav-button-bar></cfapps-side-nav-button-bar>' +
      '<cfapps-side-nav-button-bar></cfapps-side-nav-button-bar>' +
    ''
    document.body.appendChild(buttonEl)
  }

  function setupEvents () {
    buttonEl.addEventListener('click', toggle)

    document.body.addEventListener('click', function (event) {
      if (!event || !event.target) return
      if (event.target === buttonEl) return
      if (event.target === navEl) return
      if (buttonEl.contains(event.target)) return
      if (navEl.contains(event.target)) return

      close()
    })

    window.addEventListener('pushState', close)
    window.addEventListener('replaceState', close)
    window.addEventListener('hashchange', close)

    // iOS :hover CSS hack
    coverEl.addEventListener('touchstart', function () {}, false)
    buttonEl.addEventListener('touchstart', function () {}, false)
    navEl.addEventListener('touchstart', function () {}, false)
  }

  function toggle () {
    if (buttonEl.getAttribute('cfapps-side-nav-opened') === 'true') {
      close()
    } else {
      open()
    }
  }

  function open () {
    coverEl.setAttribute('cfapps-side-nav-opened', 'true')
    buttonEl.setAttribute('cfapps-side-nav-opened', 'true')
    navEl.setAttribute('cfapps-side-nav-opened', 'true')
  }

  function close () {
    coverEl.setAttribute('cfapps-side-nav-opened', 'false')
    buttonEl.setAttribute('cfapps-side-nav-opened', 'false')
    navEl.setAttribute('cfapps-side-nav-opened', 'false')
  }

  document.addEventListener('DOMContentLoaded', function () {
    addStyles()
    addCover()
    addNavEl()
    addNavItems()
    addButton()
    setupEvents()
  })

  window.INSTALL_SCOPE = {
    setOptions: function setOptions (nextOptions) {
      options = nextOptions
      renderStyles()
      navEl.innerHTML = ''
      addNavItems()
      setPosition()
    }
  }
}())
