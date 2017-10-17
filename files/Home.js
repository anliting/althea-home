import FileManager from './Home/FileManager.js'
import Ui from './Home/Ui.js'
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
    }
    fm.mkdir=async name=>{
        let site=await home._site
        return site.send({
            function:'createDirectory',
            path:`${fm.directory}/${name}`,
        })
    }
    fm.remove=async path=>{
        let site=await home._site
        return site.send({
            function:'remove',
            path,
        })
    }
    fm.send=a=>home.send(a)
    return fm
}
Home.prototype.focus=function(){
    this.fm.beFocused()
}
Home.prototype.send=async function(a){
    return(await this._site).send(a)
}
Object.defineProperty(Home.prototype,'ui',{configurable:true,get(){
    let ui=new Ui
    ui.appendLeftChild(this.fm.ui.node)
    ui.appendRightChild(this.rightFm.ui.node)
    ui.getDiskSpace=()=>this.getDiskSpace()
    Object.defineProperty(this,'ui',{value:ui.node})
    return this.ui
}})
Home.prototype.getDiskSpace=function(){
    return this.fm.getDiskSpace()
}
export default Home
