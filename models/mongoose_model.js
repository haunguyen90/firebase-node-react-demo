/**
 * Created by haunguyen on 2/22/16.
 */
var mongoose = require('mongoose');

exports.userSchedulesSchema = new mongoose.Schema({
  _id: String,
  type: String,
  leaveType: String,
  userLeaveId: {type: String, ref: 'userLeave'},
  dayOfWeek: Number,
  shifts: [{
    shiftId: {type: String, ref: 'shifts'},
    publish: Boolean,
    shiftType: String,
    cat: String,
    workStatus: String,
    workCredit: Number
  }],
  userId: String,
  groupId: String,
  date: String,
  timeBin: Array,
  logs: [{
    adminId: String,
    userId: String,
    type: String,
    shiftId: String,
    publish: Boolean,
    dateTime: Date,
    action: String
  }]
}, {collection: 'userSchedules'});

exports.shiftsSchema = new mongoose.Schema({
  _id: String,
  type: String,
  cat: String,
  code: String,
  description: String,
  createdAt: Date,
  shiftGroups: Array,
  locations: Array,
  holidaysToWork: Array,
  shiftCredit: Number
}, {collection: 'shifts'});

exports.userLeaveSchema = new mongoose.Schema({
  _id: String,
  userId: String,
  type: String,
  read: Boolean,
  startDate: String,
  endDate: String,
  status: String,
  reviewerId: String,
  requestDateTime: Date,
  groupId: String,
  comments: [{
    userId: String,
    datetime: Date,
    text: String,
    order: Number
  }]
}, {collection: 'userLeave'});

exports.groupsSchema = new mongoose.Schema({
  _id: String,
  groupName: String,
  groupAbbreviation: String,
  createdAt: Date,
  groupUsers: [{
    userId: String,
    settings: {
      timezone: String,
      enableNotifications: String
    }
  }],
  shiftTypes: [{
    type: String
  }],
  shiftCats: [{
    _id: String,
    cat: String,
    active: Boolean,
    order: Number
  }],
  leaveConfiguration: [{
    leaveType: String,
    order: Number,
    userRequestable: Boolean,
    active: Boolean
  }],
  locations: [{
    locationId: String,
    locationName: String,
    locationAbbreviation: String,
    locationAddress: [],
    locationCity: String,
    locationState: String,
    locationZipcode: String,
    locationTimezone: String
  }],
  "holidays": [{
    holidayId: String,
    holidayName: String,
    month: Number,
    active: Boolean,
    type: String,
    day: Number,
    dow: Number,
    wom: Number
  }],
  daysOff: [{
    _id: String,
    name: String,
    active: Boolean,
    order: Number,
    requireSetup: Boolean
  }]
}, {collection: "groups"});

// export models
exports.userSchedulesModel = mongoose.model("userSchedules", this.userSchedulesSchema, "userSchedules");
exports.shiftsModel = mongoose.model("shifts", this.shiftsSchema, "shifts");
exports.userLeaveModel = mongoose.model('userLeave', this.userLeaveSchema, 'userLeave');
exports.groupsModel = mongoose.model('groups', this.groupsSchema, 'groups');

