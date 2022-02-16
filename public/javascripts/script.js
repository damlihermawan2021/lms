function addSuccessNotification(title, message) {
  iziToast.success({
    title: title,
    message: message,
    timeout: 3000,
    titleSize: '9px',
    messageSize: '12px',
    position: 'bottomRight',
    close: false,
    closeOnClick: true
  })
}

function addFailNotification(title, message) {
  iziToast.error({
    title: title,
    message: message,
    timeout: 3000,
    titleSize: '9px',
    messageSize: '12px',
    position: 'bottomRight',
    close: false,
    closeOnClick: true
  })
}
function objectifyForm(formArray) {
  var returnArray = {}
  for (var i = 0; i < formArray.length; i++) {
    returnArray[formArray[i]['name']] = formArray[i]['value']
  }
  return returnArray
}

function send(method, options) {
  if(method === "POST") {
    var resp = $.ajax({
      type: method,
      url: options.url,
      contentType:false,
      cache: false,
      processData:false,
      data: options.data
    })
  } else {
    var resp = $.ajax({
      type: method,
      url: options.url,
      data: options.data
    })
 }

  const defaultDone = function(statusCode, data, text) {
    if (statusCode === 303) {
      window.location = text
    } else {
      if (method === 'POST') {
        if (!data) {
          window.location.reload()
        }else{
          window.location.href = data.links.view.url
        }
      } else if (method === 'PUT') {
        window.location.reload()
      } else if (method === 'DELETE') {
        if (!data) {
          window.location.reload()
        }else{
          window.location = data.links.index.url
        }
      } else {
        addSuccessNotification(data.message)
      }
    }
  }

  const defaultFail = function(statusCode, data, text) {
    addFailNotification(statusCode, text)
  }

  resp.always(function(x, xx, xxx) {
    const context = xxx.status !== undefined ? xxx : x
    if (context.status >= 200 && context.status < 400) {
      if (options.done) {
        options.done(
          '[' + context.status + '] ' + context.statusText,
          context.responseJSON,
          context.responseText,
          defaultDone
        )
      } else {
        defaultDone('[' + context.status + '] ' + context.statusText, context.responseJSON, context.responseText)
      }
    } else {
      if (options.fail) {
        options.fail(
          '[' + context.status + '] ' + context.statusText,
          context.responseJSON,
          context.responseText,
          defaultFail
        )
      } else {
        defaultFail('[' + context.status + '] ' + context.statusText, context.responseJSON, context.responseText)
      }
    }
  })
}

function sendGet(options) {
  send('GET', options)
}

function sendPut(options) {
  console.log(options)
  send('PUT', options)
}

function sendDelete(options) {
  send('DELETE', options)
}

function sendPost(options) {
  send('POST', options)
}

$(document).ready(function() {
  $('#notification').on('click', '.message .close', function() {
    document.getElementById('notification').removeChild(this.parentElement)
  })
})

$(document).on('mouseenter', "table > tbody > tr > td", function () {
  var $this = $(this);
  if (this.offsetWidth < this.scrollWidth && !$this.attr('title')) {
    $this.tooltip({
      title: $this.text(),
      placement: "bottom",
      container: "body"
    });
    $this.tooltip('show');
  }
});

function streamMessageDetail(s, i) {
  $('#targetId').text(s + ' ('+ i + ')')
  $('#detailStreamMessage').modal('show')
  $("#targetModalStreamMessage").html('')
  $.ajax({
    url: "/Stream/Message/Info?&s="+decodeURI(s)+"&i="+i, success: function (result) {
      $("#targetModalStreamMessage").html(result);
    }
  });
}

function copyText(value, info) {
  const $temp = $('<input>')
  $('body').append($temp)
  $temp.val(unescape(value)).select()
  document.execCommand('copy')
  $temp.remove()

  if (!info) info = 'Text'
  iziToast.info({
    title: info+':'+unescape(value),
    message: 'Copied to clipboard',
    timeout: 2000
  })
  return value
}
