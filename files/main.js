module.styleByPath('plugins/althea-home/main.css')
module.importByPath('lib/general.js').then(repository=>
    repository.althea.Home.then(Home=>
        new Home(repository.althea.site)
    )
)
