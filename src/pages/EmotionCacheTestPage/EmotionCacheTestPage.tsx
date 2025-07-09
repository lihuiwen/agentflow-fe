import React, { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  Avatar,
  LinearProgress,
  Paper,
  IconButton,
  Tooltip,
  Switch,
  Slider,
  Container,
  Alert,
  AlertTitle,
} from '@mui/material';

// 模拟数据
const generateMockData = (count: number) => 
  Array.from({ length: count }, (_, i) => ({
    id: i,
    title: `复杂组件 ${i + 1}`,
    description: `这是一个包含大量样式的复杂组件示例 ${i + 1}`,
    status: ['active', 'pending', 'completed'][i % 3],
    priority: ['high', 'medium', 'low'][i % 3],
    // 使用固定的进度值，而不是随机数，避免SSR水合不匹配
    progress: [65, 80, 45, 90, 30, 75, 55, 95, 20, 85, 60, 40, 70, 25, 88, 35, 92, 50, 78, 15][i % 20],
    // 使用固定的头像，避免外部API调用问题
    avatar: '', // 移除外部API调用
  }));

const EmotionCacheTestPage: React.FC = () => {
  const [switchStates, setSwitchStates] = useState<Record<number, boolean>>({});
  const [sliderValues, setSliderValues] = useState<Record<number, number>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [emotionElementCount, setEmotionElementCount] = useState(0);
  
  const mockData = generateMockData(20);

  // 模拟客户端加载延迟，会导致更明显的闪烁
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // 计算页面中data-emotion属性的元素数量
  useEffect(() => {
    const timer = setTimeout(() => {
      const emotionElements = document.querySelectorAll('[data-emotion]');
      setEmotionElementCount(emotionElements.length);
    }, 1000); // 等待页面完全加载后计算

    return () => clearTimeout(timer);
  }, [isLoaded]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4 
    }}>
      <Container maxWidth="xl">
        {/* 页面标题区域 - 包含大量动态样式 */}
        <Paper 
          elevation={10}
          sx={{
            p: 4,
            mb: 4,
            background: isLoaded 
              ? 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
              : '#f5f5f5',
            color: isLoaded ? 'white' : '#333',
            borderRadius: '20px',
            transform: isLoaded ? 'scale(1)' : 'scale(0.95)',
            transition: 'all 0.8s ease-in-out',
            boxShadow: isLoaded 
              ? '0 15px 35px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.07)'
              : '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <Stack spacing={2}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 'bold',
                textShadow: isLoaded ? '2px 2px 4px rgba(0,0,0,0.3)' : 'none',
                transform: isLoaded ? 'translateY(0)' : 'translateY(-30px)',
                opacity: isLoaded ? 1 : 0.5,
                transition: 'all 1s ease-out',
              }}
            >
              🎭 Emotion缓存测试页面
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateX(0)' : 'translateX(-50px)',
                transition: 'all 1.2s ease-out 0.3s',
              }}
            >
              测试Emotion缓存优化对FOUC问题的改善效果
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateX(0)' : 'translateX(-30px)',
                transition: 'all 1s ease-out 0.6s',
              }}
            >
              🚨 请注意观察页面加载时的样式变化和闪烁效果
            </Typography>
          </Stack>
        </Paper>

        {/* Emotion缓存效果说明 */}
        <Alert 
          severity="info" 
          sx={{ 
            mb: 4, 
            borderRadius: '15px',
            transform: isLoaded ? 'translateY(0)' : 'translateY(-20px)',
            opacity: isLoaded ? 1 : 0.7,
            transition: 'all 0.8s ease-out 0.5s',
          }}
        >
          <AlertTitle sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
            📊 Emotion缓存优化效果实测
          </AlertTitle>
          <Stack spacing={1}>
            <Typography variant="body2">
              <strong>🔍 测试结果对比：</strong>
            </Typography>
            <Typography variant="body2">
              • <strong>未优化：</strong>客户端渲染元素包含约 <strong>3000个</strong> data-emotion属性
            </Typography>
            <Typography variant="body2">
              • <strong>已优化：</strong>客户端渲染元素包含约 <strong>2000个</strong> data-emotion属性
            </Typography>
            <Typography variant="body2">
              • <strong>当前页面：</strong>检测到 <strong>{emotionElementCount}</strong> 个data-emotion元素
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
              💡 通过恢复服务端缓存状态，减少了约33%的重复样式注入，显著改善FOUC问题
            </Typography>
          </Stack>
        </Alert>

        {/* 复杂组件网格 - 大量动态样式 */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 3,
          }}
        >
          {mockData.map((item, index) => (
            <Card
              key={item.id}
              sx={{
                height: '100%',
                borderRadius: '15px',
                transform: isLoaded ? 'translateY(0)' : 'translateY(80px)',
                opacity: isLoaded ? 1 : 0.3,
                transition: `all 0.8s ease-out ${index * 0.1}s`,
                background: isLoaded 
                  ? `linear-gradient(135deg, ${getPriorityColor(item.priority)}22 0%, ${getPriorityColor(item.priority)}44 100%)`
                  : '#ffffff',
                border: isLoaded ? `3px solid ${getPriorityColor(item.priority)}` : '1px solid #e0e0e0',
                boxShadow: isLoaded 
                  ? `0 10px 30px ${getPriorityColor(item.priority)}33`
                  : '0 2px 4px rgba(0,0,0,0.1)',
                '&:hover': {
                  transform: isLoaded ? 'translateY(-10px) scale(1.03)' : 'none',
                  boxShadow: isLoaded 
                    ? `0 20px 40px ${getPriorityColor(item.priority)}44`
                    : '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                }
              }}
            >
              <CardContent>
                {/* 头部信息 */}
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <Avatar 
                    sx={{
                      width: isLoaded ? 60 : 40,
                      height: isLoaded ? 60 : 40,
                      transition: 'all 0.6s ease',
                      border: isLoaded ? `3px solid ${getPriorityColor(item.priority)}` : 'none',
                      transform: isLoaded ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.8)',
                      backgroundColor: getPriorityColor(item.priority),
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: isLoaded ? '1.2rem' : '1rem',
                    }}
                  >
                    {item.id.toString().padStart(2, '0')}
                  </Avatar>
                  <Box flex={1}>
                    <Typography 
                      variant="h6" 
                      sx={{
                        fontWeight: 'bold',
                        color: isLoaded ? getPriorityColor(item.priority) : '#999',
                        fontSize: isLoaded ? '1.25rem' : '1rem',
                        transition: 'all 0.8s ease',
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Stack direction="row" spacing={1} mt={1}>
                      <Chip 
                        label={item.status}
                        color={getStatusColor(item.status) as any}
                        size="small"
                        sx={{
                          fontWeight: 'bold',
                          transform: isLoaded ? 'scale(1)' : 'scale(0.5)',
                          opacity: isLoaded ? 1 : 0.5,
                          transition: `all 0.6s ease ${index * 0.05}s`,
                        }}
                      />
                      <Chip 
                        label={item.priority}
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: getPriorityColor(item.priority),
                          color: getPriorityColor(item.priority),
                          transform: isLoaded ? 'scale(1)' : 'scale(0.5)',
                          opacity: isLoaded ? 1 : 0.5,
                          transition: `all 0.6s ease ${index * 0.05 + 0.2}s`,
                        }}
                      />
                    </Stack>
                  </Box>
                </Stack>

                {/* 进度条 */}
                <Box mb={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        opacity: isLoaded ? 1 : 0,
                        transition: 'opacity 0.8s ease',
                      }}
                    >
                      进度
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: getPriorityColor(item.priority),
                        fontSize: isLoaded ? '0.875rem' : '0.75rem',
                        transition: 'all 0.6s ease',
                      }}
                    >
                      {item.progress}%
                    </Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={isLoaded ? item.progress : 0}
                    sx={{
                      height: isLoaded ? 10 : 6,
                      borderRadius: 5,
                      backgroundColor: `${getPriorityColor(item.priority)}22`,
                      transition: 'height 0.6s ease',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getPriorityColor(item.priority),
                        borderRadius: 5,
                        transition: 'transform 1.5s ease-out',
                      }
                    }}
                  />
                </Box>

                {/* 描述文本 */}
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{
                    opacity: isLoaded ? 1 : 0,
                    transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                    fontSize: isLoaded ? '0.875rem' : '0.75rem',
                    lineHeight: isLoaded ? 1.5 : 1.2,
                    transition: `all 0.8s ease ${index * 0.08}s`,
                  }}
                >
                  {item.description}
                </Typography>

                {/* 交互控件 */}
                <Stack direction="row" spacing={2} mt={2} alignItems="center">
                  <Switch
                    checked={switchStates[item.id] || false}
                    onChange={(e) => setSwitchStates(prev => ({
                      ...prev,
                      [item.id]: e.target.checked
                    }))}
                    sx={{
                      transform: isLoaded ? 'scale(1)' : 'scale(0.7)',
                      opacity: isLoaded ? 1 : 0.5,
                      transition: 'all 0.6s ease',
                      '& .MuiSwitch-thumb': {
                        backgroundColor: switchStates[item.id] 
                          ? getPriorityColor(item.priority) 
                          : '#fafafa',
                        transition: 'all 0.3s ease',
                      },
                      '& .MuiSwitch-track': {
                        backgroundColor: `${getPriorityColor(item.priority)}44`,
                      }
                    }}
                  />
                  <Box flex={1}>
                    <Slider
                      value={sliderValues[item.id] || 30}
                      onChange={(_, value) => setSliderValues(prev => ({
                        ...prev,
                        [item.id]: value as number
                      }))}
                      size="small"
                      sx={{
                        color: getPriorityColor(item.priority),
                        opacity: isLoaded ? 1 : 0.3,
                        transition: 'opacity 0.8s ease',
                        '& .MuiSlider-thumb': {
                          transform: isLoaded ? 'scale(1)' : 'scale(0.5)',
                          transition: 'transform 0.6s ease',
                        }
                      }}
                    />
                  </Box>
                </Stack>
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Stack direction="row" spacing={1}>
                  <IconButton 
                    size="small"
                    sx={{
                      color: getPriorityColor(item.priority),
                      transform: isLoaded ? 'scale(1)' : 'scale(0)',
                      opacity: isLoaded ? 1 : 0,
                      transition: `all 0.5s ease ${index * 0.05}s`,
                      '&:hover': {
                        backgroundColor: `${getPriorityColor(item.priority)}22`,
                        transform: 'scale(1.3)',
                      }
                    }}
                  >
                    ❤️
                  </IconButton>
                  <IconButton 
                    size="small"
                    sx={{
                      color: getPriorityColor(item.priority),
                      transform: isLoaded ? 'scale(1)' : 'scale(0)',
                      opacity: isLoaded ? 1 : 0,
                      transition: `all 0.5s ease ${index * 0.05 + 0.1}s`,
                      '&:hover': {
                        backgroundColor: `${getPriorityColor(item.priority)}22`,
                        transform: 'scale(1.3)',
                      }
                    }}
                  >
                    🔗
                  </IconButton>
                </Stack>
                <Button 
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: getPriorityColor(item.priority),
                    borderRadius: '20px',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: isLoaded ? '0.875rem' : '0.75rem',
                    padding: isLoaded ? '6px 16px' : '4px 12px',
                    opacity: isLoaded ? 1 : 0,
                    transform: isLoaded ? 'translateX(0) scale(1)' : 'translateX(30px) scale(0.8)',
                    transition: `all 0.8s ease ${index * 0.06}s`,
                    '&:hover': {
                      backgroundColor: getPriorityColor(item.priority),
                      transform: 'translateX(0) scale(1.1)',
                      boxShadow: `0 6px 20px ${getPriorityColor(item.priority)}66`,
                    }
                  }}
                >
                  查看详情
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>

        {/* 技术说明信息 */}
        <Paper 
          sx={{ 
            mt: 4, 
            p: 3, 
            borderRadius: '15px',
            background: isLoaded 
              ? 'linear-gradient(45deg, #ff6b6b, #4ecdc4)'
              : '#f8f9fa',
            color: isLoaded ? 'white' : '#666',
            transform: isLoaded ? 'translateY(0)' : 'translateY(50px)',
            opacity: isLoaded ? 1 : 0.5,
            transition: 'all 1s ease-out 1s',
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            🔧 Emotion缓存优化技术说明
          </Typography>
          <Stack spacing={2}>
            <Alert severity="warning" sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                ❌ 未优化情况（自动配置）
              </Typography>
              <Typography variant="body2">
                • MUI组件样式需要在客户端重新计算和注入<br/>
                • 产生约3000个data-emotion元素<br/>
                • 出现明显的FOUC（Flash of Unstyled Content）现象
              </Typography>
            </Alert>
            
            <Alert severity="success" sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                ✅ 优化后情况（手动缓存配置）
              </Typography>
              <Typography variant="body2">
                • 恢复服务端emotion缓存状态<br/>
                • 减少重复样式注入，仅产生约2000个data-emotion元素<br/>
                • 显著减少样式闪烁，提升用户体验
              </Typography>
            </Alert>

            <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2 }}>
              🧪 测试方法：
            </Typography>
            <Typography variant="body2">
              1. 刷新页面观察样式加载过程<br/>
              2. 打开开发者工具检查data-emotion元素数量<br/>
              3. 对比启用/禁用缓存优化的效果差异<br/>
              4. 启用/禁用缓存优化：修改 app/utils/emotionCache.ts 文件第9-41行代码<br/>
              &nbsp;&nbsp;&nbsp;• 注释掉第9-41行 = 禁用优化（显示3000个元素）<br/>
              &nbsp;&nbsp;&nbsp;• 保留第9-41行 = 启用优化（显示2000个元素）
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default EmotionCacheTestPage; 