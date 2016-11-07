module.styleByPath('plugins/althea-home/main.css')
module.importByPath('lib/general.js').then(repository=>{
    module.repository=repository
    module.import('Home.js').then(Home=>
        new Home(repository.althea.site)
    )
})
