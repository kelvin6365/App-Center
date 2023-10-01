export interface JiraGetIssueResponse {
  expand: string;
  id: string;
  self: string;
  key: string;
  fields: IssueField;
}

interface IssueField {
  statuscategorychangedate: string;
  issuetype: Issuetype;
  parent: Parent;
  timespent?: any;
  customfield_10030?: any;
  project: Project;
  customfield_10031?: any;
  customfield_10032?: any;
  customfield_10033?: any;
  fixVersions: any[];
  customfield_10034?: any;
  aggregatetimespent?: any;
  resolution?: any;
  customfield_10035?: any;
  customfield_10036?: any;
  customfield_10037?: any;
  customfield_10029: any[];
  resolutiondate?: any;
  workratio: number;
  issuerestriction: Issuerestriction;
  watches: Watches;
  lastViewed: string;
  created: string;
  customfield_10020: Customfield10020[];
  customfield_10021?: any;
  customfield_10022?: any;
  customfield_10023?: any;
  priority: Priority;
  customfield_10024?: any;
  customfield_10025?: any;
  labels: any[];
  customfield_10016?: any;
  customfield_10017?: any;
  customfield_10018: Customfield10018;
  customfield_10019: string;
  aggregatetimeoriginalestimate?: any;
  timeestimate?: any;
  versions: any[];
  issuelinks: any[];
  assignee?: any;
  updated: string;
  status: Status;
  components: any[];
  timeoriginalestimate?: any;
  description?: any;
  customfield_10010?: any;
  customfield_10014?: any;
  timetracking: Issuerestrictions;
  customfield_10015?: any;
  customfield_10005?: any;
  customfield_10006?: any;
  security?: any;
  customfield_10007?: any;
  customfield_10008?: any;
  attachment: any[];
  customfield_10009?: any;
  aggregatetimeestimate?: any;
  summary: string;
  creator: Creator;
  subtasks: any[];
  reporter: Creator;
  aggregateprogress: Aggregateprogress;
  customfield_10000: string;
  customfield_10001?: any;
  customfield_10002?: any;
  customfield_10003?: any;
  customfield_10004?: any;
  environment?: any;
  duedate?: any;
  progress: Aggregateprogress;
  votes: Votes;
  comment: Comment;
  worklog: Worklog;
}

interface Worklog {
  startAt: number;
  maxResults: number;
  total: number;
  worklogs: any[];
}

interface Comment {
  comments: any[];
  self: string;
  maxResults: number;
  total: number;
  startAt: number;
}

interface Votes {
  self: string;
  votes: number;
  hasVoted: boolean;
}

interface Aggregateprogress {
  progress: number;
  total: number;
}

interface Creator {
  self: string;
  accountId: string;
  emailAddress: string;
  avatarUrls: AvatarUrls;
  displayName: string;
  active: boolean;
  timeZone: string;
  accountType: string;
}

interface Customfield10018 {
  hasEpicLinkFieldDependency: boolean;
  showField: boolean;
  nonEditableReason: NonEditableReason;
}

interface NonEditableReason {
  reason: string;
  message: string;
}

interface Customfield10020 {
  id: number;
  name: string;
  state: string;
  boardId: number;
  goal: string;
  startDate: string;
  endDate: string;
  completeDate?: string;
}

interface Watches {
  self: string;
  watchCount: number;
  isWatching: boolean;
}

interface Issuerestriction {
  issuerestrictions: Issuerestrictions;
  shouldDisplay: boolean;
}

interface Issuerestrictions {
  [key: string]: any;
}

interface Project {
  self: string;
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  simplified: boolean;
  avatarUrls: AvatarUrls;
}

interface AvatarUrls {
  '48x48': string;
  '24x24': string;
  '16x16': string;
  '32x32': string;
}

interface Parent {
  id: string;
  key: string;
  self: string;
  fields: Fields;
}

interface Fields {
  summary: string;
  status: Status;
  priority: Priority;
  issuetype: Issuetype;
}

interface Priority {
  self: string;
  iconUrl: string;
  name: string;
  id: string;
}

interface Status {
  self: string;
  description: string;
  iconUrl: string;
  name: string;
  id: string;
  statusCategory: StatusCategory;
}

interface StatusCategory {
  self: string;
  id: number;
  key: string;
  colorName: string;
  name: string;
}

interface Issuetype {
  self: string;
  id: string;
  description: string;
  iconUrl: string;
  name: string;
  subtask: boolean;
  avatarId: number;
  hierarchyLevel: number;
}
