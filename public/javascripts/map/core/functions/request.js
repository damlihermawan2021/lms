mapFunc.requestData = (url, options, callback) => {
  if (options.isLoading === true) {
    $.ajax({
      type: options.method,
      url: url,
      data: options.data,
      beforeSend: function (jqXHR, settings) {
        iziToast.info({
          message: 'Loading ...',
          timeout: 0
        })
      },
      success: function (data) {
        iziToast.destroy()
        callback(data)
      },
      error: function (xhr, textStatus, err) {
        iziToast.destroy()
        iziToast.error({
          title: xhr.statusText,
          message: xhr.responseText,
          timeout: 4000
        })
      }
    })
  } else {
    $.ajax({
      type: options.method,
      url: url,
      data: options.data,
      success: function (data) {
        iziToast.destroy()
        callback(data)
      },
      error: function (xhr, textStatus, err) {
        iziToast.destroy()
        iziToast.error({
          title: xhr.statusText,
          message: xhr.responseText,
          timeout: 4000
        })
      }
    })
  }
}
