
## Analog.coffee

dpr = window.devicePixelRatio
ringProperties = [
    [120, 0.1],
    [200, 0.06],
    [280, 0.03]
]

UIAnalogStickSprite = require './UIAnalogStickSprite.coffee'
UIAnalogRingSprite = require './UIAnalogRingSprite.coffee'

class UIAnalog
    
    constructor: (rect, radius = 280) ->
        
        ###
            The rect where the analog lies. If the analog's position is
            fixed, it will center itself in the center of the rect.

            @property rect
            @type PIXI.Rectangle
        ###
        @rect = rect
        
        ###
            Whether the analog has a fixed position (true)
            or its starting position depends on where you start dragging (false).

            @property fixed
            @type Boolean
            @default true
        ###
        @fixed = true
        
        ###
            Indicates if the user is currently dragging the analog stick.

            @property dragging
            @type Boolean
            @readonly
        ###
        @dragging = false
        
        ###
            The sprite that contains the analog's graphics.

            @property sprite
            @type PIXI.DisplayObjectContainer
        ###
        @sprite = new PIXI.DisplayObjectContainer()
        
        ###
            The identifier of the touch that is currently interacting with the analog.

            @property touchIdentifier
            @type Number
            @default null
            @readonly
        ###
        @touchIdentifier = null
        
        ###
            The position where the current drag action started.

            @property dragStartPosition
            @type PIXI.Point
        ###
        @dragStartPosition = new PIXI.Point 0,0
            
        ###
            The point relative to the analog's center where the stick
            is logically (but maybe not visually) situated.

            @property stickPosition
            @type PIXI.Point
        ###
        @stickPosition = new PIXI.Point 0,0
        
        ###
            The radius of the analog.

            @property radius
            @type Number
        ###
        @radius = radius
        
        @setRect rect
        @initGraphics()
    
    ## These two should really be in the rect object
    centerX: ->
        @rect.x + @rect.width / 2
    centerX: ->
        @rect.y + @rect.height / 2
    
    setRect: (rect) ->
        
        ## TODO: rect validation tests/assertion
        @rect = rect
        
        ## TODO: compare with previous rect for point translation
        @sprite.position.x = @dragStartPosition.x = @centerX()
        @sprite.position.y = @dragStartPosition.y = @centerY()
        
    setStickPosition: (touch) ->
        
        maxRadius = @radius * dpr * @scale
        distX = touch.x - @dragStartPosition.x
        distY = touch.y - @dragStartPosition.y
        dist = Math.sqrt distX**2 + distY**2
        
        if maxRadius < dist
            distX *= outerRingRadius / dist
            distY *= outerRingRadius / dist
            
        @stickPosition.x = distX
        @stickPosition.y = distY
        
    processTouches: (touches) ->
        
        if @touchIdentifier?
            
            claimedTouch = undefined
            for touch in touches
                if touch.identifier == @touchIdentifier
                    claimedTouch = touch 
                    break
            
            if not claimedTouch
                @touchEnd() 
            else
                @touchMove claimedTouch
        
    touchStart: (touches) ->
        
        return if @touchIdentifier?
        
        claimedTouch = undefined
        for touch in touches
                if @rect.contains touch.x, touch.y
                    claimedTouch = touch
                    break
        return if not claimedTouch
        
        @dragging = true
        @touchIdentifier = claimedTouch.identifier
        
        if @fixed
            @dragStartPosition.x = @centerX()
            @dragStartPosition.y = @centerY()
            @setStickPosition claimedTouch
        else
            @dragStartPosition.x = claimedTouch.x
            @dragStartPosition.y = claimedTouch.y
            @stickSprite.position.x = 0
            @stickSprite.position.y = 0
        
    touchMove: (touch) ->
        if @dragging and (touch.identifier == @touchIdentifier)
             @setStickPosition touch 
            
    touchEnd: () ->
        @dragStartPosition.x = @center.x
        @dragStartPosition.y = @center.y
        @stickPosition.x = 0
        @stickPosition.y = 0
        @dragging = false
        @touchIdentifier = undefined
        
    logic: (dt) ->
        
        @stickSprite.position.x += (@stickPosition.x - @stickSprite.position.x) / 5
        @stickSprite.position.y += (@stickPosition.y - @stickSprite.position.y) / 5
        
        if not @fixed
            ## smoothly move analog center to the starting drag position
            @sprite.position.x += (@dragStartPosition.x - @sprite.position.x) / 5
            @sprite.position.y += (@dragStartPosition.y - @sprite.position.y) / 5
    
    calculateScaleFactor: ->
        @scale =  Math.min(@rect.width, @rect.height) / (300*2*dpr)
    
    initGraphics: ->
        @calculateScaleFactor()
        
        @rings = (@generateRing ring for ring in ringProperties)
        
        @stickSprite = new AnalogStickSprite @scale
        @sprite.addChild @stickSprite
        window.analog = this
        
    ## Called when a resize event is fired, so we need to regenerate the sprites
    updateGraphics: ->
        
        @calculateScaleFactor()
        
        @stickSprite.updateTexture @scale
        
        for i in [0..@rings.length-1]
            @rings[i].setTexture @ringTexture ringProperties[i][0], 1
        
module.exports = Analog