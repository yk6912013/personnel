<template>
  <div>
    <div>
      <div style="float: left;   margin-bottom: 10px">
        <el-input placeholder="请输入员工名进行搜索，可以直接回车搜索..."
                  prefix-icon="el-icon-search"
                  clearable
                  @clear="initEmps"
                  style="width: 350px;margin-right: 10px"
                  v-model="keyword"
                  @keydown.enter.native="initEmps"
                  :disabled="showAdvanceSearchView"></el-input>
        <el-select v-model="defstatus" @change="changestatus" placeholder="状态" style="width: 130px; margin-right: 10px">
            <el-option v-for="item in status"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
            </el-option>
        </el-select>
        <el-button icon="el-icon-search"
                   type="primary"
                   @click="initEmps"
                   :disabled="showAdvanceSearchView">
          搜索
        </el-button>
        <el-popover width="1050"
                    placement="right-end"
                    trigger="manual"
                    v-model="showAdvanceSearchView">
          <transition name="slide-fade">
            <div v-show="showAdvanceSearchView"
                 style="border: 1px solid #409eff;border-radius: 5px;box-sizing: border-box;padding: 5px;margin: 10px 0px;">
              <el-row>
                <el-col :span="5">
                  政治面貌:
                  <el-select v-model="searchValue.politicid"
                             placeholder="政治面貌"
                             style="width: 130px;">
                    <el-option v-for="item in politicsstatus"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="4">
                  民族:
                  <el-select v-model="searchValue.nationid"
                             placeholder="民族"
                             style="width: 130px;">
                    <el-option v-for="item in nations"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="4">
                  职位:
                  <el-select v-model="searchValue.posid"
                             placeholder="职位"
                             style="width: 130px;">
                    <el-option v-for="item in positions"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="4">
                  职称:
                  <el-select v-model="searchValue.joblevelid"
                             placeholder="职称"
                             style="width: 130px;">
                    <el-option v-for="item in joblevels"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="7">
                  聘用形式:
                  <el-radio-group v-model="searchValue.engageform">
                    <el-radio label="劳动合同">劳动合同</el-radio>
                    <el-radio label="劳务合同">劳务合同</el-radio>
                  </el-radio-group>
                </el-col>
              </el-row>
              <el-row style="margin-top: 10px">
                <el-col :span="5">
                  所属部门:
                  <el-popover placement="right"
                              title="请选择部门"
                              width="100%"
                              trigger="manual"
                              v-model="popVisible1">
                    <el-tree default-expand-all
                             :data="allDeps"
                             :props="defaultProps"
                             @node-click="searvhViewHandleNodeClick"></el-tree>
                    <div slot="reference"
                         style="width: 130px;display: inline-flex;font-size: 13px;border: 1px solid #dedede;height: 26px;border-radius: 5px;cursor: pointer;align-items: center;padding-left: 8px;box-sizing: border-box;margin-left: 3px"
                         @click="showDepView">{{inputDepName}}
                    </div>
                  </el-popover>
                </el-col>
                <el-col :span="10">
                  入职日期:
                  <el-date-picker v-model="searchValue.beginDateScope"
                                  type="daterange"
                                  unlink-panels
                                  value-format="yyyy-MM-dd"
                                  range-separator="至"
                                  start-placeholder="开始日期"
                                  end-placeholder="结束日期">
                  </el-date-picker>
                </el-col>
                <el-col :span="5"
                        :offset="4">
                  <el-button icon="el-icon-search"
                             type="primary"
                             @click="initEmps('advanced')">搜索</el-button>
                </el-col>
              </el-row>
            </div>
          </transition>
          <el-button type="primary"
                     @click="showAdvanceSearchView = !showAdvanceSearchView"
                     slot="reference"
                     style="margin-left: 10px">
            <i :class="showAdvanceSearchView?'fa fa-angle-double-up':'fa fa-angle-double-down'"
               aria-hidden="true"></i>
            高级搜索
          </el-button>
        </el-popover>
      </div>
    </div>
    <div class="content-style" style="clear: both;">
      <el-scrollbar>
        <div>
          <el-table :data="emps"
                    stripe
                    border
                    max-height="700px"
                    v-loading.fullscreen.lock="loading"
                    element-loading-spinner="fa fa-spinner fa-pulse fa-3x fa-fw"
                    style="width: 100%; height: 100%; font-size: 14px"
                    @selection-change="handleSelectionChange">
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
            <el-table-column prop="gender"
                             label="性别"
                             align="center"
                             hidden
                             width="50">
            </el-table-column>
            <el-table-column prop="birthday"
                             width="100"
                             align="center"
                             label="出生日期">
            </el-table-column>
            <el-table-column prop="idcard"
                             width="170"
                             align="center"
                             label="身份证号码">
            </el-table-column>
            <el-table-column prop="wedlock"
                             width="100"
                             align="center"
                             label="婚姻状况">
            </el-table-column>
            <el-table-column prop="nation.name"
                             width="125"
                             align="center"
                             label="民族">
            </el-table-column>
            <el-table-column prop="nativeplace"
                             width="100"
                             show-overflow-tooltip
                             align="center"
                             label="籍贯">
            </el-table-column>
            <el-table-column prop="politicsstatus.name"
                             label="政治面貌">
            </el-table-column>
            <el-table-column prop="email"
                             width="180"
                             align="center"
                             label="电子邮件">
            </el-table-column>
            <el-table-column prop="phone"
                             width="120"
                             align="center"
                             label="电话号码">
            </el-table-column>
            <el-table-column prop="address"
                             width="250"
                             align="center"
                             show-overflow-tooltip
                             label="联系地址">
            </el-table-column>
            <el-table-column prop="department.name"
                             width="100"
                             align="center"
                             label="所属部门">
            </el-table-column>
            <el-table-column prop="position.name"
                             width="100"
                             align="center"
                             label="职位">
            </el-table-column>
            <el-table-column prop="jobLevel.name"
                             width="100"
                             align="center"
                             label="职称">
            </el-table-column>
            <el-table-column prop="engageform"
                             width="100"
                             align="center"
                             label="聘用形式">
            </el-table-column>
            <el-table-column prop="tiptopdegree"
                             width="80"
                             align="center"
                             label="最高学历">
            </el-table-column>
            <el-table-column prop="specialty"
                             width="150"
                             align="center"
                             label="专业">
            </el-table-column>
            <el-table-column prop="school"
                             width="150"
                             align="center"
                             show-overflow-tooltip
                             label="毕业院校">
            </el-table-column>
            <el-table-column prop="begindate"
                             width="100"
                             align="center"
                             label="入职日期">
            </el-table-column>
            <el-table-column prop="conversiontime"
                             width="100"
                             align="center"
                             label="转正日期">
            </el-table-column>
            <el-table-column prop="begincontract"
                             width="105"
                             align="center"
                             label="合同起始日期">
            </el-table-column>
            <el-table-column prop="endcontract"
                             width="105"
                             align="center"
                             label="合同截止日期">
            </el-table-column>
            <el-table-column width="100"
                             align="center"
                             prop="contractterm"
                             label="合同期限">
              <template slot-scope="scope">
                <el-tag size="mini">{{scope.row.contractterm}}</el-tag>
                年
              </template>
            </el-table-column>
            <el-table-column prop="notworkdate" width="105" align="center" v-if="show" label="离职日期"/>
            <el-table-column width="100"
                             align="center"
                             label="工龄"
                             v-if="show">
              <template slot-scope="scope">
                <el-tag size="mini">{{scope.row.workage}}</el-tag>
                年
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-scrollbar>
    </div>
    <div class="bottom-style">
      <el-pagination style="margin-top: 10px"
                     background
                     @current-change="currentChange"
                     @size-change="sizeChange"
                     layout="sizes, prev, pager, next, jumper, ->, total, slot"
                     :total="total"
                     :page-sizes="[20,30,50,,100]">
      </el-pagination>
    </div>
    <!--添加弹出框-->
  </div>
