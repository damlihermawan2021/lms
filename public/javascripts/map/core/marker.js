L.Marker.include({
  onEdit: false,
  uid: '',
  group: '',
  config: {},
  getPopup: function () {
    let pts = 0
    turf.segmentEach(this.feature, function () {
      pts++
    })
    let content = `
      <div class="infoBox leaflet-control" style="">
        <div class="infoBoxTable">
          <div class="infoBoxRow">
            <div class="infoBoxCell header">
              <h4 class="title">${this.config.label}</h4>
            </div>
            <div class="infoBoxCell info">
              <div class="details sub"></div>
            </div>
          </div>
        </div>
        <div class="label sub"></div>
        <div class="infoBoxTable">
      `
    for (const key of Object.keys(this.feature.properties).sort()) {
      let value = this.feature.properties[key] + ''
      if (value.length > 36) {
        value = value.substring(0, 36) + '...'
      }
      content += `
          <div class="infoBoxRow">
            <div class="infoBoxCell left">${key}</div>
            <div class="infoBoxCell right" style="white-space:nowrap">${value}</div>
          </div>`
    }

    content += `
        </div>
        <div class="infoBoxTable">
          <div class="infoBoxRow">
            <div class="infoBoxCell action">
              <button onclick='mapFunc.loadEditForm("${this.uid}")'
                class="action button green">SAVE</button>
              <button onclick='mapFunc.toggleEditHandler("${this.uid}")'
                class="action button grey">TOGGLE EDIT</button>
              <button onclick='mapFunc.confirmDelete("${this.uid}")'
                class="action button red">DELETE</button>
            </div>
          </div>
      `
    let i = 1
    for (const key in this.config.actions) {
      const act = this.config.actions[key]
      if (key === 'delete') continue

      if (i === 1) {
        content += `
            <div class="infoBoxRow">
              <div class="infoBoxCell action">
          `
      }
      content += `
              <button
                onclick='mapFunc.callHandler("${act.path}", "${act.method}", "${this.uid}")'
                class="${act.color}">${act.label.toUpperCase()}
              </button>
        `
      if (i > 3) {
        content += `
              </div>
            </div >
          `
        i = 1
      } else ++i
    }
    content += `
        </div>
      </div>
      `

    return content
  },
  setup: function (group) {
    this.uid = uuidv4()
    this.group = group
    this.config = mapConfig.layers[group]
    this.bindPopup(this.getPopup(), { closeButton: false, className: 'infoPopup' })
    mapFunc.registerLayer(this)
  },
  delete: function () {
    mapFunc.deregisterLayer(this)
    mapLayers[this.group].removeLayer(this)
  },
  toggleEdit: function () {
    this.onEdit = !this.onEdit
    this.pm.toggleEdit()
  },
  handleDelete: function () {
    const that = this
    mapFunc.requestData(
      mapConfig.layers[this.group].actions.delete.path,
      {
        method: mapConfig.layers[this.group].actions.delete.method,
        data: this.feature
      },
      function (data) {
        iziToast.success({
          title: data.code,
          message: data.message,
          timeout: 3000
        })
        that.delete()
      }
    )
  }
})
