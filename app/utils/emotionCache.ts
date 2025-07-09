import createCache from '@emotion/cache';

export default function createEmotionCache() {
  const cache = createCache({ 
    key: 'mui-css',
    prepend: true
    // 确保与服务端配置完全一致
  });

  // 如果在浏览器环境，尝试恢复服务端缓存状态
  if (typeof document !== 'undefined') {
    const emotionScript = document.getElementById('__EMOTION_CACHE_STATE__');
    if (emotionScript) {
      try {
        const emotionData = JSON.parse(emotionScript.textContent || '{}');
        
        console.log('🔍 服务端Emotion缓存数据:', emotionData);
        
        // 恢复已插入的样式ID
        if (emotionData.ids && Array.isArray(emotionData.ids)) {
          // 将ID数组转换为emotion期望的格式
          const insertedMap: Record<string, true> = {};
          emotionData.ids.forEach((id: string) => {
            insertedMap[id] = true;
          });
          
          cache.inserted = insertedMap;
          
          console.log('✅ 成功恢复emotion缓存状态:');
          console.log(`  - 恢复了 ${emotionData.ids.length} 个样式ID`);
          console.log('  - 样式ID示例:', emotionData.ids.slice(0, 5));
        } else {
          console.warn('⚠️ emotion缓存数据格式不正确:', emotionData);
        }
      } catch (error) {
        console.warn('❌ 恢复emotion缓存状态失败:', error);
      }
    } else {
      console.warn('⚠️ 未找到emotion缓存数据脚本');
    }
  }

  return cache;
}