
## UIElement.coffee

class UIElement extends PIXI.Sprite
    
    constructor: ->
        super
        
    setUIScale: (scale) ->
        if @UIScale != scale
            @UIScale = scale
            @setTexture @generateTexture()
        
    generateTexture: ->
        texture = document.createElement 'canvas'
        texture = new PIXI.Texture.fromCanvas texture
        
module.exports = AnalogStickSprite