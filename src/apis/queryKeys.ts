export enum PrefetchKeys {
  HOME = "home-page",
  AGENTS = "agents",
  AGENT_DETAIL = "agent-detail",
  JOBS = "jobs",
  JOB_DETAIL = "job-detail",
  JOB_STATS = "job-stats",
  OPEN_JOBS = "open-jobs",
  EXPIRING_JOBS = "expiring-jobs",
  REQUEST_DEMO = "request-demo",
  CATEGORIES = "categories",
}

// 示例用法：
// useQuery({
//   queryKey: [PrefetchKeys.AGENTS],
//   queryFn: AgentService.getList,
// });
