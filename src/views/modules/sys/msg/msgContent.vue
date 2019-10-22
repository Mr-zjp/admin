<template>
    <div class="contentBox">
        <p>{{rowCon.title}}</p>
        <p>{{rowCon.createTime}}</p>
        <div v-html="rowCon.content"></div>
    </div>
</template>

<script>
    export default {
        name: "",
        props:['rowCon']
    }
</script>

<style scoped>
    .contentBox>p{
        text-align: center;
    }
    .contentBox>p:nth-child(1){
        font-size: 28px;
    }
    .contentBox>p:nth-child(2){
        color: #6f7180;
    }
</style>