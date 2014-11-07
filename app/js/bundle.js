(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Rectangle, UIAnalog, UITouchHandler, analog, animate, botButton, dpr, leftHalf, oldDate, renderer, rightHalf, stage, topButton, touchHandler;

Rectangle = require('./Rectangle.coffee');

UIAnalog = require('./UI/UIAnalog.coffee');

UITouchHandler = require('./UI/UITouchHandler.coffee');

dpr = window.devicePixelRatio;

renderer = new PIXI.autoDetectRenderer(window.innerWidth * dpr, window.innerHeight * dpr);

document.getElementById('controller').appendChild(renderer.view);

renderer.view.style.width = window.innerWidth;

renderer.view.style.height = window.innerHeight;

stage = new PIXI.Stage(0x343E47);

oldDate = +new Date();

animate = function() {
  var dt, newDate;
  requestAnimationFrame(animate);
  newDate = +new Date();
  dt = Math.min((newDate - oldDate) / 16, 1.3);
  oldDate = newDate;
  analog.logic(dt);
  return renderer.render(stage);
};

leftHalf = new Rectangle(0, 0, (window.innerWidth * dpr) / 2, window.innerHeight * dpr);

rightHalf = new Rectangle(leftHalf.width, 0, leftHalf.width, leftHalf.height);

analog = new UIAnalog(leftHalf);

stage.addChild(analog.sprite);

touchHandler = new UITouchHandler();

touchHandler.manageTouchElement(analog);

topButton = new PIXI.Graphics();

topButton.beginFill(0x000000);

topButton.moveTo(0, 0);

topButton.lineTo(70 * dpr, 0);

topButton.lineTo(0, 70 * dpr);

topButton.lineTo(0, 0);

topButton.endFill();

stage.addChild(topButton);

botButton = new PIXI.Graphics();

botButton.beginFill(0x000000);

botButton.moveTo(70 * dpr, 0);

botButton.lineTo(70 * dpr, 70 * dpr);

botButton.lineTo(0, 70 * dpr);

botButton.lineTo(70 * dpr, 0);

botButton.endFill();

botButton.position.x = (window.innerWidth - 70) * dpr;

botButton.position.y = (window.innerHeight - 70) * dpr;

stage.addChild(botButton);

window.onresize = function() {
  renderer.resize(window.innerWidth * dpr, window.innerHeight * dpr);
  leftHalf.width = window.innerWidth * dpr / 2;
  rightHalf.height = leftHalf.height = window.innerHeight * dpr;
  rightHalf.x = rightHalf.width = leftHalf.width;
  analog.updateGraphics();
  analog.setRect(leftHalf);
  botButton.position.x = (window.innerWidth - 70) * dpr;
  return botButton.position.y = (window.innerHeight - 70) * dpr;
};

animate();



},{"./Rectangle.coffee":2,"./UI/UIAnalog.coffee":3,"./UI/UITouchHandler.coffee":8}],2:[function(require,module,exports){

/**
 * @author David da Silva http://dasilvacont.in @dasilvacontin
 */

/**
 * This PIXI.Rectangle subclass adds a centerX and centerY methods.
 *
 * @class Rectangle
 * @extends PIXI.Rectangle
 * @constructor
 * @param texture {PIXI.Texture} the sprite's texture
 */
var Rectangle,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Rectangle = (function(_super) {
  __extends(Rectangle, _super);

  function Rectangle() {
    Rectangle.__super__.constructor.apply(this, arguments);
  }


  /**
   * Returns the rect's center in the x axe.
   *
   * @method centerX
   * @return {Number} the x center
   */

  Rectangle.prototype.centerX = function() {
    return this.x + this.width / 2;
  };


  /**
   * Returns the rect's center in the y axe.
   *
   * @method centerY
   * @return {Number} the y center
   */

  Rectangle.prototype.centerY = function() {
    return this.y + this.height / 2;
  };

  return Rectangle;

})(PIXI.Rectangle);

module.exports = Rectangle;



},{}],3:[function(require,module,exports){

/**
 * @author David da Silva http://dasilvacont.in @dasilvacontin
 */

/**
 * An interactive analog.
 *
 * @class UIAnalog
 * @extends UITouchElement
 * @constructor
 */
var Rectangle, UIAnalog, UIAnalogRingSprite, UIAnalogStickSprite, UITouchElement, dpr, ringProperties,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

dpr = window.devicePixelRatio;

ringProperties = [[120, 0.1], [200, 0.06], [280, 0.03]];

Rectangle = require('../Rectangle.coffee');

UITouchElement = require('./UITouchElement.coffee');

UIAnalogStickSprite = require('./UIAnalogStickSprite.coffee');

UIAnalogRingSprite = require('./UIAnalogRingSprite.coffee');

UIAnalog = (function(_super) {
  __extends(UIAnalog, _super);

  function UIAnalog(rect, radius) {
    if (radius == null) {
      radius = 280;
    }

    /**
     * The rect where the analog lies. If the analog's position is
     * fixed, it will center itself in the center of the rect.
     *
     * @property rect
     * @type PIXI.Rectangle
     */
    this.rect = rect;

    /**
     * Whether the analog has a fixed position (true)
     * or its starting position depends on where you start dragging (false).
     *
     * @property fixed
     * @type Boolean
     * @default true
     */
    this.fixed = true;

    /**
     * Indicates if the user is currently dragging the analog stick.
     *
     * @property dragging
     * @type Boolean
     * @readonly
     */
    this.dragging = false;

    /**
     * The sprite that contains the analog's graphics.
     *
     * @property sprite
     * @type PIXI.DisplayObjectContainer
     */
    this.sprite = new PIXI.DisplayObjectContainer();

    /**
     * The position where the current drag action started.
     *
     * @property dragStartPosition
     * @type PIXI.Point
     */
    this.dragStartPosition = new PIXI.Point(0, 0);

    /**
     * The point relative to the analog's center where the stick
     * is logically (but maybe not visually) situated.
     *
     * @property stickPosition
     * @type PIXI.Point
     */
    this.stickPosition = new PIXI.Point(0, 0);

    /**
     * The radius of the analog.
     *
     * @property radius
     * @type Number
     */
    this.radius = radius;
    this.setRect(rect);
    this.initGraphics();
  }


  /**
   * Sets the rect where the analog is located. It's also the rect where
   * the analog accepts touches.
   *
   * @method setRect
   * @param [rect] {Rectangle} the analog's rect
   */

  UIAnalog.prototype.setRect = function(rect) {
    if (!(rect instanceof Rectangle)) {
      return;
    }
    this.rect = rect;
    this.sprite.position.x = this.dragStartPosition.x = this.rect.centerX();
    return this.sprite.position.y = this.dragStartPosition.y = this.rect.centerY();
  };


  /**
   * Interpolates the analog's graphic elements to their logic/internal position.
   *
   * @method logic
   * @param [dt] {Number} the logic step's delta time
   */

  UIAnalog.prototype.logic = function(dt) {
    this.stickSprite.position.x += (this.stickPosition.x - this.stickSprite.position.x) / 5;
    this.stickSprite.position.y += (this.stickPosition.y - this.stickSprite.position.y) / 5;
    if (!this.fixed) {
      this.sprite.position.x += (this.dragStartPosition.x - this.sprite.position.x) / 5;
      return this.sprite.position.y += (this.dragStartPosition.y - this.sprite.position.y) / 5;
    }
  };

  UIAnalog.prototype.wouldClaimTouch = function(touch) {
    return this.rect.contains(touch.x, touch.y);
  };

  UIAnalog.prototype.initGraphics = function() {
    var alpha, radius, ring, _i, _len, _ref;
    this.calculateScaleFactor();
    this.rings = [];
    for (_i = 0, _len = ringProperties.length; _i < _len; _i++) {
      _ref = ringProperties[_i], radius = _ref[0], alpha = _ref[1];
      ring = new UIAnalogRingSprite(radius, this.scale * dpr);
      ring.alpha = alpha;
      this.sprite.addChild(ring);
    }
    this.stickSprite = new UIAnalogStickSprite(this.scale);
    return this.sprite.addChild(this.stickSprite);
  };

  UIAnalog.prototype.updateGraphics = function() {
    var ring, _i, _len, _ref, _results;
    this.calculateScaleFactor();
    this.stickSprite.setUIScale(this.scale);
    _ref = this.rings;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      ring = _ref[_i];
      _results.push(ring.setUIScale(this.scale));
    }
    return _results;
  };

  UIAnalog.prototype.setStickPosition = function(touch) {
    var dist, distX, distY, maxRadius;
    maxRadius = this.radius * dpr * this.scale;
    distX = touch.x - this.dragStartPosition.x;
    distY = touch.y - this.dragStartPosition.y;
    dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
    if (maxRadius < dist) {
      distX *= maxRadius / dist;
      distY *= maxRadius / dist;
    }
    this.stickPosition.x = distX;
    return this.stickPosition.y = distY;
  };

  UIAnalog.prototype.touchStart = function(touch) {
    this.dragging = true;
    if (this.fixed) {
      this.dragStartPosition.x = this.rect.centerX();
      this.dragStartPosition.y = this.rect.centerY();
      return this.setStickPosition(touch);
    } else {
      this.dragStartPosition.x = touch.x;
      this.dragStartPosition.y = touch.y;
      this.stickSprite.position.x = 0;
      return this.stickSprite.position.y = 0;
    }
  };

  UIAnalog.prototype.touchMove = function(touch) {
    if (this.dragging) {
      return this.setStickPosition(touch);
    }
  };

  UIAnalog.prototype.touchEnd = function() {
    this.dragStartPosition.x = this.rect.centerX();
    this.dragStartPosition.y = this.rect.centerX();
    this.stickPosition.x = 0;
    this.stickPosition.y = 0;
    return this.dragging = false;
  };

  UIAnalog.prototype.calculateScaleFactor = function() {
    return this.scale = Math.min(this.rect.width, this.rect.height) / (300 * 2);
  };

  return UIAnalog;

})(UITouchElement);

module.exports = UIAnalog;



},{"../Rectangle.coffee":2,"./UIAnalogRingSprite.coffee":4,"./UIAnalogStickSprite.coffee":5,"./UITouchElement.coffee":7}],4:[function(require,module,exports){

/**
 * @author David da Silva http://dasilvacont.in @dasilvacontin
 */

/**
 * An analog ring sprite.
 *
 * @class AnalogRingSprite
 * @extends UIElement
 * @constructor
 */
var AnalogRingSprite, UIElement,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

UIElement = require('./UIElement.coffee');

AnalogRingSprite = (function(_super) {
  __extends(AnalogRingSprite, _super);

  function AnalogRingSprite(radius, UIScale) {
    this.radius = radius;
    this.UIScale = UIScale != null ? UIScale : 1;
    AnalogRingSprite.__super__.constructor.call(this, this.generateTexture());
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
  }

  AnalogRingSprite.prototype.setRadius = function(radius) {
    if (this.radius !== radius) {
      this.radius = radius;
      return this.setTexture(this.generateTexture());
    }
  };

  AnalogRingSprite.prototype.generateTexture = function() {
    var ctx, lineWidth, radius, texture;
    radius = this.radius * this.UIScale;
    lineWidth = Math.ceil(4 * this.UIScale);
    texture = document.createElement('canvas');
    texture.width = texture.height = radius * 2 + lineWidth;
    ctx = texture.getContext('2d');
    ctx.strokeStyle = 'white';
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(texture.width / 2, texture.height / 2, radius, 0, 2 * Math.PI, false);
    ctx.stroke();
    return texture = new PIXI.Texture.fromCanvas(texture);
  };

  return AnalogRingSprite;

})(UIElement);

module.exports = AnalogRingSprite;



},{"./UIElement.coffee":6}],5:[function(require,module,exports){

/**
 * @author David da Silva http://dasilvacont.in @dasilvacontin
 */

/**
 * An analog stick sprite.
 *
 * @class AnalogStickSprite
 * @extends UIElement
 * @constructor
 */
var AnalogStickSprite, UIElement,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

UIElement = require('./UIElement.coffee');

AnalogStickSprite = (function(_super) {
  __extends(AnalogStickSprite, _super);

  function AnalogStickSprite(UIScale) {
    this.UIScale = UIScale != null ? UIScale : 1;
    AnalogStickSprite.__super__.constructor.call(this, this.generateTexture());
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
  }

  AnalogStickSprite.prototype.generateTexture = function() {
    var centerX, centerY, ctx, i, lineWidth, numberOfSides, pX, pY, radIncrement, radius, texture, _i, _ref;
    radius = 100 * this.UIScale;
    lineWidth = 10 * this.UIScale;
    texture = document.createElement('canvas');
    texture.width = texture.height = (2 * radius) + lineWidth;
    ctx = texture.getContext('2d');
    numberOfSides = 8;
    centerX = texture.width / 2;
    centerY = texture.width / 2;
    radIncrement = 2 * Math.PI / numberOfSides;
    ctx.beginPath();
    ctx.moveTo(centerX + radius * Math.cos(0), centerY + radius * Math.sin(0));
    for (i = _i = 1, _ref = numberOfSides + 1; _i <= _ref; i = _i += 1) {
      pX = centerX + radius * Math.cos(i * radIncrement);
      pY = centerY + radius * Math.sin(i * radIncrement);
      ctx.lineTo(pX, pY);
    }
    ctx.strokeStyle = 'white';
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = 'miter';
    ctx.stroke();
    radius = Math.ceil(12 * this.UIScale);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();
    return texture = new PIXI.Texture.fromCanvas(texture);
  };

  return AnalogStickSprite;

})(UIElement);

module.exports = AnalogStickSprite;



},{"./UIElement.coffee":6}],6:[function(require,module,exports){

/**
 * @author David da Silva http://dasilvacont.in @dasilvacontin
 */

/**
 * The UIElement object represents a sprite that supports re-rendering
 * due to UI scale changes.
 *
 * @class UIElement
 * @extends PIXI.Sprite
 * @constructor
 * @param texture {PIXI.Texture} the sprite's texture
 */
var UIElement,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

UIElement = (function(_super) {
  __extends(UIElement, _super);

  function UIElement() {
    UIElement.__super__.constructor.apply(this, arguments);
  }


  /**
   * Sets the UI scale of the element, and regenerates the texture if necessary.
   *
   * @method setUIScale
   * @param [scale] {Number} the new UI scale
   */

  UIElement.prototype.setUIScale = function(scale) {
    if (this.UIScale !== scale) {
      this.UIScale = scale;
      return this.setTexture(this.generateTexture());
    }
  };


  /**
   * The function that generates the texture of the UIElement.
   * It should make use of UIScale in order to calculate its sizing.
   *
   * @method generateTexture
   * @return {PIXI.Texture} the texture of the UIElement
   */

  UIElement.prototype.generateTexture = function() {
    var texture;
    texture = document.createElement('canvas');
    return texture = new PIXI.Texture.fromCanvas(texture);
  };

  return UIElement;

})(PIXI.Sprite);

module.exports = UIElement;



},{}],7:[function(require,module,exports){

/**
 * @author David da Silva http://dasilvacont.in @dasilvacontin
 */

/**
 * The UITouchElement object represents an UIElement that
 * responds to touch events.
 *
 * @class UITouchElement
 * @extends UIElement
 * @constructor
 * @param texture {PIXI.Texture} the sprite's texture
 */
var UIElement, UITouchElement,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

UIElement = require('./UIElement.coffee');

UITouchElement = (function(_super) {
  __extends(UITouchElement, _super);

  function UITouchElement(texture) {
    UITouchElement.__super__.constructor.apply(this, arguments);
  }


  /**
   * Tests whether the UITouchElement is in position to claim a touch.
   *
   * Default behaviour claims touches as long as it doesn't have a
   * claimed touch already.
   *
   * @method canClaimTouches
   * @return {Boolean}
   */

  UITouchElement.prototype.canClaimTouches = function() {
    return this.touchIdentifier === null;
  };


  /**
   * Tests if the touch is acceptable to interact with the element,
   * e.g. the touch is inside the element's bounds.
   *
   * Subclasses of UITouchElement should override this method.
   *
   * @method wouldClaimTouch
   * @param [touch] {Touch} the touch object
   * @return {Boolean}
   */

  UITouchElement.prototype.wouldClaimTouch = function(touch) {
    return true;
  };


  /**
   * Stores the touch as a claimed touch.
   *
   * @method claimTouch
   * @param [touch] {Touch} the touch object
   */

  UITouchElement.prototype.claimTouch = function(touch) {
    this.touchIdentifier = touch.identifier;
    return this.touchStart(touch);
  };


  /**
   * Unclaims the given touch.
   *
   * @method unclaimTouch
   * @param [identifier] {Number} the touch object identifier
   */

  UITouchElement.prototype.unclaimTouch = function(identifier) {
    if (this.touchIdentifier === identifier) {
      this.touchIdentifier = null;
      return this.touchEnd(identifier);
    }
  };


  /**
   * Returns an array with the identifiers of the claimed touches.
   *
   * @method claimedTouches
   * @return {Array} an array of touch identifiers
   */

  UITouchElement.prototype.claimedTouches = function() {
    if (this.touchIdentifier != null) {
      return [this.touchIdentifier];
    } else {
      return [];
    }
  };


  /**
   * Handle touchstart event of a claimed touch.
   *
   * @method touchStart
   * @param [touch] {Touch} the touch object
   */

  UITouchElement.prototype.touchStart = function(touch) {};


  /**
   * Handle touchmove event of a claimed touch.
   *
   * @method touchMove
   * @param [touch] {Touch} the touch object
   */

  UITouchElement.prototype.touchMove = function(touch) {};


  /**
   * Handle touchend event of a claimed touch.
   *
   * @method touchEnd
   * @param [identifier] {Number} the touch object identifier
   */

  UITouchElement.prototype.touchEnd = function(identifier) {};

  return UITouchElement;

})(UIElement);


/**
 * The identifier of the touch that is currently interacting
 * with the UITouchElement.
 *
 * @property touchIdentifier
 * @type Number
 * @default null
 * @readonly
 */

UITouchElement.prototype.touchIdentifier = null;

module.exports = UITouchElement;



},{"./UIElement.coffee":6}],8:[function(require,module,exports){

/**
 * @author David da Silva http://dasilvacont.in @dasilvacontin
 */

/**
 * The UITouchHandler object handles touch events for UITouchElements.
 *
 * @class UITouchHandler
 * @constructor
 */
var MOUSE_IDENTIFIER, UITouchHandler;

MOUSE_IDENTIFIER = -42;

UITouchHandler = (function() {
  function UITouchHandler() {
    this.touchElements = [];
    document.body.addEventListener('mousedown', this.handleMouseDown.bind(this), false);
    document.body.addEventListener('touchstart', this.handleTouchStart.bind(this), false);
    document.body.addEventListener('mousemove', this.handleMouseMove.bind(this), false);
    document.body.addEventListener('touchmove', this.handleTouchMove.bind(this), false);
    document.body.addEventListener('mouseup', this.handleMouseUp.bind(this), false);
    document.body.addEventListener('touchend', this.handleTouchEnd.bind(this), false);
  }


  /**
   * The handler starts managing touch events for the given UITouchElement.
   *
   * @method manageTouchElement
   * @param [element] {UITouchElement} a touch element
   */

  UITouchHandler.prototype.manageTouchElement = function(element) {
    return this.touchElements.push(element);
  };


  /**
   * The handler stops managing touch events for the given UITouchElement.
   *
   * @method forgetTouchElement
   * @param [element] {UITouchElement} a touch element
   */

  UITouchHandler.prototype.forgetTouchElement = function(element) {
    var index;
    while ((index = this.touchElements.indexOf(element)) && index !== -1) {
      this.touchElements.splice(index, 1);
    }
  };

  UITouchHandler.prototype.touchArrayCopyFromEvent = function(e) {
    var touch;
    if (e.touches != null) {
      return (function() {
        var _i, _len, _ref, _results;
        _ref = e.touches;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          touch = _ref[_i];
          _results.push(touch);
        }
        return _results;
      })();
    } else {
      return [];
    }
  };

  UITouchHandler.prototype.touchDictionaryFromEvent = function(e) {
    var touch, touches, _i, _len, _ref;
    touches = {};
    if (e.touches != null) {
      _ref = e.touches;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        touch = _ref[_i];
        touches[touch.identifier] = touch;
      }
    }
    return touches;
  };

  UITouchHandler.prototype.eventWithMouseAsTouch = function(e) {
    var fakeTouch;
    fakeTouch = {
      x: e.x,
      y: e.y,
      identifier: MOUSE_IDENTIFIER
    };
    e = {
      touches: this.touchArrayCopyFromEvent(e)
    };
    e.touches.push(fakeTouch);
    return e;
  };

  UITouchHandler.prototype.elementTryClaimingTouches = function(element, touches) {
    var i, touch, _i, _ref;
    for (i = _i = _ref = touches.length - 1; _i >= 0; i = _i += -1) {
      if (!element.canClaimTouches()) {
        return;
      }
      touch = touches[i];
      if (!element.wouldClaimTouch(touch)) {
        continue;
      }
      element.claimTouch(touch);
      touches.splice(i, 1);
      if (!element.canClaimTouches()) {
        break;
      }
    }
  };

  UITouchHandler.prototype.handleTouchStart = function(e) {
    var element, touches, _i, _len, _ref;
    touches = this.touchArrayCopyFromEvent(e);
    _ref = this.touchElements;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      element = _ref[_i];
      this.elementTryClaimingTouches(element, touches);
    }
  };

  UITouchHandler.prototype.handleMouseDown = function(e) {
    return this.handleTouchStart(this.eventWithMouseAsTouch(e));
  };

  UITouchHandler.prototype.handleTouchMove = function(e) {
    var element, identifier, touches, _i, _j, _len, _len1, _ref, _ref1;
    touches = this.touchDictionaryFromEvent(e);
    _ref = this.touchElements;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      element = _ref[_i];
      _ref1 = element.claimedTouches();
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        identifier = _ref1[_j];
        if (touches[identifier] != null) {
          element.touchMove(touches[identifier]);
        } else {
          element.touchEnd(identifier);
        }
      }
    }
  };

  UITouchHandler.prototype.handleMouseMove = function(e) {
    return this.handleTouchMove(this.eventWithMouseAsTouch(e));
  };

  UITouchHandler.prototype.handleTouchEnd = function(e) {
    var element, identifier, touches, _i, _j, _len, _len1, _ref, _ref1;
    touches = this.touchDictionaryFromEvent(e);
    _ref = this.touchElements;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      element = _ref[_i];
      _ref1 = element.claimedTouches();
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        identifier = _ref1[_j];
        if (touches[identifier] == null) {
          element.unclaimTouch(identifier);
        }
      }
    }
  };

  UITouchHandler.prototype.handleMouseUp = function(e) {
    return this.handleTouchEnd(e);
  };

  return UITouchHandler;

})();

module.exports = UITouchHandler;



},{}]},{},[1]);
