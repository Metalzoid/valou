<script setup>
const cookie = useCookie("jwt_token");
if (cookie.value === undefined) {
  await navigateTo("/login");
}
</script>
