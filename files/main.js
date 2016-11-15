module.styleByPath('plugins/althea-home/main.css')
module.importByPath('lib/general.js',{mode:1}).then(general=>{
    general(module)
    module.shareImport('Home.js').then(Home=>
        new Home(module.repository.althea.site)
    )
})
