import React, { useState } from 'react';
import {
  Grid,
  Card,
  Box,
  Typography,
  Avatar,
  Badge,
  LinearProgress,
  Chip,
  Alert,
  CircularProgress,
  Button
} from '@mui/material';
import { Agent } from '@apis/model/Agents';
import AgentExecutionDialog from '@/pages/Jobs/DetailPage/components/AgentExecutionDialog';

interface JobAgentsTabProps {
  agents: Agent[];
  agentsLoading: boolean;
}

const JobAgentsTab: React.FC<JobAgentsTabProps> = ({
  agents,
  agentsLoading
}) => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewExecution = (agent: Agent) => {
    setSelectedAgent(agent);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedAgent(null);
  };

  const handleConfirm = () => {
    setDialogOpen(false);
    setSelectedAgent(null);
  };
  if (agentsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h6" gutterBottom>
        分配的Agent
      </Typography>
      <Grid container spacing={3}>
        {agents.length === 0 ? (
          <Grid item xs={12}>
            <Alert severity="info">
              暂无分配的Agent
            </Alert>
          </Grid>
        ) : (
          agents.map((agent) => (
            <Grid item xs={12} md={6} key={agent.id}>
              <Card className="p-6 transition-all duration-300 ease-in-out hover:shadow-lg">
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}>
                    {agent.agentName?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{agent.agentName}</Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Badge 
                        color={agent.isActive ? 'success' : 'default'}
                        variant="dot"
                      />
                      <Typography variant="body2" color="text.secondary">
                        {agent.isActive ? '活跃' : '非活跃'}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {agent.agentClassification}
                    </Typography>
                  </Box>
                </Box>
                
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="body2">成功率: {agent.successRate}%</Typography>
                  <Typography variant="body2">完成任务: {agent.totalJobsCompleted}</Typography>
                </Box>
                
                <LinearProgress 
                  variant="determinate" 
                  value={agent.successRate || 0} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: (agent.successRate || 0) >= 90 ? '#4caf50' : '#ff9800'
                    }
                  }}
                />
                
                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    {agent.description}
                  </Typography>
                </Box>
                
                {agent.tags && agent.tags.length > 0 && (
                  <Box mt={2} display="flex" flexWrap="wrap" gap={0.5}>
                    {agent.tags.slice(0, 3).map((tag, index) => (
                      <Chip key={index} label={tag} size="small" variant="outlined" />
                    ))}
                  </Box>
                )}
                
                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewExecution(agent)}
                    sx={{
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        backgroundColor: 'primary.50'
                      }
                    }}
                  >
                    查看执行结果
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
      
      {selectedAgent && (
        <AgentExecutionDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onConfirm={handleConfirm}
          agent={selectedAgent}
        />
      )}
    </>
  );
};

export default JobAgentsTab;