import { getJobs } from "./db/jobs.js";

export const resolvers = {
  Query: {
    jobs: async () => {
      const jobs = await getJobs();
      console.log(jobs);
      return [
        ...jobs,
        {
          //如果一些field只在resolvers中出现，但没有在schema中出现，GraphQL会直接忽略这些field
          id: "test-id-1",
          title: "The Title",
          description: "The description",
        },
        {
          id: "test-id-2",
          title: "The Title",
          description: "The description",
        },
        //声明jobs: [Job!]Job是non-nullable
        //Cannot return null for non-nullable field Query.jobs.
        // null,
      ];
    },
  },
};

/*
上面的代码Refactor一下就是下面的代码
import { getJobs } from "./db/jobs.js";

export const resolvers = {
  Query: {
    jobs: () => getJobs(),
  },
};
*/
