<script>
import { mapMutations, mapGetters } from 'vuex'
import { getTradeDetails } from 'api/outside-trade'
export default {
    props: ['socketId'],
    methods: {
        ...mapMutations(['updateSession']),

        getMsg: function(){

            this.$socket.on('msg', (data)=>{
                if(document.visibilityState && document.visibilityState == 'hidden'){
                    document.title = this.$t('common.newMsg');
                }
                if(data.from != this.socketId){
                    var title = '';
                    var options = {};
                    if(data.msgType == 'system'){
                        title = this.$t('outside.chat.systemMsg');
                        options = {body: this.$t('outside.chat.'+data.context)};
                    }else if(data.msgType == 'img'){
                        title = data.nickName;
                        options = {icon: data.avatar?data.avatar:this.defaultAvatar, body: this.$t('outside.chat.typeImg')};
                    }else{
                        title = data.nickName;
                        options = {icon: data.avatar?data.avatar:this.defaultAvatar, body: data.context};
                    }
                    this.Notification(title, options)
                }
                // if(data.context == 'pay_ok'){
                //     data.context = '买家付款已完成'
                //     this.sessions.push(data);
                // }else if(data.context == 'cancel_order'){
                //     data.context = '订单取消'
                //     this.sessions.push(data);
                // }else if(data.context == 'coin_ok'){
                //     data.context = '卖家已发币'
                //     this.sessions.push(data);
                // }else if(data.context == 'delay'){
                //     data.context = '订单已延长15分钟'
                //     this.sessions.push(data);
                // }else{
                //     this.sessions.push(data);
                // }
                this.sessions.push(data);
                if(data.msgType == 'system'){
                    this.$emit('system', data);
                }
            })
        },
        getRecord: function(){
            let route = this.$route;
            this.orderCode = route.params.id
            this.type = route.query.type
            getTradeDetails(this.orderCode, this.type)
            .then(data => {
                this.chatRecord = data.data.chat;

                this.userId = data.data.userId;
            }).catch(data => {
                this.$message.error(this.$t(`err.${data.code}`))
            })
        }
    },
    data () {
        return {
            defaultAvatar: '',
            sessions: [],
            chatRecord: [],
            userId: null,
        }
    },
    filters: {
        // 将日期过滤为 hour:minutes
        time (date) {
            if (typeof date === 'string') {
                date = new Date(date);
            }
            return date.getHours() + ':' + date.getMinutes();
        },
        text: (context) => {
            if(context == 'pay_ok'){
                return window.$vm.$t('outside.chat.pay_ok');
            }else if(context == 'cancel_order'){
                return window.$vm.$t('outside.chat.cancel_order');
            }else if(context == 'coin_ok'){
                return window.$vm.$t('outside.chat.coin_ok');
            }else if(context == 'delay'){
                return window.$vm.$t('outside.chat.delay');
            }else if(context == 'appeal'){
                return window.$vm.$t('outside.chat.appeal');
            }else if(context == 'appeal_cancel'){
                return window.$vm.$t('outside.chat.appeal_cancel');
            }else{
                return context
            }

        }
    },
    directives: {
        // 发送消息后滚动到底部
        'scroll-bottom' : {
            componentUpdated: function(el){
                el.scrollTop = (el.scrollHeight - el.clientHeight) ;
            }
        }
    },
    created () {
        var _this = this;
        this.getRecord();
        this.getMsg();
        this.defaultAvatar = require('../../../../assets/imgs/user_default_pic.png');
        //切换前后台 修改document title
        var hiddenProperty = 'hidden' in document ? 'hidden' :
            'webkitHidden' in document ? 'webkitHidden' :
            'mozHidden' in document ? 'mozHidden' :
            null;
        var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
        var onVisibilityChange = function(){
            if (!document[hiddenProperty]) {
                document.title = _this.$store.state.common.siteName
            }
        }
        document.addEventListener(visibilityChangeEvent, onVisibilityChange);
    },
    watch: {
        '$route.params.id': {
            handler: function(){
                this.sessions = [];
                this.chatRecord = [];
                this.getRecord();
            }
        }
    }
};
</script>

