(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Analog, analog, animate, botButton, dpr, event, events, leftHalf, oldDate, processEvent, processTouches, renderer, rightHalf, stage, topButton, touchStart, _i, _len;

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

leftHalf = new PIXI.Rectangle(0, 0, (window.innerWidth * dpr) / 2, window.innerHeight * dpr);

rightHalf = new PIXI.Rectangle(leftHalf.width, 0, leftHalf.width, leftHalf.height);

Analog = require('./Analog.coffee');

analog = new Analog(leftHalf);

console.log(analog.sprite);

stage.addChild(analog.sprite);

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

processEvent = function(e) {
  var touch, touches, _i, _len, _ref;
  e.preventDefault();
  touches = [];
  if (e.touches) {
    _ref = e.touches;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      touch = _ref[_i];
      touches.push({
        x: touch.screenX * dpr,
        y: touch.screenY * dpr,
        identifier: touch.identifier
      });
    }
  } else if (e.type !== 'mouseup') {
    touches.push({
      x: e.x * dpr,
      y: e.y * dpr,
      identifier: -42
    });
  }
  return {
    touches: touches
  };
};

processTouches = function(e) {
  e = processEvent(e);
  return analog.processTouches(e.touches);
};

touchStart = function(e) {
  e = processEvent(e);
  return analog.touchStart(e.touches);
};

events = ['mousemove', 'touchmove', 'mouseup', 'touchend'];

document.body.addEventListener('mousedown', touchStart, false);

document.body.addEventListener('touchstart', touchStart, false);

for (_i = 0, _len = events.length; _i < _len; _i++) {
  event = events[_i];
  document.body.addEventListener(event, processTouches, false);
}

window.onresize = function() {
  renderer.resize(window.innerWidth * dpr, window.innerHeight * dpr);
  leftHalf.width = (window.innerWidth * dpr) / 2;
  leftHalf.height = window.innerHeight * dpr;
  rightHalf.x = leftHalf.width;
  rightHalf.y = leftHalf.height;
  analog.updateGraphics();
  analog.resetPosition();
  botButton.position.x = (window.innerWidth - 70) * dpr;
  return botButton.position.y = (window.innerHeight - 70) * dpr;
};

