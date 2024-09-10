<script setup>
import { useRouter } from "vue-router";

const { logout } = useApi();
const route = useRoute();
const router = useRouter();

let mobileChecked = ref(false);

function toggleNavMobile() {
  if (window.innerWidth < 855) {
    mobileChecked.value = false;
  }
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const userStore = useUserStore();

const handleLogout = async () => {
  const result = await logout();

  if (result && result.success) {
    if (typeof window !== "undefined") {
      return router.push("/");
    }
  }
};

onMounted(() => {
  userStore.loadUserFromSession();
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;700&display=swap");
</style>

<template>
  <div @wheel="toggleNavMobile()" @touchmove="toggleNavMobile()">
    <div>
      <header>
        <div id="navigation">
          <NuxtLink to="/" @click="scrollToTop()" class="logo"
            ><img src="/img/logo.png" alt="logo"
          /></NuxtLink>
          <div class="profil" v-if="userStore.currentUser">
            Bienvenue {{ userStore.currentUser.firstname }} !
          </div>

          <div id="nav">
            <ul class="nav">
              <li>
                <NuxtLink
                  to="/"
                  @click="scrollToTop()"
                  :class="{ active: route.path === '/' }"
                  >Accueil</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/calendar"
                  :class="{ active: route.path.includes('/calendar') }"
                  >Calendrier</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/dashboard"
                  :class="{ active: route.path.includes('/dashboard') }"
                  >Dashboard</NuxtLink
                >
              </li>
              <ul>
                <li>
                  <NuxtLink
                    to="/login"
                    :class="{ active: route.path.includes('/login') }"
                    v-if="!userStore.currentUser"
                    >Se connecter</NuxtLink
                  >
                </li>
                <li>
                  <NuxtLink
                    @click="handleLogout"
                    style="cursor: pointer"
                    v-if="userStore.currentUser"
                  >
                    Logout
                  </NuxtLink>
                </li>
              </ul>
            </ul>
          </div>
          <div id="mobileNavDiv">
            <input type="checkbox" v-model="mobileChecked" id="mobileNavPaa" />
            <label id="burger" for="mobileNavPaa">
              <div></div>
              <div></div>
              <div></div>
            </label>
            <nav id="mobileNav">
              <ul class="navMobile">
                <li>
                  <NuxtLink
                    to="/"
                    class="active"
                    @click="toggleNavMobile(), scrollToTop()"
                    >Accueil</NuxtLink
                  >
                </li>
                <li>
                  <NuxtLink to="/" @click="toggleNavMobile()"
                    >Projets Réalisés</NuxtLink
                  >
                </li>
                <li>
                  <NuxtLink to="/" @click="toggleNavMobile()">Contact</NuxtLink>
                </li>
              </ul>
            </nav>
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
  top: 0;
  left: 0;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 15px 20px -12px rgba(67, 54, 35, 0.08);
  padding: 0 1vw;

  .profil {
    flex-grow: 1;
  }

  #nav {
    flex-grow: 4;
    align-items: start;
    margin-top: 5rem;
    .nav {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }
  }

  .logo {
    width: 200px;
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
  flex-direction: row;
  list-style: none;
  justify-content: center;
  align-items: center;
  width: 100%;
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
}

.nav {
  display: flex;
  align-items: center;
  padding-left: 0;
  margin: 0 10px;
  gap: 7px;
  li {
    display: flex;
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
    width: 100%;
    margin: 0;
    justify-content: space-between;
    align-items: center;

    .logo {
      width: 40vw;
      margin-left: 5vw;
      min-width: 150px;
    }
    #nav {
      visibility: hidden;
    }
    .hireMeNav {
      display: none;
    }
    #mobileNavDiv {
      height: 100%;
      .email {
        text-decoration: underline;
      }
    }
  }
  // Navigation mobile
  .burger-wrapper {
    cursor: pointer;
  }

  #mobileNav {
    background: white;
    width: 100%;
    position: fixed;
    right: 0;
    transition-timing-function: cubic-bezier(10, 2, 3, 1);
    transform: translateY(-50rem);
    top: 72px;
    z-index: -1;
    transition: 0.5s;
    display: flex;
    flex-direction: column;
    padding-bottom: 25px;
    .navMobile {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-left: 0;
      margin: 0 10px;
      gap: 7px;
      li {
        display: flex;
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
    }

    #profilMobile {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      justify-content: center;
      margin-top: 15px;
      gap: 16px;
      #photoProfilMobile {
        background: linear-gradient(180deg, #ff6f47 0%, #ff9447 100%);
        display: flex;
        width: 132px;
        height: 132px;
        min-width: 132px;
        border-radius: 100px;
        img {
          width: 100%;
          border-radius: 100px;
        }
      }
      #profilInfosMobile {
        display: flex;
        flex-direction: column;
        #infosMobile {
          margin-top: -10px;
          display: flex;
          flex-direction: column;
          .email {
            font-family: Plus Jakarta Sans;
            font-size: 18px;
            font-weight: 600;
            line-height: 28px;
            letter-spacing: 0em;
            text-align: center;
            color: black;
            text-wrap: wrap;
          }
          a {
            text-decoration: underline;
            text-decoration-color: black;
            text-underline-offset: 3.5px;
            text-wrap: wrap;
          }
          .localisation {
            font-family: Plus Jakarta Sans;
            font-size: 18px;
            font-weight: 400;
            line-height: 28px;
            letter-spacing: 0em;
            margin-top: -15px;
          }
        }
        #socialMobile {
          margin-top: -3px;
          display: flex;
          a {
            flex: 1 1 auto;
          }
        }
      }
    }

    @media only screen and (max-width: 366px) {
      #socialMobile {
        display: flex;
        width: 100%;
        justify-content: center;
        gap: 10px;
      }
    }
  }
  /* Links Navigations */
  .nav {
    flex-direction: column;
    align-items: flex-start;
    li {
      font-family: Plus Jakarta Sans;
      font-size: 18px;
      font-weight: 400;
      line-height: 28px;
      letter-spacing: 0em;
      text-align: center;
      a {
        color: rgba(38, 38, 38, 1);
      }
    }
  }

  #burger {
    position: absolute;
    cursor: pointer;
    width: 2rem;
    height: 2rem;
    right: 1rem;
    top: 1rem;
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
        transform: translateY(15px) rotate(45deg);
      }
      &:nth-child(2) {
        opacity: 0;
      }
      &:nth-child(3) {
        transform: translateY(-15px) rotate(-45deg);
      }
    }
  }

  #toTopButton {
    display: none;
  }
}
</style>
