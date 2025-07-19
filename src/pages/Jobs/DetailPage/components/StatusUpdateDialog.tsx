import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import { CheckCircle, Pause, X, Play } from 'lucide-react';
import { Job } from '@apis/model/Job';

interface StatusUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  job: Job;
  onStatusUpdate: (status: Job['status']) => void;
  isUpdating: boolean;
}

const StatusUpdateDialog: React.FC<StatusUpdateDialogProps> = ({
  open,
  onClose,
  job,
  onStatusUpdate,
  isUpdating
}) => {
  const handleStatusUpdate = (status: Job['status']) => {
    if (status === 'COMPLETED' || status === 'CANCELLED') {
      const confirmMessage = status === 'COMPLETED' 
        ? '确定要标记此任务为已完成吗？'
        : '确定要取消此任务吗？此操作不可撤销。';
      
      if (window.confirm(confirmMessage)) {
        onStatusUpdate(status);
      }
    } else {
      onStatusUpdate(status);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>更新任务状态</DialogTitle>
      <DialogContent>
        <Typography gutterBottom sx={{ mb: 3 }}>
          当前状态：<strong>{job?.status}</strong>
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
          选择要更新的状态：
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          {job?.status === 'IN_PROGRESS' && (
            <>
              <Button 
                variant="outlined"
                onClick={() => handleStatusUpdate('COMPLETED')}
                startIcon={<CheckCircle size={20} />}
                color="success"
                className="rounded-lg justify-start"
                disabled={isUpdating}
              >
                标记为已完成
              </Button>
              <Button 
                variant="outlined"
                onClick={() => handleStatusUpdate('OPEN')}
                startIcon={<Pause size={20} />}
                color="warning"
                className="rounded-lg justify-start"
                disabled={isUpdating}
              >
                暂停任务（回到开放状态）
              </Button>
              <Button 
                variant="outlined"
                onClick={() => handleStatusUpdate('CANCELLED')}
                startIcon={<X size={20} />}
                color="error"
                className="rounded-lg justify-start"
                disabled={isUpdating}
              >
                取消任务
              </Button>
            </>
          )}
          
          {job?.status === 'OPEN' && (
            <>
              <Button 
                variant="outlined"
                onClick={() => handleStatusUpdate('IN_PROGRESS')}
                startIcon={<Play size={20} />}
                color="success"
                className="rounded-lg justify-start"
                disabled={isUpdating}
              >
                开始执行
              </Button>
              <Button 
                variant="outlined"
                onClick={() => handleStatusUpdate('CANCELLED')}
                startIcon={<X size={20} />}
                color="error"
                className="rounded-lg justify-start"
                disabled={isUpdating}
              >
                取消任务
              </Button>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isUpdating}>
          取消
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusUpdateDialog;