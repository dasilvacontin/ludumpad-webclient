
## Analog.coffee

dpr = window.devicePixelRatio
ringProperties = [
    [120, 0.1],
    [200, 0.06],
    [280, 0.03]
]

class Analog
    
    constructor: (@rect) ->
        
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
            @type DisplayObjectContainer
        ###
        @sprite = new PIXI.DisplayObjectContainer()
        
        ###
            The identifier of the touch that is currently interacting with the analog.

            @property touchIdentifier
            @type Number
            @readonly
        ###
        @touchIdentifier = undefined
        
        @initGraphics()
        @dragStartPosition = new PIXI.Point 0,0
            
        ###
            The point relative to the analog's center where the stick
            is logically (but maybe not visually) situated.

            @property stickPosition
            @type PIXI.Point
        ###
        @stickPosition = new PIXI.Point 0,0
        @center = new PIXI.Point 0,0
        @resetPosition()
        
    resetPosition: ->
        
        @center.x = @rect.x + @rect.width/2
        @center.y = @rect.y + @rect.height/2
        
        @sprite.position.x = @dragStartPosition.x = @center.x
        @sprite.position.y = @dragStartPosition.y = @center.y
        
    setStickPosition: (touch) ->
        
        outerRingRadius = 280 * dpr * @scale
        distX = touch.x - @dragStartPosition.x
        distY = touch.y - @dragStartPosition.y
        dist = Math.sqrt distX**2 + distY**2
        
        if outerRingRadius < dist
            distX *= outerRingRadius/dist
            distY *= outerRingRadius/dist
            
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
            @dragStartPosition.x = @center.x
            @dragStartPosition.y = @center.y
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
        
    updateGripGraphics: ->
        
        maxRadius = 150
        maxOpacity = 0.2
        color = '#2F3741'
        
module.exports = Analog