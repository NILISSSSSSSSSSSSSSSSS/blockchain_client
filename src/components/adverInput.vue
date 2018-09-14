<template>
    <div style="text-align: left">
        <div class="title">{{title}}</div>
        <slot name="content" ></slot>
    </div>
</template>

<script>
    export default {
        props: ['title']
    }
</script>

<style lang="scss" scoped>
    .title{
        color: #9B9B9B;
        font-weight: 400;
        font-size: 12px;
        max-width: 100%;
        margin-bottom: 5px;
    }
</style>