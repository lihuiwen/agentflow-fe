import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Box, Fade, Zoom, Container } from '@mui/material';
import { Plus, TrendingUp, Zap, Sparkles, BarChart3, Rocket, Star, Users, ArrowRight } from 'lucide-react';

const JobHero: React.FC = () => {
  return (
    <Fade in={true} timeout={800}>
      <Box className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-3xl mb-12 overflow-hidden shadow-2xl">
        {/* 背景装饰层 */}
        <div className="absolute inset-0">
          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-800/20 via-transparent to-blue-400/10"></div>
        </div>
        
        {/* 浮动光球效果 */}
        <div className="absolute top-10 right-20 w-32 h-32 bg-gradient-to-br from-white/20 to-blue-300/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 left-16 w-24 h-24 bg-gradient-to-br from-purple-300/20 to-white/10 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 left-10 w-16 h-16 bg-gradient-to-br from-yellow-300/30 to-white/20 rounded-full blur-md animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* 装饰星点 */}
        <div className="absolute top-12 left-1/4 w-2 h-2 bg-white rounded-full animate-ping opacity-70"></div>
        <div className="absolute top-20 right-1/3 w-1 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
        <div className="absolute bottom-16 left-1/3 w-1.5 h-1.5 bg-blue-200 rounded-full animate-ping opacity-50"></div>
        <div className="absolute bottom-24 right-1/4 w-1 h-1 bg-white rounded-full animate-bounce"></div>
        
        <Container maxWidth="lg" className="relative px-8 py-20 pb-[20px] text-center text-white">
          {/* 状态徽章 */}
          <Zoom in={true} timeout={1000}>
            <Box className="inline-flex items-center gap-3 px-6 py-3 bg-white/15 backdrop-blur-md rounded-full mb-8 border border-white/30 shadow-lg hover:bg-white/20 transition-all duration-300">
              <Zap size={18} className="text-yellow-300" />
              <Typography variant="body2" className="font-semibold text-white">
                AI-Powered Task Platform
              </Typography>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-blue-300 rounded-full animate-ping"></div>
              </div>
            </Box>
          </Zoom>
          
          {/* 主标题 */}
          <Box className="mb-8">
            <Typography 
              variant="h1" 
              className="font-black text-6xl md:text-7xl lg:text-8xl mb-6 tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #e0f2fe 50%, #b3e5fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 4px 20px rgba(255,255,255,0.3)'
              }}
            >
              Protocol
            </Typography>
            
            {/* 装饰分割线 */}
            <div className="flex justify-center items-center gap-4 mb-6">
              <Sparkles size={22} className="text-yellow-300 animate-spin" />
              <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-white/70 to-transparent"></div>
              <Star size={18} className="text-blue-200 animate-pulse" />
              <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-white/70 to-transparent"></div>
              <Sparkles size={22} className="text-purple-300 animate-spin" style={{ animationDirection: 'reverse' }} />
            </div>
          </Box>
          
          {/* 副标题 - 修改为两行居中显示 */}
          <Box className="mb-12 max-w-4xl mx-auto">
            <Typography 
              variant="h4" 
              className="font-light leading-relaxed text-blue-50 mb-2"
            >
              智能任务协作中心
            </Typography>
            <Typography 
              variant="h5" 
              className="font-light leading-relaxed text-blue-100"
            >
              发布任务，让 AI Agent 高效竞标完成
            </Typography>
          </Box>
          
          {/* 主要操作按钮 - 优化样式 */}
          <Box className="flex justify-center gap-8 flex-wrap mb-16">
            <Button 
              variant="contained" 
              size="large"
              startIcon={<Plus size={24} />}
              endIcon={<ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />}
              component={Link}
              to="new"
              className="group rounded-2xl px-14 py-5 font-bold text-xl transform hover:scale-110 transition-all duration-300"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(12px)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                boxShadow: '0 8px 32px rgba(255,255,255,0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  borderColor: 'rgba(255,255,255,0.5)',
                  boxShadow: '0 12px 40px rgba(255,255,255,0.2), 0 8px 16px rgba(255,255,255,0.1)',
                  color: 'white',
                }
              }}
            >
              发布新任务
            </Button>
            
            <Button 
              variant="outlined" 
              size="large"
              startIcon={<BarChart3 size={24} />}
              endIcon={<TrendingUp size={20} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />}
              className="group rounded-2xl px-14 py-5 font-bold text-xl transform hover:scale-110 transition-all duration-300"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(12px)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.4)',
                boxShadow: '0 8px 32px rgba(255,255,255,0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderColor: 'rgba(255,255,255,0.6)',
                  boxShadow: '0 12px 40px rgba(255,255,255,0.15), 0 8px 16px rgba(255,255,255,0.08)',
                  color: 'white',
                }
              }}
            >
              查看统计
            </Button>
          </Box>
        </Container>
      </Box>
    </Fade>
  );
};

export default JobHero;