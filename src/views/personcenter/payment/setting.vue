<template>
  <el-card class="payment_s">
    <pc-header :title="$t('personcenter.edit')" slot="header"></pc-header>
    <div class="payment_c">
      <p class="edit_title">{{$t('personcenter.info')}}</p>
      <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="account.accountInfo">
      </el-input>
      <p class="edit_title">{{$t('personcenter.uploading')}}</p>
      <el-upload accept="image/*" class="upload-demo" action=" " :auto-upload="false" :show-file-list="false" :on-change="selectImg">
        <img v-if="account.uploadfile" :src="account.uploadfile" class="avatar">
        <el-button size="small" type="primary">{{$t('personcenter.click')}}</el-button>

      </el-upload>
      <el-checkbox v-model="account.isOrderShow">{{$t('personcenter.show')}}</el-checkbox>
      <el-button class="sub_btn" type="success" @click.native="submit()">{{$t('common.table.submit')}}</el-button>
    </div>
  </el-card>
</template>

<script>
import pcHeader from "../components/pcHeader.vue";
export default {
  components: {
    pcHeader
  },
  data() {
    return {
      debounce: false,
      fileTmp: "",
      account: {
        payType: "",
        accountInfo:
          "姓名：陈xx\n开户行：xx银行\n开户支行：xx支行\n银行卡号：1234-5678-8765-4321",
        isOrderShow:true,
        uploadfile: ""
      }
    };
  },
  methods: {
    selectImg(file) {
      this.fileTmp = file;
      //let formData = new FormData();
      // formData.append("img", file.raw);
      // this.$set(this.account, 'img', formData);
      var reader = new FileReader();
      reader.readAsDataURL(file.raw);
      var that = this;
      reader.onload = function(e) {
        that.$set(that.account, "uploadfile", e.target.result);
      };
    },
    getPayDetail() {
      this.$http
        .get("/users/qrcode?payType=" + this.$route.query.payType)
        .then(res => {
          if (res.data.code == 0) {
            this.account = res.data.data;
            if (res.data.data.accountInfo) {
              this.account.accountInfo = res.data.data.accountInfo;
            } else {
              this.account.accountInfo =
                "姓名：陈xx\n开户行：xx银行\n开户支行：xx支行\n银行卡号：1234-5678-8765-4321";
              // this.account.isOrderShow = true
            }
          } else {
            this.$message.error(this.$t(`err.${res.data.code}`));
          }
        })
        .catch(err => {
          this.$message.error(this.$t("common.serverErr"));
        });
    },
    submit: function() {
      if (this.debounce == true) {
        return;
      }
      if(this.account.accountInfo===""){
        this.$message.error(this.$t("common.inputEmpty"));
        return;
      }
      console.log(this.$route)
      this.debounce = true;
      this.account.payType = this.$route.query.payType;
 
      var formData = new FormData();
      if (this.fileTmp) {
        formData.append("uploadfile", this.fileTmp.raw);
      }
      if (this.account.accountInfo) {
        formData.append("accountInfo", this.account.accountInfo);
      }
      console.log(this.account.isOrderShow)
      formData.append("isOrderShow", this.account.isOrderShow);
      formData.append("payType", this.account.payType);
      let config = {
        "Content-Type": "multipart/form-data"
      };
      this.$http
        .post("/users/qrcode", formData, config)
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success(this.$t("personcenter.pre"));
            this.$router.push("/personcenter/payment");
          } else {
            this.$message.error(this.$t(`err.${res.data.code}`));
            this.debounce = false;
          }
        })
        .catch(err => {
          this.$message.error(this.$t("common.serverErr"));
          this.debounce = false;
        });
    }
  },
  created() {
    this.getPayDetail();
  }
};
</script>

<style lang="scss" scoped>
.payment_s {
  width: 100%;
  .payment_c {
    width: 80%;
    .edit_title {
      margin: 20px 0 5px 0;
      font-weight: bold;
    }
    .avatar {
      width: 200px;
      display: block;
      margin-bottom: 10px;
    }
    .el-checkbox {
      display: block;
      margin-top: 20px;
    }
    .sub_btn {
      width: 100%;
      margin-top: 20px;
    }
  }
}
</style>