animate();



},{"./Analog.coffee":2}],2:[function(require,module,exports){
var Analog, AnalogStickSprite, dpr, ringProperties;

AnalogStickSprite = require('./AnalogStickSprite.coffee');

dpr = window.devicePixelRatio;

ringProperties = [[120, 0.1], [200, 0.06], [280, 0.03]];

Analog = (function() {
  function Analog(rect) {
    this.rect = rect;

    /*
        Whether the analog has a fixed position (true)
        or its starting position depends on where you start dragging (false).
    
        @property fixed
        @type Boolean
        @default true
     */
    this.fixed = true;

    /*
        Indicates if the user is currently dragging the analog stick.
    
        @property dragging
        @type Boolean
        @readonly
     */
    this.dragging = false;

    /*
        The sprite that contains the analog's graphics.
    
        @property sprite
        @type DisplayObjectContainer
     */
    this.sprite = new PIXI.DisplayObjectContainer();

    /*
        The identifier of the touch that is currently interacting with the analog.
    
        @property touchIdentifier
        @type Number
        @readonly
     */
    this.touchIdentifier = void 0;
    this.initGraphics();
    this.dragStartPosition = new PIXI.Point(0, 0);
    this.center = new PIXI.Point(0, 0);
    this.resetPosition();
  }

  Analog.prototype.resetPosition = function() {
    this.center.x = this.rect.x + this.rect.width / 2;
    this.center.y = this.rect.y + this.rect.height / 2;
    this.sprite.position.x = this.dragStartPosition.x = this.center.x;
    return this.sprite.position.y = this.dragStartPosition.y = this.center.y;
  };

  Analog.prototype.setStickPosition = function(touch) {
    var dist, distX, distY, outerRingRadius;
    outerRingRadius = 280 * dpr * this.scale;
    distX = touch.x - this.dragStartPosition.x;
    distY = touch.y - this.dragStartPosition.y;
    dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
    if (outerRingRadius < dist) {
      distX *= outerRingRadius / dist;
      distY *= outerRingRadius / dist;
    }
    this.stickSprite.position.x = distX;
    return this.stickSprite.position.y = distY;
  };

  Analog.prototype.processTouches = function(touches) {
    var claimedTouch, touch, _i, _len;
    if (this.touchIdentifier != null) {
      claimedTouch = void 0;
      for (_i = 0, _len = touches.length; _i < _len; _i++) {
        touch = touches[_i];
        if (touch.identifier === this.touchIdentifier) {
          claimedTouch = touch;
          break;
        }
      }
      if (!claimedTouch) {
        return this.touchEnd();
      } else {
        return this.touchMove(claimedTouch);
      }
    }
  };

  Analog.prototype.touchStart = function(touches) {
    var claimedTouch, touch, _i, _len;
    if (this.touchIdentifier != null) {
      return;
    }
    claimedTouch = void 0;
    for (_i = 0, _len = touches.length; _i < _len; _i++) {
      touch = touches[_i];
      if (this.rect.contains(touch.x, touch.y)) {
        claimedTouch = touch;
        break;
      }
    }
    if (!claimedTouch) {
      return;
    }
    this.dragging = true;
    this.touchIdentifier = claimedTouch.identifier;
    if (this.fixed) {
      this.dragStartPosition.x = this.center.x;
      this.dragStartPosition.y = this.center.y;
      return this.setStickPosition(claimedTouch);
    } else {
      this.dragStartPosition.x = claimedTouch.x;
      this.dragStartPosition.y = claimedTouch.y;
      this.stickSprite.position.x = 0;
      return this.stickSprite.position.y = 0;
    }
  };

  Analog.prototype.touchMove = function(touch) {
    if (this.dragging && (touch.identifier === this.touchIdentifier)) {
      return this.setStickPosition(touch);
    }
  };

  Analog.prototype.touchEnd = function() {
    this.dragStartPosition.x = this.center.x;
    this.dragStartPosition.y = this.center.y;
    this.dragging = false;
    return this.touchIdentifier = void 0;
  };

  Analog.prototype.logic = function(dt) {
    if (!this.dragging) {
      this.stickSprite.position.x += (0 - this.stickSprite.position.x) / 5;
      this.stickSprite.position.y += (0 - this.stickSprite.position.y) / 5;
    }
    if (!this.fixed) {
      this.sprite.position.x += (this.dragStartPosition.x - this.sprite.position.x) / 5;
      return this.sprite.position.y += (this.dragStartPosition.y - this.sprite.position.y) / 5;
    }
  };

  Analog.prototype.calculateScaleFactor = function() {
    return this.scale = Math.min(this.rect.width, this.rect.height) / (300 * 2 * dpr);
  };

  Analog.prototype.initGraphics = function() {
    var ring;
    this.calculateScaleFactor();
    this.rings = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = ringProperties.length; _i < _len; _i++) {
        ring = ringProperties[_i];
        _results.push(this.generateRing(ring));
      }
      return _results;
    }).call(this);
    this.stickSprite = new AnalogStickSprite(this.scale);
    this.sprite.addChild(this.stickSprite);
    return window.analog = this;
  };

  Analog.prototype.updateGraphics = function() {
    var i, _i, _ref, _results;
    this.calculateScaleFactor();
    this.stickSprite.updateTexture(this.scale);
    _results = [];
    for (i = _i = 0, _ref = this.rings.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      _results.push(this.rings[i].setTexture(this.ringTexture(ringProperties[i][0], 1)));
    }
    return _results;
  };

  Analog.prototype.updateGripGraphics = function() {
    var color, maxOpacity, maxRadius;
    maxRadius = 150;
    maxOpacity = 0.2;
    return color = '#2F3741';
  };

  Analog.prototype.generateRing = function(_arg) {
    var opacity, radius, ring, texture;
    radius = _arg[0], opacity = _arg[1];
    texture = this.ringTexture(radius, 1);
    ring = new PIXI.Sprite(texture);
    ring.anchor.x = 0.5;
    ring.anchor.y = 0.5;
    ring.alpha = ring.initialAlpha = opacity;
    this.sprite.addChild(ring);
    return ring;
  };

  Analog.prototype.ringTexture = function(radius, opacity) {
    var ctx, lineWidth, texture;
    radius *= dpr * this.scale;
    lineWidth = Math.ceil(4 * this.scale);
    texture = document.createElement('canvas');
    texture.width = texture.height = radius * 2 + lineWidth;
    ctx = texture.getContext('2d');
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = 'white';
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(texture.width / 2, texture.height / 2, radius, 0, 2 * Math.PI, false);
    ctx.stroke();
    return texture = new PIXI.Texture.fromCanvas(texture);
  };

  return Analog;

})();

module.exports = Analog;



},{"./AnalogStickSprite.coffee":3}],3:[function(require,module,exports){
var AnalogStickSprite,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AnalogStickSprite = (function(_super) {
  __extends(AnalogStickSprite, _super);

  function AnalogStickSprite(scale) {
    AnalogStickSprite.__super__.constructor.call(this, this.generateTexture(scale));
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
  }

  AnalogStickSprite.prototype.updateTexture = function(scale) {
    if (this.UIScale !== scale) {
      return this.setTexture(this.generateTexture(scale));
    }
  };

  AnalogStickSprite.prototype.generateTexture = function(UIScale) {
    var centerX, centerY, ctx, i, lineWidth, numberOfSides, pX, pY, radIncrement, radius, texture, _i, _ref;
    this.UIScale = UIScale;
    radius = 180 * this.UIScale;
    lineWidth = 20 * this.UIScale;
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

})(PIXI.Sprite);

module.exports = AnalogStickSprite;



},{}]},{},[1]);
