<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      highlight-current-row
    >
      <el-table-column prop="id" align="center" label="ID" width="95">
      </el-table-column>
      <el-table-column label="任务标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="任务种类" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.task_kind }}</span>
        </template>
      </el-table-column>
      <el-table-column label="完成率" width="110" align="center">
        <template slot-scope="scope"> {{ scope.row.rate }}% </template>
      </el-table-column>
      <el-table-column
        class-name="status-col"
        label="任务状态"
        width="110"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.status | statusFilter">{{
            getStatus(scope.row.status)
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="描述" width="200">
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.description.length > 15"
            trigger="hover"
            placement="top"
          >
            <p>{{ scope.row.description }}</p>
            <div slot="reference">
              <span>{{ scope.row.description.substring(0, 15) }}...</span>
            </div>
          </el-popover>
          <span v-else>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="200">
        <template slot-scope="scope">
          {{ foarmatTime(scope.row.create_at) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间" width="200">
        <template slot-scope="scope">
          {{ foarmatTime(scope.row.update_at) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <a class="down-btn" :href="downloadFile(scope.row.id)" download=""
            >下载</a
          >
          <el-button type="text" @click="delTask(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList, downFile, delTask } from "@/api/table";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        2: "success",
        1: "gray",
        0: "info",
        3: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      list: null,
      listLoading: true,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    /* 格式化任务的状态 */
    getStatus(val) {
      switch (val) {
        case 0:
          return "未开始";
          break;
        case 1:
          return "进行中";
          break;

        case 2:
          return "已完成";
          break;

        case 3:
          return "失败";
          break;

        default:
          break;
      }
    },
    /* 格式化时间 */
    foarmatTime(time) {
      return time.replace("T", " ");
    },
    /* 查询列表数据 */
    fetchData() {
      this.listLoading = true;
      getList().then((response) => {
        this.list = response;
        this.listLoading = false;
      });
    },
    /* 获取下载文件的地址 */
    downloadFile(taskId) {
      return `${process.env.VUE_APP_BASE_API}/api/get_task_output?task_id=${taskId}`;
    },

    /* 删除任务 */
    delTask(id) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = {
            task_id: id,
          };
          delTask(params)
            .then(() => {
              this.fetchData();
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            })
            .catch(() => {
              this.fetchData();
              this.$message({
                type: "error",
                message: "删除失败 !",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>
<style scoped>
.down-btn {
  color: #409eff;
  margin-right: 10px;
}
.down-btn:hover {
  color: #66b1ff;
}
</style>