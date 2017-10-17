import{dom}from '/lib/core.static.js'
function AudioPlayer(){
}
AudioPlayer.prototype.start=function(src){
    this.audio=dom('audio',{src,autoplay:true})
}
AudioPlayer.prototype.end=function(){
    this.audio.parentNode.removeChild(
        this.audio
    )
    delete this.audio
}
export default AudioPlayer
