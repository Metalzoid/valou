<script setup>
import { useRouter } from "vue-router";
const { logout } = useApi();
const route = useRoute();
const router = useRouter();
const props = defineProps(["chipNumberAppointmentHolded"]);

let mobileChecked = ref(false);

const user = ref({
  id: null,
  email: null,
  firstname: null,
  lastname: null,
  company: null,
  role: null,
  phone_number: null,
  currentPassword: null,
  newPassword: null,
  newPasswordConfirmation: null,
});

const chipNumber = ref(0);

const toggleNavMobile = () => {
  mobileChecked.value = false;
};

const handleNavClick = () => {
  if (window.innerWidth < 855) {
    toggleNavMobile();
  }
};

const userStore = useUserStore();

const handleLogout = async () => {
  const result = await logout();

  if (result && result.success) {
    if (typeof window !== "undefined") {
      handleNavClick();
      return router.push("/");
    }
  }
};

watch(
  () => props.chipNumberAppointmentHolded,
  (newVal) => {
    chipNumber.value = newVal;
  }
);

onMounted(() => {
  const tempUser = userStore.loadUserFromSession();
  user.value = tempUser;
});

userStore.$subscribe((mutation, state) => {
  user.value = state.currentUser;
});

watch(
  () => mobileChecked.value,
  (newVal) => {
    const body = document.querySelector("body");
    const navbar = document.getElementById("mobileNav");

    if (newVal) {
      body.style.marginLeft = `${navbar.clientWidth}px`;
    } else {
      body.style.marginLeft = "0";
    }
  }
);
</script>

<template>
  <div @wheel="toggleNavMobile()" @touchmove="toggleNavMobile()">
    <div>
      <header>
        <div id="navigation">
          <div id="mobileNavDiv">
            <input type="checkbox" v-model="mobileChecked" id="mobileNavPaa" />
            <label id="burger" for="mobileNavPaa">
              <div></div>
              <div></div>
              <div></div>
            </label>
            <nav id="mobileNav">
              <div class="navMobile">
                <div
                  class="profil flex flex-col justify-center items-center gap-3"
                  v-if="user"
                >
                  <h3>Bienvenue {{ user?.firstname }} !</h3>
                  <NuxtLink to="/profil">
                    <NuxtImg
                      src="/img/profil-manquant.jpg"
                      class="h-24 w-24 profil-img cursor-pointer"
                      :class="{ active: route.path === '/profil' }"
                    />
                  </NuxtLink>
                </div>
                <div>
                  <ul>
                    <UDivider />
                    <li>
                      <NuxtLink
                        to="/"
                        @click="handleNavClick"
                        :class="{ active: route.path === '/' }"
                        >Accueil</NuxtLink
                      >
                    </li>
                    <UDivider />
                    <li>
                      <NuxtLink
                        to="/calendar"
                        @click="handleNavClick"
                        :class="{ active: route.path.includes('/calendar') }"
                        >Calendrier</NuxtLink
                      >
                    </li>
                    <UDivider />
                    <li>
                      <NuxtLink
                        to="/dashboard"
                        @click="handleNavClick"
                        :class="{ active: route.path.includes('/dashboard') }"
                        >Dashboard</NuxtLink
                      >
                    </li>
                    <UDivider />
                  </ul>
                </div>
                <div>
                  <ul>
                    <li>
                      <NuxtLink
                        to="/login"
                        @click="handleNavClick"
                        :class="{ active: route.path.includes('/login') }"
                        v-if="!user"
                        >Se connecter</NuxtLink
                      >
                    </li>
                    <li>
                      <NuxtLink
                        @click="handleLogout"
                        style="cursor: pointer"
                        v-if="user"
                      >
                        Se déconnecter
                      </NuxtLink>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
          <NuxtLink to="/" class="logo"
            ><img src="/img/logo.png" alt="logo"
          /></NuxtLink>
          <div id="nav">
            <div
              class="profil flex flex-col justify-center items-center gap-3"
              :hidden="!user"
              :class="!user ? 'h-32' : ''"
            >
              <h3 :hidden="!user">Bienvenue {{ user?.firstname }} !</h3>
              <NuxtLink to="/profil">
                <NuxtImg
                  src="/img/profil-manquant.jpg"
                  class="h-24 w-24 profil-img cursor-pointer"
                  :class="{ active: route.path === '/profil' }"
                  :hidden="!user"
                />
              </NuxtLink>
            </div>
            <ul class="nav">
              <UDivider />
              <li>
                <NuxtLink to="/" :class="{ active: route.path === '/' }"
                  >Accueil</NuxtLink
                >
              </li>
              <UDivider />
              <li>
                <NuxtLink
                  to="/calendar"
                  :class="{ active: route.path.includes('/calendar') }"
                  >Calendrier</NuxtLink
                >
              </li>
              <UDivider />
              <li>
                <UChip :show="chipNumber > 0" :text="chipNumber" size="2xl">
                  <NuxtLink
                    to="/dashboard"
                    class="mx-2"
                    :class="{ active: route.path.includes('/dashboard') }"
                    >Dashboard</NuxtLink
                  >
                </UChip>
              </li>
              <UDivider />
            </ul>
            <div class="w-full text-center">
              <ul>
                <li>
                  <NuxtLink
                    to="/login"
                    :class="{ active: route.path.includes('/login') }"
                    v-if="!user"
                    >Se connecter</NuxtLink
                  >
                </li>
                <li>
                  <NuxtLink
                    @click="handleLogout"
                    style="cursor: pointer"
                    v-if="user"
                  >
                    Se déconnecter
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </div>
  </div>
</template>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background: rgba(163, 163, 163, 1);
  border-right: 2px white solid;
  background-clip: padding-box;
  border-radius: 4px;
}

.button {
  cursor: pointer;
}

#navigation {
  height: 100vh;
  width: 15vw;
  background-color: white;
  display: flex;
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 15px 20px -12px rgba(67, 54, 35, 0.08);
  padding: 0 1vw;

  .profil {
    flex-grow: 0.3;
    text-align: center;
    width: 100%;
    .profil-img {
      border-radius: 50%;
      transition: all ease-in-out 0.4s;
      &.active {
        border: 1px solid#ed672e91;
      }
      &:hover {
        box-shadow: 1px 1px 20px #ed682e;
        transform: scale(1.02);
      }
    }
  }

  #nav {
    flex-grow: 4;
    align-items: start;
    justify-content: space-between;
    margin: 2rem auto;
    width: 100%;
    .nav {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: flex-start;
      gap: 4vh;
      width: 100%;
    }
  }

  .logo {
    width: auto;
    max-width: 40vh;
    margin: 1rem 0 2rem 0;
  }

  a {
    text-decoration: none;
    text-wrap: nowrap;
    align-items: center;
    transition: color 0.2s ease-in-out;
    &:hover {
      color: #ed682e;
    }
  }

  input {
    display: none;
  }
}

.hireMeNav {
  max-width: 122px;
  min-width: 100px;
  width: 10vw;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  gap: 5px;
  &:hover {
    box-shadow: 1px 3px 3px 1px rgba(41, 43, 50, 0.2);
  }
}

#nav {
  display: flex;
  flex-direction: column;
  list-style: none;
  justify-content: center;
  align-items: center;
  a {
    text-decoration: none;
    font-size: x-large;
    color: rgba(64, 64, 64, 1);
    font-size: 16px;
    align-items: center;
    font-family: Plus Jakarta Sans;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0em;
    text-align: center;
  }

  ul {
    justify-content: space-around;
    flex: 0.7 0.2 auto;
  }

  .active {
    color: rgba(237, 104, 46, 1);
  }

  .nav {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding-left: 0;
    gap: 7px;
    li {
      display: flex;
    }
  }
}

@media only screen and (min-width: 855px) {
  #mobileNavDiv {
    display: none;
  }
}

.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}

@media only screen and (max-width: 855px) {
  #navigation {
    width: 100vw;
    height: 12vh;
    min-height: 35px;
    flex-direction: row-reverse;
    margin: 0;
    justify-content: space-between;
    align-items: center;

    .logo {
      margin: 10px 0;
      img {
        width: 50vw;
        min-width: 150px;
      }
    }
    #nav {
      display: none;
    }
    #mobileNavDiv {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .email {
        text-decoration: underline;
        text-align: center;
      }
    }
  }
  // Navigation mobile
  .burger-wrapper {
    cursor: pointer;
  }

  .profil {
    flex-grow: initial !important;
    text-align: center;
  }

  #mobileNav {
    background: rgb(255, 255, 255);
    width: 20vw;
    min-width: min-content;
    height: 100%;
    position: fixed;
    left: 0;
    transition-timing-function: cubic-bezier(10, 2, 3, 1);
    transform: translateX(-100vw);
    top: 0;
    z-index: -1;
    transition: 0.5s;
    display: flex;
    flex-direction: column;
    .navMobile {
      display: flex;
      height: 100%;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      margin: 15vh auto auto auto;
      gap: 7px;
      ul {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
        justify-content: center;
        align-items: center;
        li {
          display: flex;
        }
      }
      a {
        font-family: Plus Jakarta Sans;
        font-size: 18px;
        font-weight: 400;
        line-height: 28px;
        letter-spacing: 0em;
        text-align: center;
        color: rgba(38, 38, 38, 1);
      }
      .active {
        color: rgba(237, 104, 46, 1);
      }
    }
  }

  /* Links Navigations */
  .nav {
    li {
      font-family: Plus Jakarta Sans;
      font-size: 18px;
      font-weight: 400;
      line-height: 28px;
      letter-spacing: 0em;
      a {
        color: rgba(38, 38, 38, 1);
      }
    }
  }

  #burger {
    cursor: pointer;
    width: 5vh;
    height: 5vh;
    min-width: 20px;
    min-height: 20px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    & > div {
      height: 2px;
      background-color: #000;
      transition: 0.5s;
      z-index: 999;
    }
  }

  #mobileNavPaa {
    display: none;
    &:checked ~ #mobileNav {
      transform: translateX(0rem);
    }
    &:checked ~ #burger > div {
      background-color: black;
    }
    &:checked ~ #burger > div {
      &:nth-child(1) {
        transform: translateY(13px) rotate(45deg);
      }
      &:nth-child(2) {
        opacity: 0;
      }
      &:nth-child(3) {
        transform: translateY(-10px) rotate(-45deg);
      }
    }
  }
}
</style>
