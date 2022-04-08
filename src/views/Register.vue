<template style="width: 100%;height: 100%;" >
  <div v-loading.fullscreen.lock="loading"
       class="login"
       element-loading-spinner="fa fa-spinner fa-pulse fa-3x fa-fw">
    <el-form :rules="rules"
             :model="loginFrom"
             class="logContainer"
             ref="loginFrom"
             @keydown.enter.native="loginSubmit">
      <h2 class="logtitle">注册</h2>
      <el-form-item prop="username">
        <el-input type="text"
                  v-model="loginFrom.username"
                  placeholder="请输入用户名"
                  auto-complete="off">
          <i slot="prefix"
             class="el-icon-user"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password"
                  v-model="loginFrom.password"
                  placeholder="请输入密码"
                  auto-complete="off">
          <i slot="prefix"
             class="el-icon-lock"></i>
        </el-input>
      </el-form-item>
      <el-button type="primary" style="width: 100%;height: 50px;" @click="loginSubmit">注册</el-button>
    </el-form>
  </div>
</template>

<script>
// import {postKeyValueRequest} from '../utils/api';
// 在main.js里以插件形似全局导入
export default {
  data () {
    return {
      codeUrl: '',
      cookiePass: '',
      loading: false,
      redirect: undefined,
      loginFrom: {
        username: 'admin',
        password: '123',
        code: '',
        rememberMe:''
      },
      checked: true,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 25, message: '长度在 5 到 25 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: blur() },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created () {
    // this.getCode()
  },
  methods: {
    getCode () {
      this.getRequest("/auth/code").then(resp => {
          if(resp){
          console.log(resp)
        this.codeUrl = resp.img;
        this.loginForm.uuid = resp.uuid;
        console.log(this.codeUrl );
        }
      });
    },
    loginSubmit () {
      //提交前空值校验
      this.$refs.loginFrom.validate((valid) => {
        if (valid) {
          // alert('submit!');
          this.loading = true;
          this.postKeyValueRequest('/doLogin', this.loginFrom
          ).then(data => {
            this.loading = false;
            if (data) {
              //方法将 JavaScript 的json对象转换为字符串。
              //将得到数存储在SessionStorage里
              window.sessionStorage.setItem("user", JSON.stringify(data.obj))
              //获取路由对象
              this.$router.replace('/home')
            }
          })
        } else {
          this.$notify.info({
            title: '系统信息',
            message: '输入框信息不完整!',
            showClose: false,
            offset: 100,
            duration: 5000,
            customClass: 'fontclass'
          });
        }
      });
    },
    register () {}
  }
}
</script>

<style >
.fontclass {
  font-size: 35px;
  font-family: 站酷庆科黄油体;
}

.login {
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
  background-image: url(../assets/images/login-bg.jpg); 
}
.logContainer {
  background: rgb(255, 255, 255);
  /* 圆角边框 */
  border-radius: 5px;
  /* height: 500px; */
  /* 背景裁剪在背景边框内部 */
  /* background-clip: padding-box; */
  /* 外边距 */
  margin: 350px auto;
  /*//宽度*/
  width: 320px;
  /* 内边距 */
  padding: 15px 35px 15px 35px;
  /* 背景色 */
  /* background: transparent;
  background-image: radial-gradient(#ffffff, transparent); */
   /* 边框样式 */
  border: 1px solid #eaeaea;
  /* 边框阴影 */
  /* box-shadow: 0 0 25px #cac6c6; */
}
.logtitle {
  width: 100%;
  line-height: 70px;
  text-align: center;
  font-size: 22px;
  color: rgb(0, 0, 0);
  border-bottom: 1px solid #ddd;
  /* font-family: 站酷庆科黄油体; */
}
.loginRen {
  text-align: center;
  margin: 0px 0px 35px 0px;
}
/* .fontclass { */
  /* font-size: 35px; */
  /* font-family: 站酷庆科黄油体; */
/* } */
.login-code {
  width: 33%;
  display: inline-block;
  height: 38px;
  margin-left: 12px;
  /* float: right; */
}
.login-code img {
  cursor: pointer;
  vertical-align: middle;
}
</style>