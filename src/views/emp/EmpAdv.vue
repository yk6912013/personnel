
<template>
  <div>
    <div class="top-style" >
      <div style="display: flex;justify-content: flex-start;">
        <el-input placeholder="请输入员工名进行搜索..."
                  prefix-icon="el-icon-search"
                  clearable
                  @clear="initEmps"
                  style="width: 250px;margin-right: 10px"
                  v-model="keyword"
                  @keydown.enter.native="initEmps"
                  :disabled="showAdvanceSearchView">
        </el-input>
        <el-select v-model="searchValue.politicid"
                   style="width: 130px;margin-right: 10px"
                   placeholder="政治面貌"
                   clearable>
          <el-option v-for="item in politicsstatus"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="searchValue.nationid"
                   placeholder="民族"
                   clearable
                   style="width: 130px;margin-right: 10px">
          <el-option v-for="item in nations"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="searchValue.posid"
                   placeholder="职位"
                   clearable
                   style="width: 130px;margin-right: 10px">
          <el-option v-for="item in positions"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="searchValue.joblevelid"
                   placeholder="职称"
                   clearable
                   style="width: 130px;margin-right: 10px">
          <el-option v-for="item in joblevels"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-date-picker v-model="searchValue.beginDateScope"
                        type="daterange"
                        unlink-panels
                        clearable
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="入职开始日期"
                        end-placeholder="入职结束日期">
        </el-date-picker>
        <el-button icon="el-icon-search" type="primary" style="margin-left:10px" @click="initEmps('advanced')">搜索</el-button>
      </div>
      <div style="display: flex;justify-content: flex-end">
      </div>
    </div>
    <div class="content-style">
      <el-scrollbar style="height: 100%">
        <div>
          <el-table :data="emps"
                    stripe
                    border
                    :cell-style="changeCellStyle"
                    max-height="685"
                    v-loading.fullscreen.lock="loading"
                    element-loading-spinner="fa fa-spinner fa-pulse fa-3x fa-fw"
                    style="width: 100%; height: 800px;font-size: 14px"
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
            <el-table-column type="selection"
                             width="55">
            </el-table-column>
            <el-table-column fixed
                             prop="name"
                             align="center"
                             label="姓名"
                             width="100">
            </el-table-column>
            <el-table-column prop="workid"
                             fixed
                             label="工号"
                             align="center"
                             width="90">
            </el-table-column>
            <el-table-column label="培训信息" align="center">
              <el-table-column prop="employeetrainList.traincontent"
                               align="left"
                               show-overflow-tooltip
                               label="培训内容">
              </el-table-column>
              <el-table-column prop="employeetrainList.trainstartdate"
                               align="center"
                               width="110"
                               label="培训开始时间">
              </el-table-column>
              <el-table-column prop="employeetrainList.trainfinishdate"
                               align="center"
                               width="110"
                               label="培训结束时间">
              </el-table-column>
            </el-table-column>
            <el-table-column label="考评信息" align="center">
              <el-table-column prop="appraise.appcontent"
                               align="left"
                               show-overflow-tooltip
                               label="考评内容">
              </el-table-column>
              <el-table-column prop="appraise.appdate"
                               align="center"
                               width="110"
                               label="考评时间">
              </el-table-column>
            </el-table-column>
            <el-table-column label="工资信息" align="center">
              <el-table-column width="200"
                               prop="salary.name"
                               align="center"
                               label="账套名称"></el-table-column>
              <el-table-column width="100"
                               align="center"
                               prop="salary.basicsalary"
                               label="基本工资"></el-table-column>
            </el-table-column>
          </el-table>
        </div>
      </el-scrollbar>
    </div>
    <div class="bottom-style">
      <div>
        <el-button @click="refershMany" type="success" class="el-icon-refresh" style="margin-top: 10px"> 刷新</el-button>
      </div>
      <el-pagination style="margin-top: 10px"
                     background
                     @current-change="currentChange"
                     @size-change="sizeChange"
                     layout="sizes, prev, pager, next, jumper, ->, total, slot"
                     :total="total"
                     :page-sizes="[20,30,50,100]">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "EmpAdv",
  inject: ['reload'],
  data () {
    return {
      multipleSelection: [],
      searchValue: {
        politicid: null,
        nationid: null,
        joblevelid: null,
        posid: null,
        engageform: null,
        departmentid: null,
        beginDateScope: null
      },
      title: '',
      importDataBtnText: '导入数据',
      importDataBtnIcon: 'el-icon-upload2',
      importDataDisabled: false,
      showAdvanceSearchView: false,
      allDeps: [],
      emps: [],
      loading: false,
      popVisible: false,
      popVisible1: false,
      dialogVisible: false,
      total: 0,
      page: 1,
      keyword: '',
      size: 20,
      nations: [],
      joblevels: [],
      politicsstatus: [],
      positions: [],
      tiptopDegrees: ['本科', '大专', '硕士', '博士', '高中', '初中', '小学', '其他'],
      options: [{
        value: '',
        label: ''
      }],
      inputDepName: '所属部门',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
    }
  },
  mounted () {
    this.initEmps();
    this.initData();
    this.initPositions();
  },
  methods: {
    // 列表颜色
    // changeCellStyle (row, column, rowIndex, columnIndex) {
    // //列的label的名称
    //   if (row.column.label == "培训内容" || row.column.label == "培训开始时间" || row.column.label == "培训结束时间") {
    //     return 'color: red' //修改的样式
    //   } else if (row.column.label === "考评内容" || row.column.label == "考评时间"){
    //     return 'color: blue'
    //   } else if (row.column.label === "账套名称" || row.column.label == "基本工资"){
    //     return 'color: #7904FF'
    //   }
    // },
    // 刷新
    refershMany() {
      this.reload()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    /*部门初始化*/
    showDepView () {
      this.popVisible1 = !this.popVisible1
    },
    showDepView1 () {
      this.popVisible = !this.popVisible
    },
    /**/
    initPositions () {
      this.getRequest('/employee/basic/positions').then(resp => {
        if (resp) {
          this.positions = resp;
        }
      })
    },
    getMaxWordID () {
      this.getRequest("/employee/basic/maxWorkID").then(resp => {
        if (resp) {
          this.emp.workid = resp.obj;
        }
      })
    },
    /*添加员工数据预加载*/
    initData () {
      /*如果缓存了在缓存里取*/
      /*民族*/
      if (!window.sessionStorage.getItem("nations")) {
        this.getRequest('/employee/basic/nations').then(resp => {
          if (resp) {
            this.nations = resp;
            window.sessionStorage.setItem("nations", JSON.stringify(resp));
          }
        })
      } else {
        this.nations = JSON.parse(window.sessionStorage.getItem("nations"));
      }
      /*职称*/
      if (!window.sessionStorage.getItem("joblevels")) {
        this.getRequest('/employee/basic/joblevels').then(resp => {
          if (resp) {
            this.joblevels = resp;
            window.sessionStorage.setItem("joblevels", JSON.stringify(resp));
          }
        })
      } else {
        this.joblevels = JSON.parse(window.sessionStorage.getItem("joblevels"));
      }
      /*政治面貌*/
      if (!window.sessionStorage.getItem("politicsstatus")) {
        this.getRequest('/employee/basic/politicsstatus').then(resp => {
          if (resp) {
            this.politicsstatus = resp;
            window.sessionStorage.setItem("politicsstatus", JSON.stringify(resp));
          }
        })
      } else {
        this.politicsstatus = JSON.parse(window.sessionStorage.getItem("politicsstatus"));
      }
      /*所在部门*/
      if (!window.sessionStorage.getItem("deps")) {
        this.getRequest('/employee/basic/deps').then(resp => {
          if (resp) {
            this.allDeps = resp;
            window.sessionStorage.setItem("deps", JSON.stringify(resp));
          }
        })
      } else {
        this.allDeps = JSON.parse(window.sessionStorage.getItem("deps"));
      }
    },
    /*分页事件处理*/
    sizeChange (currentSize) {
      this.size = currentSize;
      this.initEmps();
    },
    currentChange (currentPage) {
      this.page = currentPage;
      this.initEmps();
    },
    /*初始化搜索处理*/
    initEmps (type) {
      this.loading = true;
      let url = '/employee/advanced/?page=' + this.page + '&size=' + this.size;
      // if (this.searchValue != null) {
      // }
      if (this.searchValue.politicid) {
        url += '&politicid=' + this.searchValue.politicid;
      }
      if (this.searchValue.nationid) {
        url += '&nationid=' + this.searchValue.nationid;
      }
      if (this.searchValue.joblevelid) {
        url += '&joblevelid=' + this.searchValue.joblevelid;
      }
      if (this.searchValue.posid) {
        url += '&posid=' + this.searchValue.posid;
      }
      if (this.searchValue.engageform) {
        url += '&engageform=' + this.searchValue.engageform;
      }
      if (this.searchValue.departmentid) {
        url += '&departmentid=' + this.searchValue.departmentid;
      }
      if (this.searchValue.beginDateScope) {
        url += '&beginDateScope=' + this.searchValue.beginDateScope;
      }
      if (this.keyword) {
        this.$notify.success({
        title: '搜索信息',
        message: '搜索员工中...',
        showClose: false,
        offset: 100,
        duration: 2000,
        customClass: 'fontclass'
      });
        url += "&name=" + this.keyword;
      }
      /*数据 返回*/
      this.$notify.success({
        title: '系统信息',
        message: '高级信息加载中...',
        showClose: false,
        offset: 100,
        duration: 2000,
        customClass: 'fontclass'
      });
      this.getRequest(url).then(resp => {
        this.loading = false;
        if (resp) {
          this.emps = resp.data;
          /*总记录数*/
          this.total = resp.total;
          // this.searchValue = [];
          this.keyword = '';
        }
      });
    }
  }
}
</script>

<style>
.top-style {
  /*定义弹性布局*/
  display: flex;
  /*分布方式*/
  justify-content: space-between;
}
.content-style {
  margin-top: 10px;
}
.content-style .el-scrollbar__wrap {
  overflow: scroll;
}

/* 空数据 */
.empty {
  padding: 170px;
}
.el-table__empty-text {
  line-height: 0px;
  width: 100%;
  color: #909399;
}

.bottom-style {
  display: flex;
  justify-content: space-between;
}

.fontclasssys {
  font-family: 站酷庆科黄油体;
}

/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all 0.8s ease;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active for below version 2.1.8 */
 {
  transform: translateX(10px);
  opacity: 0;
}
</style>