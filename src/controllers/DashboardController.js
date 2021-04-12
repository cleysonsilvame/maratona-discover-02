const JobModel = require('../model/JobModel');
const ProfileModel = require('../model/ProfileModel');
const jobUtils = require('../utils/jobUtils');

module.exports = {
  index(req, res) {
    const jobs = JobModel.get();
    const profile = ProfileModel.get();

    let statusCount = {
      progress: 0,
      done: 0,
      total: jobs.length,
    };

    let jobTotalHours = 0;

    const updatedJobs = jobs.map((job) => {
      const remaining = jobUtils.remainingDays(job);
      const status = remaining > 0 ? 'progress' : 'done';

      statusCount[status]++;

      jobTotalHours =
        status == 'progress'
          ? (jobTotalHours += Number(job['daily-hours']))
          : jobTotalHours;

      return {
        ...job,
        remaining,
        status,
        budget: jobUtils.calculateBudget(job, profile['value-hour']),
      };
    });

    const freeHours = profile['hours-per-day'] - jobTotalHours;

    return res.render('index', {
      jobs: updatedJobs,
      profile,
      statusCount,
      freeHours,
    });
  },
};
