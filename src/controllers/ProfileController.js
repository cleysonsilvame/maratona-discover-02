const ProfileModel = require('../model/ProfileModel');

module.exports = {
  index(req, res) {
    res.render('profile', { profile: ProfileModel.get() });
  },
  update(req, res) {
    const data = req.body;

    const weeksPerYear = 52;

    const weeksPerMonth = (weeksPerYear - data['vacation-per-year']) / 12;

    const weekTotalHours = data['hours-per-day'] * data['days-per-week'];

    const monthlyTotalHours = weekTotalHours * weeksPerMonth;

    const valueHour = data['monthly-budget'] / monthlyTotalHours;

    ProfileModel.update({
      ...ProfileModel.get(),
      ...req.body,
      'value-hour': valueHour,
    });

    return res.redirect('/profile');
  },
};
