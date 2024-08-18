export class GithubUserDto {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string | null;
  company: string | null;
  blog: string;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username: string | null;
  notification_email: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  private_gists: number;
  total_private_repos: number;
  owned_private_repos: number;
  disk_usage: number;
  collaborators: number;
  two_factor_authentication: boolean;
  plan: {
    name: string;
    space: number;
    collaborators: number;
    private_repos: number;
  };

  constructor({
    login,
    id,
    node_id,
    avatar_url,
    gravatar_id,
    url,
    html_url,
    followers_url,
    following_url,
    gists_url,
    starred_url,
    subscriptions_url,
    organizations_url,
    repos_url,
    events_url,
    received_events_url,
    type,
    site_admin,
    name,
    company,
    blog,
    location,
    email,
    hireable,
    bio,
    twitter_username,
    notification_email,
    public_repos,
    public_gists,
    followers,
    following,
    created_at,
    updated_at,
    private_gists,
    total_private_repos,
    owned_private_repos,
    disk_usage,
    collaborators,
    two_factor_authentication,
    plan,
  }: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    name: string | null;
    company: string | null;
    blog: string;
    location: string | null;
    email: string | null;
    hireable: boolean | null;
    bio: string | null;
    twitter_username: string | null;
    notification_email: string | null;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
    private_gists: number;
    total_private_repos: number;
    owned_private_repos: number;
    disk_usage: number;
    collaborators: number;
    two_factor_authentication: boolean;
    plan: {
      name: string;
      space: number;
      collaborators: number;
      private_repos: number;
    };
  }) {
    this.login = login;
    this.id = id;
    this.node_id = node_id;
    this.avatar_url = avatar_url;
    this.gravatar_id = gravatar_id;
    this.url = url;
    this.html_url = html_url;
    this.followers_url = followers_url;
    this.following_url = following_url;
    this.gists_url = gists_url;
    this.starred_url = starred_url;
    this.subscriptions_url = subscriptions_url;
    this.organizations_url = organizations_url;
    this.repos_url = repos_url;
    this.events_url = events_url;
    this.received_events_url = received_events_url;
    this.type = type;
    this.site_admin = site_admin;
    this.name = name;
    this.company = company;
    this.blog = blog;
    this.location = location;
    this.email = email;
    this.hireable = hireable;
    this.bio = bio;
    this.twitter_username = twitter_username;
    this.notification_email = notification_email;
    this.public_repos = public_repos;
    this.public_gists = public_gists;
    this.followers = followers;
    this.following = following;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.private_gists = private_gists;
    this.total_private_repos = total_private_repos;
    this.owned_private_repos = owned_private_repos;
    this.disk_usage = disk_usage;
    this.collaborators = collaborators;
    this.two_factor_authentication = two_factor_authentication;
    this.plan = plan;
  }
}
