<template>
  <div class="container">
    <leftside :info="info"></leftside>
    <router-view></router-view>
  </div>
</template>

<script>
import leftside from "./leftside.vue";
import { mapMutations, mapGetters } from "vuex";
import { getDetail } from "@/api/user";
export default {
  components: {
    leftside
  },
  data() {
    return {
      info: {
        name: "",
        email: "",
        lastLoginTime: "",
        negativeComment: "",
        positiveComment: ""
      }
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    ...mapMutations(["setQRcode"]),
    getInfo() {
      getDetail()
        .then(data => {
          localStorage.userInfo = JSON.stringify(data.data);
          this.$root.updateAvatar.$emit("avatar", data.data.avatar);
          this.info = data.data;
          this.setQRcode(data.data.inviteCode);
        })
        .catch(err => {
          if (err.code) {
            this.$message.error(this.$t("err." + err.code));
          } else {
            this.$message.error(this.$t("err.undefined"));
          }
        });
    }
  },
  created() {
    this.getInfo();
    var that = this;
    this.$root.eventHub.$on("updateUserInfo", () => {
      that.getInfo();
    });
  },
  destroyed() {
    this.$root.eventHub.$off("updateUserInfo");
  }
  // watch: {
  //   'userInfo': {
  //     handler (val) {
  //       console.log('zzz')
  //       this.getInfo();
  //     },
  //     deep: true
  //   }
  // }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  max-width: 1200px;
  margin: auto;
  padding: 30px 16px;
}
</style>
