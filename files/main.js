module.styleByPath('plugins/althea-home/main.css').then(main=>
    document.head.appendChild(main)
)
module.importByPath('lib/general.js',{mode:1}).then(async general=>{
    general(module)
    let Home=await module.shareImport('Home.js')
    new Home(module.repository.althea.site)
})
