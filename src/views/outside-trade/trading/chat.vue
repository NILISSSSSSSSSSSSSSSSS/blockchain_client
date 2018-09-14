<script>

import { getTradeDetails } from 'api/outside-trade'
import inputText from './components/inputText';
import Message from './components/message';
import VueSocketio from 'vue-socket.io';
import socketio from 'socket.io-client';
import Vue from 'vue';
export default {
    components: { inputText, Message },
    props: ['remark'],
    data () {
        return {
            socketId: '',
            
        }
    },
    methods: {
        system: function(text){
            this.$emit('system', text)
        },
        upload: function(file){
            console.log('======up')
            console.log(file)
        },
        // updateSocket: function(params){
        //     if(localStorage.socketArr){
        //         let socketArr = JSON.parse(localStorage.socketArr);
        //         for(var i = 0; i < socketArr.length; i++){
        //             if(params.orderCode == socketArr[i].orderCode){
        //                 socketArr[i] = params;
        //                 localStorage.socketArr = JSON.stringify(socketArr)
        //                 return;
        //             }
        //         }
        //     }else{
        //         let socketArr = [];
        //         socketArr.push(params)
        //         localStorage.socketArr = JSON.stringify(socketArr)
        //     }
        // },
        // clearSocket: function(params){
        //     let socketArr = JSON.parse(localStorage.socketArr);
        //     for(var i = 0; i < socketArr.length; i++){
        //         if(params.orderCode == socketArr[i].orderCode){
        //             socketArr.splice(i, 1);
        //             localStorage.socketArr = JSON.stringify(socketArr)
        //             return;
        //         }
        //     }
        // },

        joinok: function(){
            let self=this;
            function _joinok(data){

            }
            this.$socket.on('joinok', (data)=>{
                console.log('==========joinok')
                console.log(data);
        
                this.socketId = data;
                
                //this.updateSocket({orderCode: this.$route.params.orderCode, socketId: data})
            })
        },
        joinerr: function(){
            this.$socket.on('joinerr', ()=>{
                console.log('err')
                this.$socket.close();
                this.$router.push('/user/login');
                this.$message.error(this.$t('common.mustLogin'));
            })
        },
        close: function() {
            this.$socket.on('close', ()=>{
                console.log('close');
            })
        }
    },
    sockets:{
        connect: function(){
            console.log('socket connected');
        },
        customEmit: function(val){
            console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
        }
    },
    created () {
        console.log(process.env.NODE_ENV);
        var orderCode = this.$route.params.id;
        if(true){
            //orderCode = this.$route.params.id;
            if(this.$socket){
                console.log("has");
                this.$socket.removeListener('joinok');
                this.$socket.removeListener('joinerr');
                this.$socket.removeListener('msg');
                this.$socket.close();
                if(process.env.NODE_ENV == 'development'){
                    this.$socket.io.uri = `${this.serverIP}?token=${this.getCookie('token')}&orderCode=${orderCode}`
                }else{
                    this.$socket.io.uri = `${window.location.protocol}//${window.location.host}?token=${this.getCookie('token')}&orderCode=${orderCode}`
                }
                this.$socket.connect();
                this.joinok();
                this.joinerr();
            }else{
                console.log("new");
                if(process.env.NODE_ENV == 'development'){
                    Vue.use(VueSocketio, socketio(`${this.serverIP}?token=${this.getCookie('token')}&orderCode=${orderCode}`));
                }else{
                    Vue.use(VueSocketio, socketio(`${window.location.protocol}//${window.location.host}?token=${this.getCookie('token')}&orderCode=${orderCode}`));
                }
                 this.$socket.connect();
                 this.joinok();
                 this.joinerr();
            }
        
        }
        // else{
        //     const route = this.$route
        //     let id = route.params.id
        //     let type = route.query.type
        //     type = type === 'orderId' ? 'orderId' : 'orderCode'
        //     getTradeDetails(id, type)
        //     .then(data => {
        //         orderCode = data.data.orderCode;
        //         if(this.$socket){
        //             console.log("has")
        //             this.$socket.close();
        //             if(process.env.NODE_ENV == 'development'){
        //                 this.$socket.io.uri = `${this.serverIP}?token=${this.getCookie('token')}&orderCode=${orderCode}`
        //             }else{
        //                 this.$socket.io.uri = `${window.location.protocol}//${window.location.host}?token=${this.getCookie('token')}&orderCode=${orderCode}`
        //             }
        //             this.$socket.connect();
        //             this.joinok();
        //             this.joinerr();
        //         }else{
        //             console.log("new");
        //             if(process.env.NODE_ENV == 'development'){
        //                 Vue.use(VueSocketio, socketio(`${this.serverIP}?token=${this.getCookie('token')}&orderCode=${orderCode}`));
        //             }else{
        //                 Vue.use(VueSocketio, socketio(`${window.location.protocol}//${window.location.host}?token=${this.getCookie('token')}&orderCode=${orderCode}`));
        //             }
        //             this.$socket.connect();
        //             this.joinok();
        //             this.joinerr();
        //         }
        //     }).catch(data => {
        //         this.$message.error(this.$t(`err.${data.code}`))
        //     })
        // }

    },
    destroyed () {
        console.log('destory')
        this.$socket.removeListener('joinok');
        this.$socket.removeListener('joinerr');
        this.$socket.removeListener('msg');
        //this.clearSocket({orderCode: this.$route.params.orderCode, socketId: this.socketId})
        this.$socket.close();
        //this.$socket.io.uri = '';
        console.log(this.$socket)
    },
    watch: {
    '$route.params.id': function(val){
        console.log('switch')
        let orderCode = val;
        this.$socket.close();
        console.info(this.$socket);
        //this.$socket.io.uri = `${this.serverIP}?token=${this.getCookie('token')}&orderCode=${orderCode}`
        if(process.env.NODE_ENV == 'development'){
            this.$socket.io.uri = `${this.serverIP}?token=${this.getCookie('token')}&orderCode=${orderCode}`
        }else{
            this.$socket.io.uri = `${window.location.protocol}//${window.location.host}?token=${this.getCookie('token')}&orderCode=${orderCode}`
        }
        this.$socket.connect();
        
      },
      socketId(value) {
          console.log('chat sock', value)
        this.$emit('curSocketId', value)
      }
  }
}
</script>

<template>
<div class="app">
    <div class="main">
      <div class="header">{{$t('outside.chat.title')}}</div>
      <message :socketId="socketId" @system="system"></message>
      <inputText @upload="upload" :remark="remark"></inputText>
    </div>
</div>
</template>

<style lang="scss" scoped>
.app {
    margin: 20px auto;
    width: 100%;
    height: 600px;

    overflow: hidden;
    border-radius: 3px;

    .sidebar, .main {
        height: 100%;
    }
    .main{
      width: 100%;
        .header{
            height: 40px;
            background: #ccc;
            line-height: 40px;
            color: #fff;
            text-align: center;
            letter-spacing: 10px;
        }
    }
    .sidebar {
        float: left;
        width: 200px;
        color: #f4f4f4;
        background-color: #2e3238;
    }
    .main {
        position: relative;
        overflow: hidden;
        background-color: #eee;
    }
    .text {
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
    }
    .message {
    }
}
</style>
