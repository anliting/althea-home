import{rollup}from'rollup'
let
    skip=[
        '/lib/core.static.js',
    ]
async function link(input,file,skip=[]){
    let bundle=await rollup({
        input,
        external:s=>skip.includes(s),
    })
    await bundle.write({
        file,
        format:'es',
        paths:s=>skip.includes(s)&&s,
    })
}
;(async()=>{
    await link('files/main.js','files/main.static.js',skip)
})()
