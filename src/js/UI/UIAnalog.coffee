
## Analog.coffee

dpr = window.devicePixelRatio
ringProperties = [
    [120, 0.1],
    [200, 0.06],
    [280, 0.03]
]

Rectangle = require '../Rectangle.coffee'
UITouchElement = require './UITouchElement.coffee'
UIAnalogStickSprite = require './UIAnalogStickSprite.coffee'
UIAnalogRingSprite = require './UIAnalogRingSprite.coffee'

class UIAnalog extends UITouchElement
    
    constructor: (rect, radius = 280) ->
        
        ###*
        # The rect where the analog lies. If the analog's position is
        # fixed, it will center itself in the center of the rect.
        #
        # @property rect
        # @type PIXI.Rectangle
        ###

        @rect = rect

        
        ###*
        # Whether the analog has a fixed position (true)
        # or its starting position depends on where you start dragging (false).
        #
        # @property fixed
        # @type Boolean
        # @default true
        ###

        @fixed = true
        

        ###*
        # Indicates if the user is currently dragging the analog stick.
        #
        # @property dragging
        # @type Boolean
        # @readonly
        ###

        @dragging = false
        

        ###*
        # The sprite that contains the analog's graphics.
        #
        # @property sprite
        # @type PIXI.DisplayObjectContainer
        ###

        @sprite = new PIXI.DisplayObjectContainer()
        

        ###*
        # The position where the current drag action started.
        #
        # @property dragStartPosition
        # @type PIXI.Point
        ###

        @dragStartPosition = new PIXI.Point 0,0
        

        ###*
        # The point relative to the analog's center where the stick
        # is logically (but maybe not visually) situated.
        #
        # @property stickPosition
        # @type PIXI.Point
        ###

        @stickPosition = new PIXI.Point 0,0
        

        ###*
        # The radius of the analog.
        #
        # @property radius
        # @type Number
        ###

        @radius = radius
        

        @setRect rect
        @initGraphics()
    
    
    ###*
    # Sets the rect where the analog is located. It's also the rect where
    # the analog accepts touches.
    #
    # @method setRect
    # @param [rect] {Rectangle} the analog's rect
    ###

    setRect: (rect) ->
        
        if rect not instanceof Rectangle
            return

        @rect = rect
        
        ## TODO: compare with previous rect for point translation
        @sprite.position.x = @dragStartPosition.x = @rect.centerX()
        @sprite.position.y = @dragStartPosition.y = @rect.centerY()


    wouldClaimTouch: (touch) ->
        @rect.contains touch.x, touch.y


    initGraphics: ->

        @calculateScaleFactor()
        
        @rings = []
        for [radius, alpha] in ringProperties
            ring = new UIAnalogRingSprite radius, @scale * dpr
            ring.alpha = alpha
            @sprite.addChild ring
        
        @stickSprite = new UIAnalogStickSprite @scale
        @sprite.addChild @stickSprite

        
    ## Called when a resize event is fired, so we need to regenerate the sprites
    updateGraphics: ->
        
        @calculateScaleFactor()
        
        @stickSprite.setUIScale @scale
        
        for ring in @rings
            ring.setUIScale @scale


    setStickPosition: (touch) ->
        
        maxRadius = @radius * dpr * @scale
        distX = touch.x - @dragStartPosition.x
        distY = touch.y - @dragStartPosition.y
        dist = Math.sqrt distX**2 + distY**2
        
        if maxRadius < dist
            distX *= maxRadius / dist
            distY *= maxRadius / dist
            
        @stickPosition.x = distX
        @stickPosition.y = distY
        
    touchStart: (touch) ->

        @dragging = true
        
        if @fixed
            @dragStartPosition.x = @rect.centerX()
            @dragStartPosition.y = @rect.centerY()
            @setStickPosition touch
        else
            @dragStartPosition.x = touch.x
            @dragStartPosition.y = touch.y
            @stickSprite.position.x = 0
            @stickSprite.position.y = 0
    

    touchMove: (touch) ->
        if @dragging
            @setStickPosition touch

            
    touchEnd: () ->
        @dragStartPosition.x = @rect.centerX()
        @dragStartPosition.y = @rect.centerX()
        @stickPosition.x = 0
        @stickPosition.y = 0
        @dragging = false

        
    logic: (dt) ->
        
        @stickSprite.position.x += (@stickPosition.x - @stickSprite.position.x) / 5
        @stickSprite.position.y += (@stickPosition.y - @stickSprite.position.y) / 5
        
        if not @fixed
            ## smoothly move analog center to the starting drag position
            @sprite.position.x += (@dragStartPosition.x - @sprite.position.x) / 5
            @sprite.position.y += (@dragStartPosition.y - @sprite.position.y) / 5
    

    calculateScaleFactor: ->
        @scale =  Math.min(@rect.width, @rect.height) / ( 300 * 2 )

        
module.exports = UIAnalog