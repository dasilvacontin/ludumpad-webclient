
## UITouchElement.coffee

###
    @author David da Silva http://dasilvacont.in @dasilvacontin
###

UIElement = require './UIElement.coffee'

###
    The UITouchElement object represents an UIElement that
    responds to touch events.

    @class UITouchElement
    @constructor
    @param texture {PIXI.Texture} the sprite's texture
###

class UITouchElement extends UIElement
    
    constructor: (texture) ->
        super
         
        ###
            The identifier of the touch that is currently interacting
            with the UITouchElement.

            @property touchIdentifier
            @type Number
            @default null
            @readonly
        ###
        @touchIdentifier = null
    
    ###
        Tests whether the UITouchElement is in position to claim a touch.

        Default behaviour claims touches as long as it doesn't have a
        claimed touch already.

        @method canClaimTouches
        @return {Boolean}
    ###
    canClaimTouches: -> @touchIdentifier == null
    
    ###
        Tests if the touch is acceptable to interact with the element,
        e.g. the touch is inside the element's bounds.

        Subclasses of UITouchElement should override this method.

        @method wouldClaimTouch
        @param [touch] {Touch} the touch object
        @return {Boolean}
    ###
    wouldClaimTouch: (touch) ->
        true

    ###
        Stores the touch as a claimed touch.

        @method claimTouch
        @param [touch] {Touch} the touch object
    ###
    claimTouch: (touch) -> @touchIdentifier = touch.identifier
    
    ###
        Unclaims the given touch.

        @method unclaimTouch
        @param [touch] {Touch} the touch object
    ###
    unclaimTouch: (touch) ->
        if @touchIdentifier == touch.identifier
            @touchIdentifier = null
        
    ###
        Returns an array with the identifiers of the claimed touches.

        @method claimedTouches
        @return {Array} an array of touch identifiers
    ###
    claimedTouches: ->
        if @touchIdentifier?
            return [@touchIdentifier]
        else
            return []
        
    ###
        Handle touchstart event of a claimed touch.
        
        @method touchStart
        @param [touch] {Touch} the touch object
    ###
    touchStart: (touch) ->
        
    ###
        Handle touchmove event of a claimed touch.

        @method touchMove
        @param [touch] {Touch} the touch object
    ###
    touchMove: (touch) ->
        
    ###
        Handle touchend event of a claimed touch.

        @method touchEnd
        @param [touch {Touch} the touch object
    ###
    touchEnd: (touch) ->
        
module.exports = UITouchElement