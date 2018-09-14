<template>
  <div>
    <ul class="header">
      <li class="h-item">{{$t('common.user')}}</li>
      <li class="h-item">{{$t('common.trade')}}</li>
      <li class="h-item">{{$t('common.count')}}</li>
      <li class="h-item">{{$t('common.time')}}</li>
    </ul>
    <div class="marquee" id="marquee">
      <ul id="con1">
        <slot></slot>
      </ul>
    </div>
  </div>

</template>

<script>
export default {
    props: {
        speed: {
            type: Number,
            default: 50,
        },
    },
    data() {
        return {
            timmer: null
        };
    },
    mounted() {
        this.$nextTick(() => {
            const box = document.querySelector("#marquee");
            const con1 = document.querySelector("#con1");
            this.timmer = setInterval(() => {
                this.scrollUp(box, con1);
            }, this.speed);
        });
    },
    destroyed() {
        clearInterval(this.timmer);
    },
    methods: {
        scrollUp(box, con1) {
            if (box.scrollTop >= con1.scrollHeight) {
                box.scrollTop = 0;
            } else box.scrollTop++;
        }
    }
};
</script>

<style lang="scss" scoped>
.header {
    // display: flex;
    background-color: #dbdbdb;
    padding: 5px 0;
    font-weight: 600;
    color: #000;
    width: 100%;
    height: 32px;
    .h-item {
        float: left;
        width: 24%;
        text-align: center;
        &:nth-of-type(2) {
            width: 10%;
        }
        &:nth-of-type(3) {
            width: 38%;
        }
    }
}
.marquee {
    height: calc(100% - 32px);
    width: 100%;
    margin: 0;
    overflow: hidden;
    color: #d14a4a;
    .header {
        background-color: #dbdbdb;
        padding: 5px 0;
        font-weight: 600;
        color: #000;
        li {
            list-style: none;
            display: inline-block !important;
            width: 24%;
            text-align: center;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }
    #con1 ul {
        width: 100%;
        padding: 0;
        margin: 0;
        list-style: none;
        overflow: hidden;
    }

    #con1 ul li {
        padding: 10px 0;
    }
}
</style>
