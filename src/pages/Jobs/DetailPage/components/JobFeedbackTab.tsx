import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Rating,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { Star } from 'lucide-react';
import { Feedback, FeedbackStats } from '@apis/model/Feedback';
import { formatDate } from '../utils';

interface JobFeedbackTabProps {
  feedbacks: Feedback[];
  feedbackStats?: FeedbackStats;
  feedbacksLoading: boolean;
  onAddFeedback: () => void;
  isSubmitting?: boolean;
}

const JobFeedbackTab: React.FC<JobFeedbackTabProps> = ({
  feedbacks,
  feedbackStats,
  feedbacksLoading,
  onAddFeedback,
  isSubmitting
}) => {
  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          反馈评价
        </Typography>
        <Button 
          variant="contained"
          onClick={onAddFeedback}
          className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? '提交中...' : '添加反馈'}
        </Button>
      </Box>

      {/* 反馈统计概览 */}
      {feedbackStats && (
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                评分统计
              </Typography>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {feedbackStats.averageRating.toFixed(1)}
                </Typography>
                <Box>
                  <Rating value={feedbackStats.averageRating} readOnly precision={0.1} />
                  <Typography variant="body2" color="text.secondary">
                    基于 {feedbackStats.totalFeedbacks} 条反馈
                  </Typography>
                </Box>
              </Box>
              
              {/* 评分分布 */}
              <Box>
                {[5, 4, 3, 2, 1].map((star) => (
                  <Box key={star} display="flex" alignItems="center" gap={1} mb={0.5}>
                    <Typography variant="body2" width={20}>{star}</Typography>
                    <Star size={16} fill="currentColor" />
                    <LinearProgress 
                      variant="determinate" 
                      value={(feedbackStats.ratingDistribution[star as keyof typeof feedbackStats.ratingDistribution] / feedbackStats.totalFeedbacks) * 100}
                      sx={{ 
                        flex: 1, 
                        height: 6, 
                        borderRadius: 3,
                        backgroundColor: 'grey.200'
                      }}
                    />
                    <Typography variant="body2" width={30}>
                      {feedbackStats.ratingDistribution[star as keyof typeof feedbackStats.ratingDistribution]}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {feedbackStats.dimensionAverages && (
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  维度评分
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  {Object.entries(feedbackStats.dimensionAverages).map(([key, value]) => (
                    <Box key={key}>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography variant="body2">
                          {key === 'quality' ? '质量' : 
                           key === 'communication' ? '沟通' :
                           key === 'timeliness' ? '及时性' : '专业性'}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {value.toFixed(1)}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(value / 5) * 100}
                        sx={{ height: 8, borderRadius: 4 }}
                        color={value >= 4 ? 'success' : value >= 3 ? 'warning' : 'error'}
                      />
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      {/* 反馈列表 */}
      {feedbacksLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : feedbacks.length === 0 ? (
        <Alert severity="info">
          暂无反馈，成为第一个评价的用户吧！
        </Alert>
      ) : (
        <List>
          {feedbacks.map((feedback) => (
            <React.Fragment key={feedback.id}>
              <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {feedback.isAnonymous ? '匿' : feedback.userName.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {feedback.isAnonymous ? '匿名用户' : feedback.userName}
                      </Typography>
                      <Rating value={feedback.rating} readOnly size="small" />
                      <Chip 
                        label={
                          feedback.feedbackType === 'quality' ? '质量' :
                          feedback.feedbackType === 'communication' ? '沟通' :
                          feedback.feedbackType === 'timeline' ? '时间' : '综合'
                        }
                        size="small"
                        variant="outlined"
                      />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(feedback.createdAt)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                        {feedback.comment}
                      </Typography>
                      
                      {/* 标签 */}
                      {feedback.tags && feedback.tags.length > 0 && (
                        <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                          {feedback.tags.map((tag, index) => (
                            <Chip key={index} label={tag} size="small" />
                          ))}
                        </Box>
                      )}

                      {/* 维度评分 */}
                      {feedback.dimensions && (
                        <Grid container spacing={1} mb={2}>
                          {Object.entries(feedback.dimensions).map(([key, value]) => (
                            <Grid item xs={6} sm={3} key={key}>
                              <Box textAlign="center">
                                <Typography variant="caption" color="text.secondary">
                                  {key === 'quality' ? '质量' : 
                                   key === 'communication' ? '沟通' :
                                   key === 'timeliness' ? '及时性' : '专业性'}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {value}/5
                                </Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      )}

                      {/* 有用投票 */}
                      {feedback.helpfulVotes && (
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="caption" color="text.secondary">
                            这条反馈有用吗？
                          </Typography>
                          <Button size="small" startIcon={<Star size={14} />}>
                            有用 ({feedback.helpfulVotes.helpful})
                          </Button>
                          <Button size="small" color="inherit">
                            无用 ({feedback.helpfulVotes.notHelpful})
                          </Button>
                        </Box>
                      )}
                    </Box>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </>
  );
};

export default JobFeedbackTab;