<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="任务标题" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="任务类型" prop="task_kind">
        <el-col :span="11">
          <el-select
            v-model="form.task_kind"
            placeholder="请选择任务类型"
            style="width: 100%"
          >
            <el-option label="积雨出图" value="积雨出图" />
            <el-option label="积温出图" value="积温出图" />
            <el-option label="土壤属性出图" value="土壤属性出图" />
            <el-option label="蓄冷量出图" value="蓄冷量出图" />
            <el-option label="年平均总辐射量出图" value="年平均总辐射量出图" />
            <el-option label="DEM出图" value="DEM出图" />
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item
        v-if="form.task_kind === '土壤属性出图'"
        label="土壤属性"
        prop="soil_parameter"
      >
        <el-col :span="11">
          <el-select
            v-model="form.soil_parameter"
            placeholder="请选择土壤属性"
            style="width: 100%"
          >
            <el-option label="速效钾  mg/kg" value="AK" />
            <el-option label="速效氮  mg/kg" value="AN" />
            <el-option label="速效磷  mg/kg" value="AP" />
            <el-option label="pH值" value="PH" />
            <el-option label="有机质  %" value="SOM" />
            <el-option label="全氮  %" value="TN" />
            <el-option label="全磷  %" value="TP" />
            <el-option label="全钾  %" value="TK" />
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item
        v-if="form.task_kind === 'DEM出图'"
        label="高程属性"
        prop="DEM_parameter"
      >
        <el-col :span="11">
          <el-select
            v-model="form.DEM_parameter"
            placeholder="请选择高程属性"
            style="width: 100%"
          >
            <el-option label="坡度" value="slope" />
            <el-option label="高度" value="altitude" />
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="任务地区" prop="district_name">
        <el-col :span="11">
          <!-- multiple -->
          <el-select
            v-model="form.adcode"
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethod"
            :loading="loading"
            @change="changeDistrict"
            placeholder="请输入搜索地区"
            style="width: 100%"
          >
            <el-option
              v-for="item in options"
              :key="item.adcode"
              :label="item.parent + item.name"
              :value="item.adcode"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item
        v-if="
          form.task_kind !== '土壤属性出图' &&
          form.task_kind !== '年平均总辐射量出图' &&
          form.task_kind !== 'DEM出图'
        "
        label="开始时间"
        prop="time_start"
      >
        <el-col :span="11">
          <el-date-picker
            v-model="form.time_start"
            type="date"
            placeholder="请选择开始时间"
            value-format="yyyyMMdd"
            style="width: 100%"
          />
        </el-col>
      </el-form-item>
      <el-form-item
        v-if="
          form.task_kind !== '土壤属性出图' &&
          form.task_kind !== '年平均总辐射量出图' &&
          form.task_kind !== 'DEM出图'
        "
        label="结束时间"
        prop="time_end"
      >
        <el-col :span="11">
          <el-date-picker
            v-model="form.time_end"
            type="date"
            placeholder="请选择结束时间"
            style="width: 100%"
            value-format="yyyyMMdd"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="任务描述" prop="description">
        <el-input type="textarea" :rows="8" v-model="form.description" />
      </el-form-item>
      <el-form-item>
        <el-button @click="onCancel">清空</el-button>
        <el-button type="primary" @click="onSubmit">创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getDistricts, createTask } from "@/api/table";

export default {
  data() {
    return {
      form: {
        title: "",
        task_kind: "",
        time_start: "",
        time_end: "",
        district_name: "",
        parent_name: "",
        description: "",
        adcode: "",
      },
      loading: false,
      options: [],
    };
  },
  methods: {
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        let params = {
          name: query,
          level: null,
        };
        getDistricts(params).then((res) => {
          this.loading = false;
          this.options = res;
        });
      } else {
        this.options = [];
      }
    },
    changeDistrict(val) {
      this.options.forEach((item) => {
        if (item.adcode == val) {
          this.form.district_name = item.name;
          this.form.parent_name = item.parent;
        }
      });
    },
    /* 提交任务 */
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.task_kind === "蓄冷量出图") {
            this.form.cold_flag = true;
          }
          if (this.form.task_kind === "土壤属性出图") {
            this.form.time_start = null;
            this.form.time_end = null;
          }
          if (this.form.task_kind === "年平均总辐射量出图") {
            this.form.avgRad = 1;
            this.form.time_start = null;
            this.form.time_end = null;
          }
          if (this.form.task_kind === "DEM出图") {
            this.form.time_start = null;
            this.form.time_end = null;
          }
          createTask(this.form).then((res) => {
            this.$message({ type: "success", message: "提交成功!" });
            this.$router.push({ name: "Table" });
          });
        }
      });
    },
    onCancel() {
      this.$refs["form"].resetFields();
    },
  },
};
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

