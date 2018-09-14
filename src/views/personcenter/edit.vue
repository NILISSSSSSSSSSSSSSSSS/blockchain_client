<template>
  <el-card class="editinfo">
    <pc-header :title="$t('personcenter.modifyData')" slot="header"></pc-header>
    <p class="edit_title">{{$t('personcenter.newAvatar')}}</p>
    <el-upload accept="image/png,image/jpeg,image/jpg" class="avatar-uploader"  :auto-upload="false" action=" " :show-file-list="false" :on-change="selectImg" :before-upload="beforeAvatarUpload">
      <img v-if="avatar" :src="avatar" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      <div slot="tip" class="el-upload__tip">{{$t('common.imgTypeError')}}</div>
    </el-upload>
    <div class="form">
      <p class="edit_title">{{$t('personcenter.name')}}</p>
      <el-input v-model="nickName"></el-input>
      <!--<p class="edit_title">{{$t('personcenter.area')}}</p>
      <el-select v-model="form.nation" :placeholder="$t('common.pSelect')">
        <el-option value="China" label="China（+86）"></el-option>
      </el-select>
      <p class="edit_title">{{$t('personcenter.phone')}}</p>
      <el-input v-model="form.phone"></el-input>-->
      <el-button type="success" @click.native="submit()">{{$t('personcenter.confirm')}}</el-button>
    </div>

  </el-card>
</template>

<script>
import pcHeader from "./components/pcHeader.vue";
import { Base64 } from "js-base64";
import { edit } from "@/api/user";
export default {
  components: {
    pcHeader
  },
  data() {
    return {
      avatar: "",
      nickName: "",
      file: "",
      isLt2M: false
    };
  },
  computed: {},
  methods: {
    submit: function() {
      //上传头像
      console.log(this.file);
      if(this.nickName == ''){
        this.$message.error(this.$t("personcenter.nicknameErr"));
        return;
      }
      
      if (this.file) {
        this.beforeAvatarUpload(this.file);
        if (this.isLt2M) {
          //图片大小小于2M时更改头像
          var formData = new FormData();
          formData.append("img", this.file.raw);
          formData.append("nickName", this.nickName);
          var config = {
            "Content-Type": "multipart/form-data"
          };
        }
        else{
          return;
        }
      } 
      else {
        var formData = new FormData();
        formData.append("img", null);
        formData.append("nickName", this.nickName);
        var config = {
          "Content-Type": "multipart/form-data"
        };
      }
      console.log(formData)
      edit(formData, config)
        .then(data => {
          this.$root.eventHub.$emit("updateUserInfo");
          this.$router.push("/personcenter");
        })
        .catch(err => {
          console.log(err.response);
          if (err.code) {
            this.$message.error(this.$t("err." + err.code));
          } else {
            this.$message.error(this.$t("err.undefined"));
          }
        });
    },
    selectImg(file) {
      this.file = file;
      if(!(this.file.name.includes(".png") || this.file.name.includes(".jpg"))){
         this.$message.error(this.$t("common.imgTypeError"));
         return;
      }
      var reader = new FileReader();
      reader.readAsDataURL(file.raw);
      var that = this;
      reader.onload = function(e) {
        that.avatar = e.target.result;
      };
    },
    beforeAvatarUpload(file) {
      console.log(file.size);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error(this.$t("personcenter.avatarTooLarge"));
        this.isLt2M = false;
      } else {
        this.isLt2M = true;
      }
      // return isJPG && isLt2M;
    }
  },
  created() {
    this.nickName = JSON.parse(localStorage.userInfo).nickName;
    if (JSON.parse(localStorage.userInfo).avatar) {
      this.avatar = JSON.parse(localStorage.userInfo).avatar;
    }
  }
};
</script>

<style lang="scss" scoped>
.editinfo {
  width: 100%;
  .editTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    h3 {
      margin: 0px;
      color: #2a2a41;
      font-size: 1.4em;
    }
    a {
      color: rgba(42, 42, 65, 0.7);
      letter-spacing: 0.05em;
    }
  }
  .edit_title {
    font-weight: bold;
    margin: 0 0 5px;
  }
  .op {
    margin: 0 0 10px;
  }
  .avatar-uploader {
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      &:hover {
        border-color: #409eff;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
  .form {
    max-width: 360px;
    .el-select {
      width: 100%;
    }
    .edit_title {
      margin: 20px 0 5px 0 !important;
    }
    .el-button {
      margin-top: 20px;
      width: 100%;
    }
  }
}
</style>
