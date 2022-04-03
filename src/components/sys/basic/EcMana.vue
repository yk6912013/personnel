<template>
    <div>
        <div style="display: flex;align-items: center; justify-content: flex-start;margin-bottom: 10px">
            <el-select v-model="rp.rpsystemId" clearable placeholder="奖罚类别" icon="el-icon-plus"
                       style="margin-right: 10px">
                <el-option v-for="item in rpsystems" :key="item.id" :label="item.rpsystem" :value="item.id"></el-option>
            </el-select>
            <el-tooltip content="奖罚分值" placement="top" effect="light">
                <el-input-number v-model="rp.rpiont" placeholder="奖罚分值" controls-position="right" :min="-10" :max="10"
                                 style="margin-right: 10px"/>
            </el-tooltip>
            <el-autocomplete class="inline-input" v-model="rp.rpmsg" :fetch-suggestions="querySearch" placeholder="奖罚描述"
                             style="margin-right: 10px">
                <i class="el-icon-edit el-input__icon" slot="suffix"></i>
            </el-autocomplete>
            <el-button  type="primary" icon="el-icon-plus" @click="addrwardsPunishments">添加</el-button>
            <el-input
                    class="addPosInput"
                    style="margin-left: 10px;margin-right: 10px"
                    placeholder="请输入奖惩描述进行搜索..."
                    prefix-icon="el-icon-search"
                    :fetch-suggestions="querySearch"
                    v-model="rp.searchname">
            </el-input>
            <el-button icon="el-icon-search" type="primary" @click="searchname">搜索</el-button>
        </div>
        <div style="margin-top: 10px">
            <el-table
                    :data="rps"
                    border
                    max-height="680"
                    v-loading="loading"
                    element-loading-spinner="el-icon-loading"
                    element-loading-text="正在拼命加载中..."
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    @selection-change="handleSelectionChange"
                    size="medium"
                    stripe
                    style="width:100%;">
                <el-table-column type="selection" width="55" align="center">
                </el-table-column>
                <el-table-column prop="id" label="ID" align="center" sortable width="70" >
                </el-table-column>
                <el-table-column prop="rwardsAndPunishments.rpsystem" align="center" label="奖罚类别" width="150">
                </el-table-column>
                <el-table-column prop="rpiont" label="奖罚分值" align="center" width="100">
                </el-table-column>
                <el-table-column prop="rpmsg" label="奖罚描述">
                </el-table-column>
                <el-table-column prop="createrp" label="创建时间" align="center" width="250">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="showEditView(scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="deleteHandler(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog
                    title="修改奖罚规则"
                    :visible.sync="dialogVisible"
                    width="30%">
                <div>
                    <el-form :rules="rules">
                        <el-form-item label="奖罚类别" prop="updaterp.name">
                            <el-select v-model="updaterp.rpsystemId" clearable placeholder="奖罚类别" icon="el-icon-plus"
                                       style="margin-right: 10px">
                                <el-option v-for="item in rpsystems" :key="item.id" :label="item.rpsystem" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="奖罚分值" prop="rp.rpiont">
                            <el-input-number v-model="updaterp.rpiont" placeholder="奖罚分值" controls-position="right" :min="-10" :max="10"
                                             style="margin-right: 10px"/>
                        </el-form-item>
                        <el-form-item label="奖罚描述" prop="rp.rpmsg">
                            <el-autocomplete class="inline-input" v-model="updaterp.rpmsg" :fetch-suggestions="querySearch" placeholder="奖罚描述"
                                             style="margin-right: 10px">
                                <i class="el-icon-edit el-input__icon" slot="suffix"></i>
                            </el-autocomplete>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button size="small" @click="outUpdate">取 消</el-button>
                    <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
                </span>
            </el-dialog>
            <el-button type="danger" icon="el-icon-delete" style="margin-top: 10px" :disabled="multipleSelection.length==0" @click="deleteMany">
                批量删除
            </el-button>
            <el-button @click="refershMany" type="success" icon="el-icon-refresh" style="margin-top: 8px">
                刷 新
            </el-button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dialogVisible:false,
                rpsystems: [],
                rpsystem: '',
                rps: [],
                rp: {
                    rpsystemId: '',
                    rpmsg: '',
                    rpiont: '1',
                    searchname:''
                },
                updaterp: {
                    rpsystemId: '',
                    rpmsg: '',
                    rpiont: '',
                    searchname:'',
                    rwardsAndPunishments: {
                    rpsystem: ""},
                },
                restaurants: [],
                loading: false,
                multipleSelection: [],
            }
        },
        mounted() {
            this.initrps();
            this.initrpsystems();
            this.restaurants = this.initrpmsg();
        },
        methods: {
            /*批量删除的添加回调*/
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            deleteMany(){
            this.$confirm('此操作将永久删除【' + this.multipleSelection.length + '】条记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let ids = '?';
                this.multipleSelection.forEach(item => {
                    ids += 'ids=' + item.id + '&';
                })
                this.$notify.success({
                    title: '删除信息',
                    message: '删除奖罚规则中...',
                    showClose: false,
                    offset: 100,
                    duration: 4000,
                    customClass: 'fontclass'
                });
                this.deleteRequest("/system/basic/rp/" + ids).then(resp => {
                    if (resp) {
                        this.initrps();
                    }
                })
            }).catch(() => {
                this.$notify.info({
                    title: '删除信息',
                    message: '已取消删除',
                    showClose: false,
                    offset: 100,
                    duration: 4000,
                    customClass: 'fontclass'
                });
            });
            },
            showEditView(data) {
                //用于值得复原，更新前不改变原来的值
                /*用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）。*/
                Object.assign(this.updaterp, data);
                this.dialogVisible = true;
            },
            outUpdate() {
                this.$notify.info({
                    title: '修改信息',
                    message: '已取消修改',
                    showClose: false,
                    offset: 100,
                    duration: 2000,
                    customClass: 'fontclass'
                });
                this.dialogVisible = false;
            },
            doUpdate() {
                this.$notify.success({
                    title: '修改信息',
                    message: '更新奖罚规则中...',
                    showClose: false,
                    offset: 100,
                    duration: 2000,
                    customClass: 'fontclass'
                });
                this.putRequest("/system/basic/rp/", this.updaterp).then(resp => {
                    if (resp) {
                        this.initrps();
                        this.dialogVisible = false;
                    }
                })
            },
            searchname(){
                if ( this.rp.searchname) {
                    this.rp.rpmsg = this.rp.searchname;
                    this.postRequest("/system/basic/rp/serch/", this.rp).then(resp => {
                        if (resp) {
                            this.rps = resp;
                            this.rp.rpmsg = '';
                            this.rp.searchname = '';
                        }
                    });
                }else {
                    this.$notify({
                        title: '搜索信息',
                        message: '搜索字段不可以为空!',
                        showClose: false,
                        offset: 100,
                        duration: 2000,
                        customClass: 'fontclass',
                        type: 'warning'
                    });
                }
            },
            deleteHandler(data) {
                this.$confirm('此操作将永久删除【' + data.rpmsg + '】规则, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$notify.success({
                        title: '删除信息',
                        message: '删除奖罚规则中...',
                        showClose: false,
                        offset: 100,
                        duration: 3000,
                        customClass: 'fontclass'
                    });
                    this.deleteRequest("/system/basic/rp/" + data.id).then(resp => {
                        if (resp) {
                            this.initrps();
                        }
                    })
                }).catch(() => {
                    this.$notify.info({
                        title: '删除信息',
                        message: '已取消删除',
                        showClose: false,
                        offset: 100,
                        duration: 3000,
                        customClass: 'fontclass'
                    });
                });
            },
            refershMany(){
                this.initrps();
            },
            querySearch(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
                };
            },
            initrpmsg() {
                return [
                    {"value": "通报批评"},
                    {"value": "通报表扬"},
                    {"value": "嘉奖"},
                    {"value": "辞退"},
                    {"value": "开除"},
                    {"value": "带薪调休"},
                    {"value": "晋职"},
                    {"value": "记小功"},
                    {"value": "晋级"},
                    {"value": "记大功"},
                    {"value": "年终评奖"},
                    {"value": "晋职晋级"},
                ];
            },
            addrwardsPunishments() {
                if (this.rp.rpsystemId && this.rp.rpmsg && this.rp.rpiont) {
                    this.$notify.success({
                        title: '添加信息',
                        message: '添加奖罚规则中...',
                        showClose: false,
                        offset: 100,
                        duration: 4000,
                        customClass: 'fontclass'
                    });
                    this.postRequest("/system/basic/rp/", this.rp).then(resp => {
                        if (resp) {
                            this.rp.rpsystemId = '',
                            this.rp.rpmsg = '',
                            this.rp.rpiont = '1'
                            this.initrps();
                        }
                    });
                }else {
                    this.$notify({
                        title: '添加信息',
                        message: '添加字段不可以为空!',
                        showClose: false,
                        offset: 100,
                        duration: 2000,
                        customClass: 'fontclass',
                        type: 'warning'
                    });
                }
            },
            initrpsystems(){
              this.getRequest("/system/basic/rp/rap/").then( resp =>{
                  if (resp){
                      this.rpsystems = resp;
                  }
              });
            },
            initrps(){
                setTimeout(() => {
                    this.$notify.success({
                        title: '系统信息',
                        message: '奖罚规则信息加载中...',
                        showClose: false,
                        offset: 100,
                        duration: 2000,
                        customClass: 'fontclass'
                    });
                }, 1200)
                this.loading = true
                this.getRequest("/system/basic/rp/").then( resp =>{
                    if (resp){
                        this.loading = false;
                        this.rps = resp;
                    }
                }) ;
            }
        }
    }
</script>

<style >
/* .fontclass {
    font-size: 35px;
    font-family: 站酷庆科黄油体;
} */
/* .el-select {

} */
</style>