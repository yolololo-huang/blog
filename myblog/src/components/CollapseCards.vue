<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { Delete, Edit, Check } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import MarkdownIt from 'markdown-it';
import markdownItHighlight from 'markdown-it-highlightjs'; // 用于代码高亮

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
}).use(markdownItHighlight);

// 接收父组件传递的 source 参数
const props = defineProps<{ source: string }>();

const boldTextRegex = /\*\*(.*?)\*\*/g;

const activeNames = ref<string[]>([]);
const itemStore = useDataStore();
const editMode = ref<Record<string, boolean>>({});
const tempContent = ref<Record<string, string>>({});
const tempTitle = ref<Record<string, string>>({});
const vditorInstances = ref<Record<string, Vditor>>({});

const formatDateString = (dateString: string): string => {
  const year = dateString.slice(0, 4);
  const month = parseInt(dateString.slice(4, 6), 10);
  const day = parseInt(dateString.slice(6, 8), 10);
  const hour = dateString.slice(8, 10);
  const minute = dateString.slice(10, 12);

  return `${year}/${month}/${day} ${hour}:${minute}`;
};

const sortedItems = computed(() => {
  return [...itemStore.Items]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((item) => {
      const matches = [...item.content.matchAll(boldTextRegex)];
      const boldTexts = matches.map((match) => match[1]);
      return {
        ...item,
        formattedDate: formatDateString(item.date),
        boldTexts,
        renderedContent: md.render(item.content)
      };
    });
});

const updateItem = async (date: string) => {
  try {
    const newContent = tempContent.value[date];
    const newTitle = tempTitle.value[date];
    await itemStore.modifyItem(props.source, date, newContent, newTitle);
    ElMessage({
      type: 'success',
      message: 'Item updated successfully',
    });
    editMode.value[date] = false;
  } catch (error) {
    ElMessage({
      type: 'error',
      message: 'Failed to update item',
    });
  }
};

const deleteItem = async (date: string) => {
  try {
    await itemStore.removeItem(props.source, date);
    ElMessage({
      type: 'success',
      message: 'Item deleted successfully',
    });
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage({
        type: 'error',
        message: 'Failed to delete item',
      });
    }
  }
};

const enterEditMode = (date: string, title: string, content: string) => {
  editMode.value[date] = true;
  tempContent.value[date] = content;
  tempTitle.value[date] = title;

  setTimeout(() => {
    const vditor = new Vditor(`vditor-${date}`, {
      height: 300,
      cache: {
        id: `vditorCache-${date}`,
      },
      after: () => {
        vditor.setValue(content);
      },
      input: (value: string) => {
        tempContent.value[date] = value;
      },
    });

    vditorInstances.value[date] = vditor;
  }, 0);
};

onMounted(() => {
  itemStore.fetchItems(props.source);
  itemStore.Items.forEach((item) => {
    editMode.value[item.date] = false;
    tempContent.value[item.date] = item.content;
    tempTitle.value[item.date] = item.title;
  });
});
</script>

<template>
  <div class="demo-timeline">
    <el-timeline>
      <el-timeline-item
        v-for="(item, index) in sortedItems"
        :key="index"
        :timestamp="item.formattedDate"
      >
        <el-collapse v-model="activeNames">
          <el-collapse-item :name="String(index)">
            <template #title>
              <span>{{ item.title }}</span>
              <div class="tags-container">
                <el-check-tag
                  v-for="(boldText, idx) in item.boldTexts"
                  :key="idx"
                  :checked="true"
                  class="custom-check-tag"
                >
                  {{ boldText }}
                </el-check-tag>
              </div>
            </template>
            <div v-if="editMode[item.date]">
              <el-input v-model="tempTitle[item.date]" placeholder="Edit title"></el-input>
              <div :id="`vditor-${item.date}`"></div>
              <el-button
                @click="updateItem(item.date)"
                size="small"
                type="primary"
                :icon="Check"
              ></el-button>
            </div>
            <div v-else>
              <div class="markdown-body" v-html="item.renderedContent"></div>
              <div style="display: flex; align-items: center; margin-top: 10px">
                <el-button
                  @click="enterEditMode(item.date, item.title, item.content)"
                  size="small"
                  type="primary"
                  :icon="Edit"
                ></el-button>
                <el-popconfirm
                  title="Are you sure to delete this?"
                  @confirm="deleteItem(item.date)"
                >
                  <template #reference>
                    <el-button size="small" type="primary" :icon="Delete"></el-button>
                  </template>
                </el-popconfirm>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<style scoped>
.el-timeline {
  padding-left: 0px !important;
}

.vditor {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap:2px;
  margin-left: 4px;
}

.custom-check-tag {
  padding: 2px 8px; /* 控制标签的大小 */
  border-radius: 6px; /* 控制标签的圆角 */
  font-size: 12px; /* 控制字体大小 */
  margin-right: 2px; /* 控制标签之间的间距 */
}
.markdown-body {
  font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji;
  font-size: 12px;
  line-height: 1.5;
  word-wrap: break-word;
}

.markdown-body pre {
  background-color: #cbe1f7;
  border-radius: 3px;
  font-size: 85%;
  line-height: 1.45;
  overflow: auto;
  padding: 16px;
}

.markdown-body code {
  background-color: rgba(37, 78, 119, 0.714);
  border-radius: 3px;
  font-size: 90%;
  margin: 0;
  padding: .2em .4em;
}

.markdown-body blockquote {
  border-left: 4px solid #dfe2e5;
  color: #6a737d;
  padding: 0 1em;
  margin: 0;
  background-color: #f9f9f9;
}

</style>
