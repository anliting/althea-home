;(async()=>{
    let style=module.styleByPath('plugins/althea-home/main.css')
    ;(await module.importByPath('lib/general.js',{mode:1}))(module)
    let
        [
            path,
            Home
        ]=await Promise.all([
            module.repository.althea.path,
            module.module('Home.js'),
        ]),
        directory=path.normalize(
            decodeURIComponent(location.pathname).match(/\/home\/?(.*)/)[1]
        ),
        home=new Home(module.repository.althea.site,directory),
        listenToDirectoryChange=true
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
    style=await style
    document.head.appendChild(style)
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
})()
