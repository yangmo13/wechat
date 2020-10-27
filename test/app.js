//socket.io
//包含客户端和服务端
var app = require('express')();
//创建http服务 
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const users = [
    {
        username: 'liu',
        avatar: null
    }

]

//express 处理静态资源
app.use(require('express').static('public'))

app.get('/', (req, res) => {
    res.redirect('/index.html')
});

io.on('connection', (socket) => {

    console.log("服务器启动了")
    socket.on("login", data => {
        console.log(data, users)
        let user = users.find(item=>item.username===data.username)
        if(user){
            socket.emit('login_',{count:300,data:"用户名字重复"})
        }else{
            users.push(data)
            socket.emit('login_',{count:200,data:"登陆成功",msg:data})
            //socket.emit告诉当前用户登录成功,
            //io.emit()广播
            io.emit('addUser',data)
            io.emit('new',users)

            //把登录成功的用户存储
            socket.username = data.username
            socket.avatar = data.avatar

            
        }
    })
    socket.on('disconnect',()=>{

        //用户离开
        //删除users内容
        //告诉所有人    
        users.forEach(item=>{
           let num =   users.findIndex(item=>{
                item.username === socket.username
            })
            //删除
            users.splice(num,1)
            io.emit('delUser',{
                username:socket.username,
                avatar:socket.avatar
            })
        })
    
    })
  //监听聊天

socket.on("sendMes",data=>{
    io.emit('newMes',data)
})

});




http.listen(3000, () => {
    console.log('listening on *:3000');
});