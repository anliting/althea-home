;(async()=>{
    let[
        FileManager,
        Ui,
    ]=await Promise.all([
        module.shareImport('Home/FileManager.js'),
        module.shareImport('Home/Ui.js'),
    ])
    function Home(site,directory){
        this._site=site
        this.fm=new FileManager(this)
        this.fm.directory=directory
        this.fm.send=a=>this.send(a)
        this.rightFm=new FileManager(this)
        this.rightFm.directory=directory
        this.rightFm.send=a=>this.send(a)
    }
    Home.prototype.send=async function(a){
        return(await this._site).send(a)
    }
    Object.defineProperty(Home.prototype,'ui',{configurable:true,get(){
        let ui=new Ui
        ui.appendLeftChild(this.fm.div)
        ui.appendRightChild(this.rightFm.div)
        ui.getDiskSpace=()=>this.getDiskSpace()
        Object.defineProperty(this,'ui',{value:ui.node})
        return this.ui
    }})
    Home.prototype.getDiskSpace=function(){
        return this.fm.getDiskSpace()
    }
    return Home
})()
