<script>
import { mapMutations, mapGetters } from "vuex";
export default {
  props: ["remark"],
  computed: {
    ...mapGetters(["sessions"])
  },
  watch: {
    remark(val) {
      let content = {
        msgType: "text",
        context: val
      };
      this.$socket.emit("msg", content);
    }
  },
  methods: {
    ...mapMutations(["updateSession"]),
    sendMsg: function() {
      if (this.content.trim() == "") {
        this.noContent = true;
        setTimeout(() => {
          this.noContent = false;
        }, 1000);
        return;
      }
      var content = {
        msgType: "text",
        context: this.content
      };
      this.updateSession(content);
      this.$socket.emit("msg", content);

      this.content = "";
    },
    beforeUpload(file) {
      const isPIC = file.type === "image/png" || "image/jpeg" || "image/jpg";
      const isLt1M = file.size / 1024 / 1024 < 1;
      console.log(file.type);
      if (!isPIC) {
        this.$message.error(this.$t("outside.imgUp"));
      }
      if (!isLt1M) {
        this.$message.error(this.$t("outside.imgSize"));
      }
      return isPIC && isLt1M;
    },
    success: function(res) {
      console.log(res)
      var content = {
        msgType: "img",
        context: res.data
      };
      this.$socket.emit("msg", content);
    },
    error: function(err) {
      this.$message.error(err.msg[0]);
    }
  },
  data() {
    return {
      content: "",
      noContent: false,
      actionUrl: ""
    };
  },
  created() {
    if (process.env.NODE_ENV == "development") {
      this.actionUrl = this.serverIP;
    }
  }
};
</script>

<template>
    <div class="text">
        <el-upload class="upload-demo" name="img" :action="actionUrl + '/websocket/uploadimg'" :on-success="success" :on-error="error" accept="image/*" :before-upload="beforeUpload" :show-file-list="false">
            <el-button size="small" type="text">{{$t('outside.chat.sendPicture')}}</el-button>
        </el-upload>
        <div class="flex">
            <textarea v-model="content" @keyup.enter="sendMsg" :placeholder="$t('outside.chat.sendState')"></textarea>
            <el-tooltip :value="noContent" :content="$t('outside.chat.empty')" placement="top-end" effect="light" manual>
                <el-button @click.native="sendMsg">{{$t('outside.chat.send')}}</el-button>
            </el-tooltip>
        </div>

    </div>
</template>

<style lang="scss" scoped>
.text {
  height: 150px;
  border: 1px solid #ddd;
  padding: 10px;
  .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-button {
      height: 40px;
    }
  }
  textarea {
    padding: 10px;
    width: 85%;
    height: 80px;
    border: none;
    outline: none;
    font-family: "Micrsofot Yahei";
    resize: none;
  }
}
</style>
