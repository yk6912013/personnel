<template>
  <div>
    <div style="float: left;width: 30%">
      <el-card style="width: 100%; margin: 10px" shadow="hover">
        <el-form ref="form" :model="form" label-width="80px">
          <!-- <el-form-item style="text-align: center" label-width="0"> -->
            <!-- <el-upload
                class="avatar-uploader"
                action="http://localhost:9527/files/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
            >
              <img v-if="form.avatar" :src="form.avatar" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload> -->
          <!-- <img v-if="form.avatar" :src="userface" class="avatar"> -->
          <!-- </el-form-item> -->
            <div class="block">
              <el-avatar :size="100" :src="form.userface"></el-avatar>
            </div>
          <el-form-item label="用户名">
            <el-input v-model="form.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="form.nickName"></el-input>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input v-model="form.age"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-input v-model="form.sex"></el-input>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="form.address"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: center">
          <el-button type="primary" @click="update">更新基本信息</el-button>
        </div>
      </el-card>
    </div>
    <div style="float: left;width: 60%; margin-left: 20px;" shadow="hover">
      <el-card style="width: 100%; margin: 10px">
        <el-form ref="form" :model="form" label-width="80px" style="padding: 137px 110px 137px 110px">
          <el-form-item label="旧密码">
            <el-input type="password" show-password v-model="oldpwd"></el-input>
          </el-form-item>
          <el-form-item label="新密码">
            <el-input type="password" show-password v-model="newpwd"></el-input>
          </el-form-item>
          <el-form-item label="重新输入">
            <el-input type="password" show-password v-model="rnewpwd"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: center">
          <el-button type="primary" @click="update">保存</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
// import request from "@/utils/request";
export default {
  name: "Person",
  data() {
    return {
      form: {
      },
      oldpwd: '123456',
      newpwd: '123123',
      rnewpwd: '123123',
    }
  },
  created() {
    let str = sessionStorage.getItem("user") || "{}"
    this.form = JSON.parse(str)
  },
  methods: {
    handleAvatarSuccess(res) {
      this.form.avatar = res.data
      this.$message.success("上传成功")
      this.update()
    },
    update() {
      request.put("/user", this.form).then(res => {
        console.log(res)
        if (res.code === '0') {
          this.$message({
            type: "success",
            message: "更新成功"
          })
          sessionStorage.setItem("user", JSON.stringify(this.form))
          // 触发Layout更新用户信息
          this.$emit("userInfo")
        } else {
          this.$message({
            type: "error",
            message: res.msg
          })
        }
      })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.block {
 margin-bottom: 20px;
 margin-left: 40%;
}
</style>
