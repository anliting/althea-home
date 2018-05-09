import fs from 'fs'
import path from 'path'
export default async(opt,env)=>{
    opt instanceof Object&&
    typeof opt.path=='string'&&
    env.currentUser.isadmin||0()
    let pathToTarget=env.config.pathToUsersFiles+'/home/'+opt.path
    path.normalize(path.relative(
        `${env.config.pathToUsersFiles}/home`,pathToTarget
    )).substring(0,2)!='..'||0()
    try{
        let stat=await fs.promises.lstat(pathToTarget)
        stat.isFile()?
            fs.promises.unlink(pathToTarget)
        :stat.isDirectory&&
            fs.promises.rmdir(pathToTarget).catch(err=>{
                if(err.code=='ENOTEMPTY')
                    return
                throw err
            })
    }catch(err){
        if(err.code=='ENOENT')
            return
        throw err
    }
    return null
}
