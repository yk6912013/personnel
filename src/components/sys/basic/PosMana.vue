<template>
    <div>
        <div style="display: flex;align-items: center">
            <el-input
                class="addPosInput"
                style="margin-right: 10px"
                placeholder="请输入职位名称..."
                icon="el-icon-edit"
                @keydown.enter.native="addPosition"
                v-model="pos.name">
            </el-input>
            <template>
                <el-button icon="el-icon-plus"  type="primary" @click="addPosition">添加</el-button>
            </template>
            <el-input
                class="addPosInput"
                style="margin-left: 10px;margin-right: 10px"
                placeholder="请输入职位名称进行搜索..."
                icon="el-icon-search"
                v-model="pos.searchname">
            </el-input>
            <el-button  icon="el-icon-search"  type="primary" @click="searchname">搜索</el-button>
        </div>
        <div class="posManaMain">
            <el-table
                :data="positions"
                border
                v-loading="loading"
                element-loading-spinner="el-icon-loading"
                element-loading-text="正在拼命加载中..."
                element-loading-background="rgba(0, 0, 0, 0.8)"
                max-height="680px"
                @selection-change="handleSelectionChange"
                size="medium"
                stripe
                style="width: 100%">
                <el-table-column
                    type="selection"
                    align="center"
                    width="55">
                </el-table-column>
                <el-table-column
                    prop="id"
                    label="ID"
                    sortable
                    align="center"
                    width="70">
                </el-table-column>
                <el-table-column
                    prop="name"
                    align="center"
                    label="职位名称"
                    width="180">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="createdate"
                    width="200"
                    label="创建时间">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="是否启用"
                    width="150">
                    <template slot-scope="scope">
                        <el-tag size="small" type="success" v-if="scope.row.enabled">已启用</el-tag>
                        <el-tag size="small" type="danger" v-else>未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click="showEditView(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button @click="deleteMany" type="danger" icon="el-icon-delete" style="margin-top: 15px" :disabled="multipleSelection.length==0">批量删除</el-button>
            <el-button @click="refershMany" type="success" icon="el-icon-refresh" style="margin-top: 8px">刷 新</el-button>
        </div>
        <el-dialog
                title="修改职位"
                :visible.sync="dialogVisible"
                width="30%">
            <div>
                <el-form :rules="rules">
                    <el-form-item label="职位名称" prop="updatePos.name" label-width="100px">
                        <el-input type="text" class="updatePosInput" size="small" v-model="updatePos.name"/>
                    </el-form-item>
                    <el-form-item label="是否启用" prop="delivery" label-width="100px">
                        <el-switch v-model="updatePos.enabled" style="margin-left: 15px">
                        </el-switch>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="outUpdate">取 消</el-button>
    <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "PosMana",
    data() {
        return {
            pos: {
                name: '',
                searchname: '',
            },
            dialogVisible: false,
            loading: false,
            updatePos: {
                name: '',
                enabled: false
            },
            multipleSelection: [],
            positions: [],
        }
    },
    mounted() {
        this.initPositions();
    },
    methods: {
        refershMany() {
            this.initPositions();
        },
        searchname() {
            if (this.pos.searchname) {
                this.$notify.success({
                    title: '搜索信息',
                    message: '搜索职位中...',
                    showClose: false,
                    offset: 100,
                    duration: 2000,
                    customClass: 'fontclass'
                });
                this.pos.name = this.pos.searchname;
                this.postRequest("/system/basic/pos/serch/", this.pos).then(resp => {
                    if (resp) {
                        /*更新数据+清空列表*/
                        this.positions = resp;
                        this.pos.searchname = '';
                        this.pos.name = '';
                    }
                })
            } else {
                this.$notify({
                    title: '搜索信息',
                    message: '搜 索 字 段 不 可 以 为 空!',
                    showClose: false,
                    offset: 100,
                    duration: 2000,
                    customClass: 'fontclass',
                    type: 'warning'
                });
            }
        },
        deleteMany() {
            this.$confirm('此操作将永久删除【' + this.multipleSelection.length + '】条记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let ids = '?';
                this.multipleSelection.forEach(item => {
                    ids += 'ids=' + item.id + '&';
                });
                this.$notify.success({
                    title: '删除信息',
                    message: '删除职位中...',
                    showClose: false,
                    offset: 100,
                    duration: 4000,
                    customClass: 'fontclass'
                });
                this.deleteRequest("/system/basic/pos/" + ids).then(resp => {
                    if (resp) {
                        this.initPositions();
                    }
                })
            }).catch(() => {
                this.$notify.info({
                    title: '删除信息',
                    message: '取消删除中...',
                    showClose: false,
                    offset: 100,
                    duration: 4000,
                    customClass: 'fontclass'
                });
            });
        },
        /*批量删除的添加回调*/
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        /*添加*/
        addPosition() {
            if (this.pos.name) {
                this.$notify.success({
                    title: '添加信息',
                    message: '添加职位中...',
                    showClose: false,
                    offset: 100,
                    duration: 2000,
                    customClass: 'fontclass'
                });
                this.postRequest("/system/basic/pos/", this.pos).then(resp => {
                    if (resp) {
                        /*更新数据+清空列表*/
                        this.initPositions();
                        this.pos.name = '';
                    }
                })
            } else {
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
        showEditView(index, data) {
            //用于值得复原，更新前不改变原来的值
            /*用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）。*/
            Object.assign(this.updatePos, data);
            this.dialogVisible = true;
        },
        outUpdate() {
            this.$notify.info({
                title: '修改信息',
                message: '已取消修改操作',
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
                message: '更新职位中...',
                showClose: false,
                offset: 100,
                duration: 2000,
                customClass: 'fontclass'
            });
            this.putRequest("/system/basic/pos/", this.updatePos).then(resp => {
                if (resp) {
                    this.initPositions();
                    this.updatePos.name = '';
                    this.dialogVisible = false;
                }
            })
        },
        handleDelete(index, data) {
            this.$confirm('此操作将永久删除【' + data.name + '】职位, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$notify.success({
                    title: '删除信息',
                    message: '删除职位中...',
                    showClose: false,
                    offset: 100,
                    duration: 4000,
                    customClass: 'fontclass'
                });
                this.deleteRequest("/system/basic/pos/" + data.id).then(resp => {
                    if (resp) {
                        this.initPositions();
                    }
                })
            }).catch(() => {
                this.$notify.info({
                    title: '删除信息',
                    message: '已取消删除操作',
                    showClose: false,
                    offset: 100,
                    duration: 2000,
                    customClass: 'fontclass'
                });
            });
        },
        /*AJAX初始化*/
        initPositions() {
            setTimeout(() => {
            this.$notify.success({
                title: '系统信息',
                message: '职位信息加载中...',
                showClose: false,
                offset: 100,
                duration: 2000,
                customClass: 'fontclass'
            });
            }, 900);
            this.loading = true;
            this.getRequest("/system/basic/pos/").then(resp => {
                // this.loading = false;
                if (resp) {
                    this.loading = false;
                    this.positions = resp;
                }
            })
        }
    }
}
</script>

<style>
.fontclass {
    font-size: 35px;
    font-family: 站酷庆科黄油体;
}
.addPosInput {
    width: 300px;
    /* margin: 0px 0px; */
}
.updatePosInput {
    width: 200px;
    margin-left: 8px;
}
.posManaMain {
    margin-top: 10px;
}
</style>