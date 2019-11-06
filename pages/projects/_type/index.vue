<template>
  <div class="main-content">
    <Loading v-show="loading" />
    <div v-show="!loading">
      <b-row>
        <b-col md="8">
          <h2 class="page-title">
            {{ projectType }}
            <small>
              <a v-b-modal.modal-add-project>
                <i class="nav-icon i-Add"></i>
                <span class="item-name"> Add New</span>
              </a>
            </small>
          </h2>
        </b-col>
        <b-col md="4">
          <b-form-input
            v-model="searchWord"
            class="form-control-rounded"
            type="text"
            required
            placeholder="Search..."
          ></b-form-input>
        </b-col>
      </b-row>
      <transition-group name="fade" tag="b-row">
        <b-col
          v-for="project in projects"
          v-show="
            project.name.toLowerCase().includes(searchWord) &&
              project.type.includes(projectType.toLowerCase())
          "
          :key="project.id"
          md="6"
        >
          <b-card
            class="mb-30 text-15 w-100"
            :header="project.name"
            header-tag="h5"
          >
            <b-row>
              <b-col md="6">
                <ProjectAvatar
                  nick-name="Matt"
                  image-url="@/assets/images/avatars/matthewt.svg"
                />
                <ProjectAvatar
                  nick-name="Armand"
                  image-url="@/assets/images/avatars/matthewt.svg"
                />
              </b-col>
              <b-col md="6" class="text-right">
                <div class="button-container">
                  <b-button
                    pill
                    variant="primary ripple"
                    :to="
                      `/projects/${toLink(projectType)}/${toLink(project.name)}`
                    "
                    nuxt
                    >View tasks</b-button
                  >
                </div>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </transition-group>
      <b-modal
        id="modal-add-project"
        centered
        :hide-footer="true"
        :hide-header="true"
        size="lg"
      >
        <div class="modal-addition-only">
          <b-form-input
            v-model="newProjectName"
            class="form-control-rounded input-extra-large"
            type="text"
            required
            placeholder="Enter project name..."
          ></b-form-input>
          <b-button pill variant="success ripple" @click="addProject()"
            >Save</b-button
          >
        </div>
      </b-modal>
    </div>
  </div>
</template>
<script>
import ProjectAvatar from "@/components/projectAvatar"
import Loading from "@/components/loading"
import Util from "@/utils"
import { mapState } from "vuex"

export default {
  layout: "default",
  name: "Type",
  components: {
    ProjectAvatar,
    Loading
  },
  data() {
    return {
      projectType: "",
      newProjectName: "",
      searchWord: "",
      loading: true
    }
  },
  computed: {
    ...mapState({
      projects: state => state.projects.all
    })
  },
  created() {
    this.projectType = Util.linkToString(this.$route.params.type)
    this.loading = false
  },
  methods: {
    addProject: function() {
      if (!this.newProjectName) {
        return this.$toast.error("Please enter a project name.")
      }

      if (
        this.projects.filter(
          project => project.name == Util.linkToString(this.newProjectName)
        ).length > 0
      ) {
        return this.$toast.error("A project with this name already exists")
      }

      this.$store.state.db
        .collection("projects")
        .add({
          name: Util.linkToString(this.newProjectName),
          lists: [
            { name: "Milestone 1", archived: false, tasks: [] },
            { name: "Bugs", archived: false, tasks: [] }
          ],
          type: this.projectType.toLowerCase()
        })
        .then(() => {
          this.$bvModal.hide("modal-add-project")
          this.$toast.success(
            `${Util.linkToString(
              this.newProjectName
            )} has been added as a project`
          )
          this.newProjectName = ""
        })
        .catch(error => {
          this.$toast.error(`There was an issue adding this project: ${error}`)
        })
    },
    toLink: function(projectName) {
      return Util.stringToLink(projectName)
    }
  }
}
</script>
<style scoped>
.button-container {
  position: absolute;
  bottom: 0;
  right: 15px;
}
.modal-addition-only {
  display: flex;
}
.modal-addition-only input {
  margin-right: 15px;
}
</style>