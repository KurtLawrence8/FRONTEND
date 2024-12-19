<template>
  <div>
    <div v-if="!$route.meta.layout" class="no-layout">
      <router-view />
    </div>

    <div class="page" v-else>
      <div :class="['NavBarView', { collapsed: isCollapsed }]">
        <i @click="toggleSidebar" class="bi-list" style="font-size: 40px; padding-right: 20px; padding-left: 12.5px;"></i>
        <span @click="toggleSidebar" v-if="!isCollapsed" style="font-size: 35px;">Menu</span>

        <div class="divider">
        </div>

        <ul>
          <li v-for="(navItem, index) in navItems" :key="index" :class="{ active: isActive(navItem.to) }">
            <router-link :to="navItem.to" @click="setActiveLink(navItem.to)">
              <i :class="['bi', navItem.icon, 'icon']"></i>
              <span v-if="!isCollapsed" style="padding-left: 10px;">{{ navItem.label }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div class="main-content">
        <ToolBarView />
        <PrescriptiveView />
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import PrescriptiveView from './components/PrescriptiveView.vue';
import ToolBarView from './components/ToolBarView.vue';

export default {
  components: { ToolBarView, PrescriptiveView },
  name: "App", 
  data() {
    return {
      token: "",
      user_id: "",
      name: "",
      isCollapsed: true,
      navItems: [
        { to: '/main', label: 'Home', icon: 'bi-house' },
        { to: '/inventory', label: 'Inventory', icon: 'bi-box-seam' },
        { to: '/category', label: 'Category', icon: 'bi-collection' },
        { to: '/product', label: 'Product', icon: 'bi-cart4' },
        { to: '/manage-users', label: 'Manage Users', icon: 'bi-person'},
        { to: '/settings', label: 'Settings', icon: 'bi-gear'},
      ]
    };
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
    },
    setActiveLink(link) {
      this.activeLink = link;
    },
    isActive(link) {
      return this.activeLink === link;
    },
  },
};
</script>

<style scoped>
/* Page Container */
.page {
  margin: 10px;
  font-family: Georgia, serif;
  background-color: #fff;
  color: #333;
}

/* Navigation Bar */
.NavBarView {
  width: 250px;
  height: 100%;
  background: linear-gradient(135deg, #f5e1fd, #d7a3f7);
  color: purple;
  position: fixed;
  top: 0;
  left: 0;
  transition: width 0.3s ease;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.NavBarView.collapsed {
  width: 65px;
}

/* Main Content Area */
.main-content {
  margin-left: 250px;
  flex-grow: 1;
  transition: margin-left 0.3s ease;
  padding-top: 75px;
  max-width: 100%;
}

.NavBarView.collapsed + .main-content {
  margin-left: 65px;
}

/* Toolbar */
.toolbar {
  height: 70px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 250px;
  right: 0;
  transition: left 0.3s ease;
  padding: 20px;
  border-bottom: 2px solid #f5e1fd;
}

.NavBarView.collapsed + .main-content .toolbar {
  left: 65px;
}

/* Navigation List */
ul {
  list-style: none;
  padding: 20px;
}

li {
  margin: 20px 0;
  position: relative;
}

li a {
  text-decoration: none;
  color: #6a1b9a;
  font-size: 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  transition: color 0.3s ease, transform 0.3s ease;
}

li a:hover {
  color: #38006b;
  transform: translateX(5px);
}

li::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: #6a1b9a;
  bottom: 0;
  left: 0;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

li:hover::before {
  transform: scaleX(1);
}

li.active a {
  color: #38006b;
}

li.active::before {
  transform: scaleX(1);
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: #00796b;
  bottom: 0;
  left: 0;
}

/* Icons */
.icon {
  font-size: 1.5rem;
  margin-right: 8px;
  color: #6a1b9a;
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 9px 0;
  color: #6a1b9a;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  position: relative;
}

.divider:before,
.divider:after {
  content: "";
  flex: 1;
  height: 2px;
  background: #d7a3f7;
}

.NavBarView:hover {
  box-shadow: 5px 0 10px rgba(0, 0, 0, 0.2);
}

.toolbar:hover {
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.2);
}
</style>
