function AudioPlayer(){
}
AudioPlayer.prototype.start=function(src){
    this.audio=createAudio(src)
    function createAudio(src){
        let a=dom.audio()
        a.src=src
        a.autoplay=true
        return a
    }
}
AudioPlayer.prototype.end=function(){
    this.audio.parentNode.removeChild(
        this.audio
    )
    delete this.audio
}
AudioPlayer
