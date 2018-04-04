import fs from 'fs'
import path from 'path'
export default(opt,env)=>{
    opt instanceof Object&&
    typeof opt.path=='string'||0()
    let currentUser=env.currentUser
    let pathToTarget=`${env.config.pathToUsersFiles}/home/`+opt.path
    currentUser.isadmin&&
    path.normalize(
        path.relative(`${env.config.pathToUsersFiles}/home`,pathToTarget)
    ).substring(0,2)!='..'||0()
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
