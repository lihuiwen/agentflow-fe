import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Paper,
  TextField,
} from '@mui/material';
import { Play } from 'lucide-react';
import { Agent } from '@/apis/model/Agents';

interface AgentExecutionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  agent: Agent;
}

interface ExecutionResult {
  id: string;
  taskName: string;
  status: 'completed' | 'running' | 'failed';
  progress: number;
  result?: string;
  duration?: string;
  error?: string;
}

// Mock large text result
const mockLargeResult = `执行结果详情:

数据分析报告
===============

概述:
本次任务成功完成了对目标数据集的全面分析，包含了数据收集、处理、模型训练和结果生成等多个环节。

详细结果:
1. 数据收集阶段
   - 成功收集数据记录: 1,245 条
   - 数据质量评分: 94.8/100
   - 数据完整性: 99.2%
   - 异常值检测: 发现并处理了 23 个异常值

2. 数据处理阶段
   - 数据清洗完成率: 100%
   - 特征工程: 提取了 47 个关键特征
   - 数据标准化: 应用 Z-score 标准化
   - 缺失值处理: 使用均值填补法处理 12 个缺失值

3. 模型训练阶段
   - 模型类型: 梯度提升决策树 (GBDT)
   - 训练样本数: 996 条 (80% 分割)
   - 验证样本数: 249 条 (20% 分割)
   - 训练时长: 2.3 秒
   - 收敛轮次: 127 轮

4. 模型性能评估
   - 准确率: 94.8%
   - 精确率: 93.2%
   - 召回率: 95.1%
   - F1分数: 94.1%
   - AUC值: 0.967

5. 特征重要性分析
   - 最重要特征: feature_1 (重要性: 0.234)
   - 次重要特征: feature_23 (重要性: 0.187)
   - 第三重要特征: feature_7 (重要性: 0.156)
   - 其他特征重要性均匀分布

6. 预测结果统计
   - 正样本预测: 423 个
   - 负样本预测: 622 个
   - 置信度 > 0.9 的预测: 857 个 (68.8%)
   - 置信度 > 0.8 的预测: 1,098 个 (88.2%)

7. 业务建议
   - 建议关注 feature_1 和 feature_23 的变化趋势
   - 可以进一步收集相关特征数据来提升模型性能
   - 模型可以投入生产环境使用
   - 建议每月重新训练一次模型以保持性能

8. 技术细节
   - 使用算法: XGBoost 3.1.1
   - 超参数优化: 贝叶斯优化，迭代 50 次
   - 交叉验证: 5折交叉验证
   - 正则化: L1=0.01, L2=0.1
   - 学习率: 0.1，衰减策略: 指数衰减

结论:
本次任务圆满完成，模型性能达到预期目标，可以为业务决策提供可靠支持。建议后续持续监控模型表现，并根据新数据及时调整模型参数。`;

const AgentExecutionDialog: React.FC<AgentExecutionDialogProps> = ({
  open,
  onClose,
  onConfirm,
  agent
}) => {
  const [isConfirming, setIsConfirming] = useState(false);


  const handleConfirm = async () => {
    setIsConfirming(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsConfirming(false);
    onConfirm();
  };


  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Play className="w-6 h-6 text-blue-600" />
          <Typography variant="h6" component="div">
            Agent 执行结果
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {agent?.agentName} - 执行任务详情
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* Large Text Result Section */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            执行结果详情
          </Typography>
          <Paper
            elevation={1}
            sx={{
              p: 0,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
              backgroundColor: 'grey.50'
            }}
          >
            <TextField
              multiline
              value={mockLargeResult}
              variant="outlined"
              fullWidth
              InputProps={{
                readOnly: true,
                sx: {
                  fontSize: '0.875rem',
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  lineHeight: 1.6,
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  }
                }
              }}
              sx={{
                '& .MuiInputBase-input': {
                  color: 'text.primary',
                  cursor: 'text'
                }
              }}
              rows={12}
              placeholder="执行结果将在这里显示..."
            />
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
        >
          关闭
        </button>
        <button
          onClick={handleConfirm}
          className={'px-6 py-2 rounded-lg transition-colors font-medium bg-green-600 hover:bg-green-700 text-white'}
        >
          确认选择
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default AgentExecutionDialog;