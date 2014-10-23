
###*
# @author David da Silva http://dasilvacont.in @dasilvacontin
###

###*
# The UIElement object represents a sprite that supports re-rendering
# due to UI scale changes.
#
# @class UIElement
# @extends PIXI.Sprite
# @constructor
# @param texture {PIXI.Texture} the sprite's texture
###

class UIElement extends PIXI.Sprite
    
    constructor: ->
        super

    ###*
    # Sets the UI scale of the element, and regenerates the texture if necessary.
    #
    # @method setUIScale
    # @param [scale] {Number} the new UI scale
    ###

    setUIScale: (scale) ->
        if @UIScale != scale
            @UIScale = scale
            @setTexture @generateTexture()


    ###*
    # The function that generates the texture of the UIElement.
    # It should make use of UIScale in order to calculate its sizing.
    #
    # @method generateTexture
    # @return {PIXI.Texture} the texture of the UIElement
    ###

    generateTexture: ->
        texture = document.createElement 'canvas'
        texture = new PIXI.Texture.fromCanvas texture


module.exports = UIElement