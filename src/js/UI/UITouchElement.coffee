
###*
# @author David da Silva http://dasilvacont.in @dasilvacontin
###

###*
# The UITouchElement object represents an UIElement that
# responds to touch events.
#
# @class UITouchElement
# @extends UIElement
# @constructor
# @param texture {PIXI.Texture} the sprite's texture
###

UIElement = require './UIElement.coffee'

class UITouchElement extends UIElement
    
    constructor: (texture) ->
        super

    ###*
    # Tests whether the UITouchElement is in position to claim a touch.
    #
    # Default behaviour claims touches as long as it doesn't have a
    # claimed touch already.
    #
    # @method canClaimTouches
    # @return {Boolean}
    ###

    canClaimTouches: ->
        console.log 'touchIdentifier:'
        console.log @touchIdentifier
        @touchIdentifier == null
    

    ###*
    # Tests if the touch is acceptable to interact with the element,
    # e.g. the touch is inside the element's bounds.
    #
    # Subclasses of UITouchElement should override this method.
    #
    # @method wouldClaimTouch
    # @param [touch] {Touch} the touch object
    # @return {Boolean}
    ###

    wouldClaimTouch: (touch) ->
        true


    ###*
    # Stores the touch as a claimed touch.
    #
    # @method claimTouch
    # @param [touch] {Touch} the touch object
    ###

    claimTouch: (touch) ->
        @touchIdentifier = touch.identifier
        @touchStart touch
    

    ###*
    # Unclaims the given touch.
    #
    # @method unclaimTouch
    # @param [identifier] {Number} the touch object identifier
    ###

    unclaimTouch: (identifier) ->
        if @touchIdentifier == identifier
            @touchIdentifier = null
            @touchEnd identifier


    ###*
    # Returns an array with the identifiers of the claimed touches.
    #
    # @method claimedTouches
    # @return {Array} an array of touch identifiers
    ###

    claimedTouches: ->
        if @touchIdentifier?
            return [@touchIdentifier]
        else
            return []
        

    ###*
    # Handle touchstart event of a claimed touch.
    #
    # @method touchStart
    # @param [touch] {Touch} the touch object
    ###

    touchStart: (touch) ->
        

    ###*
    # Handle touchmove event of a claimed touch.
    #
    # @method touchMove
    # @param [touch] {Touch} the touch object
    ###

    touchMove: (touch) ->
        

    ###*
    # Handle touchend event of a claimed touch.
    #
    # @method touchEnd
    # @param [identifier] {Number} the touch object identifier
    ###

    touchEnd: (identifier) ->


###*
# The identifier of the touch that is currently interacting
# with the UITouchElement.
#
# @property touchIdentifier
# @type Number
# @default null
# @readonly
###

UITouchElement::touchIdentifier = null


module.exports = UITouchElement