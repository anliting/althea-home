let
    diskspace=require('diskspace')
module.exports=(args,env)=>{
    if(!env.currentUser.isadmin)
        return
    return diskSpace()
}
function diskSpace(){
    return new Promise((rs,rj)=>{
        diskspace.check('/',(err,total,free,status)=>{
            if(err)
                return rj(err)
            rs({
                total,
                free,
            })
        })
    })
}
