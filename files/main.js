module.styleByPath('plugins/althea-home/main.css').then(main=>
    document.head.appendChild(main)
)
module.importByPath('lib/general.js',{mode:1}).then(async general=>{
    general(module)
    let[
        path,
        Home
    ]=await Promise.all([
        module.repository.npm.path,
        module.shareImport('Home.js'),
    ])
    let directory=path.normalize(
        decodeURI(location.pathname).match(/\/home\/?(.*)/)[1]
    )
    let home=new Home(module.repository.althea.site,directory)
    history.replaceState(
        {directory},
        '',
        path.normalize(`/home/${directory}`)
    )
    document.title=location.pathname
    home.fm.on('directoryChange',e=>{
        history.pushState(
            {directory:home.fm.directory},
            '',
            path.normalize(`/home/${home.fm.directory}`)
        )
        document.title=location.pathname
    })
    onpopstate=e=>{
        if(location.pathname.substring(0,5)=='/home')
            home.fm.directory=e.state.directory
    }
    document.body.appendChild(home.node)
    setTimeout(()=>
        home.fm.div.focus()
    )
})
