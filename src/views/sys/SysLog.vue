<template>
  <div>
    <div class="top-log-style">
      <!-- <div style="display: flex;justify-content: flex-start;"> -->
      <el-select v-model="logtype"
                 clearable
                 placeholder="日志类型"
                 icon="el-icon-plus"
                 style="margin-right: 10px">
        <el-option v-for="item in logtypes"
                   :key="item.id"
                   :label="item.logtypemsg"
                   :value="item.id"></el-option>
      </el-select>
      <el-date-picker v-model="beginDateScope"
                      type="monthrange"
                      align="left"
                      unlink-panels
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始月份"
                      end-placeholder="结束月份"
                      :picker-options="pickerOptions">
      </el-date-picker>
      <el-button icon="el-icon-search"
                 type="primary"
                 style="margin-left:10px"
                 @click="initlog">
        搜索
      </el-button>
    </div>
    <div class="centon-log-style">
      <el-scrollbar style="height: 100%;">
        <div>
          <el-table :data="logs"
                    border
                    v-loading.fullscreen.lock="loading"
                    element-loading-spinner="fa fa-spinner fa-pulse fa-3x fa-fw"
                    stripe
                    max-height="680"
                    style="width:100%;font-size: 14px;"
                    @selection-change="handleSelectionChange">
            <!-- 无数据展示 -->
            <template slot="empty">
              <div class="empty">
                <div>
                  <img src="@/assets/images/No-Date.png" width="240px" height="240px" alt>
                </div>
                <div>
                  <span>暂无数据</span>
                </div>
              </div>
            </template>
            <el-table-column prop="id"
                             label="ID"
                             sortable
                             align="center"
                             width="70">
            </el-table-column>
            <el-table-column prop="logTypss.logtypemsg"
                             label="日志类型"
                             align="center"
                             width="140">
            </el-table-column>
            <el-table-column prop="operate"
                             label="日志描述">
            </el-table-column>
            <el-table-column prop="hrname"
                             label="操作人"
                             align="center"
                             width="100">
            </el-table-column>
            <el-table-column prop="adddate"
                             width="200"
                             align="center"
                             label="日志时间">
            </el-table-column>
          </el-table>
        </div>
      </el-scrollbar>
    </div>
    <div class="bottom-log-style">
      <div>
        <el-button @click="refershMany" type="success" class="el-icon-refresh" style="margin-top: 15px"> 刷新</el-button>
      </div>
      <el-pagination style="margin-top: 15px;margin-right:320px"
                     background
                     @current-change="currentChange"
                     @size-change="sizeChange"
                     layout="sizes, prev, pager, next, jumper, ->, total, slot"
                     :total="total"
                     :page-sizes="[20,30,50,100,1000]">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "SysLog",
  data () {
    return {
      loading: false,
      total: 0,
      page: 1,
      size: 20,
      logtypes: {},
      logtype: '',
      logs: [],
      beginDateScope: null,
      multipleSelection: [],
      pickerOptions: {
        shortcuts: [{
          text: '本月',
          onClick (picker) {
            picker.$emit('pick', [new Date(), new Date()]);
          }
        }, {
          text: '今年至今',
          onClick (picker) {
            const end = new Date();
            const start = new Date(new Date().getFullYear(), 0);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近六个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 6);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    }
  },
  mounted () {
    this.initlog();
    this.inittypelog();
  },
  methods: {
    refershMany() {
      this.initlog()
    },
    /*分页事件处理*/
    sizeChange (currentSize) {
      this.size = currentSize;
      this.initlog();
    },
    currentChange (currentPage) {
      this.page = currentPage;
      this.initlog();
    },
    initlog () {
      this.loading = true;
      if (this.logtype) {
        this.$notify.success({
          title: '搜索信息',
          message: '搜索日志中...',
          showClose: false,
          offset: 100,
          duration: 2000,
          customClass: 'fontclasssyslog'
        });
      }
      let url = "/system/log/?page=" + this.page + "&size=" + this.size;
      if (this.logtype) {
        url += "&logtype=" + this.logtype;
        this.logtype = '';
      }
      if (this.beginDateScope) {
        url += "&beginDateScope=" + this.beginDateScope;
        this.beginDateScope = null;
      }
      this.getRequest(url).then(resp => {
        if (resp) {
          this.logs = resp.data;
          this.total = resp.total;
          this.loading = false;
        }
      })
    },
    inittypelog () {
      this.getRequest("/system/log/logtype").then(resp => {
        if (resp) {
          this.logtypes = resp;
        }
      })
    }
  }
}
</script>

<style >
.fontclasssyslog {
  font-family: 站酷庆科黄油体;
}
.top-log-style {
  margin: 10px 0px;
  display: flex;
  justify-content: flex-start;
}
.centon-log-style {
  margin-top: 10px;
}
.bottom-log-style {
  display: flex;
  justify-content: space-between;
}
</style>