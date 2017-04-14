let
    fs=require('fs'),
    path=require('path')
module.exports=(options,env)=>{
    let currentUser=env.currentUser
    let
        pathToTarget=`${env.config.pathToUsersFiles}/home/`+options.path
    if(!(
        currentUser.isadmin&&
        path.normalize(
            path.relative(`${env.config.pathToUsersFiles}/home`,pathToTarget)
        ).substring(0,2)!='..'
    ))
        return
    return new Promise((rs,rj)=>{
        fs.readdir(pathToTarget,(err,files)=>{
            if(err)
                return rj(err)
            rs(Promise.all(files.map(file=>
                new Promise((rs,rj)=>{
                    fs.stat(pathToTarget+'/'+file,(err,stat)=>{
                        if(err)
                            return rj(err)
                        rs({
                            name:file,
                            isDirectory:
                                stat.isDirectory(),
                        })
                    })
                })
            )))
        })
    })
}
