<template>
  <div>
    <div>
      <el-button type="primary" icon="el-icon-plus" @click="showAddSalaryView">添加账套</el-button>
      <el-button icon="el-icon-refresh" type="success" @click="initSalaries">刷新</el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table :data="salaries"
                border
                max-height="680"
                style="font-size: 14px"
                v-loading.fullscreen.lock="loading"
                element-loading-spinner="fa fa-spinner fa-pulse fa-3x fa-fw"
                stripe>
        <el-table-column type="selection"
                         width="55"
                         align="center"></el-table-column>
        <el-table-column width="200"
                         prop="name"
                         label="账套名称"
                         align="center"></el-table-column>
        <el-table-column width="100"
                         prop="basicsalary"
                         align="center"
                         label="基本工资"></el-table-column>
        <el-table-column width="100"
                         prop="trafficsalary"
                         align="center"
                         label="交通补助"></el-table-column>
        <el-table-column width="100"
                         prop="lunchsalary"
                         align="center"
                         label="午餐补助"></el-table-column>
        <el-table-column width="100"
                         prop="bonus"
                         align="center"
                         label="奖金"></el-table-column>
        <el-table-column width="100"
                         prop="createdate"
                         align="center"
                         label="启用时间"></el-table-column>
        <el-table-column label="养老金"
                         align="center">
          <el-table-column width="70"
                           prop="pensionper"
                           align="center"
                           label="比率"></el-table-column>
          <el-table-column width="70"
                           prop="pensionbase"
                           align="center"
                           label="基数"></el-table-column>
        </el-table-column>
        <el-table-column label="医疗保险"
                         align="center">
          <el-table-column width="70"
                           prop="medicalper"
                           align="center"
                           label="比率"></el-table-column>
          <el-table-column width="70"
                           prop="medicalbase"
                           align="center"
                           label="基数"></el-table-column>
        </el-table-column>
        <el-table-column label="公积金"
                         align="center">
          <el-table-column width="70"
                           prop="accumulationfundper"
                           align="center"
                           label="比率"></el-table-column>
          <el-table-column width="70"
                           prop="accumulationfundbase"
                           align="center"
                           label="基数"></el-table-column>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini"
                       @click="showEditSalaryView(scope.row)">编辑</el-button>
            <el-button size="mini"
                       type="danger"
                       @click="deleteSalary(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑弹出框 -->
      <el-dialog title="账套修改" :visible.sync="updatedialogVisible" width="50%" :before-close="handleClose">
        <el-form ref="empform" :rules="rules" :model="salary" label-width="70px">
          <el-row :gutter="10">
            <el-col :span="8">
              <div class="grid-content bg-purple">
                  <el-form-item label="账套名" prop="name">
                      <el-input
                          v-model="salary.name"
                          maxlength="20"
                          show-word-limit
                          suffix-icon="el-icon-edit"
                          clearable
                          placeholder="请输入账套名">
                      </el-input>
                  </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                  <el-form-item label="基本工资" prop="basicsalary" label-width="80px">
                      <el-input
                          v-model.number="salary.basicsalary"
                          suffix-icon="el-icon-edit"
                          maxlength="20"
                          show-word-limit
                          clearable="true"
                          placeholder="基本工资">
                      </el-input>
                  </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content bg-purple">
                    <el-form-item label="午餐补助" prop="lunchsalary" label-width="80px">
                      <el-input
                          v-model.number="salary.lunchsalary"
                          suffix-icon="el-icon-edit"
                          clearable="true"
                          maxlength="20"
                          show-word-limit
                          placeholder="午餐补助">
                      </el-input>
                  </el-form-item>
                </div>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <div class="grid-content bg-purple">
                  <el-form-item label="奖金" prop="bonus">
                      <el-input
                          v-model.number="salary.bonus"
                          suffix-icon="el-icon-edit"
                          clearable="true"
                          maxlength="20"
                          show-word-limit
                          placeholder="奖金">
                      </el-input>
                  </el-form-item>
              </div>
            </el-col>
            <el-col :span="8">
              <el-form-item label="交通补助" prop="trafficsalary" label-width="80px">
                  <el-input
                      v-model.number="salary.trafficsalary"
                      suffix-icon="el-icon-edit"
                      clearable="true"
                      maxlength="20"
                      show-word-limit
                      placeholder="交通补助">
                  </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 分割线 -->
          <el-divider></el-divider>
          <!-- 分割线 -->
          <el-tag style="margin-bottom: 8px;" size="medium" effect="dark" type="warning">养老金</el-tag>
          <el-row :gutter="10">
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <el-form-item label="比率" prop="pensionper">
                      <el-input
                          v-model.number="salary.pensionper"
                          suffix-icon="el-icon-edit"
                          clearable="true"
                          placeholder="请输入比率">
                      </el-input>
                  </el-form-item>
                </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">
                  <el-form-item label="基数" prop="pensionbase">
                      <el-input
                          v-model.number="salary.pensionbase"
                          suffix-icon="el-icon-edit"
                          clearable="true"
                          placeholder="请输入基数">
                      </el-input>
                  </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-tag style="margin-bottom: 8px" size="medium" effect="dark" type="success">医疗保险</el-tag>
          <el-row :gutter="10">
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <el-form-item label="比率" prop="medicalper">
                      <el-input
                          v-model.number="salary.medicalper"
                          suffix-icon="el-icon-edit"
                          clearable="true"
                          placeholder="请输入比率">
                      </el-input>
                  </el-form-item>
                </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">
                  <el-form-item label="基数" prop="medicalbase">
                      <el-input
                          v-model.number="salary.medicalbase"
                          suffix-icon="el-icon-edit"
                          clearable="true"
                          placeholder="请输入基数">
                      </el-input>
                  </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-tag style="margin-bottom: 8px" size="medium" effect="dark">公积金</el-tag>
          <el-row :gutter="10">
            <el-col :span="6">
                <div class="grid-content bg-purple">
                    <el-form-item label="比率" prop="accumulationfundper">
                      <el-input
                          v-model.number="salary.accumulationfundper"
                          suffix-icon="el-icon-edit"
                          clearable="true"
                          placeholder="请输入比率">
                      </el-input>
                  </el-form-item>
                </div>
            </el-col>
            <el-col :span="6">
              <div class="grid-content bg-purple">
                  <el-form-item label="基数" prop="accumulationfundbase">
                      <el-input
                          v-model.number="salary.accumulationfundbase"
                          suffix-icon="el-icon-edit"
                          clearable
                          placeholder="请输入基数">
                      </el-input>
                  </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="updatedialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updatestep">确 定</el-button>
        </span>
      </el-dialog>
      <!-- <el-dialog title="账套修改"
                 :visible.sync="updatedialogVisible"
                 width="70%"
                 size="mini"
                 :before-close="handleClose">
        <el-form ref="empform"
                 :model="salary"
                 label-width="120px"
                 size="120"
                 :rules="rules">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item prop="name"
                            label="账套名称">
                <el-input v-model="salary.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="basicsalary"
                            label="基本工资">
                <el-input v-model.number="salary.basicsalary"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="trafficsalary"
                            label="交通补助">
                <el-input v-model.number="salary.trafficsalary"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item prop="lunchsalary"
                            label="午餐补助">
                <el-input v-model.number="salary.lunchsalary"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="bonus"
                            label="奖金">
                <el-input v-model.number="salary.bonus"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="accumulationfundbase"
                            label="公积金基数">
                <el-input v-model.number="salary.accumulationfundbase"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item prop="pensionper"
                            label="养老金比率">
                <el-input v-model="salary.pensionper"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="medicalper"
                            label="医疗保险比率">
                <el-input v-model="salary.medicalper"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="medicalbase"
                            label="医疗保险基数">
                <el-input v-model.number="salary.medicalbase"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item prop="accumulationfundper"
                            label="公积金比率">
                <el-input v-model="salary.accumulationfundper"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
            </el-col>
            <el-col :span="6">
              <el-button @click="updatedialogVisible = false"
                         style="margin-left: 120px">取 消</el-button>
              <el-button type="primary"
                         @click="updatestep">确 定</el-button>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer"
              class="dialog-footer">
        </span>
      </el-dialog> -->
    </div>
    <el-dialog :title="dialogTitle"
               :visible.sync="dialogVisible"
               width="50%">
      <div style="display: flex;justify-content: space-around;align-items: center">
        <el-steps direction="vertical"
                  :active="activeItemIndex">
          <el-step :title="itemName"
                   v-for="(itemName,index) in salaryItemName"
                   :key="index"></el-step>
        </el-steps>
        <el-input v-model="salary[title]"
                  :placeholder="'请输入'+salaryItemName[index]+'...'"
                  v-for="(value,title,index) in salary"
                  :key="index"
                  v-show="activeItemIndex==index"
                  style="width: 200px"></el-input>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="preStep">{{activeItemIndex==11?'取消':'上一步'}}</el-button>
        <el-button type="primary"
                   @click="nextStep">{{activeItemIndex==11?'完成':'下一步'}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "SalSob",
  data () {
    return {
      rules: {
        basicsalary: [{ required: true, message: '不能为空', trigger: 'blur' }, { type: 'number', message: '必须为数字值' }],
        trafficsalary: [{ required: true, message: '不能为空', trigger: 'blur' }, { type: 'number', message: '必须为数字值' }],
        lunchsalary: [{ required: true, message: '不能为空', trigger: 'blur' }, { type: 'number', message: '必须为数字值' }],
        bonus: [{ required: true, message: '不能为空', trigger: 'blur' }, { type: 'number', message: '必须为数字值' }],
        pensionper: [{ required: true, message: '不能为空', trigger: 'blur' }],
        pensionbase: [{ required: true, message: '不能为空', trigger: 'blur' }, { type: 'number', message: '必须为数字值' }],
        medicalper: [{ required: true, message: '不能为空', trigger: 'blur' }],
        medicalbase: [{ required: true, message: '不能为空', trigger: 'blur' }, { type: 'number', message: '必须为数字值' }],
        accumulationfundper: [{ required: true, message: '不能为空', trigger: 'blur' }  ],
        accumulationfundbase: [{ required: true, message: '不能为空', trigger: 'blur' }, { type: 'number', message: '必须为数字值' }],
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
      },
      dialogVisible: false,
      tempsalary: [],
      loading: false,
      updatedialogVisible: false,
      dialogTitle: '添加工资账套',
      salaries: [],
      activeItemIndex: 0,
      salaryItemName: [
        '基本工资',
        '交通补助',
        '午餐补助',
        '奖金',
        '养老金比率',
        '养老金基数',
        '医疗保险比率',
        '医疗保险基数',
        '公积金比率',
        '公积金基数',
        '账套名称'
      ],
      salary: {
        basicsalary: 0,
        trafficsalary: 0,
        lunchsalary: 0,
        bonus: 0,
        pensionper: 0,
        pensionbase: 0,
        medicalper: 0,
        medicalbase: 0,
        accumulationfundper: 0,
        accumulationfundbase: 0,
        name: ''
      }
    }
  },
  mounted () {
    this.initSalaries();
  },
  methods: {
    showEditSalaryView (data) {
      this.dialogTitle = '修改工资账套';
      this.updatedialogVisible = true;
      this.salary.basicsalary = data.basicsalary;
      this.salary.trafficsalary = data.trafficsalary;
      this.salary.lunchsalary = data.lunchsalary;
      this.salary.bonus = data.bonus;
      this.salary.pensionper = data.pensionper;
      this.salary.pensionbase = data.pensionbase;
      this.salary.medicalper = data.medicalper;
      this.salary.medicalbase = data.medicalbase;
      this.salary.accumulationfundper = data.accumulationfundper;
      this.salary.accumulationfundbase = data.accumulationfundbase;
      this.salary.name = data.name;
      this.salary.id = data.id;
      this.tempsalary = this.salary;
    },
    deleteSalary (data) {
      this.$confirm('此操作将删除【' + data.name + '】账套，是否继续？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定'
      }).then(() => {
        this.deleteRequest("/salary/sob/" + data.id).then(resp => {
          if (resp) {
            this.initSalaries();
          }
        })
      }).catch(() => {
        this.$notify.info({
          title: '删除信息',
          message: '已取消删除',
          showClose: false,
          offset: 100,
          duration: 2000,
          customClass: 'fontclass'
        });
      })
    },
    preStep () {
      if (this.activeItemIndex == 0) {
        return;
      } else if (this.activeItemIndex == 11) {
        //关闭对话框
        this.dialogVisible = false;
        return;
      }
      this.activeItemIndex--;
    },
    updatestep () {
      this.$refs['empform'].validate((valid) => {
        if (valid) {
          this.$notify.success({
            title: '修改信息',
            message: ' 修改账套中...',
            showClose: false,
            offset: 100,
            duration: 2000,
            customClass: 'fontclass'
          });
          this.putRequest("/salary/sob/", this.salary).then(resp => {
            if (resp) {
              this.initSalaries();
              this.updatedialogVisible = false;
            }
          });
        } else {
          this.$notify.info({
            title: '删除信息',
            message: '已取消修改 ',
            showClose: false,
            offset: 100,
            duration: 4000,
            customClass: 'fontclass'
          });
        }
      });
    },
    nextStep () {
      if (this.activeItemIndex == 11) {
        if (this.salary.id) {
          this.$notify.success({
            title: '修改信息',
            message: ' 修改账套中...',
            showClose: false,
            offset: 100,
            duration: 2000,
            customClass: 'fontclass'
          });
          this.putRequest("/salary/sob/", this.salary).then(resp => {
            if (resp) {
              this.initSalaries();
              this.dialogVisible = false;
            }
          })
        } else {
          this.$notify.success({
            title: '添加信息',
            message: '添加工资账套中...',
            showClose: false,
            offset: 100,
            duration: 4000,
            customClass: 'fontclass'
          });
          this.postRequest("/salary/sob/", this.salary).then(resp => {
            if (resp) {
              this.initSalaries();
              this.dialogVisible = false;
            }
          });
        }
        return;
      }
      this.activeItemIndex++;
    },
    showAddSalaryView () {
      //数据初始化
      this.salary = {
        basicsalary: 0,
        trafficsalary: 0,
        lunchsalary: 0,
        bonus: 0,
        pensionper: 0,
        pensionbase: 0,
        medicalper: 0,
        medicalbase: 0,
        accumulationfundper: 0,
        accumulationfundbase: 0,
        name: '',
      }
      this.dialogTitle = '添加工资账套';
      this.activeItemIndex = 0;
      this.dialogVisible = true;
    },
    initSalaries () {
      setTimeout(() => {
        this.$notify.success({
          title: '系统信息',
          message: '工资账套信息加载中...',
          showClose: false,
          offset: 100,
          duration: 4000,
          customClass: 'fontclass'
        });
      }, 1100);
      this.loading = true;
      this.getRequest("/salary/sob/").then(resp => {
        if (resp) {
          this.salaries = resp;
          this.loading = false;
        }
      })
    }
  }
}
</script>

<style >
.fontclass {
  font-family: 站酷庆科黄油体;
}
</style>