module.styleByPath('plugins/althea-home/main.css')
module.importByPath('lib/general.js',{mode:1}).then(repository=>{
    module.repository=repository
    module.shareImport('Home.js').then(Home=>
        new Home(repository.althea.site)
    )
})
