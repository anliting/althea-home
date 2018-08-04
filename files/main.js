import style from './main/style.js'
import Home from'./Home.js'
import {doe,general,path,Site} from '/lib/core.static.js'
let
    directory=path.normalize(
        decodeURIComponent(location.pathname).match(/\/home\/?(.*)/)[1]
    ),
    home=new Home(new Site,directory),
    listenToDirectoryChange=true
general()
changeHistory('replaceState',directory)
home.fm.on('directoryChange',e=>{
    if(listenToDirectoryChange)
        changeHistory('pushState',home.fm.directory)
})
home.fm.on('fileExecuted',e=>{
    if(!e.isDirectory)
        location=e.href
    else
        home.fm.directory+='/'+e.name
})
onpopstate=e=>{
    listenToDirectoryChange=false
    home.fm.directory=e.state.directory
    listenToDirectoryChange=true
}
doe.head(doe.style(style))
document.body.appendChild(home.ui)
home.focus()
function changeHistory(method,directory){
    history[method](
        {directory},
        '',
        path.normalize(`/home/${directory}`)
    )
    document.title=directory
}