</template>

<script>
export default {
  name: "EmpBasic",
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
      showAdvanceSearchView: false,
      allDeps: [],
      show: false,
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
      defstatus: 1,
      status: [
          {
              id: 1,
              name: '在职'
          },
          {
              id: 0,
              name: '离职'
          }
        ],
      options: [{
        value: '',
        label: ''
      }],
      inputDepName: '所属部门',
      emp: {
        id: '',
        name: "小明",
        gender: "男",
        birthday: "1995-10-08",
        idcard: "610122199001011256",
        wedlock: "已婚",
        nationid: 1,
        nativeplace: "内蒙古",
        politicid: 13,
        email: "1224965096@qq.com",
        phone: "18565558897",
        address: "内蒙古呼和浩特",
        departmentid: 29,
        joblevelid: 9,
        posid: 29,
        engageform: "劳务合同",
        tiptopdegree: "本科",
        specialty: "信息与计算科学",
        school: "集宁师范学院",
        begindate: "2017-12-31",
        workstate: "在职",
        workid: "",
        contractterm: 2,
        conversiontime: "2018-03-31",
        notworkdate: null,
        begincontract: "2017-12-31",
        endcontract: "2019-12-31",
        workage: null
      },
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
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    changestatus(value) {
        this.defstatus = value
        console.log(this.defstatus)
        this.initEmps()
    },
    /**/
    searvhViewHandleNodeClick (data) {
      this.inputDepName = data.name;
      this.searchValue.departmentid = data.id;
      this.popVisible1 = !this.popVisible1
    },
    emptyEmp () {
      this.emp = {
        id: '',
        name: "小明",
        gender: "男",
        birthday: "1995-10-08",
        idcard: "610122199001011256",
        wedlock: "已婚",
        nationid: 1,
        nativeplace: "内蒙古",
        politicid: 13,
        email: "1224965096@qq.com",
        phone: "18565558897",
        address: "内蒙古呼和浩特",
        departmentid: 8,
        joblevelid: 9,
        posid: 29,
        engageform: "劳务合同",
        tiptopdegree: "本科",
        specialty: "信息与计算科学",
        school: "集宁师范学院",
        begindate: "2017-12-31",
        workstate: "在职",
        workid: "",
        contractterm: 2,
        conversiontime: "2018-03-31",
        notworkdate: null,
        begincontract: "2017-12-31",
        endcontract: "2019-12-31",
        workage: null
      }
      this.inputDepName = '';
    },
    handleNodeClick (data) {
      this.inputDepName = data.name;
      this.emp.departmentid = data.id;
      this.popVisible = !this.popVisible
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
            window.sessionStorage.setItem("nations  ", JSON.stringify(resp));
          }
        })
      } else {
        this.nations = JSON.parse(window.sessionStorage.getItem("nations"));
      }
      /*职称*/
      // if (!window.sessionStorage.getItem("joblevels")) {
        this.getRequest('/employee/basic/joblevels').then(resp => {
          if (resp) {
            this.joblevels = resp;
            window.sessionStorage.setItem("joblevels", JSON.stringify(resp));
          }
        })
      // } else {
      //   this.joblevels = JSON.parse(window.sessionStorage.getItem("joblevels"));
      // }
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
      // if (!window.sessionStorage.getItem("deps")) {
        this.getRequest('/employee/basic/deps').then(resp => {
          if (resp) {
            this.allDeps = resp;
            window.sessionStorage.setItem("deps", JSON.stringify(resp));
          }
        })
      // } else {
      //   this.allDeps = JSON.parse(window.sessionStorage.getItem("deps"));
      // }
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
      let url
      if (this.defstatus == 1) {
          url = '/employee/basic/?page=' + this.page + '&size=' + this.size;
          this.show = false
      } else {
          url = '/employee/info/?page=' + this.page + '&size=' + this.size;
          this.show = true
      }
      if (type && type == 'advanced') {
        this.$notify.success({
          title: '搜索信息',
          message: '搜索员工中...',
          showClose: false,
          offset: 100,
          duration: 2000,
          customClass: 'fontclass'
        });
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
      } else if (this.keyword) {
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
      /*数据返回*/
      this.$notify.success({
          title: '系统信息',
          message: '基本信息加载中...',
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
          this.searchValue = [];
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
  /* margin-bottom: ; */
  /*分布方式*/
  justify-content: space-between;
}

.content-style {
  margin-top: 10px;
}

.content-style .el-scrollbar__wrap {
  overflow: scroll;
}

.bottom-style {
  /* margin-left: 34%; */
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}

.fontclasssys {
  font-family: 站酷庆科黄油体;
}

/* .loadingstyle {
  font-family: 站酷庆科黄油体;
  font-size: 25px;
} */
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