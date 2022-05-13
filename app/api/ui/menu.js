module.exports = [
  {
    key: 'home',
    name: 'Home',
    icon: 'home',
    child: [
      {
        key: 'dashboard',
        name: 'Dashboard',
        link: '/app/{username}',
        icon: 'business'
      },
      {
        key: 'user_profile',
        name: 'User Profile',
        icon: 'contacts',
        link: '/app/{username}/user-profile'
      },
      {
        key: 'edit_profile',
        name: 'Edit Profile',
        icon: 'contacts',
        link: '/app/{username}/edit-profile'
      }
    ]
  },
  {
    key: 'projects',
    name: 'Projects',
    icon: 'widgets',
    child: [
      {
        key: 'searchProjects',
        icon: 'search',
        name: 'Search Projects',
        link: '/app/projects/searchprojects'
      },
      {
        key: 'itemMyProjects',
        icon: 'assignment',
        name: 'My Projects',
        link: '/app/{username}/projects/myprojects'
      },
    ]
  },
  {
    key: 'posts',
    name: 'Posts',
    icon: 'widgets',
    child: [
      {
        key: 'searchArticles',
        icon: 'search',
        name: 'Search Articles',
        link: '/app/posts/searcharticles'
      },
      {
        key: 'itemMyArticles',
        icon: 'description',
        name: 'My Articles',
        link: '/app/{username}/posts/myarticles'
      },
      // {
      //   key: 'itemNewArticle',
      //   icon: 'shopping_cart',
      //   name: 'Add Article',
      //   link: '/app/{username}/posts/addarticle'
      // },
    ]
  },
  {
    key: 'products',
    name: 'Products',
    icon: 'widgets',
    child: [
      {
        key: 'searchProducts',
        icon: 'search',
        name: 'Search Products',
        link: '/app/{username}/products/searchproducts'
      },
      {
        key: 'myItemlist',
        icon: 'shopping_cart',
        name: 'My Products',
        link: '/app/{username}/products/myproducts'
      },
    ]
  }
];
