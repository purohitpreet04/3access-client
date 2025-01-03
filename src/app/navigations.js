export const staffnavigations = [
  { name: "Dashboard", path: "/desh", icon: "dashboard", title: "Dashboard" },
  { name: "Property", path: "/services/property", icon: "house", title: "Property Management" },
  // { name: "Staff", path: "/services/staff", icon: "work", title: "Staff Management", nav:'newstaff' },
  {
    name: "Tenants", icon: "group", title: "Tenant Management",
    children: [
      { name: "Active Tenants", path: "/services/tenants", iconText: "A", nav: 1 },
      { name: "Sign Out Tenants", path: '/services/sign-out-tenants', iconText: "B", nav: 0 },
    ]
  },
];

export const usernavigations = [
  { name: "Dashboard", path: "/desh", icon: "dashboard", title: "Dashboard" },
  { name: "Staff", path: "/services/staff", icon: "work", title: "Staff Management" },
  { name: "Property", path: "/services/property", icon: "house", title: "Property Management" },
  {
    name: "Tenants", icon: "group", title: "Tenant Management",
    children: [
      { name: "Active Tenants", path: "/services/tenants", iconText: "A", nav: 1 },
      { name: "Sign Out Tenants", path: '/services/sign-out-tenants', iconText: "B", nav: 0 },
    ]
  },
  {
    name: "Setting", icon: "settings", title: "Agents",
    children: [
      { name: "Email", path: '/services/settings', iconText: "A" },
    ]
  },
  // { name: "Registered RSL", path: "/services/listrsl", icon: "corporate_fare", title: "RSL" },
  // { name: "Agents", path: "/services/agents", icon: "people", title: "Agents" },
];

export const mainAgent = [
  { name: "Dashboard", path: "/desh", icon: "dashboard", title: "Dashboard" },
  { name: "Staff", path: "/services/staff", icon: "work", title: "Staff Management" },
  { name: "Property", path: "/services/property", icon: "house", title: "Property Management" },
  {
    name: "Tenants", icon: "group", title: "Tenant Management",
    children: [
      { name: "Active Tenants", path: "/services/tenants", iconText: "A" },
      { name: "Sign Out Tenants", path: '/services/sign-out-tenants', iconText: "B" },
    ]
  },
  { name: "Registered RSL", path: "/services/listrsl", icon: "corporate_fare", title: "RSL" },
  {
    name: "Agents", path: "/services/agents", icon: "people", title: "Agents",
  },
  {
    name: "Setting", icon: "settings", title: "Agents",
    children: [
      { name: "Email", path: '/services/settings', iconText: "A" },
    ]
  },
]