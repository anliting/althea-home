import fs from 'fs'
import createDirectory from './server/createDirectory.mjs'
import getDiskSpace from './server/getDiskSpace.mjs'
import renameFile from './server/renameFile.mjs'
import getDirectoryInformation from './server/getDirectoryInformation.mjs'
import remove from './server/remove.mjs'
function pagemodule(env){
    if(!env.althea.allowOrigin(env.envVars,env.request.headers.origin))
        return 403
    if(env.request.method==='GET')
        return get(env)
    env.headers.allow='GET'
    return{
        status:405,
        headers:env.headers,
    }
}
function get(env){
    env.headers['content-type']='text/html;charset=utf-8'
    return{
        status:200,
        headers:env.headers,
        content:`
<!doctype html>
<title>Home</title>
<base href=${env.config.root}>
<meta name=viewport content='width=device-width,initial-scale=1'>
<body>
${env.althea.loadModule(
    //'plugins/home/main.js',
    'plugins/home/main.static.js',
    null,{
        sharedWorker:1,
    }
)}
        `
    }
}
export default althea=>{
    althea.addQueryFunction('createDirectory',createDirectory)
    althea.addQueryFunction('getDiskSpace',getDiskSpace)
    althea.addQueryFunction('renameFile',renameFile)
    althea.addQueryFunction(
        'getDirectoryInformation',
        getDirectoryInformation
    )
    althea.addQueryFunction('remove',remove)
    althea.addPagemodule(async env=>{
        let pathname=env.analyze.request.parsedUrl.pathname
        return /\/home/.test(pathname)&&
            await isDirectory(`usersFiles${decodeURI(pathname)}`)
        async function isDirectory(path){
            try{
                return(await fs.promises.stat(path)).isDirectory()
            }catch(e){
                return false
            }
        }
    },pagemodule)
}