<template>
<div class="message" v-scroll-bottom="sessions" >
    <ul v-if="chatRecord" v-for="(item,index) in chatRecord" :key="index">
        <li  v-if="item.msgType == 'text'">
            <p class="time">
                <span>{{ item.time | datetimeFormat}}</span>
            </p>
            <div class="main" :class="{ self: item.userId == userId }">
                <img class="avatar" width="30" height="30" :src="item.avatar?item.avatar:defaultAvatar" />
                <div class="text">{{ item.context }}</div>
            </div>
        </li>
        <li  v-if="item.msgType == 'img'">
            <p class="time">
                <span>{{ item.time | datetimeFormat}}</span>
            </p>
            <div class="main" :class="{ self: item.userId == userId }">
                <img class="avatar" width="30" height="30" :src="item.avatar?item.avatar:defaultAvatar" />
                <div class="text"><img style="max-width:100%" :src="item.context" alt=""> </div>
            </div>

        </li>
        <li  v-if="item.msgType == 'system'">
            <p class="time">
                <span>{{ item.time | datetimeFormat}}</span>
            </p>
            <div class="system">
                {{ item.context | text }}
            </div>
        </li>
    </ul>

    <ul v-if="sessions" v-for="(item,idx) in sessions" :key="idx">
        <li  v-if="item.msgType == 'text'">
            <p class="time">
                <span>{{ item.time | datetimeFormat}}</span>
            </p>
            <div class="main" :class="{ self: item.from == socketId }">
                <img class="avatar" width="30" height="30" :src="item.avatar?item.avatar:defaultAvatar" />
                <div class="text">{{ item.context }}</div>
            </div>

        </li>
        <li  v-if="item.msgType == 'img'">
            <p class="time">
                <span>{{ item.time | datetimeFormat}}</span>
            </p>
            <div class="main" :class="{ self: item.from == socketId }">
                <img class="avatar" width="30" height="30" :src="item.avatar?item.avatar:defaultAvatar" />
                <div class="text"><img style="max-width:100%" :src="item.context" alt=""> </div>
            </div>

        </li>
        <li  v-if="item.msgType == 'system'">
            <p class="time">
                <span>{{ item.time | datetimeFormat}}</span>
            </p>
            <div class="system">
                {{ item.context | text}}
            </div>
        </li>
    </ul>
</div>
</template>

<style lang="scss" scoped>
.message {
    padding: 0px 15px;
    overflow-y: scroll;
    height: calc(100% - 190px);
    .system{
        max-width: 60%;
        text-align: center;
        margin: 0 auto;
        padding: 3px 10px;
        font-size: 13px;
        color: #e6a23c;
        border-radius: 4px;
        background-color: #fdf6ec;
    }
    li {
        margin-bottom: 15px;
    }
    .time {
        margin: 7px 0;
        text-align: center;

        > span {
            display: inline-block;
            padding: 0 18px;
            font-size: 12px;
            color: #fff;
            border-radius: 2px;
            background-color: #dcdcdc;
        }
    }
    .avatar {
        float: left;
        margin: 0 10px 0 0;
        border-radius: 3px;
    }
    .text {
        display: inline-block;
        position: relative;
        padding: 0 10px;
        min-height: 30px;
        line-height: 2.5;
        font-size: 12px;
        text-align: left;
        word-break: break-all;
        background-color: #fafafa;
        border-radius: 4px;
        max-width: 50%;
        &:before {
            content: " ";
            position: absolute;
            top: 9px;
            right: 100%;
            border: 6px solid transparent;
            border-right-color: #fafafa;
        }
    }

    .self {
        text-align: right;

        .avatar {
            float: right;
            margin: 0 0 0 10px;
        }
        .text {
            background-color: #b2e281;

            &:before {
                right: inherit;
                left: 100%;
                border-right-color: transparent;
                border-left-color: #b2e281;
            }
        }
    }
}
</style>
