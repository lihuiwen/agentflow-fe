export enum PrefetchKeys {
  HOME = "home-page",
  AGENTS = "agents",
  AGENT_DETAIL = "agent-detail",
  JOBS = "jobs",
  JOB_DETAIL = "job-detail",
}

// 示例用法：
// useQuery({
//   queryKey: [PrefetchKeys.AGENTS],
//   queryFn: AgentService.getList,
// });
