import { GraphQLError } from "graphql";
import {
  getJobs,
  getJob,
  getJobsByCompany,
  createJob,
  updateJob,
  deleteJob,
} from "./db/jobs.js";
import { getCompany } from "./db/companies.js";

export const resolvers = {
  Query: {
    //job的第二个argument包含了request的id
    job: async (_root, { id }) => {
      const job = await getJob(id);
      if (!job) {
        throw notFoundError("No Job Found With id " + id);
      }
      return job;
    },
    company: async (_root, { id }) => {
      const company = await getCompany(id);
      if (!company) {
        throw notFoundError("No Company found with id " + id);
      }
      return company;
    },
    jobs: () => getJobs(),
  },

  Mutation: {
    createJob: (_root, { input: { title, description } }, { user }) => {
      if (!user) {
        throw unauthorizeError("Missing authentication");
      }
      return createJob({ title, description, companyId: user.companyId });
    },

    updateJob: async (
      _root,
      { input: { id, title, description } },
      { user }
    ) => {
      if (!user) {
        throw unauthorizeError("Missing authentication");
      }

      const job = await updateJob({
        id,
        companyId: user.companyId,
        title,
        description,
      });

      if (!job) {
        throw notFoundError("No job found with id " + id);
      }

      return job;
    },

    deleteJob: async (_root, { id }, { user }) => {
      if (!user) {
        throw unauthorizeError("Missing authentication");
      }

      const job = await deleteJob(id, user.companyId);

      if (!job) {
        throw notFoundError("No job found with id " + id);
      }
      return job;
    },
  },

  Job: {
    date: (job) => toISODate(job.createdAt),
    company: async (job) => {
      const company = await getCompany(job.companyId);
      if (!company) {
        throw notFoundError("No Company found with id " + id);
      }
      return company;
    },
  },

  Company: {
    jobs: async (company) => {
      const jobs = await getJobsByCompany(company.id);
      if (!jobs) {
        throw notFoundError("No job found with id " + id);
      }
      return jobs;
    },
  },
};

function toISODate(value) {
  return value.slice(0, "yyyy-mm-dd".length);
}

function notFoundError(message) {
  return new GraphQLError(message, {
    extensions: { code: "NOT_FOUND" },
  });
}

function unauthorizeError(message) {
  return new GraphQLError(message, {
    extensions: { code: "UNAUTHORIZE" },
  });
}
