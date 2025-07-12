export enum PrefetchKeys {
  HOME = "home-page",
  AGENTS = "agents",
  AGENT_DETAIL = "agent-detail",
  JOBS = "jobs",
  JOB_DETAIL = "job-detail",
  REQUEST_DEMO = "request-demo",
}

// 示例用法：
// useQuery({
//   queryKey: [PrefetchKeys.AGENTS],
//   queryFn: AgentService.getList,
// });
