
###*
# @author David da Silva http://dasilvacont.in @dasilvacontin
###

###*
# This PIXI.Rectangle subclass adds a centerX and centerY methods.
#
# @class Rectangle
# @extends PIXI.Rectangle
# @constructor
# @param texture {PIXI.Texture} the sprite's texture
###

class Rectangle extends PIXI.Rectangle
    
    constructor: ->
        super

    ###*
    # Returns the rect's center in the x axe.
    #
    # @method centerX
    # @return {Number} the x center
    ###

    centerX: ->
        return @.x + @.width / 2


    ###*
    # Returns the rect's center in the y axe.
    #
    # @method centerY
    # @return {Number} the y center
    ###

    centerY: ->
        return @.y + @.height / 2


module.exports = Rectangle