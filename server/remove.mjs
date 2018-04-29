import fsPromises from 'fs/promises'
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
        let stat=await fsPromises.lstat(pathToTarget)
        stat.isFile()?
            fsPromises.unlink(pathToTarget)
        :stat.isDirectory&&
            fsPromises.rmdir(pathToTarget).catch(err=>{
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
