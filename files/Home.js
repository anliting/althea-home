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
        this.fm=createFM(this,directory)
        this.rightFm=createFM(this,directory)
    }
    function createFM(home,directory){
        let fm=new FileManager
        fm.directory=directory
        fm.rename=async(f,name)=>{
            let site=await home._site
            await site.send({
                function:'renameFile',
                path:`${fm.directory}/${f.name}`,
                newpath:`${fm.directory}/${name}`,
            })
            fm.div.focus()
            fm.purgeFilelist()
            fm.setupFilelist()
        }
        fm.mkdir=async name=>{
            let site=await home._site
            return site.send({
                function:'createDirectory',
                path:`${fm.directory}/${name}`,
            })
        }
        fm.send=a=>home.send(a)
        return fm
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
