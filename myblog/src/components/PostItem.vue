<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import type { ComponentSize, FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import Vditor from 'vditor';
import 'vditor/dist/index.css';

interface RuleForm {
  date: string;
  title: string;
  content: string;
}

const formSize = ref<ComponentSize>('default');
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  date: '',
  title: '',
  content: ''
});

const rules = reactive<FormRules<RuleForm>>({
  date: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a date',
      trigger: 'change'
    }
  ],
  title: [{ required: true, message: 'Please input title', trigger: 'blur' }],
  content: [{ required: true, message: 'Please input content', trigger: 'blur' }]
});

const dataStore = useDataStore();

const formatDateTime = (date: string): string => {
  const selectedDate = new Date(date);
  const currentTime = new Date();

  selectedDate.setHours(currentTime.getHours());
  selectedDate.setMinutes(currentTime.getMinutes());
  selectedDate.setSeconds(currentTime.getSeconds());

  const year = selectedDate.getFullYear().toString();
  const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
  const day = selectedDate.getDate().toString().padStart(2, '0');
  const hours = selectedDate.getHours().toString().padStart(2, '0');
  const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
  const seconds = selectedDate.getSeconds().toString().padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

let vditor: Vditor | undefined;

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  if (vditor) {
    vditor.setValue(''); // 清空 Vditor 的内容
  }
};

const source = ref<string>('diarydb'); // 添加 source 变量

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        const formattedDate = formatDateTime(ruleForm.date);
        console.log(formattedDate);
        await dataStore.addItem(source.value, {
          date: formattedDate,
          title: ruleForm.title,
          content: ruleForm.content
        });
        resetForm(formEl);
        ElMessage({
          message: 'Congrats, this is a success message.',
          type: 'success'
        });
      } catch (error) {
        console.error('Error posting Item:', error);
      }
    } else {
      console.log('error submit!', fields);
    }
  });
};

// 初始化 Vditor
onMounted(() => {
  vditor = new Vditor('vditor', {
    height: 360,
    cache: {
      id: 'vditorCache'
    },
    after: () => {
      vditor!.setValue(ruleForm.content);
    },
    input: (value: string) => {
      ruleForm.content = value;
    }
  });
});
</script>

<template>
  <el-form
    ref="ruleFormRef"
    style="max-width: 600px"
    :model="ruleForm"
    :rules="rules"
    label-width="auto"
    class="demo-ruleForm"
    :size="formSize"
    status-icon
  >
    <el-row gutter="20">
      <el-col :span="12">
        <el-form-item label="Date" required>
          <el-date-picker
            v-model="ruleForm.date"
            type="date"
            aria-label="Pick a date"
            placeholder="Pick a date"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Post to" required>
          <el-select v-model="source" placeholder="Select source" style="width: 100%">
            <el-option label="DiaryDB" value="diarydb"></el-option>
            <el-option label="DebugLog" value="debuglog"></el-option>
            <el-option label="IELTS" value="ielts"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="Title" prop="title">
      <el-input v-model="ruleForm.title" />
    </el-form-item>
    <el-form-item label="Content" prop="content" label-position="top">
      <div id="vditor"></div>
      <!-- 用于初始化 Vditor 的 div -->
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)"> Create </el-button>
      <el-button @click="resetForm(ruleFormRef)">clear</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>
#vditor {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.vditor-reset {
  padding: 10px 10px !important;
}
</style>
