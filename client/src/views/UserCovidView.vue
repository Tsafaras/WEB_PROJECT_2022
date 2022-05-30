<template>
  <PageContent>
    <Container title="Declare a COVID diagnosis">
      <ActionButton text="Declare"/>
    </Container>
    <Container title="COVID - Possible contacts">
      <ActionButton text="Fetch data"/>

    </Container>
  </PageContent>
</template>

<script>
export default {
  name: "UserCovidView",
  date() {
    return {
      firstCOVIDCase: Date.parse(import.meta.env.VITE_FIRST_COVID_CASE)
    }
  }
}
</script>
