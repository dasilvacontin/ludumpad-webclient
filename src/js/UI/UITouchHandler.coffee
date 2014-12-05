
###*
# @author David da Silva http://dasilvacont.in @dasilvacontin
###

###*
# The UITouchHandler object handles touch events for UITouchElements.
#
# @class UITouchHandler
# @constructor
###

MOUSE_IDENTIFIER = -42

class UITouchHandler
    
    constructor: ->
        @touchElements = []
        document.body.addEventListener 'mousedown', @handleMouseDown.bind(@), false
        document.body.addEventListener 'touchstart', @handleTouchStart.bind(@), false
        document.body.addEventListener 'mousemove', @handleMouseMove.bind(@), false
        document.body.addEventListener 'touchmove', @handleTouchMove.bind(@), false
        document.body.addEventListener 'mouseup', @handleMouseUp.bind(@), false
        document.body.addEventListener 'touchend', @handleTouchEnd.bind(@), false


    ## Public Methods


    ###*
    # The handler starts managing touch events for the given UITouchElement.
    #
    # @method manageTouchElement
    # @param [element] {UITouchElement} a touch element
    ###

    manageTouchElement: (element) ->
        @touchElements.push element


    ###*
    # The handler stops managing touch events for the given UITouchElement.
    #
    # @method forgetTouchElement
    # @param [element] {UITouchElement} a touch element
    ###

    forgetTouchElement: (element) ->
        while (index = @touchElements.indexOf element) and index != -1
            @touchElements.splice index, 1
        return


    ## Private Methods
    

    touchArrayCopyFromEvent: (e) ->
        if e.touches?
            return ({
                x: t.x * window.devicePixelRatio,
                y: t.y * window.devicePixelRatio,
                identfifier: t.identifier
            } for t in e.touches)
        else
            return []

    touchDictionaryFromEvent: (e) ->
        touches = {}
        if e.touches?
            for touch in e.touches
                touches[touch.identifier] = touch
        touches

    eventWithMouseAsTouch: (e) ->
        fakeTouch =
            x: e.x,
            y: e.y,
            identifier: MOUSE_IDENTIFIER
        e = touches: @touchArrayCopyFromEvent e
        e.touches.push fakeTouch
        e

    elementTryClaimingTouches: (element, touches) ->
        for i in [touches.length-1..0] by -1
            if not element.canClaimTouches()
                return
            touch = touches[i]
            if not element.wouldClaimTouch touch
                continue
            element.claimTouch touch
            touches.splice i, 1
            if not element.canClaimTouches()
                break
        return

    handleTouchStart: (e) ->
        touches = @touchArrayCopyFromEvent e
        for element in @touchElements
            @elementTryClaimingTouches element, touches
        return

    handleMouseDown: (e) ->
        @handleTouchStart @eventWithMouseAsTouch e

    handleTouchMove: (e) ->
        touches = @touchDictionaryFromEvent e
        for element in @touchElements
            for identifier in element.claimedTouches()
                if touches[identifier]?
                    element.touchMove touches[identifier]
                else
                    element.touchEnd identifier
        return

    handleMouseMove: (e) ->
        @handleTouchMove @eventWithMouseAsTouch e

    handleTouchEnd: (e) ->
        touches = @touchDictionaryFromEvent e
        for element in @touchElements
            for identifier in element.claimedTouches()
                if not touches[identifier]?
                    element.unclaimTouch identifier
        return

    handleMouseUp: (e) ->
        @handleTouchEnd e


module.exports = UITouchHandler