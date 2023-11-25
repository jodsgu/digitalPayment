 const UserMenu = [
    {
      name:'Home',
      path:'/',
      icon:"fa-sharp fa-solid fa-house"
    },
    
    {
      name:'Profile',
      path:'/profile',
      icon:"fa-solid fa-user"
    },
    {
      name:'Balance',
      path:'/balance',
      icon:"fa-solid fa-wallet"
    },
    {
      name:'Request Device',
      path:'/request-device', 
      icon:"fa-solid fa-mobile"
    },


]


//admin menu

const AdminMenu = [
  {
    name:'Home',
    path:'/',
    icon:"fa-sharp fa-solid fa-house"
  },
  {
    name:'Users',
    path:'/admin/users',
    icon:"fa-solid fa-user"
  },
  {
    name:'Account Manage',
    path:'/admin/account-management',
    icon:"fa-solid fa-list-check"
  },
  {
    name:'Balance History',
    path:'/admin/balance-history',
    icon:"fa-solid fa-wallet"
  },
  {
    name:'Device Requests',
    path:'/admin/device-requests', 
    icon:"fa-solid fa-mobile"
  },


]

export { UserMenu, AdminMenu };
